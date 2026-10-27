import type { ReactNode } from 'react'
import { Icon } from '../Icon'
import s from './PhoneUI.module.css'

/** Android's status bar, sized in cqw so it scales with the phone. */
export function StatusBar() {
  return (
    <div className={s.status}>
      <span>9:41</span>
      <span className={s.statusIcons}>
        <Icon name="wifi" />
        <Icon name="battery" />
      </span>
    </div>
  )
}

/** Pocketdesk's session bar: which computer, and what the phone is being. */
export function AppBar({ title, chip }: { title: string; chip?: ReactNode }) {
  return (
    <div className={s.appbar}>
      <span className={s.back} aria-hidden="true">
        ‹
      </span>
      <span className={s.title}>{title}</span>
      {chip && <span className={s.chip}>{chip}</span>}
    </div>
  )
}

/** A phone screen laid out as a column: status bar, session bar, then the rest. */
export function PhoneScreen({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className ? `${s.screen} ${className}` : s.screen}>{children}</div>
}
