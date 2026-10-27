import type { ReactNode, Ref } from 'react'
import { cx } from '../../lib/cx'
import s from './Laptop.module.css'

interface LaptopProps {
  children?: ReactNode
  className?: string
  ref?: Ref<HTMLDivElement>
}

/** A laptop whose 16:9 screen holds the children; it fills its holder's width. */
export function Laptop({ children, className, ref }: LaptopProps) {
  return (
    <div ref={ref} className={cx(s.laptop, className)} aria-hidden="true">
      <div className={s.lid}>
        <span className={s.cam} />
        <div className={s.screen}>{children}</div>
      </div>
      <div className={s.base}>
        <span className={s.notch} />
      </div>
    </div>
  )
}
