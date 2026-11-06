import b from '../components/Button.module.css'
import { Icon, type IconName } from '../components/Icon'
import { SectionHead } from '../components/SectionHead'
import { useOS } from '../hooks/useOS'
import { useRelease } from '../hooks/useRelease'
import { cx } from '../lib/cx'
import type { OS } from '../lib/os'
import { type Asset, formatReleaseDate, formatSize, pickDownloads, RELEASES, REPO } from '../lib/release'
import s from './Download.module.css'

type Platform = Exclude<OS, 'other'>

const PLATFORMS: Array<{
  os: Platform
  name: string
  icon: IconName
  req: string
  note: string
  label: (a?: Asset) => string
  alt?: (a: Asset) => string
}> = [
  {
    os: 'windows',
    name: 'Windows',
    icon: 'windows',
    req: 'Windows 10 and 11, 64-bit',
    note: 'The server, the desktop app and the tray. Hardware encoding goes through FFmpeg.',
    label: (a) => (a?.name.endsWith('.exe') ? 'Download the installer' : a ? 'Download the .zip' : 'Download for Windows'),
    alt: () => 'or the portable .zip',
  },
  {
    os: 'linux',
    name: 'Linux',
    icon: 'linux',
    req: 'x86-64 · Wayland or X11',
    note: 'Hyprland, Sway, GNOME and KDE. It starts at login as a systemd user unit. On Arch: yay -S pocketdesk.',
    label: (a) => (a?.name.endsWith('.deb') ? 'Download the .deb' : a ? 'Download the .tar.gz' : 'Download for Linux'),
    alt: () => 'or the .tar.gz, for any distribution',
  },
  {
    os: 'android',
    name: 'Android',
    icon: 'android',
    req: 'Android 8 and newer, arm64',
    note: 'Signed with the release key. Obtainium can follow the releases for you.',
    label: () => 'Download the APK',
  },
]

const STEPS = [
  { title: 'Install it on your computer', body: 'It starts by itself each time you sign in.' },
  { title: 'Put the app on your phone', body: 'The APK is here, or let Obtainium follow the releases.' },
  { title: 'Scan to pair', body: "Scan the code on the desktop app's Pair page. Then connect, from anywhere." },
]

export function Download() {
  const release = useRelease()
  const os = useOS()
  const picks = pickDownloads(release?.assets ?? [])
  const sums = release?.assets.find((a) => a.name === 'SHA256SUMS')

  return (
    <section id="download" className={s.section} aria-labelledby="download-title">
      <div className="container">
        <SectionHead
          label="Download"
          id="download-title"
          align="center"
          title={
            <>
              Get Pocketdesk. <em>It's free.</em>
            </>
          }
          lede="Free and open source, for good. Pick your computer, then your phone."
        />

        <div className={s.cards}>
          {PLATFORMS.map((p) => {
            const pick = picks[p.os]
            const mine = os === p.os
            return (
              <article key={p.os} className={cx(s.card, mine && s.mine)} data-os={p.os}>
                {mine && <span className={s.badge}>{p.os === 'android' ? 'Your phone' : 'Your computer'}</span>}
                <span className={s.osIcon}>
                  <Icon name={p.icon} size={30} />
                </span>
                <h3>{p.name}</h3>
                <span className={s.req}>{p.req}</span>
                <p>{p.note}</p>
                <a
                  className={cx(b.btn, mine ? b.primary : b.ghost, s.get)}
                  href={pick.primary?.browser_download_url ?? RELEASES}
                  rel="noopener"
                  data-download={p.os}
                >
                  <Icon name="download" size={18} />
                  {p.label(pick.primary)}
                  {pick.primary && <span className={b.meta}>{formatSize(pick.primary.size)}</span>}
                </a>
                {pick.alt && p.alt && (
                  <a className={s.alt} href={pick.alt.browser_download_url} rel="noopener">
                    {p.alt(pick.alt)}
                  </a>
                )}
              </article>
            )
          })}
        </div>

        {os === 'other' && (
          <p className={s.other}>
            Pocketdesk runs on Windows and Linux computers and Android phones; macOS and iPhone aren't supported yet. The downloads are here
            for the computer you'll use it on.
          </p>
        )}

        <p className={s.meta}>
          <span>{release ? `${release.tag} · ${formatReleaseDate(release.publishedAt)}` : 'The latest release'}</span>
          <a href={sums?.browser_download_url ?? RELEASES} rel="noopener">
            SHA-256 checksums
          </a>
          <a href={`${REPO}/releases`} rel="noopener">
            All releases
          </a>
          <a href="https://aur.archlinux.org/packages/pocketdesk" rel="noopener">
            Arch (AUR)
          </a>
          <a href={`${REPO}#quickstart`} rel="noopener">
            Install guide
          </a>
        </p>

        <ol className={s.steps}>
          {STEPS.map((st, i) => (
            <li key={st.title}>
              <span className={s.n}>{String(i + 1).padStart(2, '0')}</span>
              <h3>{st.title}</h3>
              <p>{st.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
