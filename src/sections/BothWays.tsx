import { useRef } from 'react'
import { FitDesktop } from '../components/desktop/Desktop'
import { Window } from '../components/desktop/Window'
import { Laptop } from '../components/device/Laptop'
import { LockScreen, Notice } from '../components/device/LockScreen'
import { Phone } from '../components/device/Phone'
import { Icon, type IconName } from '../components/Icon'
import { Mark } from '../components/Mark'
import { SectionHead } from '../components/SectionHead'
import { cx } from '../lib/cx'
import { gsap, motionOn, useGSAP } from '../lib/gsap'
import s from './BothWays.module.css'

const BEATS = [
  {
    title: 'Copy here, paste there.',
    body: 'Text and images cross the clipboard both ways. A copy your password manager marks private never leaves the computer.',
  },
  {
    title: 'Answer your phone from your desk.',
    body: "Texts and notifications arrive as toasts, with their buttons and a reply box. Calls ring here too, and the phone's music sits in the computer's media keys.",
  },
  {
    title: 'Files, both ways.',
    body: 'Send a file or a whole folder. A transfer that stops picks up where it left off, and every file is checked end to end.',
  },
  {
    title: 'Lost your phone? Ring it.',
    body: 'Loud for 30 seconds, through Do Not Disturb, with the torch blinking. From the tray, the desktop app or a terminal.',
  },
]

const MORE: Array<{ icon: IconName; text: string }> = [
  { icon: 'call', text: 'Calls ring on the computer' },
  { icon: 'window', text: "The phone's screen in a window" },
  { icon: 'camera', text: 'Its camera in a window' },
  { icon: 'photo', text: 'Recent photos' },
  { icon: 'music', text: 'Its music in your media keys' },
  { icon: 'battery', text: 'Battery and state' },
  { icon: 'power', text: 'Wake the computer from the phone' },
  { icon: 'lock', text: 'Lock it when you walk away' },
]

const REPLY = "No rush, I'll grab us a table"

