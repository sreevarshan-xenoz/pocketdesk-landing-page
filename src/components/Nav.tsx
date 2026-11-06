import { type MouseEvent, useEffect, useState } from 'react'
import { cx } from '../lib/cx'
import { scrollToId } from '../lib/motion'
import { REPO } from '../lib/release'
import b from './Button.module.css'
import { Icon } from './Icon'
import { Mark } from './Mark'
import s from './Nav.module.css'

const LINKS = [
  ['control', 'Control'],
  ['both-ways', 'Both ways'],
  ['together', 'Computers'],
  ['anywhere', 'Anywhere'],
  ['private', 'Privacy'],
  ['new', 'New'],
  ['download', 'Download'],
] as const

/** A same-page link that glides with the smooth scroller, and still works without scripts. */
export function jumpTo(id: string) {
  return (e: MouseEvent) => {
    e.preventDefault()
    scrollToId(id)
    history.replaceState(null, '', `#${id}`)
  }
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={cx(s.nav, scrolled && s.scrolled)}>
      <div className={s.inner}>
        <a className={s.brand} href="#top" onClick={jumpTo('top')} aria-label="Pocketdesk, back to the top">
          <Mark size={30} />
          <span>Pocketdesk</span>
        </a>
        <nav className={s.links} aria-label="Sections">
          {LINKS.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={jumpTo(id)}>
              {label}
            </a>
          ))}
        </nav>
        <div className={s.actions}>
          <a className={s.gh} href={REPO} rel="noopener" aria-label="Pocketdesk's source on GitHub">
            <Icon name="github" size={20} />
          </a>
          <a className={cx(b.btn, b.primary, b.small)} href="#download" onClick={jumpTo('download')}>
            Download
          </a>
        </div>
      </div>
    </header>
  )
}
