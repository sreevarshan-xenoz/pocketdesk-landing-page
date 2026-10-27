import { type ReactNode, useEffect, useRef, useState } from 'react'
import { Window } from '../components/desktop/Window'
import { Phone } from '../components/device/Phone'
import { StatusBar } from '../components/device/PhoneUI'
import { Icon } from '../components/Icon'
import { SectionHead } from '../components/SectionHead'
import { useInView } from '../hooks/useInView'
import { cx } from '../lib/cx'
import { gsap, motionOn, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import { qrPath } from '../lib/qr'
import { REPO } from '../lib/release'
import s from './Private.module.css'

const QR = qrPath(REPO)
const PROTOCOL = `${REPO}/blob/main/docs/protocol.md`

const PERMISSIONS = [
  { name: 'Control the computer', on: true },
  { name: 'Files', on: true },
  { name: 'Clipboard', on: true },
  { name: 'Notifications', on: true },
  { name: 'Sound', on: true },
  { name: 'Microphone', on: false },
]

function QrCode({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={`-2 -2 ${QR.size + 4} ${QR.size + 4}`} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="-2" y="-2" width={QR.size + 4} height={QR.size + 4} fill="#fff" />
      <path d={QR.d} fill="#0b1222" />
    </svg>
  )
}

function Proof({ title, body, children }: { title: string; body: ReactNode; children: ReactNode }) {
  return (
    <article className={s.proof} data-reveal>
      <div className={s.proofUi}>{children}</div>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  )
}

export function Private() {
  const root = useRef<HTMLElement>(null)
  const pairRef = useRef<HTMLDivElement>(null)
  const pairInView = useInView(pairRef, '0px 0px -30% 0px')
  const [paired, setPaired] = useState(false)
  const [perms, setPerms] = useState(PERMISSIONS)
  const [answer, setAnswer] = useState<'ask' | 'allowed' | 'denied'>('ask')

  // The phone scans for a moment, then the pairing lands.
  useEffect(() => {
    if (!pairInView || paired) return
    const t = window.setTimeout(() => setPaired(true), prefersReducedMotion() ? 0 : 2600)
    return () => window.clearTimeout(t)
  }, [pairInView, paired])

  useEffect(() => {
    if (answer === 'ask') return
    const t = window.setTimeout(() => setAnswer('ask'), 3200)
    return () => window.clearTimeout(t)
  }, [answer])

  useGSAP(
    () => {
      if (!motionOn()) return
      gsap.from(gsap.utils.toArray<HTMLElement>('[data-reveal]', root.current), {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '[data-proofs]', start: 'top 85%', once: true },
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="private" className={s.section} aria-labelledby="private-title">
      <div className="container">
        <SectionHead
          label="Yours alone"
          id="private-title"
          align="center"
          title={
            <>
              No account. No cloud. <em>Just your two devices.</em>
            </>
          }
          lede="Pocketdesk runs no server of its own. The phone and the computer hold each other to their keys over TLS 1.3, and you decide what each phone may do."
        />

        <div ref={pairRef} className={s.pair}>
          <div className={s.pairCopy}>
            <h3>Scan once.</h3>
            <p>
              The desktop app's Pair page shows a code. The phone scans it and checks the computer's certificate before its first byte,
              so the pairing reaches only that computer.
            </p>
            <p className={s.egg}>
              <Icon name="eye" size={16} /> This one opens Pocketdesk's source.
            </p>
          </div>
          <div className={s.pairScene}>
            <Window title="Pocketdesk — Pair a phone" focused inline className={s.pairWindow}>
              <div className={s.pairBody}>
                <QrCode className={s.qr} />
                <div className={s.pairSide}>
                  <b>Scan with the Pocketdesk app</b>
                  <span>Open the app on your phone and point it here.</span>
                  <span className={cx(s.pairState, paired && s.pairDone)}>
                    {paired ? (
                      <>
                        <Icon name="check" size={16} /> Pixel 8 is paired
                      </>
                    ) : (
                      'Waiting for a phone…'
                    )}
                  </span>
                </div>
              </div>
            </Window>
            <div className={s.pairPhone}>
              <Phone>
                <div className={s.viewfinder}>
                  <StatusBar />
                  <div className={s.finder}>
                    <QrCode className={s.finderQr} />
                    <i className={s.corners} />
                    {!paired && <i className={s.scanLine} />}
                  </div>
                  <span className={s.finderHint}>Point at the code on your computer</span>
                  <div className={cx(s.success, paired && s.successOn)}>
                    <span className={s.check}>
                      <Icon name="check" />
                    </span>
                    <b>Paired with Laptop</b>
                    <span>Keys pinned · TLS 1.3</span>
                  </div>
                </div>
              </Phone>
            </div>
          </div>
        </div>

        <div className={s.proofs} data-proofs>
          <Proof
            title="Each phone, its own switches."
            body="Give one phone the whole computer and another only files. Turning off control, sound or the microphone ends that phone's session at once."
          >
            <ul className={s.perms}>
              {perms.map((p, i) => (
                <li key={p.name}>
                  <span>{p.name}</span>
                  <button
                    type="button"
                    className={cx(s.switch, p.on && s.switchOn)}
                    aria-pressed={p.on}
                    aria-label={`${p.name} for Pixel 8`}
                    onClick={() => setPerms((ps) => ps.map((q, j) => (j === i ? { ...q, on: !q.on } : q)))}
                  >
                    <i />
                  </button>
                </li>
              ))}
            </ul>
          </Proof>

          <Proof title="Asked first, if you like." body="The computer can ask before each session starts, so no one drives it unseen.">
            {/* The buttons stay put, so a keyboard user keeps their place; the answer shows beneath. */}
            <div className={s.ask}>
              <span className={s.askIcon}>
                <Icon name="shield" size={22} />
              </span>
              <b>Pixel 8 wants to start a session</b>
              <span className={s.askSub}>It may control the computer and hear its sound.</span>
              <div className={s.askButtons}>
                <button type="button" aria-pressed={answer === 'denied'} onClick={() => setAnswer('denied')}>
                  Deny
                </button>
                <button type="button" className={s.allow} aria-pressed={answer === 'allowed'} onClick={() => setAnswer('allowed')}>
                  Allow
                </button>
              </div>
              <span className={s.askResult} aria-live="polite">
                {answer !== 'ask' && (
                  <>
                    <Icon name={answer === 'allowed' ? 'check' : 'x'} size={18} />
                    {answer === 'allowed' ? 'Session started' : 'Turned away'}
                  </>
                )}
              </span>
            </div>
          </Proof>

          <Proof
            title="Private copies stay put."
            body="A copy your password manager marks private never leaves the computer, and neither do copies from apps you list."
          >
            <div className={s.kept}>
              <div className={s.keptRow}>
                <span className={s.keptApp}>KeePassXC copied a password</span>
                <span className={s.dots}>••••••••••••</span>
              </div>
              <div className={s.keptVerdict}>
                <Icon name="lock" size={18} /> Kept on this computer. Not sent.
              </div>
            </div>
          </Proof>

          <Proof
            title="Everything on the record."
            body={
              <>
                The protocol is written down in full: what is sent, and to whom.{' '}
                <a href={PROTOCOL} rel="noopener">
                  Read it
                </a>
                .
              </>
            }
          >
            <pre className={s.record}>
              <span>
                <b>pairing</b> QR, then a pinned certificate
              </span>
              <span>
                <b>control</b> TLS 1.3, pinned on both sides
              </span>
              <span>
                <b>screen</b> QUIC, the same keys
              </span>
              <span>
                <b>away</b> iroh; a relay sees ciphertext
              </span>
            </pre>
          </Proof>
        </div>
      </div>
    </section>
  )
}
