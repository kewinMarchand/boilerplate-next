import { defineConfig, devices } from '@playwright/test'

const PORT = 4000
const BASE_URL = `http://localhost:${PORT}`
// `make e2e-vite` construit lui-même `.next`, seulement si les sources ont changé (tools/e2e-vite.sh)
const BUILD = process.env.E2E_SANS_BUILD === '1' ? '' : 'yarn build && '

export default defineConfig({
  testMatch: /.*\.(e2e|a11y)\.ts/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    locale: 'fr-FR',
    testIdAttribute: 'data-testid',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `${BUILD}yarn start --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    env: { ENABLE_TEST_ROUTES: '1' },
    timeout: 180_000,
  },
})
