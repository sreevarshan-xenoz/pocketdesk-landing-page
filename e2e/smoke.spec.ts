import { expect, test } from '@playwright/test'

test('the page loads with its title and no console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))
  // Release info comes from GitHub's API; the page must not depend on it.
  await page.route('https://api.github.com/**', (route) => route.abort())

  await page.goto('/')

  await expect(page).toHaveTitle('Pocketdesk — your desktop, in your pocket')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your desktop.')
  expect(errors.filter((e) => !e.includes('api.github.com') && !e.includes('ERR_FAILED'))).toEqual([])
})

test('the copy is in the HTML before any script runs', async ({ request }) => {
  const html = await (await request.get('/')).text()
  expect(html).toContain('Your desktop.')
  expect(html).toContain('In your pocket.')
})
