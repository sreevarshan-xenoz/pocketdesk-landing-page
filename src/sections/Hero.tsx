import { useRef } from 'react'
import b from '../components/Button.module.css'
import { Desktop } from '../components/desktop/Desktop'
import { Phone } from '../components/device/Phone'
import { Icon, type IconName } from '../components/Icon'
import { jumpTo } from '../components/Nav'
import { useOS } from '../hooks/useOS'
import { useRelease } from '../hooks/useRelease'
import { cx } from '../lib/cx'
import { FILM } from '../lib/film'
import { gsap, motionOn, offsetWithin, ScrollTrigger, useGSAP } from '../lib/gsap'
import type { OS } from '../lib/os'
import { RELEASES } from '../lib/release'
import s from './Hero.module.css'

/* The phone, laid out at full size: a 2000x900 screen inside a 28 px bezel. */
const DEVICE_W = 2056
const DEVICE_H = 956
const BEZEL = 28

const CALLOUTS: Array<{ icon: IconName; text: string }> = [
  { icon: 'code', text: 'Hardware H.264 or HEVC' },
  { icon: 'play', text: 'Up to 60 frames a second' },
  { icon: 'lock', text: 'QUIC and TLS 1.3, keys pinned' },
  { icon: 'globe', text: 'No account. No port forward.' },
]

export function downloadLabel(os: OS | null): string {
  if (os === 'windows') return 'Download for Windows'
  if (os === 'linux') return 'Download for Linux'
  if (os === 'android') return 'Get the Android app'
  return 'Download'
}

