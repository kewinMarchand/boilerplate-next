import { expect, test } from '@playwright/test'

import { ROUTES } from './routes'

import type { Page } from '@playwright/test'

const meta = (page: Page, selector: string) =>
  page.locator(selector).first().getAttribute('content')

for (const route of ROUTES) {
  test(`la page ${route} expose ses métadonnées SEO`, async ({ page }) => {
    await page.goto(route)

    expect(await page.locator('html').getAttribute('lang')).toBe('fr')
    expect((await page.title()).length).toBeGreaterThan(0)

    const description = (await meta(page, 'meta[name="description"]')) ?? ''
    expect(description.length).toBeGreaterThanOrEqual(50)
    expect(description.length).toBeLessThanOrEqual(160)

    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toMatch(/^https?:\/\//)
    expect(await meta(page, 'meta[property="og:title"]')).toBeTruthy()
    expect(await meta(page, 'meta[property="og:description"]')).toBeTruthy()
    // Image par défaut, ou celle de l'article servie par l'API
    expect(await meta(page, 'meta[property="og:image"]')).toMatch(
      /^https?:\/\/.+(og-image\.jpg|\/media\/[0-9a-f]{32}-\d+\.webp)$/,
    )
    expect(await meta(page, 'meta[name="twitter:card"]')).toBe('summary_large_image')

    for (const text of await page.locator('script[type="application/ld+json"]').allTextContents()) {
      expect(() => JSON.parse(text)).not.toThrow()
    }
  })
}

test('chaque page a un titre unique', async ({ page }) => {
  const titles: string[] = []
  for (const route of ROUTES) {
    await page.goto(route)
    titles.push(await page.title())
  }

  expect(new Set(titles).size).toBe(titles.length)
})

test("l'accueil déclare Organization et WebSite", async ({ page }) => {
  await page.goto('/')
  const types = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(
    (text) => JSON.parse(text)['@type'],
  )

  expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite']))
})

test('une page de catalogue filtrée est noindex et canonique sans filtres', async ({ page }) => {
  await page.goto('/catalogue/plantes-interieur?exposition=soleil&tri=nom')

  expect(await meta(page, 'meta[name="robots"]')).toContain('noindex')
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toMatch(
    /\/catalogue\/plantes-interieur$/,
  )
})

test('la page 2 du catalogue est canonique d’elle-même et liée par rel prev', async ({ page }) => {
  await page.goto('/catalogue?page=2')

  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toMatch(
    /\/catalogue\?page=2$/,
  )
  expect(await meta(page, 'meta[name="robots"]')).not.toContain('noindex')
  await expect(page.locator('head link[rel="prev"]')).toHaveAttribute('href', '/catalogue')
})

test('le sitemap liste les pages statiques et chaque catégorie', async ({ request }) => {
  const body = await (await request.get('/sitemap.xml')).text()

  for (const path of [
    '/mentions-legales',
    '/plan-du-site',
    '/catalogue/plantes-aquatiques/nenuphars',
  ]) {
    expect(body).toContain(path)
  }
  expect(body).not.toContain('/charte-graphique')
})
