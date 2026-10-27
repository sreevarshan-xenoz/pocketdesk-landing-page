import { type ReactNode, useRef } from 'react'
import { cx } from '../lib/cx'
import { gsap, motionOn, useGSAP } from '../lib/gsap'
import s from './SectionHead.module.css'

interface SectionHeadProps {
  label: string
  id: string
  title: ReactNode
  lede?: ReactNode
  align?: 'left' | 'center'
  /** 'md' beside a demo, 'lg' for a section that stands on its words. */
  size?: 'md' | 'lg'
  className?: string
}

/** A section's eyebrow, title and lede, rising in as they come into view. */
export function SectionHead({ label, id, title, lede, align = 'left', size = 'lg', className }: SectionHeadProps) {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (!motionOn()) return
      gsap.from(root.current!.children, {
        y: 30,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
      })
    },
    { scope: root },
  )
  return (
    <div ref={root} className={cx(s.head, align === 'center' && s.center, size === 'md' && s.md, className)}>
      <p className={s.eyebrow}>
        <span className={s.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {label}
      </p>
      <h2 id={id} className={s.title}>
        {title}
      </h2>
      {lede && <p className={s.lede}>{lede}</p>}
    </div>
  )
}
