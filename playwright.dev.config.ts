import { defineConfig } from '@playwright/test'

import base from './playwright.config'

const PORT = 4016
const BASE_URL = `http://localhost:${PORT}`

// Pages réservées au développement (charte graphique) : servies par `next dev`, pas par le build.
export default defineConfig({
  ...base,
  testMatch: /.*\.dev\.ts/,
  use: { ...base.use, baseURL: BASE_URL },
  webServer: {
    command: `yarn dev --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
