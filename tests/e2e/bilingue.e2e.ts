import { spawn } from 'node:child_process'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

import { en } from '@/shared/i18n/dictionaries/en'

import { useMode } from './helpers'
import { MODES } from './routes'

import type { Page } from '@playwright/test'
import type { ChildProcess } from 'node:child_process'

const API_URL = process.env.API_URL ?? 'http://localhost:8090'
const APP_PORT = 3106
const APP_URL = `http://localhost:${APP_PORT}`

/**
 * Fixtures de l'API (contrat, section 29) : `X-Scenario: bilingual` active `en` après `fr`, avec ces
 * traductions ; tout le reste retombe sur le français.
 */
const PRODUCT = { fr: '/produit/monstera-deliciosa', en: '/en/produit/swiss-cheese-plant' }
const ARTICLE = {
  fr: '/blog/le-mode-accessibilite-renforcee',
  en: '/en/blog/enhanced-accessibility-mode',
}
const CATEGORY = {
  fr: '/catalogue/plantes-interieur/feuillages',
  en: '/en/catalogue/indoor-plants/foliage-plants',
}
const TAGLINE_EN = 'Website template with boilerplates-ui, equipped for QA and end-to-end testing.'

const EN_ROUTES = [
  '/en',
  '/en/catalogue',
  CATEGORY.en,
  PRODUCT.en,
  '/en/blog',
  ARTICLE.en,
  '/en/contact',
  '/en/taches',
  '/en/mentions-legales',
  '/en/plan-du-site',
  '/en/panier',
]

// Le build bilingue fixe `API_SCENARIO=bilingual` : chaque appel à l'API, serveur et navigateur,
// porte `X-Scenario: bilingual` (src/shared/api/client.ts).
const ENV = {
  ...process.env,
  NEXT_DIST_DIR: '.next-bilingue',
  NEXT_PUBLIC_SITE_URL: APP_URL,
  API_SCENARIO: 'bilingual',
}

