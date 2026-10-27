import { type PointerEvent, useEffect, useRef, useState } from 'react'
import { FitDesktop } from '../../components/desktop/Desktop'
import { Window } from '../../components/desktop/Window'
import { Laptop } from '../../components/device/Laptop'
import { Phone } from '../../components/device/Phone'
import { AppBar, PhoneScreen, StatusBar } from '../../components/device/PhoneUI'
import { cx } from '../../lib/cx'
import { gsap } from '../../lib/gsap'
import { prefersReducedMotion } from '../../lib/motion'
import s from './stages.module.css'

interface Pt {
  u: number
  v: number
  w: number
}
interface Stroke {
  color: string
  pts: Pt[]
  /** Drawn by the demo, wiped when the visitor starts drawing. */
  ghost?: boolean
}

const PAPER = '#f3f0e8'
const INKS = [
  { name: 'Ink', color: '#1c2340' },
  { name: 'Blue', color: '#2f7bff' },
  { name: 'Coral', color: '#e8524a' },
]
/* The Sketch window's canvas, in desktop pixels. */
const DESK_W = 1240
const DESK_H = 712

/* The ghost's sketch: ridges under a moon, like the wallpaper. u across, v down. */
const RIDGE: Array<[number, number]> = [
  [0.07, 0.66],
  [0.19, 0.53],
  [0.29, 0.45],
  [0.39, 0.53],
  [0.5, 0.47],
  [0.61, 0.36],
  [0.73, 0.47],
  [0.84, 0.55],
  [0.94, 0.61],
]

function catmull(points: Array<[number, number]>, perSpan: number): Array<[number, number]> {
  const out: Array<[number, number]> = []
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const [p1, p2] = [points[i], points[i + 1]]
    const p3 = points[Math.min(points.length - 1, i + 2)]
    for (let j = 0; j < perSpan; j++) {
      const t = j / perSpan
      const t2 = t * t
      const t3 = t2 * t
      const at = (k: 0 | 1) =>
        0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)
      out.push([at(0), at(1)])
    }
  }
  out.push(points[points.length - 1])
  return out
}

