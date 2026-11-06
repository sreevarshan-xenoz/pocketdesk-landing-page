import { useRef } from 'react'
import { Icon, type IconName } from '../components/Icon'
import { SectionHead } from '../components/SectionHead'
import { gsap, motionOn, useGSAP } from '../lib/gsap'
import s from './Together.module.css'

const CARDS: Array<{ icon: IconName; title: string; body: string }> = [
  {
    icon: 'mouse',
    title: 'One keyboard and mouse.',
    body: 'Push the pointer past a screen’s edge and it carries on onto the next computer, with the clipboard, files and sound following it. The phone can be one of the screens.',
  },
  {
    icon: 'laptop',
    title: 'A computer in a window.',
    body: 'One computer’s screen in a window on another, either way round: its keys, your mic, every one of its screens, and a pointer lock for games.',
  },
  {
    icon: 'window',
    title: 'Carry a window across.',
    body: 'Drag a window past a Sway or Hyprland screen’s edge and it opens on the other computer, or borrow one from the menu, on Windows too. From KDE Plasma, borrow one to look at.',
  },
]

/** Two screens side by side; the pointer, then a window, cross the seam between them. */
function Screens() {
  return (
    <div className={s.screens} aria-hidden="true">
      {['Laptop', 'Desktop'].map((name, i) => (
        <div key={name} className={s.screen}>
          <div className={s.bar}>
            <i />
            <i />
            <i />
            <span>{name}</span>
          </div>
          {i === 0 && (
            <div className={s.travel}>
              <div className={s.win}>
                <div className={s.winBar}>notes.md</div>
                <span />
                <span />
                <span />
              </div>
              <svg className={s.pointer} viewBox="0 0 24 24" width="22" height="22">
                <path d="M4 2l15 10-7 1.5L8.5 21z" fill="#fff" stroke="#0b1222" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export function Together() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (!motionOn()) return
      gsap.from(gsap.utils.toArray<HTMLElement>('[data-reveal]', root.current), {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '[data-cards]', start: 'top 85%', once: true },
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="together" className={s.section} aria-labelledby="together-title">
      <div className="container">
        <SectionHead
          label="Your computers, together"
          id="together-title"
          align="center"
          title={
            <>
              Two computers. <em>One desk.</em>
            </>
          }
          lede="Pair your computers with each other once, both ways, and they share a keyboard and mouse, show each other's screens and hand windows across."
        />
        <Screens />
        <div className={s.cards} data-cards>
          {CARDS.map((c) => (
            <article key={c.title} className={s.card} data-reveal>
              <span className={s.icon}>
                <Icon name={c.icon} size={22} />
              </span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
