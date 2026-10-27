import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('https://api.github.com/**', (route) => route.abort())
})

test('every section heading is in the accessibility tree before it is scrolled to', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(500)
  for (const name of ['Two devices. One of everything.', 'From the couch. Or abroad.', 'Your phone, in your scripts.', 'Good to know.']) {
    await expect(page.getByRole('heading', { level: 2, name })).toHaveCount(1)
  }
  // The four beats of Both ways, and the hero's facts, are read too, not only the beat on screen.
  await expect(page.getByRole('heading', { level: 3, name: 'Lost your phone? Ring it.' })).toHaveCount(1)
  await expect(page.getByRole('list', { name: 'In short' }).getByRole('listitem')).toHaveCount(4)
})

test('text has enough contrast and headings descend in order', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(500)
  const results = await new AxeBuilder({ page }).withRules(['color-contrast', 'heading-order']).analyze()
  const found = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 4).join(' | ')}`)
  expect(found).toEqual([])
})