export function PenStage({ active }: { active: boolean }) {
  const phoneCanvas = useRef<HTMLCanvasElement>(null)
  const deskCanvas = useRef<HTMLCanvasElement>(null)
  const ghostDot = useRef<HTMLSpanElement>(null)
  const strokes = useRef<Stroke[]>([])
  const current = useRef<Stroke | null>(null)
  const lastT = useRef(0)
  const [ink, setInk] = useState(INKS[0].color)
  const [touched, setTouched] = useState(false)

  /** Map a point to each canvas: the phone's own pixels, and a phone-shaped region in the middle of the desk canvas. */
  const maps = () => {
    const pc = phoneCanvas.current!
    const aspect = pc.clientWidth / Math.max(1, pc.clientHeight)
    const rw = DESK_H * aspect
    const left = (DESK_W - rw) / 2
    return {
      phone: (p: Pt) => ({ x: p.u * pc.width, y: p.v * pc.height, w: p.w * (pc.width / rw) }),
      desk: (p: Pt) => ({ x: left + p.u * rw, y: p.v * DESK_H, w: p.w }),
    }
  }

  const segment = (st: Stroke, i: number) => {
    const m = maps()
    const ctxs: Array<[CanvasRenderingContext2D | null | undefined, (p: Pt) => { x: number; y: number; w: number }]> = [
      [phoneCanvas.current?.getContext('2d'), m.phone],
      [deskCanvas.current?.getContext('2d'), m.desk],
    ]
    for (const [ctx, map] of ctxs) {
      if (!ctx) continue
      const a = map(st.pts[Math.max(0, i - 1)])
      const b = map(st.pts[i])
      ctx.strokeStyle = st.color
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = b.w
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
  }

  const repaint = () => {
    for (const c of [phoneCanvas.current, deskCanvas.current]) {
      const ctx = c?.getContext('2d')
      if (!c || !ctx) continue
      ctx.fillStyle = PAPER
      ctx.fillRect(0, 0, c.width, c.height)
    }
    for (const st of strokes.current) for (let i = 0; i < st.pts.length; i++) segment(st, i)
  }

  const clearAll = () => {
    strokes.current = []
    current.current = null
    repaint()
  }

  const clearGhost = () => {
    strokes.current = strokes.current.filter((st) => !st.ghost)
    repaint()
  }

  // Keep the phone canvas at its on-screen size, in device pixels.
  useEffect(() => {
    const c = phoneCanvas.current!
    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      c.width = Math.round(c.clientWidth * dpr)
      c.height = Math.round(c.clientHeight * dpr)
      repaint()
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(c)
    return () => ro.disconnect()
  }, [])

  // The ghost sketches ridges and a moon until the visitor picks up the pen.
  useEffect(() => {
    if (!active || touched || prefersReducedMotion()) return
    const c = phoneCanvas.current!
    const aspect = c.clientWidth / Math.max(1, c.clientHeight)
    const moon: Array<[number, number]> = Array.from({ length: 56 }, (_, i) => {
      const a = -Math.PI / 2 + (i / 55) * Math.PI * 2
      return [0.72 + Math.cos(a) * 0.09, 0.22 + Math.sin(a) * 0.09 * aspect]
    })
    const paths = [catmull(RIDGE, 10), moon]
    const dot = ghostDot.current!
    const tl = gsap.timeline({ repeat: -1, delay: 0.5 })
    for (const path of paths) {
      const proxy = { i: 0 }
      let st: Stroke | null = null
      tl.to(proxy, {
        i: path.length - 1,
        duration: path.length / 34,
        ease: 'none',
        onStart: () => {
          st = { color: INKS[0].color, pts: [], ghost: true }
          strokes.current.push(st)
        },
        onUpdate: () => {
          if (!st) return
          while (st.pts.length <= Math.floor(proxy.i)) {
            const k = st.pts.length
            const [u, v] = path[k]
            st.pts.push({ u, v, w: 5 + 2.5 * Math.sin(k / 7) })
            segment(st, k)
            dot.style.transform = `translate(${u * c.clientWidth}px, ${v * c.clientHeight}px)`
            dot.style.opacity = '1'
          }
        },
      }).to({}, { duration: 0.35 })
    }
    tl.call(() => {
      dot.style.opacity = '0'
    })
      .to({}, { duration: 2.2 })
      .call(clearGhost)
    return () => {
      tl.kill()
      dot.style.opacity = '0'
      clearGhost()
    }
  }, [active, touched])

  const point = (e: PointerEvent<HTMLCanvasElement>): Pt => {
    const r = e.currentTarget.getBoundingClientRect()
    const u = (e.clientX - r.left) / r.width
    const v = (e.clientY - r.top) / r.height
    let w: number
    if (e.pointerType === 'pen') w = 2 + e.pressure * 11
    else {
      const prev = current.current?.pts.at(-1)
      const dt = Math.max(1, e.timeStamp - lastT.current)
      const dist = prev ? Math.hypot((u - prev.u) * r.width, (v - prev.v) * r.height) : 0
      w = Math.min(10, Math.max(3, 10 - (dist / dt) * 5))
    }
    lastT.current = e.timeStamp
    return { u, v, w }
  }

  const onDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!touched) setTouched(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    lastT.current = e.timeStamp
    const st: Stroke = { color: ink, pts: [point(e)] }
    strokes.current.push(st)
    current.current = st
    segment(st, 0)
  }

  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const st = current.current
    if (!st) return
    st.pts.push(point(e))
    segment(st, st.pts.length - 1)
  }

  const onUp = () => {
    current.current = null
  }

  return (
    <div className={s.stage}>
      <div className={s.laptop}>
        <Laptop>
          <FitDesktop scene="bare" app="Sketch" live cursor={false}>
            <Window title="Sketch — untitled.png" focused style={{ left: 180, top: 74, width: DESK_W, height: DESK_H + 40 }}>
              <canvas ref={deskCanvas} width={DESK_W} height={DESK_H} className={s.paper} />
            </Window>
          </FitDesktop>
        </Laptop>
      </div>
      <div className={s.phone}>
        <Phone decorative={false}>
          <PhoneScreen>
            <StatusBar />
            <AppBar title="Laptop" chip="Pen" />
            <div className={s.tools}>
              {INKS.map((i) => (
                <button
                  key={i.name}
                  type="button"
                  className={cx(s.swatch, ink === i.color && s.swatchOn)}
                  style={{ background: i.color }}
                  aria-label={`${i.name} ink`}
                  aria-pressed={ink === i.color}
                  onClick={() => {
                    setTouched(true)
                    setInk(i.color)
                  }}
                />
              ))}
              <button
                type="button"
                className={s.clear}
                onClick={() => {
                  setTouched(true)
                  clearAll()
                }}
              >
                Clear
              </button>
            </div>
            <div className={s.canvasWrap}>
              <canvas
                ref={phoneCanvas}
                className={s.phoneCanvas}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
                aria-label="Drawing surface: what you draw appears on the laptop"
              />
              <span ref={ghostDot} className={s.ghostPen} />
            </div>
          </PhoneScreen>
        </Phone>
      </div>
    </div>
  )
}
