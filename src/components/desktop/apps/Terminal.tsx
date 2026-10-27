import { Fragment, useEffect, useRef, useState } from 'react'
import { useInView } from '../../../hooks/useInView'
import { cx } from '../../../lib/cx'
import { prefersReducedMotion } from '../../../lib/motion'
import type { Command, Line } from '../../../lib/term'
import s from './apps.module.css'

export function TermLine({ line }: { line: Line }) {
  return (
    <div className={s.tline}>
      {line.map((seg, i) =>
        typeof seg === 'string' ? <Fragment key={i}>{seg}</Fragment> : <span key={i} className={s[seg[0]]}>{seg[1]}</span>,
      )}
      {line.length === 0 && ' '}
    </div>
  )
}

interface TerminalProps {
  history: Line[]
  /** Commands typed one after another, in a loop, while the terminal is on screen. */
  script?: Command[]
  live?: boolean
  prompt?: string
  className?: string
}

/** A prompt with what has been typed so far and the caret, for shells driven from outside. */
export function PromptLine({ prompt = '~ $', typed }: { prompt?: string; typed: string }) {
  return (
    <div className={s.tline}>
      <span className={s.prompt}>{prompt}</span> <span className={s.cmd}>{typed}</span>
      <span className={s.caret} />
    </div>
  )
}

/** A shell whose lines and typing come from outside (the Control demo's keyboard). */
export function ShellView({ lines, typed }: { lines: Line[]; typed: string }) {
  return (
    <div className={s.term}>
      {lines.map((line, i) => (
        <TermLine key={i} line={line} />
      ))}
      <PromptLine typed={typed} />
    </div>
  )
}

/** A shell: past lines, then the prompt typing the script. Not live: the first command, already run. */
export function Terminal({ history, script = [], live = false, prompt = '~ $', className }: TerminalProps) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref)
  const [step, setStep] = useState({ i: 0, typed: live ? 0 : Infinity, done: !live })

  useEffect(() => {
    if (!live || !visible || script.length === 0 || prefersReducedMotion()) return
    const cur = script[step.i]
    let delay: number
    let next: () => void
    if (!step.done && step.typed < cur.cmd.length) {
      delay = 45 + ((step.typed * 37) % 50)
      next = () => setStep((st) => ({ ...st, typed: st.typed + 1 }))
    } else if (!step.done) {
      delay = 420
      next = () => setStep((st) => ({ ...st, done: true }))
    } else {
      delay = 2600
      next = () => setStep((st) => ({ i: (st.i + 1) % script.length, typed: 0, done: false }))
    }
    const t = window.setTimeout(next, delay)
    return () => window.clearTimeout(t)
  }, [live, visible, script, step])

  const cur = script[step.i]
  return (
    <div ref={ref} className={cx(s.term, className)}>
      {history.map((line, i) => (
        <TermLine key={i} line={line} />
      ))}
      <div className={s.tline}>
        <span className={s.prompt}>{prompt}</span> <span className={s.cmd}>{cur?.cmd.slice(0, step.typed)}</span>
        {!step.done && <span className={s.caret} />}
      </div>
      {step.done && cur?.out.map((line, i) => <TermLine key={i} line={line} />)}
      {step.done && (
        <div className={s.tline}>
          <span className={s.prompt}>{prompt}</span> <span className={s.caret} />
        </div>
      )}
    </div>
  )
}
