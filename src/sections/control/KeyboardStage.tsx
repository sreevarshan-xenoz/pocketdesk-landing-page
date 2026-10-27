import { useEffect, useRef, useState } from 'react'
import { ShellView } from '../../components/desktop/apps/Terminal'
import { FitDesktop } from '../../components/desktop/Desktop'
import { Laptop } from '../../components/device/Laptop'
import { Phone } from '../../components/device/Phone'
import { AppBar, PhoneScreen, StatusBar } from '../../components/device/PhoneUI'
import { Icon } from '../../components/Icon'
import { cx } from '../../lib/cx'
import { prefersReducedMotion } from '../../lib/motion'
import { runCommand } from '../../lib/shell'
import type { Line } from '../../lib/term'
import s from './stages.module.css'

const WELCOME: Line[] = [[['dim', 'A demo shell, typed from the phone. Try help.']], []]

const ROWS = [
  ['Esc', 'Tab', 'Ctrl', 'Alt', '←', '↑', '↓', '→'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
  ['?123', ' ', '⏎'],
]

const GHOST = ['pocketdesk status', 'pd ring pixel']

const sleep = (ms: number) => new Promise((r) => window.setTimeout(r, ms))

export function KeyboardStage({ active }: { active: boolean }) {
  const [lines, setLines] = useState<Line[]>(WELCOME)
  const [typed, setTyped] = useState('')
  const typedRef = useRef('')
  const [pressed, setPressed] = useState<string | null>(null)
  const [ringing, setRinging] = useState(false)
  const [touched, setTouched] = useState(false)
  const touchedRef = useRef(false)
  const input = useRef<HTMLInputElement>(null)
  const flashTimer = useRef(0)

  const setText = (v: string) => {
    typedRef.current = v
    setTyped(v)
  }

  const flash = (k: string) => {
    setPressed(k)
    window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setPressed(null), 150)
  }

  const submit = () => {
    const text = typedRef.current
    const r = runCommand(text)
    const echo: Line = [['prompt', '~ $'], ' ', ['cmd', text]]
    setLines((ls) => (r.effect === 'clear' ? [] : [...ls, echo, ...r.output].slice(-15)))
    if (r.effect === 'ring') {
      setRinging(true)
      window.setTimeout(() => setRinging(false), 2600)
    }
    setText('')
  }

  const key = (k: string) => {
    flash(k)
    if (k === '⏎') submit()
    else if (k === '⌫') setText(typedRef.current.slice(0, -1))
    else if (k.length === 1) setText((typedRef.current + k).slice(0, 48))
  }

  /** The visitor's first touch: the ghost stops at once and its half-typed line goes. */
  const takeOver = () => {
    if (touchedRef.current) return
    touchedRef.current = true
    setTouched(true)
    setText('')
    setLines(WELCOME)
  }

  const press = (k: string) => {
    takeOver()
    key(k)
    // A desk keyboard keeps typing after a tap on the phone; a touch screen keeps its own keyboard away.
    if (!window.matchMedia('(pointer: coarse)').matches) input.current?.focus({ preventScroll: true })
  }

  // The ghost types a couple of real commands until the visitor takes over.
  useEffect(() => {
    if (!active || touched || prefersReducedMotion()) return
    let alive = true
    const going = () => alive && !touchedRef.current
    // Each run starts clean: a run cut short by scrolling away may have left a half-typed line.
    setText('')
    setLines(WELCOME)
    ;(async () => {
      await sleep(700)
      while (going()) {
        for (const cmd of GHOST) {
          for (const ch of cmd) {
            if (!going()) return
            key(ch)
            await sleep(70 + (ch.charCodeAt(0) % 5) * 20)
          }
          await sleep(380)
          if (!going()) return
          key('⏎')
          await sleep(2800)
        }
        if (!going()) return
        setLines(WELCOME)
        await sleep(700)
      }
    })()
    return () => {
      alive = false
    }
  }, [active, touched])

  return (
    <div className={s.stage}>
      <div className={s.laptop} onClick={() => input.current?.focus({ preventScroll: true })}>
        <Laptop>
          <FitDesktop live focus="terminal" terminal={<ShellView lines={lines} typed={typed} />} />
        </Laptop>
      </div>
      <input
        ref={input}
        className="sr-only"
        aria-label="Type a command for the demo terminal, then press Enter"
        value={typed}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        onFocus={takeOver}
        onChange={(e) => {
          takeOver()
          setText(e.target.value.slice(0, 48))
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            takeOver()
            flash('⏎')
            submit()
          } else if (e.key === 'Backspace') flash('⌫')
          else if (e.key.length === 1) flash(e.key.toLowerCase())
        }}
      />
      <div className={cx(s.phone, ringing && s.ringing)}>
        <Phone decorative={false}>
          <PhoneScreen>
            <StatusBar />
            <AppBar title="Laptop" chip="Keyboard" />
            <div className={s.preview}>
              <FitDesktop focus="terminal" cursor={false} terminal={<ShellView lines={lines} typed={typed} />} />
            </div>
            <div className={s.typing}>
              <span className={s.typingLabel}>Typing to Laptop</span>
              <span className={s.typingLine}>
                {typed}
                <i className={s.typingCaret} />
              </span>
            </div>
            <div className={s.keyboard}>
              {ROWS.map((row, i) => (
                <div key={i} className={cx(s.keyRow, i === 0 && s.modRow)}>
                  {row.map((k) => (
                    <button
                      key={k}
                      type="button"
                      tabIndex={-1}
                      aria-hidden="true"
                      className={cx(s.key, k === ' ' && s.space, k.length > 1 && s.wideKey, pressed === k && s.keyOn)}
                      onPointerDown={(e) => {
                        e.preventDefault()
                        press(k)
                      }}
                    >
                      {k === ' ' ? 'space' : k}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            {ringing && (
              <div className={s.ring}>
                <span className={s.ringIcon}>
                  <Icon name="bell" />
                </span>
                <b>Ringing</b>
                <span>from Laptop, for 30 seconds</span>
                <span className={s.ringStop}>Stop</span>
              </div>
            )}
          </PhoneScreen>
        </Phone>
      </div>
    </div>
  )
}
