import { useId, useRef } from 'react'
import b from '../components/Button.module.css'
import { Icon } from '../components/Icon'
import { MARK, MarkGradients, PocketFront } from '../components/Mark'
import { jumpTo } from '../components/Nav'
import { useOS } from '../hooks/useOS'
import { cx } from '../lib/cx'
import { gsap, motionOn, useGSAP } from '../lib/gsap'
import { downloadLabel } from '../lib/os'
import { REPO } from '../lib/release'
import s from './Finale.module.css'

/** The last scene: the window, still showing a desktop, drops into the pocket and becomes the mark. */
export function Finale() {
  const root = useRef<HTMLElement>(null)
  const id = `fin${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const os = useOS()
  const w = MARK.window

  useGSAP(
    () => {
      if (!motionOn()) return
      const q = gsap.utils.selector(root)
      // The pivot is set while the window is untransformed: set mid-tween, GSAP shifts it to compensate.
      gsap.set(q('[data-drop]'), { svgOrigin: `${w.cx} ${w.cy}` })
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'bottom bottom', scrub: 0.8 },
      })
      tl.fromTo(q('[data-drop]'), { y: -330, rotation: -21, scale: 1.18 }, { y: 0, rotation: 0, scale: 1, duration: 1 }, 0)
        .fromTo(q('[data-back]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.35)
        .fromTo(q('[data-front]'), { y: 140, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'power3.out' }, 0.45)
        .fromTo(q('[data-scene]'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3 }, 0.78)
        .fromTo(q('[data-copy] > *'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.08, ease: 'power3.out' }, 0.8)
    },
    { scope: root },
  )

  return (
    <section ref={root} className={s.section} aria-labelledby="finale-title">
      <div className={s.glow} aria-hidden="true" />
      <svg className={s.mark} viewBox="0 -60 512 572" aria-hidden="true">
        <MarkGradients id={id} />
        <clipPath id={`${id}-clip`}>
          <rect x={w.x} y={w.y} width={w.width} height={w.height} rx={w.rx} />
        </clipPath>
        <path data-back d={MARK.back} fill={`url(#${id}-back)`} />
        <g data-drop>
          <g transform={`rotate(${w.rotate} ${w.cx} ${w.cy})`}>
            <rect x={w.x} y={w.y} width={w.width} height={w.height} rx={w.rx} fill="#0B1222" />
            {/* A desktop on the window's screen until it settles: night ridges, a terminal. */}
            <g data-scene clipPath={`url(#${id}-clip)`}>
              <rect x={w.x} y={w.y} width={w.width} height={w.height} fill="#0a1640" />
              <circle cx="330" cy="150" r="13" fill="#e6eeff" />
              <path d="M152 270 C190 240 214 250 240 232 S300 214 330 236 S370 250 380 244 V342 H152Z" fill="#15297a" />
              <path d="M152 300 C200 282 236 296 270 284 S340 276 380 290 V342 H152Z" fill="#0c1740" />
              <rect x="172" y="168" width="120" height="74" rx="8" fill="#08101f" stroke="#2a3a75" strokeWidth="2" />
              <path d="M184 186 h40 M184 200 h66 M184 214 h30" stroke="#5ad1ff" strokeWidth="5" strokeLinecap="round" />
            </g>
            <rect x={w.x} y={w.y} width={w.width} height={w.height} rx={w.rx} fill="none" stroke={`url(#${id}-rim)`} strokeWidth="12" />
            <circle cx={MARK.dots[0]} cy="140" r="14" fill="#FF5F57" />
            <circle cx={MARK.dots[1]} cy="140" r="14" fill="#FEBC2E" />
            <circle cx={MARK.dots[2]} cy="140" r="14" fill="#28C840" />
          </g>
        </g>
        <g data-front>
          <PocketFront id={id} />
        </g>
      </svg>

      <div className={s.copy} data-copy>
        <h2 id="finale-title">
          Put your desktop <em>in your pocket.</em>
        </h2>
        <p>Free, open source, and yours alone.</p>
        <div className={s.ctas}>
          <a className={cx(b.btn, b.primary)} href="#download" onClick={jumpTo('download')}>
            <Icon name="download" size={18} />
            {downloadLabel(os)}
          </a>
          <a className={cx(b.btn, b.ghost)} href={REPO} rel="noopener">
            <Icon name="github" size={18} />
            Read the source
          </a>
        </div>
      </div>
    </section>
  )
}
