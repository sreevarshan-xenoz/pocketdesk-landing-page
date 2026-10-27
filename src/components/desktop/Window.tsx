import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../lib/cx'
import s from './Window.module.css'

interface WindowProps {
  title: string
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** The window in front: brighter title, deeper shadow. */
  focused?: boolean
  /** In the page's flow rather than placed on a desktop. */
  inline?: boolean
}

/** The brand's window: rounded, three dots, a quiet title. Used for every window on every screen. */
export function Window({ title, children, className, style, focused, inline }: WindowProps) {
  return (
    <div className={cx(s.window, focused && s.focused, inline && s.inline, className)} style={style}>
      <div className={s.bar}>
        <span className={s.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={s.title}>{title}</span>
      </div>
      <div className={s.body}>{children}</div>
    </div>
  )
}
