import { useEffect, useRef, useState } from 'react'
import { PromptLine, TermLine } from '../components/desktop/apps/Terminal'
import { Window } from '../components/desktop/Window'
import { LockScreen, Notice } from '../components/device/LockScreen'
import { Phone } from '../components/device/Phone'
import { Icon } from '../components/Icon'
import { SectionHead } from '../components/SectionHead'
import { useInView } from '../hooks/useInView'
import { cx } from '../lib/cx'
import { motionOn } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import type { Line } from '../lib/term'
import s from './Scripts.module.css'

type NoticeId = 'done' | 'ask' | 'link'

interface Step {
  cmd: string
  /** Printed at once. */
  out: Line[]
  /** Printed once the phone has answered (ask), or after the work (done). */
  after: Line[]
  notice: NoticeId
}

const STEPS: Step[] = [
  {
    cmd: 'pocketdesk done -- cargo build --release',
    out: [[['ok', '   Compiling'], ' pocketdesk-server v0.6.0']],
    after: [[['ok', '    Finished'], ' `release` profile [optimized] in 1m 42s']],
    notice: 'done',
  },
  {
    cmd: 'pocketdesk ask "Ship v0.6.1 to production?"',
    out: [[['dim', 'waiting for an answer from your phone…']]],
    after: [[['ok', 'yes']]],
    notice: 'ask',
  },
  {
    cmd: 'pocketdesk link "Pixel 8" https://example.com/boarding-pass',
    out: [],
    after: [[['ok', '✓'], ' handed to Pixel 8']],
    notice: 'link',
  },
]

const echo = (cmd: string): Line => [['prompt', '~ $'], ' ', ['cmd', cmd]]
const FINAL_LINES: Line[] = STEPS.flatMap((st) => [echo(st.cmd), ...st.out, ...st.after])
const ALL_NOTICES: NoticeId[] = ['link', 'ask', 'done']

const sleep = (ms: number) => new Promise((r) => window.setTimeout(r, ms))

export function Scripts() {
  const root = useRef<HTMLElement>(null)
  const inView = useInView(root, '0px 0px -25% 0px')
  // Prerendered (and still) as the finished run; the scene replays it when it comes into view.
  const [lines, setLines] = useState<Line[]>(FINAL_LINES)
  const [typed, setTyped] = useState('')
  const [notices, setNotices] = useState<NoticeId[]>(ALL_NOTICES)
  const [answer, setAnswer] = useState<'waiting' | 'yes'>('yes')
  /** A command is running: no prompt until it is done. */
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!motionOn()) return
    setLines([])
    setNotices([])
    setAnswer('waiting')
  }, [])

  useEffect(() => {
    if (!inView || !motionOn() || prefersReducedMotion()) return
    let alive = true
    ;(async () => {
      while (alive) {
        setLines([])
        setNotices([])
        setAnswer('waiting')
        await sleep(500)
        for (const st of STEPS) {
          for (let i = 1; i <= st.cmd.length; i++) {
            if (!alive) return
            setTyped(st.cmd.slice(0, i))
            await sleep(28 + ((i * 13) % 30))
          }
          await sleep(260)
          if (!alive) return
          setTyped('')
          setBusy(true)
          setLines((ls) => [...ls, echo(st.cmd), ...st.out])
          if (st.notice === 'ask') {
            setNotices((ns) => ['ask', ...ns])
            await sleep(1900)
            if (!alive) return
            setAnswer('yes')
            await sleep(500)
          } else {
            await sleep(st.notice === 'done' ? 1300 : 500)
            if (!alive) return
            setNotices((ns) => [st.notice, ...ns])
          }
          setLines((ls) => [...ls, ...st.after])
          setBusy(false)
          await sleep(1500)
        }
        await sleep(4200)
      }
    })()
    return () => {
      alive = false
    }
  }, [inView])

  return (
    <section ref={root} id="scripts" className={s.section} aria-labelledby="scripts-title">
      <div className={cx('container', s.grid)}>
        <div className={s.text}>
          <SectionHead
            label="For your terminal"
            id="scripts-title"
            size="md"
            title={
              <>
                Your phone, <em>in your scripts.</em>
              </>
            }
            lede="Pocketdesk is a command too. A long build tells your phone when it ends. A deploy waits for a yes from your fingerprint. A link goes straight to your pocket."
          />
          <ul className={s.more} aria-label="More commands">
            <li>
              <code>pocketdesk send</code> a file or a folder
            </li>
            <li>
              <code>pocketdesk ring</code> a lost phone
            </li>
            <li>
              <code>pocketdesk pause</code> the phones' notifications
            </li>
            <li>
              <code>pocketdesk events</code> for hooks and Home Assistant
            </li>
          </ul>
        </div>

        <div className={s.scene} aria-hidden="true">
          <Window title="Terminal — ~/pocketdesk" focused inline className={s.term}>
            <div className={s.termBody}>
              {lines.map((l, i) => (
                <TermLine key={i} line={l} />
              ))}
              {!busy && <PromptLine typed={typed} />}
            </div>
          </Window>
          <div className={s.phone}>
            <Phone>
              <LockScreen>
                {notices.map((n) => (
                  <div key={n} className={s.notice}>
                    {n === 'done' && (
                      <Notice
                        app="Laptop"
                        tint="#2f7bff"
                        icon={<Icon name="terminal" />}
                        title="cargo build --release finished"
                        body="Exit 0 after 1m 42s · Finished `release` profile"
                      />
                    )}
                    {n === 'ask' && (
                      <Notice
                        app="Laptop asks"
                        tint="#7b6cff"
                        icon={<Icon name="shield" />}
                        title="Ship v0.6.1 to production?"
                        body={
                          <span className={s.askButtons}>
                            <span>No</span>
                            <span className={cx(s.yes, answer === 'yes' && s.yesOn)}>
                              <Icon name="fingerprint" /> {answer === 'yes' ? 'Yes, confirmed' : 'Yes'}
                            </span>
                          </span>
                        }
                      />
                    )}
                    {n === 'link' && (
                      <Notice
                        app="Laptop"
                        tint="#2f7bff"
                        icon={<Icon name="globe" />}
                        title="A link from Laptop"
                        body="example.com/boarding-pass · tap to open"
                      />
                    )}
                  </div>
                ))}
              </LockScreen>
            </Phone>
          </div>
        </div>
      </div>
    </section>
  )
}
