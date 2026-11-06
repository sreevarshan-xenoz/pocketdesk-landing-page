import { useRef } from 'react'
import { Icon, type IconName } from '../components/Icon'
import { SectionHead } from '../components/SectionHead'
import { gsap, motionOn, useGSAP } from '../lib/gsap'
import { REPO } from '../lib/release'
import s from './WhatsNew.module.css'

const GUIDE = `${REPO}/blob/main/docs/guide.md#features`

/* As the main repository's README lists 0.9.0. Most are off until you turn them on. */
const ITEMS: Array<{ icon: IconName; title: string; body: string }> = [
  {
    icon: 'phone',
    title: 'The phone’s apps on the computer',
    body: 'A Phone apps page lists them; a click opens one on the phone and shows it in a window. No adb, no wireless debugging.',
  },
  {
    icon: 'camera',
    title: 'The phone as a webcam',
    body: 'On Linux, apps see a PipeWire camera, with no kernel module. A tap on the phone starts it.',
  },
  {
    icon: 'fingerprint',
    title: 'Approve with the phone',
    body: 'sudo, polkit prompts and the lock screen on Linux can wait for the phone’s fingerprint or screen lock. The password keeps working.',
  },
  {
    icon: 'globe',
    title: 'The phone’s location',
    body: 'Linux apps get it through GeoClue, now that Mozilla’s location service is gone.',
  },
  {
    icon: 'wifi',
    title: 'A direct link',
    body: 'No shared network? The computer makes its own Wi-Fi for one phone, on Linux and on Windows.',
  },
  {
    icon: 'folder',
    title: 'Folders kept on the computer',
    body: 'Pick phone folders with Android’s own picker, with no all-files permission, and they are copied over on a schedule.',
  },
  {
    icon: 'power',
    title: 'A spare phone wakes the computer',
    body: 'An old phone on a charger at home sends the magic packet, so waking from outside needs no router setting.',
  },
  {
    icon: 'ring',
    title: 'A Wear OS tile',
    body: 'Wake the computer, ring the phone, and press music and deck buttons from your watch, with no Google Play services. Built from source for now.',
  },
  {
    icon: 'gamepad',
    title: 'Optional, with Shizuku',
    body: 'Each phone app in a window of its own, keys to taps for phone games, and the phone’s hotspot turned on from the computer.',
  },
]

export function WhatsNew() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (!motionOn()) return
      gsap.from(gsap.utils.toArray<HTMLElement>('[data-reveal]', root.current), {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.05,
        scrollTrigger: { trigger: '[data-items]', start: 'top 85%', once: true },
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="new" className={s.section} aria-labelledby="new-title">
      <div className="container">
        <SectionHead
          label="New in 0.9.0"
          id="new-title"
          size="md"
          title={
            <>
              The phone does more. <em>So does the computer.</em>
            </>
          }
          lede={
            <>
              Most of these are off until you turn them on.{' '}
              <a href={GUIDE} rel="noopener">
                The guide
              </a>{' '}
              has each one's switches.
            </>
          }
        />
        <ul className={s.grid} data-items>
          {ITEMS.map((it) => (
            <li key={it.title} className={s.item} data-reveal>
              <span className={s.icon}>
                <Icon name={it.icon} size={20} />
              </span>
              <div>
                <h3>{it.title}</h3>
                <p>{it.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