interface Geometry {
  vw: number
  s0: number
  y0: number
  s1: number
  y1: number
  /** The title rises into the eyebrow's place and shrinks (k) to give the phone room. */
  lift: number
  k: number
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/** Where the phone starts (a desktop wider than the window, just under the intro) and ends (under the title). */
function measure(stage: HTMLElement, eyebrow: HTMLElement, intro: HTMLElement, title: HTMLElement): Geometry {
  const vw = stage.clientWidth
  const vh = stage.clientHeight
  const narrow = vw < 700
  const introBottom = offsetWithin(intro, stage).top + intro.offsetHeight
  const s0 = (vw * (narrow ? 2 : 1.12)) / 1600
  const y0 = introBottom + (narrow ? 36 : 52) - BEZEL * s0

  const titleTop = offsetWithin(title, stage).top
  const lift = titleTop - offsetWithin(eyebrow, stage).top
  const k = narrow ? 1 : clamp((vh - 480) / 520, 0.55, 0.86)
  const top1 = titleTop - lift + title.offsetHeight * k + (narrow ? 28 : 36)
  const room = vh - top1 - (narrow ? 150 : 44)
  const s1 = Math.max(0.05, Math.min((vw * (narrow ? 0.94 : 0.84)) / DEVICE_W, room / DEVICE_H, 1120 / DEVICE_W))
  const y1 = top1 + Math.max(0, (room - DEVICE_H * s1) / 2)
  return { vw, s0, y0, s1, y1, lift, k }
}

export function Hero({ onWatchFilm }: { onWatchFilm: () => void }) {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const eyebrow = useRef<HTMLAnchorElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const line2 = useRef<HTMLSpanElement>(null)
  const intro = useRef<HTMLDivElement>(null)
  const arrival = useRef<HTMLDivElement>(null)
  const device = useRef<HTMLDivElement>(null)
  const callouts = useRef<HTMLUListElement>(null)
  const glow = useRef<HTMLDivElement>(null)
  const os = useOS()
  const release = useRelease()

  useGSAP(
    () => {
      if (!motionOn()) return
      const st = stage.current!
      const dev = device.current!
      const frame = dev.querySelectorAll('[data-part=frame], [data-part=keys], [data-part=camera], [data-side]')
      const get = () => measure(st, eyebrow.current!, intro.current!, title.current!)
      let g = get()
      const place = () => {
        g = get()
        const w = DEVICE_W * g.s1
        gsap.set([callouts.current, glow.current], {
          '--cl': `${(g.vw - w) / 2}px`,
          '--ct': `${g.y1}px`,
          '--cw': `${w}px`,
          '--ch': `${DEVICE_H * g.s1}px`,
        })
      }
      place()
      ScrollTrigger.addEventListener('refreshInit', place)

      gsap.set(dev, { x: 0, xPercent: -50, transformOrigin: '50% 0', y: g.y0, scale: g.s0 })
      gsap.fromTo(arrival.current, { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 1.4, ease: 'expo.out', delay: 0.1 })

      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true },
        })
        .fromTo(dev, { y: () => g.y0, scale: () => g.s0 }, { y: () => g.y1, scale: () => g.s1, ease: 'power2.inOut', duration: 0.62 }, 0)
        .to([intro.current, eyebrow.current], { autoAlpha: 0, y: -28, duration: 0.16 }, 0.03)
        .fromTo(
          title.current,
          { y: 0, scale: 1 },
          { y: () => -g.lift, scale: () => g.k, transformOrigin: '50% 0', ease: 'power2.inOut', duration: 0.5 },
          0.12,
        )
        .fromTo([frame, glow.current], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22 }, 0.3)
        .fromTo(line2.current, { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 0.24, ease: 'power3.out' }, 0.34)
        .fromTo(
          callouts.current!.children,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.14, stagger: 0.035, ease: 'power2.out' },
          0.62,
        )
        .to({}, { duration: 0.14 })

      return () => ScrollTrigger.removeEventListener('refreshInit', place)
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className={s.hero} aria-labelledby="hero-title">
      <div ref={stage} className={s.stage}>
        <div className={s.copy}>
          <a ref={eyebrow} className={s.eyebrow} href={release?.url ?? RELEASES} rel="noopener">
            <span className={s.dots} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>
              Open source<span className={s.wide}> · Beta</span>
              {release && (
                <>
                  {' '}
                  · {release.tag}
                  <span className={s.wide}> is out</span>
                </>
              )}
            </span>
            <Icon name="arrow" size={14} />
          </a>
          <h1 ref={title} id="hero-title" className={s.title}>
            <span className={s.l1}>Your desktop.</span>{' '}
            <span className={s.l2}>
              <span ref={line2} className={s.l2inner}>
                In your pocket.
              </span>
            </span>
          </h1>
          <div ref={intro} className={s.intro}>
            <p className={s.lede}>
              Your Windows or Linux computer, live on your Android phone. Drive it, hear it, and pass copies, files and
              messages between the two, at home or from anywhere.
            </p>
            <div className={s.ctas}>
              <a className={cx(b.btn, b.primary)} href="#download" onClick={jumpTo('download')}>
                <Icon name="download" size={18} />
                {downloadLabel(os)}
              </a>
              <button type="button" className={cx(b.btn, b.ghost)} onClick={onWatchFilm}>
                <Icon name="play" size={16} />
                Watch the film <span className={b.meta}>{FILM.length}</span>
              </button>
            </div>
          </div>
        </div>

        <div ref={glow} className={s.glow} aria-hidden="true" />
        <div ref={arrival} className={s.arrival}>
          <div ref={device} className={s.device}>
            <Phone orientation="landscape" screenClassName={s.screen}>
              <div className={s.stream}>
                <div className={s.side} data-side>
                  <span className={s.sideBtn}>
                    <Icon name="keyboard" size={54} />
                  </span>
                  <span className={cx(s.sideBtn, s.sideOn)}>
                    <Icon name="trackpad" size={54} />
                  </span>
                  <span className={s.sideBtn}>
                    <Icon name="pen" size={54} />
                  </span>
                </div>
                <div className={s.view}>
                  <Desktop live />
                </div>
                <div className={s.side} data-side>
                  <span className={s.sideBtn}>
                    <Icon name="volume" size={54} />
                  </span>
                  <span className={s.sideBtn}>
                    <Icon name="more" size={54} />
                  </span>
                </div>
              </div>
            </Phone>
          </div>
        </div>

        <ul ref={callouts} className={s.callouts} aria-label="In short">
          {CALLOUTS.map((c) => (
            <li key={c.text}>
              <Icon name={c.icon} size={16} />
              {c.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
