import type { CSSProperties, ReactNode, Ref } from 'react'
import { cx } from '../../lib/cx'
import s from './Phone.module.css'

interface PhoneProps {
  orientation?: 'portrait' | 'landscape'
  children?: ReactNode
  className?: string
  screenClassName?: string
  style?: CSSProperties
  ref?: Ref<HTMLDivElement>
  /** Hidden from assistive tech unless its screen holds controls (the Control demo). */
  decorative?: boolean
}

/**
 * An Android phone that fills its holder's width. Inside, `cqw` is a hundredth
 * of the phone's width, so screens drawn in it scale with the phone.
 * Parts carry data-part (frame, screen, camera, keys) for scenes that animate them.
 */
export function Phone({ orientation = 'portrait', children, className, screenClassName, style, ref, decorative = true }: PhoneProps) {
  return (
    <div ref={ref} className={cx(s.phone, s[orientation], className)} style={style} aria-hidden={decorative || undefined}>
      <div className={s.frame} data-part="frame" />
      <span className={s.keys} data-part="keys" />
      <div className={cx(s.screen, screenClassName)} data-part="screen">
        {children}
      </div>
      <span className={s.camera} data-part="camera" />
    </div>
  )
}
