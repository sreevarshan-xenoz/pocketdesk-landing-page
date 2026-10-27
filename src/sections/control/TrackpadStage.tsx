import { type PointerEvent, useEffect, useRef, useState } from 'react'
import { type Click, DESKTOP_H, DESKTOP_W, FitDesktop } from '../../components/desktop/Desktop'
import { Laptop } from '../../components/device/Laptop'
import { Phone } from '../../components/device/Phone'
import { AppBar, PhoneScreen, StatusBar } from '../../components/device/PhoneUI'
import { gsap } from '../../lib/gsap'
import { prefersReducedMotion } from '../../lib/motion'
import { accelerate } from '../../lib/trackpad'
import { type WindowId, windowAt } from '../../lib/windows'
import s from './stages.module.css'

/* The ghost's tour: the editor, the music player, back to the terminal (where it starts). */
const HOME = { x: 430, y: 330 }
const TOUR = [
  { x: 1180, y: 300 },
  { x: 1010, y: 650 },
  HOME,
]

const clampX = (x: number) => Math.min(DESKTOP_W - 12, Math.max(0, x))
const clampY = (y: number) => Math.min(DESKTOP_H - 12, Math.max(40, y))

export function TrackpadStage({ active }: { active: boolean }) {
  const cursor = useRef<SVGSVGElement>(null)
  const screen = useRef<HTMLDivElement>(null)
  const pad = useRef<HTMLDivElement>(null)
  const finger = useRef<HTMLSpanElement>(null)
  const pos = useRef({ ...HOME })
  const focusRef = useRef<WindowId>('terminal')
  const [focus, setFocus] = useState<WindowId>('terminal')
  const [clicks, setClicks] = useState<Click[]>([])
  const [touched, setTouched] = useState(false)
  const last = useRef<{ x: number; y: number; t: number } | null>(null)
  const down = useRef<{ x: number; y: number; t: number } | null>(null)

  const draw = () => {
    if (cursor.current) cursor.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`
  }

  const showFinger = (fx: number, fy: number, pressed = true) => {
    const f = finger.current
    if (!f) return
    f.style.transform = `translate(${fx}px, ${fy}px) scale(${pressed ? 1 : 0.6})`
    f.style.opacity = pressed ? '1' : '0'
  }

  const click = () => {
    const { x, y } = pos.current
    const hit = windowAt(x, y, focusRef.current)
    if (hit) {
      focusRef.current = hit
      setFocus(hit)
    }
    const id = performance.now()
    setClicks((cs) => [...cs.slice(-2), { id, x, y }])
    window.setTimeout(() => setClicks((cs) => cs.filter((c) => c.id !== id)), 700)
  }

  useEffect(draw, [])

  // The ghost: a finger that tours the windows until the visitor takes over.
  useEffect(() => {
    if (!active || touched || prefersReducedMotion()) return
    const padEl = pad.current!
    const proxy = { ...HOME }
    pos.current = { ...HOME }
    draw()
    const toPad = () => {
      const w = padEl.clientWidth
      const h = padEl.clientHeight
      showFinger(w * (0.5 + ((proxy.x - DESKTOP_W / 2) / DESKTOP_W) * 0.62), h * (0.5 + ((proxy.y - DESKTOP_H / 2) / DESKTOP_H) * 0.56))
    }
    const tl = gsap.timeline({ repeat: -1, delay: 0.6 })
    for (const t of TOUR) {
      tl.to(proxy, {
        x: t.x,
        y: t.y,
        duration: 1.3,
        ease: 'power2.inOut',
        onUpdate: () => {
          pos.current = { ...proxy }
          draw()
          toPad()
        },
      })
        .call(click, undefined, '+=0.12')
        .to({}, { duration: 1 })
    }
    return () => {
      tl.kill()
      showFinger(0, 0, false)
    }
  }, [active, touched])

  const local = (e: PointerEvent) => {
    const r = pad.current!.getBoundingClientRect()
    return [e.clientX - r.left, e.clientY - r.top] as const
  }

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    setTouched(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = { x: e.clientX, y: e.clientY, t: e.timeStamp }
    last.current = p
    down.current = p
    showFinger(...local(e))
  }

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const l = last.current
    if (!l) return
    const a = accelerate(e.clientX - l.x, e.clientY - l.y, e.timeStamp - l.t)
    const k = (DESKTOP_W / (screen.current?.clientWidth || 600)) * 1.25
    pos.current = { x: clampX(pos.current.x + a.x * k), y: clampY(pos.current.y + a.y * k) }
    draw()
    last.current = { x: e.clientX, y: e.clientY, t: e.timeStamp }
    showFinger(...local(e))
  }

  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = down.current
    if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 6 && e.timeStamp - d.t < 300) click()
    last.current = null
    down.current = null
    showFinger(...local(e), false)
  }

  return (
    <div className={s.stage}>
      <div className={s.laptop}>
        <Laptop>
          <div ref={screen} className={s.fill}>
            <FitDesktop live cursorRef={cursor} focus={focus} clicks={clicks} />
          </div>
        </Laptop>
      </div>
      <div className={s.phone}>
        <Phone decorative={false}>
          <PhoneScreen>
            <StatusBar />
            <AppBar title="Laptop" chip="Trackpad" />
            <div
              ref={pad}
              className={s.pad}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              role="application"
              aria-label="Trackpad: drag to move the laptop's pointer, tap to click"
            >
              <span className={s.padLabel}>Drag here</span>
              <span ref={finger} className={s.finger} />
            </div>
            <div className={s.buttons} aria-hidden="true">
              <span />
              <span />
            </div>
          </PhoneScreen>
        </Phone>
      </div>
    </div>
  )
}
