import type { ReactNode } from 'react'
import { StatusBar } from './PhoneUI'
import s from './LockScreen.module.css'

/** The phone's lock screen: night ridges, a big clock, and room for notifications. */
export function LockScreen({ children }: { children?: ReactNode }) {
  return (
    <div className={s.lock}>
      <svg className={s.ridges} viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 30 C12 22 20 26 30 20 S48 14 58 22 S78 30 100 18 V60 H0Z" fill="#14235f" />
        <path d="M0 40 C16 32 28 38 42 33 S66 28 78 35 S92 40 100 34 V60 H0Z" fill="#0d1846" />
        <path d="M0 50 C20 44 40 49 58 46 S84 44 100 48 V60 H0Z" fill="#070f30" />
      </svg>
      <StatusBar />
      <div className={s.clock}>
        <b>9:41</b>
        <span>Tuesday, October 27</span>
      </div>
      <div className={s.stack}>{children}</div>
    </div>
  )
}

interface NoticeProps {
  app: string
  icon: ReactNode
  /** The app's colour, behind its icon. */
  tint: string
  title: string
  body: ReactNode
  time?: string
  className?: string
}

/** An Android notification card, in cqw so it scales with the phone. */
export function Notice({ app, icon, tint, title, body, time = 'now', className }: NoticeProps) {
  return (
    <div className={className ? `${s.notice} ${className}` : s.notice}>
      <div className={s.noticeHead}>
        <span className={s.appIcon} style={{ background: tint }}>
          {icon}
        </span>
        <span className={s.appName}>{app}</span>
        <span className={s.time}>· {time}</span>
      </div>
      <b className={s.noticeTitle}>{title}</b>
      <div className={s.noticeBody}>{body}</div>
    </div>
  )
}
