import { describe, expect, test } from 'vitest'
import { type Asset, fetchLatestRelease, formatReleaseDate, formatSize, latestRelease, pickDownloads } from './release'

const asset = (name: string, size = 1_000_000): Asset => ({
  name,
  size,
  browser_download_url: `https://github.com/sreevarshan-xenoz/Pocketdesk/releases/download/v0.6.0/${name}`,
})

const v060 = [
  asset('pocketdesk-v0.6.0-android-arm64.apk'),
  asset('pocketdesk-v0.6.0-linux-x86_64.tar.gz'),
  asset('pocketdesk-v0.6.0-windows-x86_64.zip'),
  asset('SHA256SUMS'),
]

const withInstallers = [
  ...v060,
  asset('pocketdesk-v0.7.0-windows-x86_64-setup.exe'),
  asset('pocketdesk-v0.7.0-linux-amd64.deb'),
]

describe('pickDownloads', () => {
  test('without installers, Windows gets the .zip and Linux the .tar.gz', () => {
    const d = pickDownloads(v060)
    expect(d.windows.primary?.name).toBe('pocketdesk-v0.6.0-windows-x86_64.zip')
    expect(d.windows.alt).toBeUndefined()
    expect(d.linux.primary?.name).toBe('pocketdesk-v0.6.0-linux-x86_64.tar.gz')
    expect(d.linux.alt).toBeUndefined()
    expect(d.android.primary?.name).toBe('pocketdesk-v0.6.0-android-arm64.apk')
  })

  test('the installer and the .deb come first, the archives second', () => {
    const d = pickDownloads(withInstallers)
    expect(d.windows.primary?.name).toBe('pocketdesk-v0.7.0-windows-x86_64-setup.exe')
    expect(d.windows.alt?.name).toBe('pocketdesk-v0.6.0-windows-x86_64.zip')
    expect(d.linux.primary?.name).toBe('pocketdesk-v0.7.0-linux-amd64.deb')
    expect(d.linux.alt?.name).toBe('pocketdesk-v0.6.0-linux-x86_64.tar.gz')
  })

  test('the checksums file is never a download', () => {
    const d = pickDownloads([asset('SHA256SUMS')])
    expect(d.windows.primary).toBeUndefined()
    expect(d.linux.primary).toBeUndefined()
    expect(d.android.primary).toBeUndefined()
  })
})

const okJson = (body: unknown) => (async () => new Response(JSON.stringify(body), { status: 200 })) as typeof fetch

describe('fetchLatestRelease', () => {
  test('reads tag, date, page and assets from the API', async () => {
    const release = await fetchLatestRelease(
      okJson({
        tag_name: 'v0.6.0',
        published_at: '2026-10-23T20:16:35Z',
        html_url: 'https://github.com/sreevarshan-xenoz/Pocketdesk/releases/tag/v0.6.0',
        assets: v060,
      }),
    )
    expect(release).toEqual({
      tag: 'v0.6.0',
      publishedAt: '2026-10-23T20:16:35Z',
      url: 'https://github.com/sreevarshan-xenoz/Pocketdesk/releases/tag/v0.6.0',
      assets: v060,
    })
  })

  test('a rate-limited or missing answer is null', async () => {
    const forbidden = (async () => new Response('{}', { status: 403 })) as typeof fetch
    expect(await fetchLatestRelease(forbidden)).toBeNull()
  })

  test('a network failure is null', async () => {
    const offline = (async () => {
      throw new TypeError('Failed to fetch')
    }) as typeof fetch
    expect(await fetchLatestRelease(offline)).toBeNull()
  })

  test('an answer without assets is null', async () => {
    expect(await fetchLatestRelease(okJson({ tag_name: 'v0.6.0' }))).toBeNull()
  })
})

describe('latestRelease', () => {
  test('asks GitHub once however many parts of the page want it', async () => {
    let calls = 0
    const counting = (async () => {
      calls++
      return new Response('{}', { status: 403 })
    }) as typeof fetch
    await Promise.all([latestRelease(counting), latestRelease(counting), latestRelease(counting)])
    expect(calls).toBe(1)
  })
})

describe('formatting', () => {
  test('the date is the UTC day, written out', () => expect(formatReleaseDate('2026-10-23T20:16:35Z')).toBe('Oct 23, 2026'))
  test('a late-evening UTC release keeps its UTC day', () =>
    expect(formatReleaseDate('2026-10-23T23:59:00Z')).toBe('Oct 23, 2026'))
  test('sizes under 10 MB keep one decimal', () => expect(formatSize(5_400_000)).toBe('5.4 MB'))
  test('larger sizes are whole megabytes', () => expect(formatSize(48_234_567)).toBe('48 MB'))
})
