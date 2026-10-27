import { expect, type Page, test } from '@playwright/test'

const githubDown = (page: Page) => page.route('https://api.github.com/**', (route) => route.abort())

const scrollTo = (page: Page, selector: string, offset = 0) =>
  page.evaluate(
    ([sel, off]) => {
      const el = document.querySelector(sel as string)!
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + (off as number))
    },
    [selector, offset],
  )

test('from the Pages project path, nothing is asked of the domain root', async ({ page }) => {
  const outside: string[] = []
  page.on('request', (r) => {
    const url = new URL(r.url())
    if (url.hostname === '127.0.0.1' && !url.pathname.startsWith('/pocketdesk-landing-page/')) outside.push(url.pathname)
  })
  page.on('response', (r) => {
    if (r.status() >= 400 && new URL(r.url()).hostname === '127.0.0.1') outside.push(`${r.status()} ${r.url()}`)
  })
  await githubDown(page)
  await page.goto('/pocketdesk-landing-page/')
  await page.getByRole('button', { name: /Watch the film/ }).click()
  await page.waitForTimeout(1000)
  expect(outside).toEqual([])
})

test.describe('a phone held sideways', () => {
  test.use({ viewport: { width: 844, height: 390 }, hasTouch: true })

  test('the film and its close button fit on screen', async ({ page }) => {
    await githubDown(page)
    await page.goto('/')
    await page.getByRole('button', { name: /Watch the film/ }).click()
    const close = await page.getByRole('button', { name: 'Close the film' }).boundingBox()
    const video = await page.locator('dialog video').boundingBox()
    expect(close!.y).toBeGreaterThanOrEqual(0)
    expect(video!.y + video!.height).toBeLessThanOrEqual(390)
  })
})

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('the list of what else crosses is there', async ({ page }) => {
    await githubDown(page)
    await page.goto('/')
    const more = page.getByRole('list', { name: 'And more, both ways' })
    await more.scrollIntoViewIfNeeded()
    await expect(more).toBeVisible()
    await expect(more.getByRole('listitem')).toHaveCount(8)
  })

  test('the page does not shift as it loads', async ({ page }) => {
    await githubDown(page)
    await page.goto('/')
    await page.waitForTimeout(1500)
    const cls = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let sum = 0
          new PerformanceObserver((list) => {
            for (const e of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
              if (!e.hadRecentInput) sum += e.value
            }
          }).observe({ type: 'layout-shift', buffered: true })
          setTimeout(() => resolve(sum), 200)
        }),
    )
    expect(cls).toBeLessThan(0.1)
  })
})

test('the keyboard demo starts clean after the visitor scrolls away and back', async ({ page }) => {
  await githubDown(page)
  await page.goto('/')
  await scrollTo(page, '#control')
  await page.getByRole('tab', { name: 'Keyboard' }).click()
  await page.waitForTimeout(1300) // the ghost is mid-command
  await scrollTo(page, '#download')
  await page.waitForTimeout(600)
  await scrollTo(page, '#control')
  await page.waitForTimeout(4200)
  await expect(page.locator('#control-stage')).not.toContainText('pocketdeskpocketdesk')
  await expect(page.locator('#control-stage')).not.toContainText('command not found')
})

test('the terminal scene starts clean after the visitor scrolls away and back', async ({ page }) => {
  await githubDown(page)
  await page.goto('/')
  const terminal = page.locator('#scripts [class*="_termBody_"]')
  await scrollTo(page, '#scripts', 60)
  // Leave while pocketdesk ask is still waiting for the phone.
  await expect(terminal).toContainText('waiting for an answer', { timeout: 15000 })
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.waitForTimeout(800)
  await scrollTo(page, '#scripts', 60)
  // Mid-way through typing the fresh run's first command (it starts 0.5 s in and takes about 1.7 s):
  // the old lines are gone, and the command is being typed at a visible prompt.
  await page.waitForTimeout(1300)
  const text = (await terminal.textContent()) ?? ''
  expect(text).not.toContain('Finished')
  expect(text).toContain('~ $ pocketd')
  expect(text).not.toContain('--release')
})

test('if the page script cannot run, the scenes are shown still', async ({ page }) => {
  await githubDown(page)
  await page.route('**/assets/*.js', (route) => route.abort())
  await page.goto('/')
  await page.waitForTimeout(5600)
  expect(await page.evaluate(() => document.documentElement.classList.contains('motion'))).toBe(false)
  await expect(page.getByText('In your pocket.').first()).toBeVisible()
})

test('a keyboard user can see where they are typing, and keeps their place after answering', async ({ page }) => {
  await githubDown(page)
  await page.goto('/')
  await scrollTo(page, '#control')
  await page.getByRole('tab', { name: 'Keyboard' }).click()
  await page.getByLabel('Type a command for the demo terminal, then press Enter').focus()
  const ring = await page.locator('#control-stage [class*="_phone_"]').first().evaluate((el) => getComputedStyle(el).outlineStyle)
  expect(ring).not.toBe('none')

  await scrollTo(page, '#private', 900)
  await page.getByRole('button', { name: 'Allow' }).focus()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(200)
  const focused = await page.evaluate(() => document.activeElement?.tagName)
  expect(focused).toBe('BUTTON')
})

test.describe('on a tall screen', () => {
  test.use({ viewport: { width: 1080, height: 2400 } })

  test('the last scene finishes', async ({ page }) => {
    await githubDown(page)
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await page.waitForTimeout(2500)
    const cta = page.locator('[aria-labelledby="finale-title"] h2')
    expect(Number(await cta.evaluate((el) => getComputedStyle(el).opacity))).toBeGreaterThan(0.99)
  })
})
