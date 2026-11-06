import { cx } from '../lib/cx'
import { REPO } from '../lib/release'
import b from '../components/Button.module.css'
import { Icon } from '../components/Icon'
import { SectionHead } from '../components/SectionHead'
import s from './OpenSource.module.css'

const FACTS = [
  { k: 'MIT or Apache-2.0', v: 'Every line on GitHub' },
  { k: 'Pure Rust', v: 'The server, on Linux and Windows' },
  { k: 'Native Kotlin', v: 'The Android app' },
  { k: 'Wayland first', v: 'Hyprland, Sway, GNOME and KDE; X11 too' },
]

type Cell = 'yes' | 'no' | { mark: 'yes' | 'part'; note: string }

const PRODUCTS = ['Pocketdesk', 'RustDesk', 'Sunshine + Moonlight', 'KDE Connect']

/* As the main repository's README compares them. */
const ROWS: Array<[string, Cell, Cell, Cell, Cell]> = [
  ['See and drive the computer from a phone', 'yes', 'yes', 'yes', { mark: 'part', note: 'keyboard and touchpad' }],
  ['See and drive the phone from the computer', 'yes', { mark: 'part', note: 'needs permissions' }, 'no', 'no'],
  ['Notifications, texts and calls on the computer', { mark: 'yes', note: 'checked on Windows' }, 'no', 'no', 'yes'],
  ['Clipboard and files, both ways', { mark: 'yes', note: 'files checked on Windows' }, 'yes', { mark: 'part', note: 'partly' }, 'yes'],
  ['One keyboard and mouse across computers', { mark: 'yes', note: 'partly device-checked' }, 'no', 'no', 'no'],
  ['From outside, without a port forward or VPN', { mark: 'yes', note: 'after one session at home' }, 'yes', { mark: 'part', note: 'UPnP or a forward' }, 'no'],
  ['No account needed', 'yes', 'yes', 'yes', 'yes'],
  ['Wayland-native', 'yes', { mark: 'part', note: 'partial' }, { mark: 'part', note: 'partial' }, 'yes'],
  ['Hyprland optimized', 'yes', 'no', { mark: 'part', note: 'limited' }, { mark: 'part', note: 'limited' }],
  ['Works with KDE Connect devices', { mark: 'part', note: 'most features' }, 'no', 'no', 'yes'],
  ['Open source', 'yes', 'yes', 'yes', 'yes'],
]

function Mark({ cell }: { cell: Cell }) {
  const mark = typeof cell === 'string' ? cell : cell.mark
  const label = mark === 'yes' ? 'Yes' : mark === 'no' ? 'No' : 'Partly'
  return (
    <>
      <span className={cx(s.mark, s[mark])} role="img" aria-label={label}>
        <Icon name={mark === 'yes' ? 'check' : mark === 'no' ? 'x' : 'minus'} size={14} strokeWidth={2.4} />
      </span>
      {typeof cell !== 'string' && <small>{cell.note}</small>}
    </>
  )
}

export function OpenSource() {
  return (
    <section id="open-source" className={s.section} aria-labelledby="open-title">
      <div className="container">
        <div className={s.top}>
          <SectionHead
            label="Open source"
            id="open-title"
            size="md"
            title={
              <>
                Open source. <em>Written in Rust.</em>
              </>
            }
            lede="A pure Rust server, a native Kotlin app and a protocol written down in full, all of it yours to read, build and change."
          />
          <div className={s.ctas}>
            <a className={cx(b.btn, b.primary)} href={REPO} rel="noopener">
              <Icon name="github" size={18} />
              Read the source
            </a>
            <a className={cx(b.btn, b.ghost)} href={`${REPO}/stargazers`} rel="noopener">
              <Icon name="star" size={18} />
              Star it on GitHub
            </a>
          </div>
        </div>

        <dl className={s.facts}>
          {FACTS.map((f) => (
            <div key={f.k}>
              <dt>{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>

        <h3 className={s.compareTitle}>A remote desktop and KDE Connect, in one.</h3>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Feature</span>
                </th>
                {PRODUCTS.map((p, i) => (
                  <th key={p} scope="col" className={cx(i === 0 && s.us)}>
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([feature, ...cells]) => (
                <tr key={feature}>
                  <th scope="row">{feature}</th>
                  {cells.map((c, i) => (
                    <td key={i} className={cx(i === 0 && s.us)}>
                      <Mark cell={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
