import { defineConfig, devices } from '@playwright/test'

// End-to-end tests run against the production build, prerendered HTML and all.
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    channel: 'chrome',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    // The build, served as Pages serves it: also at /pocketdesk-landing-page/, with no fallback page.
    command: 'npm run build && node scripts/serve-dist.mjs 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 180_000,
  },
})