const run = (command: string, args: string[]) =>
  new Promise<void>((resolve, reject) => {
    spawn(command, args, { env: ENV, stdio: 'ignore' }).on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} ${args.join(' ')} : code ${code}`)),
    )
  })

// L'API n'autorise pas l'origine du build bilingue (port 3106) : le navigateur du test ajoute
// l'en-tête CORS aux réponses de l'API (tâches, envoi du contact).
const allowApiFromApp = (page: Page) =>
  page.route(`${API_URL}/**`, async (route) => {
    const response = await route.fetch()
    await route.fulfill({
      response,
      headers: {
        ...response.headers(),
        'access-control-allow-origin': APP_URL,
        'access-control-allow-headers': 'content-type, accept, accept-language, x-scenario',
      },
    })
  })

const goto = async (page: Page, path: string) => {
  await allowApiFromApp(page)
  return page.goto(`${APP_URL}${path}`)
}

const hreflangs = (page: Page) =>
  page
    .locator('link[rel="alternate"][hreflang]')
    .evaluateAll((links) =>
      Object.fromEntries(
        links.map((link) => [link.getAttribute('hreflang'), link.getAttribute('href')]),
      ),
    )

const meta = (page: Page, selector: string) =>
  page.locator(selector).first().getAttribute('content')

test.describe('Site monolingue (API sans scénario)', () => {
  test('aucun sélecteur de langue, et un préfixe de langue non activée répond 404', async ({
    page,
  }) => {
    await page.goto(PRODUCT.fr)
    await expect(page.getByTestId('product-title')).toBeVisible()
    await expect(page.getByTestId('layout-languages')).toHaveCount(0)
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0)

    const response = await page.goto(PRODUCT.en)
    expect(response?.status()).toBe(404)
  })
})

test.describe('Site bilingue fr, en (X-Scenario: bilingual, build dédié)', () => {
  test.describe.configure({ mode: 'serial' })

  let app: ChildProcess | undefined

  test.beforeAll(async () => {
    test.skip(test.info().project.name !== 'desktop', 'Build dédié, une seule fois.')
    test.setTimeout(300_000)
    await run('yarn', ['build'])
    app = spawn('yarn', ['start', '--port', String(APP_PORT)], { env: ENV, stdio: 'ignore' })
    await expect
      .poll(async () => (await fetch(APP_URL).catch(() => null))?.status, { timeout: 30_000 })
      .toBe(200)
  })

  test.afterAll(() => {
    app?.kill()
  })

  test('l’accueil anglais est préfixé, en anglais, et ses liens internes gardent le préfixe', async ({
    page,
  }) => {
    const response = await goto(page, '/en')

    expect(response?.status()).toBe(200)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByTestId('home-hero')).toContainText(TAGLINE_EN)
    await expect(page.getByTestId('home-hero')).toContainText(en.home.overline)
    await expect(page.getByTestId('home-blog-all')).toHaveText(en.blog.all)
    await expect(page.getByTestId('home-blog-all')).toHaveAttribute('href', '/en/blog')
    await expect(page.getByTestId('home-tasks-link')).toHaveAttribute('href', '/en/taches')
    await expect(page.getByTestId('layout-logo')).toHaveAttribute('href', '/en')
  })

  test('la fiche produit anglaise sert le contenu, les libellés et le fil d’Ariane en anglais', async ({
    page,
  }) => {
    await goto(page, PRODUCT.en)

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByTestId('product-title')).toHaveText('Swiss cheese plant')
    await expect(page.getByTestId('product-page')).toContainText(en.product.availability)
    await expect(page.getByTestId('add-to-cart')).toHaveText(en.cart.add)
    await expect(page.getByTestId('layout-breadcrumb').getByRole('link').nth(1)).toHaveAttribute(
      'href',
      '/en/catalogue',
    )
    await expect(page.getByTestId('layout-breadcrumb')).toContainText('Indoor plants')
    await expect(page).toHaveTitle('Swiss cheese plant (Monstera deliciosa)')
  })

  test('une ligne du panier prend le nom et le lien de la langue de la page', async ({ page }) => {
    await goto(page, PRODUCT.en)
    await page.getByTestId('add-to-cart').click()
    await expect(page.getByTestId('cart-count')).toHaveText('1')

    await goto(page, '/panier')
    await expect(page.getByTestId('cart-line')).toContainText('Monstera deliciosa')
    await expect(page.getByTestId('cart-line').getByRole('link')).toHaveAttribute(
      'href',
      PRODUCT.fr,
    )

    await goto(page, '/en/panier')
    await expect(page.getByTestId('cart-line')).toContainText('Swiss cheese plant')
    await expect(page.getByTestId('cart-line').getByRole('link')).toHaveAttribute(
      'href',
      PRODUCT.en,
    )
  })

  test('le sélecteur mène à l’équivalent de la fiche dans l’autre langue', async ({ page }) => {
    await goto(page, PRODUCT.en)
    const french = page.getByTestId('layout-language-fr')

    await expect(page.getByTestId('layout-languages')).toHaveAttribute('aria-label', 'Language')
    await expect(page.getByTestId('layout-language-en')).toHaveAttribute('aria-current', 'true')
    await expect(french).toHaveText('Français')
    await expect(french).toHaveAttribute('lang', 'fr')
    await expect(french).toHaveAttribute('hreflang', 'fr')
    await expect(french).toHaveAttribute('href', PRODUCT.fr)

    await french.click()
    await expect(page).toHaveURL(`${APP_URL}${PRODUCT.fr}`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    await expect(page.getByTestId('product-title')).toHaveText('Monstera deliciosa')
    await expect(page.getByTestId('layout-language-en')).toHaveAttribute('href', PRODUCT.en)
    await expect(page.getByTestId('layout-language-en')).toHaveText('English')
  })

  test('le sélecteur garde la catégorie et l’article dans l’autre langue', async ({ page }) => {
    await goto(page, CATEGORY.fr)
    await expect(page.getByTestId('layout-language-en')).toHaveAttribute('href', CATEGORY.en)

    await goto(page, CATEGORY.en)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Foliage plants')
    await expect(page.getByTestId('catalog-product-link').first()).toHaveAttribute(
      'href',
      /^\/en\/produit\//,
    )

    await goto(page, ARTICLE.en)
    await expect(page.getByTestId('article-title')).toHaveText('The enhanced accessibility mode')
    await expect(page.getByTestId('layout-language-fr')).toHaveAttribute('href', ARTICLE.fr)
  })

  test('le sélecteur est visible sur mobile sans débordement horizontal', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await goto(page, PRODUCT.en)

    await expect(page.getByTestId('layout-language-fr')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375)
  })

  test('hreflang, x-default, canonique et og:locale suivent la langue de la page', async ({
    page,
  }) => {
    await goto(page, PRODUCT.en)

    expect(await hreflangs(page)).toEqual({
      fr: `${APP_URL}${PRODUCT.fr}`,
      en: `${APP_URL}${PRODUCT.en}`,
      'x-default': `${APP_URL}${PRODUCT.fr}`,
    })
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${APP_URL}${PRODUCT.en}`,
    )
    expect(await meta(page, 'meta[property="og:locale"]')).toBe('en_US')
    expect(await meta(page, 'meta[property="og:locale:alternate"]')).toBe('fr_FR')

    await goto(page, '/contact')
    expect(await hreflangs(page)).toEqual({
      fr: `${APP_URL}/contact`,
      en: `${APP_URL}/en/contact`,
      'x-default': `${APP_URL}/contact`,
    })
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  })

  test('les données structurées déclarent la langue de la page', async ({ page }) => {
    await goto(page, ARTICLE.en)
    const posting = (await page.locator('script[type="application/ld+json"]').allTextContents())
      .map((text) => JSON.parse(text) as { '@type': string; inLanguage?: string; url?: string })
      .find((item) => item['@type'] === 'BlogPosting')

    expect(posting).toMatchObject({ inLanguage: 'en-US', url: `${APP_URL}${ARTICLE.en}` })
  })

  test('le sitemap liste chaque adresse dans chaque langue, avec ses équivalents', async ({
    request,
  }) => {
    const sitemap = await (await request.get(`${APP_URL}/sitemap.xml`)).text()

    expect(sitemap).toContain(`<loc>${APP_URL}${PRODUCT.en}</loc>`)
    expect(sitemap).toContain(`<loc>${APP_URL}${PRODUCT.fr}</loc>`)
    expect(sitemap).toContain(`<loc>${APP_URL}${CATEGORY.en}</loc>`)
    expect(sitemap).toContain(`<loc>${APP_URL}/en/contact</loc>`)
    expect(sitemap).toContain(`hreflang="en" href="${APP_URL}${PRODUCT.en}"`)
    expect(sitemap).toContain(`hreflang="fr" href="${APP_URL}${PRODUCT.fr}"`)
  })

  for (const path of [
    '/de/contact',
    '/fr/contact',
    '/en/route-inexistante',
    '/en/produit/monstera-deliciosa',
  ]) {
    test(`${path} répond 404`, async ({ page }) => {
      const response = await goto(page, path)

      expect(response?.status()).toBe(404)
    })
  }

  test('les tâches anglaises sont chargées dans le navigateur', async ({ page }) => {
    await goto(page, '/en/taches')

    await expect(page.getByTestId('tasks-list')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(en.tasks.title)
  })

  for (const mode of MODES) {
    for (const path of EN_ROUTES) {
      test(`${path} en mode ${mode} ne présente aucune violation axe WCAG 2.1 AA`, async ({
        page,
      }) => {
        await useMode(page, mode)
        await goto(page, path)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze()
        expect(results.violations).toEqual([])
      })
    }
  }
})
