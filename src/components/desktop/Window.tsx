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
}

/** The brand's window: rounded, three dots, a quiet title. Used for every window on every screen. */
export function Window({ title, children, className, style, focused }: WindowProps) {
  return (
    <div className={cx(s.window, focused && s.focused, className)} style={style}>
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
