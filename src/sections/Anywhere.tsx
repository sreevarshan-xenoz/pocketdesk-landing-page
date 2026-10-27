import { useEffect, useRef, useState } from 'react'
import { SectionHead } from '../components/SectionHead'
import { cx } from '../lib/cx'
import { gsap, motionOn, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import s from './Anywhere.module.css'

const ROADS = [
  { name: 'Same Wi-Fi', body: 'Straight across your network. Nothing to set up.' },
  { name: 'Tailscale', body: 'Both on one tailnet? They connect as if side by side, inside its encryption.' },
  {
    name: 'The internet',
    body: 'After one session at home, iroh punches a direct path through both routers, or falls back to a relay that only ever sees encrypted bytes.',
  },
]

/* Scene geometry, in the SVG's 1200x460 units. */
const HOME_PHONE = { x: 330, y: 262 }
const AWAY_PHONE = { x: 1000, y: 262 }
const TRIP = `M${HOME_PHONE.x} ${HOME_PHONE.y} C 520 150, 810 150, ${AWAY_PHONE.x} ${AWAY_PHONE.y}`

export function Anywhere() {
  const root = useRef<HTMLElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const [road, setRoad] = useState(2)

  useGSAP(
    () => {
      if (!motionOn()) return
      const q = gsap.utils.selector(svg)
      const phone = q('[data-phone]')
      setRoad(0)

      gsap.set(phone, { x: HOME_PHONE.x, y: HOME_PHONE.y })
      gsap.set(q('[data-road=tail], [data-road=punch], [data-road=relay], [data-spark]'), { autoAlpha: 0 })

      let current = 0
      const tl = gsap.timeline({
        defaults: { duration: 0.2, ease: 'power2.inOut' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
        onUpdate: () => {
          const t = tl.time()
          const next = t < 1 ? 0 : t < 2 ? 1 : 2
          if (next !== current) {
            current = next
            setRoad(next)
          }
        },
      })

      tl.fromTo(q('[data-road=wifi]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.22 }, 0.04)
        .to(q('[data-road=wifi]'), { autoAlpha: 0, duration: 0.1 }, 0.84)
        .to(phone, { motionPath: { path: TRIP }, duration: 0.42, ease: 'power2.inOut' }, 0.84)
        .fromTo(q('[data-road=tail]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 1.12)
        .fromTo(q('[data-tail-line]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.3 }, 1.12)
        .to(q('[data-road=tail]'), { autoAlpha: 0, duration: 0.1 }, 1.9)
        .fromTo(q('[data-road=punch]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 2.04)
        .fromTo(q('[data-punch-line]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.34, ease: 'none' }, 2.04)
        .fromTo(q('[data-spark=a]'), { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.06, transformOrigin: '50% 50%' }, 2.1)
        .to(q('[data-spark=a]'), { autoAlpha: 0, scale: 1.6, duration: 0.1 }, 2.16)
        .fromTo(q('[data-spark=b]'), { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.06, transformOrigin: '50% 50%' }, 2.3)
        .to(q('[data-spark=b]'), { autoAlpha: 0, scale: 1.6, duration: 0.1 }, 2.36)
        .fromTo(q('[data-road=relay]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 2.46)
        .to({}, { duration: 0.24 }, 2.76)
    },
    { scope: root },
  )

  // Packets run the live road on their own clock, both ways.
  useEffect(() => {
    if (!motionOn() || prefersReducedMotion()) return
    const el = svg.current!
    const q = gsap.utils.selector(svg)
    const lane = road === 0 ? '[data-path=wifi]' : road === 1 ? '[data-path=tail]' : '[data-path=punch]'
    const path = el.querySelector<SVGPathElement>(lane)!
    const [a, b, c] = q('[data-packet]')
    const tweens = [
      gsap.to(a, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, duration: road === 0 ? 0.7 : 1.5, repeat: -1, ease: 'none' }),
      gsap.to(b, {
        motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: 1, end: 0 },
        duration: road === 0 ? 0.7 : 1.5,
        repeat: -1,
        ease: 'none',
        delay: 0.6,
      }),
    ]
    if (road === 2) {
      const relay = el.querySelector<SVGPathElement>('[data-path=relay]')!
      tweens.push(gsap.to(c, { motionPath: { path: relay, align: relay, alignOrigin: [0.5, 0.5] }, duration: 2.6, repeat: -1, ease: 'none' }))
    }
    gsap.set([a, b], { autoAlpha: 1 })
    gsap.set(c, { autoAlpha: road === 2 ? 0.6 : 0 })
    return () => tweens.forEach((t) => t.kill())
  }, [road])

  return (
    <section ref={root} id="anywhere" className={s.section} aria-labelledby="anywhere-title">
      <div className={s.stage}>
        <div className="container">
          <SectionHead
            index="03"
            label="Anywhere"
            id="anywhere-title"
            size="md"
            align="center"
            title={
              <>
                From the couch. <em>Or abroad.</em>
              </>
            }
            lede="The phone finds its own way to your computer: no port forward, no VPN to set up, and no Pocketdesk server in the middle."
          />

          <svg ref={svg} className={s.map} viewBox="0 0 1200 460" role="img" aria-label="The three roads from the phone to the computer">
            <defs>
              <pattern id="aw-dots" width="26" height="26" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.3" fill="#1b2650" />
              </pattern>
              {/* In user space: on a level line, a bounding-box gradient has no height and draws nothing. */}
              <linearGradient id="aw-line" x1="232" y1="0" x2="976" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#5AD1FF" />
                <stop offset="1" stopColor="#7B6CFF" />
              </linearGradient>
            </defs>
            <rect width="1200" height="460" fill="url(#aw-dots)" />

            {/* home, and away */}
            <rect className={s.block} x="40" y="90" width="380" height="300" rx="28" />
            <text className={s.blockLabel} x="68" y="128">
              HOME
            </text>
            <rect className={s.block} x="780" y="90" width="380" height="300" rx="28" />
            <text className={s.blockLabel} x="808" y="128">
              AWAY
            </text>

            {/* the laptop at home */}
            <g transform="translate(104 222)">
              <rect className={s.device} x="0" y="0" width="124" height="80" rx="8" />
              <rect x="8" y="8" width="108" height="64" rx="4" fill="#12245e" />
              <path className={s.deviceLine} d="M-14 88 H138" />
            </g>

            {/* the roads */}
            <path data-road="wifi" data-path="wifi" className={s.road} d="M232 262 L306 262" />
            <g data-road="tail">
              <path className={s.tunnel} d="M232 262 L976 262" />
              <path data-tail-line data-path="tail" className={s.roadDashed} d="M232 262 L976 262" />
              <text className={s.roadLabel} x="600" y="232" textAnchor="middle">
                your tailnet
              </text>
            </g>
            <g data-road="punch">
              <path data-punch-line data-path="punch" className={s.road} d="M232 262 L976 262" />
              <text className={s.roadLabel} x="600" y="296" textAnchor="middle">
                direct, through both routers
              </text>
            </g>
            <g data-road="relay">
              <path data-path="relay" className={s.relayPath} d="M232 250 C 330 120, 470 66, 578 66 L 622 66 C 730 66, 870 120, 976 250" />
              <circle className={s.relay} cx="600" cy="66" r="22" />
              <path className={s.relayLock} d="M593 66 h14 v10 h-14 z M596 66 v-4 a4 4 0 0 1 8 0 v4" />
              <text className={s.roadLabel} x="600" y="30" textAnchor="middle">
                or a relay: encrypted bytes only
              </text>
            </g>

            {/* routers on the walls, where the punch goes through */}
            <g transform="translate(420 262)">
              <rect className={s.router} x="-11" y="-36" width="22" height="72" rx="11" />
              <circle data-spark="a" className={s.spark} r="26" />
            </g>
            <g transform="translate(780 262)">
              <rect className={s.router} x="-11" y="-36" width="22" height="72" rx="11" />
              <circle data-spark="b" className={s.spark} r="26" />
            </g>
            <text className={s.small} x="420" y="322" textAnchor="middle">
              router
            </text>
            <text className={s.small} x="780" y="322" textAnchor="middle">
              router
            </text>

            {/* packets */}
            <circle data-packet className={s.packet} r="6" />
            <circle data-packet className={s.packet} r="6" />
            <circle data-packet className={s.packetSlow} r="5" />

            {/* the phone */}
            <g data-phone transform={`translate(${AWAY_PHONE.x} ${AWAY_PHONE.y})`}>
              <rect className={s.phoneGlow} x="-40" y="-60" width="80" height="120" rx="30" />
              <rect className={s.device} x="-22" y="-42" width="44" height="84" rx="10" />
              <rect x="-17" y="-36" width="34" height="72" rx="6" fill="#12245e" />
            </g>
          </svg>

          <ol className={s.roads}>
            {ROADS.map((r, i) => (
              <li key={r.name} className={cx(i === road && s.on)}>
                <span className={s.n}>{i + 1}</span>
                <h3>{r.name}</h3>
                <p>{r.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
