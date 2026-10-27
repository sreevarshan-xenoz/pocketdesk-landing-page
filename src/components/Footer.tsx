import { REPO } from '../lib/release'
import { Mark } from './Mark'
import { jumpTo } from './Nav'
import s from './Footer.module.css'

const COLUMNS: Array<{ title: string; links: Array<[string, string]> }> = [
  {
    title: 'Pocketdesk',
    links: [
      ['Control', '#control'],
      ['Both ways', '#both-ways'],
      ['Anywhere', '#anywhere'],
      ['Privacy', '#private'],
      ['Download', '#download'],
    ],
  },
  {
    title: 'Project',
    links: [
      ['Source code', REPO],
      ['Releases', `${REPO}/releases`],
      ['Issues', `${REPO}/issues`],
      ['Contributing', `${REPO}/blob/main/CONTRIBUTING.md`],
    ],
  },
  {
    title: 'Trust',
    links: [
      ['Security', `${REPO}/blob/main/SECURITY.md`],
      ['The protocol', `${REPO}/blob/main/docs/protocol.md`],
      ['License', `${REPO}#license`],
    ],
  },
]

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.brand}>
          <a href="#top" onClick={jumpTo('top')} className={s.logo}>
            <Mark size={30} />
            <span>Pocketdesk</span>
          </a>
          <p>Your desktop. Anywhere.</p>
        </div>
        <nav className={s.cols} aria-label="Footer">
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <h2>{c.title}</h2>
              <ul>
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith('#') ? (
                      <a href={href} onClick={jumpTo(href.slice(1))}>
                        {label}
                      </a>
                    ) : (
                      <a href={href} rel="noopener">
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className={s.base}>
        <span>Open source under MIT or Apache-2.0 · Built in Rust and Kotlin</span>
        <a href="#top" onClick={jumpTo('top')}>
          Back to the top ↑
        </a>
      </div>
    </footer>
  )
}
