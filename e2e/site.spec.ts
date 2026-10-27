import { expect, type Page, test } from '@playwright/test'

const RELEASES = 'https://github.com/sreevarshan-xenoz/Pocketdesk/releases/latest'
const WINDOWS_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
const MAC_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15'

const asset = (name: string, size = 30_000_000) => ({
  name,
  size,
  browser_download_url: `https://github.com/sreevarshan-xenoz/Pocketdesk/releases/download/v0.7.0/${name}`,
})

const RELEASE = {
  tag_name: 'v0.7.0',
  published_at: '2026-10-30T12:00:00Z',
  html_url: 'https://github.com/sreevarshan-xenoz/Pocketdesk/releases/tag/v0.7.0',
  assets: [
    asset('pocketdesk-v0.7.0-android-arm64.apk'),
    asset('pocketdesk-v0.7.0-linux-amd64.deb'),
    asset('pocketdesk-v0.7.0-linux-x86_64.tar.gz'),
    asset('pocketdesk-v0.7.0-windows-x86_64-setup.exe'),
    asset('pocketdesk-v0.7.0-windows-x86_64.zip'),
    asset('SHA256SUMS', 600),
  ],
}

const githubDown = (page: Page) => page.route('https://api.github.com/**', (route) => route.abort())
const githubAnswers = (page: Page) => page.route('https://api.github.com/**', (route) => route.fulfill({ json: RELEASE }))

test('scrolling the whole page raises no errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  await githubAnswers(page)
  await page.goto('/')
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += 700) {
    await page.mouse.wheel(0, 700)
    await page.waitForTimeout(60)
  }
  await page.waitForTimeout(500)
  expect(errors).toEqual([])
})

test('when GitHub cannot answer, every download goes to the releases page', async ({ page }) => {
  await githubDown(page)
  await page.goto('/')
  for (const os of ['windows', 'linux', 'android']) {
    await expect(page.locator(`[data-download=${os}]`)).toHaveAttribute('href', RELEASES)
  }
})

test.describe('on Windows', () => {
  test.use({ userAgent: WINDOWS_UA })

  test('the installer is the Windows download and the card is marked', async ({ page }) => {
    await githubAnswers(page)
    await page.goto('/')
    const win = page.locator('[data-download=windows]')
    await expect(win).toHaveAttribute('href', /windows-x86_64-setup\.exe$/)
    await expect(page.locator('[data-download=linux]')).toHaveAttribute('href', /linux-amd64\.deb$/)
    await expect(page.locator('[data-os=windows]')).toContainText('Your computer')
    await expect(page.getByRole('link', { name: 'Download for Windows' }).first()).toBeVisible()
  })
})

test.describe('on a Mac', () => {
  test.use({ userAgent: MAC_UA })

  test('no platform is guessed, and the page says what runs where', async ({ page }) => {
    await githubDown(page)
    await page.goto('/')
    await expect(page.locator('#top').getByRole('link', { name: 'Download', exact: true })).toBeVisible()
    await expect(page.getByText("macOS and iPhone aren't supported yet")).toBeAttached()
  })
})

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('the whole headline shows without scrolling', async ({ page }) => {
    await githubDown(page)
    await page.goto('/')
    await expect(page.getByText('In your pocket.').first()).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.classList.contains('motion'))).toBe(false)
  })
})

test.describe('on a small phone', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('nothing scrolls sideways', async ({ page }) => {
    await githubDown(page)
    await page.goto('/')
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += 900) {
      await page.evaluate((top) => window.scrollTo(0, top), y)
      await page.waitForTimeout(40)
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(over, `at ${y}px down`).toBeLessThanOrEqual(0)
    }
  })
})

test('the keyboard demo runs what the visitor types', async ({ page }) => {
  await githubDown(page)
  await page.goto('/#control')
  await page.getByRole('tab', { name: 'Keyboard' }).click()
  await page.getByLabel('Type a command for the demo terminal, then press Enter').focus()
  await page.keyboard.type('echo hello from the page')
  await page.keyboard.press('Enter')
  await expect(page.locator('#control-stage')).toContainText('hello from the page')
})

test('the film opens in a dialog and Escape closes it', async ({ page, request }) => {
  const film = await request.get('/video/pocketdesk-film.mp4')
  expect(film.status()).toBe(200)
  expect(film.headers()['content-type']).toContain('video/mp4')
  await githubDown(page)
  await page.goto('/')
  await page.getByRole('button', { name: /Watch the film/ }).click()
  const dialog = page.getByRole('dialog', { name: 'Pocketdesk, the film' })
  await expect(dialog).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})
