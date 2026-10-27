export const REPO = 'https://github.com/sreevarshan-xenoz/Pocketdesk'
export const RELEASES = `${REPO}/releases/latest`
const API = 'https://api.github.com/repos/sreevarshan-xenoz/Pocketdesk/releases/latest'

export interface Asset {
  name: string
  size: number
  browser_download_url: string
}

export interface Release {
  tag: string
  publishedAt: string
  url: string
  assets: Asset[]
}

export interface Pick {
  primary?: Asset
  alt?: Asset
}

export type Downloads = Record<'windows' | 'linux' | 'android', Pick>

const find = (assets: Asset[], suffix: string) => assets.find((a) => a.name.endsWith(suffix))

/** The installer and the .deb when a release has them; the archives otherwise, or as the second choice. */
export function pickDownloads(assets: Asset[]): Downloads {
  const choose = (preferred: Asset | undefined, fallback: Asset | undefined): Pick =>
    preferred ? { primary: preferred, alt: fallback } : { primary: fallback }
  return {
    windows: choose(find(assets, 'windows-x86_64-setup.exe'), find(assets, 'windows-x86_64.zip')),
    linux: choose(find(assets, 'linux-amd64.deb'), find(assets, 'linux-x86_64.tar.gz')),
    android: { primary: find(assets, 'android-arm64.apk') },
  }
}

/** The latest release, or null when GitHub cannot say (offline, rate-limited, odd answer). */
export async function fetchLatestRelease(fetchImpl: typeof fetch = fetch): Promise<Release | null> {
  try {
    const res = await fetchImpl(API, { headers: { Accept: 'application/vnd.github+json' } })
    if (!res.ok) return null
    const body = await res.json()
    if (typeof body?.tag_name !== 'string' || !Array.isArray(body.assets)) return null
    return {
      tag: body.tag_name,
      publishedAt: body.published_at,
      url: body.html_url,
      assets: body.assets.map((a: Asset) => ({
        name: a.name,
        size: a.size,
        browser_download_url: a.browser_download_url,
      })),
    }
  } catch {
    return null
  }
}

let shared: Promise<Release | null> | undefined

/** fetchLatestRelease, asked once per page load and shared by every caller. */
export function latestRelease(fetchImpl?: typeof fetch): Promise<Release | null> {
  shared ??= fetchLatestRelease(fetchImpl)
  return shared
}

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

export function formatReleaseDate(iso: string): string {
  return dateFormat.format(new Date(iso))
}

export function formatSize(bytes: number): string {
  const mb = bytes / 1_000_000
  return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`
}