export function BothWays() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!motionOn()) return
      const q = gsap.utils.selector(root)
      const el = root.current!
      const texts = q('[data-beat]')
      const ticks = q('[data-tick]')
      const packet = q('[data-packet]')
      const pct = q('[data-pct]')
      const bars = q('[data-bar]')
      const progress = { p: 0 }

      const tl = gsap.timeline({
        defaults: { duration: 0.1, ease: 'power2.out' },
        scrollTrigger: { trigger: track.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
        onUpdate: () => el.classList.toggle(s.ringing, tl.time() > 3.42),
      })

      const show = (sel: string, at: number, until?: number) => {
        tl.fromTo(q(sel), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, immediateRender: false }, at)
        if (until !== undefined) tl.to(q(sel), { autoAlpha: 0, y: -10, duration: 0.07, immediateRender: false }, until)
      }
      const send = (at: number, dir: 1 | -1, duration = 0.18) =>
        tl
          .fromTo(
            packet,
            { left: dir > 0 ? '0%' : '100%', autoAlpha: 1 },
            { left: dir > 0 ? '100%' : '0%', duration, ease: 'power1.inOut', immediateRender: false },
            at,
          )
          .set(packet, { autoAlpha: 0 }, at + duration)

      // The first beat is already on screen as the section arrives; the others come in turn.
      BEATS.forEach((_, i) => {
        if (i > 0) tl.fromTo(texts[i], { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.08 }, i + 0.01)
        if (i < BEATS.length - 1) tl.to(texts[i], { opacity: 0, y: -26, duration: 0.08 }, i + 0.92)
        tl.fromTo(ticks[i], { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'none' }, i + 0.05)
      })

      // 1: copy on the laptop, and it is on the phone's clipboard.
      tl.to(q('[data-l1]'), { autoAlpha: 0, y: -10, duration: 0.07 }, 0.92)
      tl.fromTo(q('[data-sel]'), { scaleX: 0 }, { scaleX: 1, duration: 0.16, ease: 'none' }, 0.08)
      show('[data-keys]', 0.26, 0.92)
      send(0.38, 1)
      show('[data-p1]', 0.58, 0.92)

      // 2: a text on the phone, answered from the laptop's toast.
      show('[data-p2]', 1.04, 1.92)
      send(1.14, -1)
      show('[data-l2]', 1.32, 1.92)
      tl.fromTo(q('[data-typed]'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.22, ease: 'none' }, 1.42)
      send(1.66, 1)
      show('[data-sent]', 1.84)

      // 3: a big file goes over, checked at the end.
      show('[data-l3]', 2.03, 2.92)
      show('[data-p3]', 2.08, 2.92)
      tl.fromTo(
        progress,
        { p: 0 },
        {
          p: 100,
          duration: 0.56,
          ease: 'none',
          immediateRender: false,
          onUpdate: () => {
            const v = Math.round(progress.p)
            for (const node of pct) node.textContent = `${v}%`
            for (const b of bars) (b as HTMLElement).style.transform = `scaleX(${progress.p / 100})`
          },
        },
        2.12,
      )
      for (let k = 0; k < 5; k++) send(2.12 + k * 0.1, 1, 0.12)
      show('[data-done]', 2.72, 2.92)

      // 4: ring it from the tray.
      show('[data-l4]', 3.03)
      show('[data-click]', 3.16)
      send(3.24, 1)
      show('[data-p4]', 3.42)
      tl.to({}, { duration: 0.18 }, 3.82)
    },
    { scope: root },
  )

  return (
    <section ref={root} id="both-ways" className={s.section} aria-labelledby="both-title">
      {/* The scroll track: the sticky stage plays while it passes. The list follows it. */}
      <div ref={track} className={s.track}>
      <div className={s.stage}>
        <div className={cx('container', s.head)}>
          <SectionHead
            label="Both ways"
            id="both-title"
            size="md"
            title={
              <>
                Two devices. <em>One of everything.</em>
              </>
            }
          />
        </div>
        <div className={cx('container', s.layout)}>
          <div className={s.text}>
            <ol className={s.beats}>
              {BEATS.map((b) => (
                <li key={b.title} data-beat>
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </li>
              ))}
            </ol>
            <div className={s.ticks} aria-hidden="true">
              {BEATS.map((b) => (
                <span key={b.title}>
                  <i data-tick />
                </span>
              ))}
            </div>
          </div>

          <div className={s.scene} aria-hidden="true">
            <div className={s.laptop}>
              <Laptop>
                <FitDesktop scene="bare" app="Notes" cursor={false}>
                  {/* 1: the copy */}
                  <div className={s.layer} data-l1>
                    <Window title="Notes — Saturday" focused style={{ left: 150, top: 110, width: 820, height: 470 }}>
                      <div className={s.notes}>
                        <b>Saturday</b>
                        <p>Pick up the camera from the shop</p>
                        <p>
                          <span className={s.sel}>
                            <i data-sel />
                            Meet at 4, by the station
                          </span>
                        </p>
                        <p>Bring the charger</p>
                      </div>
                    </Window>
                    <div className={s.keycaps} data-keys>
                      <kbd>Ctrl</kbd>
                      <kbd>C</kbd>
                    </div>
                  </div>

                  {/* 2: the toast, answered */}
                  <div className={cx(s.toast, s.layer)} data-l2>
                    <div className={s.toastHead}>
                      <span className={s.msgIcon}>
                        <Icon name="chat" size={20} />
                      </span>
                      Messages <span>· Pixel 8</span>
                    </div>
                    <b>Maya</b>
                    <p>Running five minutes late, save me a seat?</p>
                    <div className={s.replyBox}>
                      <span className={s.typed} data-typed>
                        {REPLY}
                      </span>
                      <span className={s.send}>Send</span>
                    </div>
                  </div>

                  {/* 3: the transfer */}
                  <div className={s.layer} data-l3>
                    <Window title="Pocketdesk — Files" focused style={{ left: 290, top: 190, width: 1020, height: 380 }}>
                      <div className={s.files}>
                        <div className={s.fileRow}>
                          <span className={s.fileIcon}>
                            <Icon name="file" size={34} />
                          </span>
                          <div className={s.fileName}>
                            <b>holiday.mp4</b>
                            <span>1.8 GB · to Pixel 8</span>
                          </div>
                          <span className={s.pct} data-pct>
                            0%
                          </span>
                        </div>
                        <div className={s.bar}>
                          <i data-bar />
                        </div>
                        <div className={s.fileFoot}>
                          <span>Sending · a dropped link picks up where it stopped</span>
                          <span className={s.checked} data-done>
                            <Icon name="check" size={20} /> Checked, SHA-256
                          </span>
                        </div>
                      </div>
                    </Window>
                  </div>

                  {/* 4: the tray */}
                  <div className={cx(s.tray, s.layer)} data-l4>
                    <div className={s.trayHead}>
                      <Mark size={24} /> Pocketdesk
                      <span className={s.trayOn}>● Pixel 8</span>
                    </div>
                    <div className={s.trayItem}>Send a file…</div>
                    <div className={cx(s.trayItem, s.trayHot)}>
                      <Icon name="ring" size={20} /> Ring Pixel 8
                    </div>
                    <div className={s.trayItem}>Pause notifications</div>
                    <div className={s.trayItem}>Open Pocketdesk</div>
                    <svg className={s.trayCursor} data-click viewBox="0 0 24 24" width="34" height="34">
                      <path d="M4 2.5 19 13l-7 1.4L8.2 21 4 2.5Z" fill="#fff" stroke="#0b1222" strokeWidth="1.4" strokeLinejoin="round" />
                    </svg>
                  </div>
                </FitDesktop>
              </Laptop>
            </div>

            <div className={s.link}>
              <span className={s.packet} data-packet />
            </div>

            <div className={s.phone}>
              <Phone>
                <LockScreen>
                  <div className={cx(s.layer, s.slot)} data-p2>
                    <Notice
                      app="Messages"
                      tint="#22c55e"
                      icon={<Icon name="chat" />}
                      title="Maya"
                      body={
                        <>
                          Running five minutes late, save me a seat?
                          <span className={s.sentLine} data-sent>
                            You: {REPLY} <em>sent from Laptop</em>
                          </span>
                        </>
                      }
                    />
                  </div>
                  <div className={cx(s.layer, s.slot)} data-p3>
                    <Notice
                      app="Pocketdesk"
                      tint="#2f7bff"
                      icon={<Icon name="download" />}
                      title="holiday.mp4 from Laptop"
                      body={
                        <>
                          <span className={s.phoneBar}>
                            <i data-bar />
                          </span>
                          <span className={s.phoneMeta}>
                            <span data-pct>0%</span> of 1.8 GB
                          </span>
                        </>
                      }
                    />
                  </div>
                </LockScreen>
                <div className={cx(s.clip, s.layer)} data-p1>
                  <Icon name="clipboard" />
                  <span>
                    <em>Copied from Laptop</em>
                    Meet at 4, by the station
                  </span>
                </div>
                <div className={cx(s.ring, s.layer)} data-p4>
                  <span className={s.ringIcon}>
                    <Icon name="bell" />
                  </span>
                  <b>Laptop is ringing this phone</b>
                  <span>For 30 seconds, through Do Not Disturb</span>
                  <span className={s.ringStop}>Stop</span>
                </div>
                <span className={s.torch} />
              </Phone>
            </div>
          </div>
        </div>
      </div>
      </div>

      <ul className={cx('container', s.more)} aria-label="And more, both ways">
        {MORE.map((m) => (
          <li key={m.text}>
            <Icon name={m.icon} size={16} />
            {m.text}
          </li>
        ))}
      </ul>
    </section>
  )
}
