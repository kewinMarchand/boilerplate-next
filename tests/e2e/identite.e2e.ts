import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { createServer } from 'node:http'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

import { useMode } from './helpers'
import { MODES } from './routes'

import type { Mode } from './routes'
import type { Page } from '@playwright/test'
import type { ChildProcess } from 'node:child_process'
import type { Server } from 'node:http'

const API_URL = process.env.API_URL ?? 'http://localhost:8090'

/** `--bui-color-primary` de boilerplates-ui dans chaque affichage. */
const LIBRARY_PRIMARY: Record<Mode, string> = {
  standard: '#1d4ed8',
  dark: '#9abdff',
  enhanced: '#1e3a8a',
}

const primaryToken = (page: Page) =>
  page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--bui-color-primary').trim(),
  )

const expectNoViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  expect(results.violations).toEqual([])
}

test.describe('Identité lue dans l’API (fixtures : sans logo ni couleurs)', () => {
  test('le nom de l’API est dans le header, le pied de page, le hero et les titres', async ({
    page,
    request,
  }) => {
    const { name } = await (await request.get(`${API_URL}/api/site-identity`)).json()

    await page.goto('/')
    const logo = page.getByTestId('layout-logo')
    await expect(logo).toHaveAccessibleName(name)
    await expect(logo.locator('svg')).toBeVisible()
    await expect(logo.locator('img')).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(name)
    await expect(page.locator('footer')).toContainText(name)
    await expect(page).toHaveTitle(name)
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', name)

    await page.goto('/contact')
    await expect(page).toHaveTitle(`Contact · ${name}`)
  })

  for (const mode of MODES) {
    test(`sans couleurs saisies, en mode ${mode}, les jetons de la bibliothèque s’appliquent`, async ({
      page,
    }) => {
      await useMode(page, mode)
      await page.goto('/')

      await expect(page.locator('link[rel="stylesheet"][href="/theme.css"]')).toHaveCount(0)
      expect(await primaryToken(page)).toBe(LIBRARY_PRIMARY[mode])
    })
  }
})

const APP_PORT = 3104
const FAKE_API_PORT = 3105
const APP_URL = `http://localhost:${APP_PORT}`
const FAKE_API_URL = `http://localhost:${FAKE_API_PORT}`

// Valeurs calculées par l'API (BrandPaletteTest de boilerplate-api-platform).
const THEME = {
  light: {
    primary: '#0b1f3a',
    'primary-dark': '#08172c',
    'on-primary': '#ffffff',
    'primary-surface-subtle': '#ebedef',
    'primary-surface': '#d3d7dc',
    'primary-surface-strong': '#b1b7c0',
    secondary: '#f2b705',
    'secondary-dark': '#b68904',
    'on-secondary': '#111827',
    'secondary-surface-subtle': '#fef9eb',
    'secondary-surface': '#fdf2d2',
    'secondary-surface-strong': '#fbe8af',
  },
  dark: {
    primary: '#839eea',
    'primary-dark': '#a2b6ef',
    'on-primary': '#0f141d',
    'primary-surface-subtle': '#181f2d',
    'primary-surface': '#1d2536',
    'primary-surface-strong': '#252e44',
    secondary: '#b793f5',
    'secondary-dark': '#c9aef8',
    'on-secondary': '#0f141d',
    'secondary-surface-subtle': '#1c1e2e',
    'secondary-surface': '#232337',
    'secondary-surface-strong': '#2f2c46',
  },
}

const ICON = {
  png32: `${FAKE_API_URL}/icon-32.png`,
  png180: `${FAKE_API_URL}/icon-180.png`,
  png192: `${FAKE_API_URL}/icon-192.png`,
  png512: `${FAKE_API_URL}/icon-512.png`,
}

const SHARE_IMAGE_URL = `${FAKE_API_URL}/share-1200.webp`

const IDENTITY = {
  name: 'Oraki',
  tagline: 'Plantes rares et tropicales, livrées chez vous, partout en France métropolitaine.',
  logo: { alt: 'Oraki', width: 1200, height: 630, sources: [], src: `${FAKE_API_URL}/logo.jpg` },
  icon: ICON,
  shareImage: {
    alt: 'La serre d’Oraki',
    width: 1200,
    height: 630,
    sources: [{ type: 'image/webp', srcset: `${SHARE_IMAGE_URL} 1200w` }],
    src: SHARE_IMAGE_URL,
  },
  defaultColorScheme: 'dark',
  theme: THEME,
}

const HOME_META = {
  title: 'Oraki, plantes rares et tropicales livrées chez vous',
  description:
    'Monstera, strelitzia, nénuphars : des plantes tropicales choisies une à une, emballées avec soin et livrées partout en France.',
}

const PRIVACY_META = {
  title: 'Vos données chez Oraki',
  description:
    'Ce que devient votre message de contact chez Oraki : qui le lit, combien de temps il est gardé, et comment exercer vos droits.',
}

const PAGE_METAS = [
  'home',
  'catalog',
  'blog',
  'contact',
  'sitemap',
  'legal-notice',
  'privacy',
  'accessibility',
].map((page) => ({
  page,
  ...(page === 'home'
    ? HOME_META
    : page === 'privacy'
      ? PRIVACY_META
      : { title: '', description: '' }),
}))

const PRODUCT_WITH_META = 'monstera-deliciosa'
const PRODUCT_META = {
  metaTitle: 'Monstera deliciosa, le faux philodendron d’Oraki',
  metaDescription:
    'Le monstera deliciosa d’Oraki : grandes feuilles découpées, croissance rapide à la mi-ombre, livré en pot de 21 cm avec son tuteur.',
}

const ARTICLE_WITH_META = 'un-carrousel-accessible-sans-dependance'
const ARTICLE_META_TITLE = 'Carrousel accessible : le guide sans dépendance'

const ARTICLE_WITHOUT_SECTION = 'le-mode-accessibilite-renforcee'

type Json = Record<string, unknown>

const withoutSection = (article: Json) =>
  article.slug === ARTICLE_WITHOUT_SECTION ? { ...article, section: null } : article

/** Réponses de l'API locale retouchées : métadonnées saisies, un article sans rubrique. */
const patch = (path: string, body: unknown): unknown => {
  if (/^\/api\/articles(\?|$)/.test(path)) return (body as Json[]).map(withoutSection)
  if (path.startsWith(`/api/articles/${ARTICLE_WITHOUT_SECTION}`)) {
    return withoutSection(body as Json)
  }
  if (path.startsWith(`/api/articles/${ARTICLE_WITH_META}`)) {
    return { ...(body as Json), metaTitle: ARTICLE_META_TITLE }
  }
  if (path.startsWith(`/api/products/${PRODUCT_WITH_META}`)) {
    return { ...(body as Json), ...PRODUCT_META }
  }
  return body
}

// L'identité est lue côté serveur, au build puis à chaque régénération : une API factice la sert
// avec logo, couleurs, icône et image de partage, sert les métadonnées des pages fixes, et relaie
// le reste à l'API locale (retouché par `patch`), sans toucher à sa base.
const startFakeApi = () =>
  createServer(async (request, response) => {
    const path = request.url ?? '/'
    if (path.startsWith('/api/site-identity')) {
      response.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify(IDENTITY))
      return
    }
    if (path.startsWith('/api/page-metas')) {
      response
        .writeHead(200, { 'content-type': 'application/json' })
        .end(JSON.stringify(PAGE_METAS))
      return
    }
    if (path === '/logo.jpg') {
      response
        .writeHead(200, { 'content-type': 'image/jpeg' })
        .end(readFileSync('public/images/og-image.jpg'))
      return
    }
    const upstream = await fetch(`${API_URL}${path}`).catch(() => null)
    if (!upstream) {
      response.writeHead(502).end()
      return
    }
    const contentType = upstream.headers.get('content-type') ?? 'application/json'
    const body = Buffer.from(await upstream.arrayBuffer())
    response
      .writeHead(upstream.status, { 'content-type': contentType })
      .end(
        upstream.ok && contentType.includes('json')
          ? JSON.stringify(patch(path, JSON.parse(body.toString())))
          : body,
      )
  }).listen(FAKE_API_PORT)

const ENV = {
  ...process.env,
  NEXT_DIST_DIR: '.next-identite',
  NEXT_PUBLIC_SITE_URL: APP_URL,
  API_URL: FAKE_API_URL,
}

const run = (command: string, args: string[]) =>
  new Promise<void>((resolve, reject) => {
    spawn(command, args, { env: ENV, stdio: 'ignore' }).on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} ${args.join(' ')} : code ${code}`)),
    )
  })

const chooseLight = (page: Page) =>
  page.addInitScript(() => localStorage.setItem('color-scheme', 'light'))

const meta = (page: Page, selector: string) =>
  page.locator(selector).first().getAttribute('content')

test.describe('Identité saisie dans l’admin : logo, couleurs, sombre par défaut (API factice)', () => {
  test.describe.configure({ mode: 'serial' })

  let app: ChildProcess | undefined
  let fakeApi: Server | undefined

  test.beforeAll(async () => {
    test.skip(test.info().project.name !== 'desktop', 'Build dédié, une seule fois.')
    test.setTimeout(300_000)
    fakeApi = startFakeApi()
    await run('yarn', ['build'])
    app = spawn('yarn', ['start', '--port', String(APP_PORT)], { env: ENV, stdio: 'ignore' })
    await expect
      .poll(async () => (await fetch(APP_URL).catch(() => null))?.status, { timeout: 30_000 })
      .toBe(200)
  })

  test.afterAll(() => {
    app?.kill()
    fakeApi?.close()
  })

  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 375, height: 812 },
  ]) {
    test(`le logo remplace pictogramme et nom dans le header (${viewport.width} px)`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport)
      await page.goto(APP_URL)
      const logo = page.getByTestId('layout-logo')
      const image = logo.locator('img')

      await expect(logo).toHaveAccessibleName('Oraki')
      await expect(image).toHaveAttribute('alt', 'Oraki')
      await expect(image).toHaveAttribute('fetchpriority', 'high')
      await expect(image).toHaveJSProperty('complete', true)
      expect((await image.boundingBox())?.height).toBe(40)
      await expect(logo.locator('svg')).toHaveCount(0)
      await expect(logo).not.toContainText('Oraki')
    })
  }

  test('le nom et la couleur principale passent dans les titres et le manifeste', async ({
    page,
    request,
  }) => {
    await page.goto(`${APP_URL}/contact`)
    await expect(page).toHaveTitle('Contact · Oraki')

    const manifest = await (await request.get(`${APP_URL}/manifest.webmanifest`)).json()
    expect(manifest).toMatchObject({
      name: 'Oraki',
      short_name: 'Oraki',
      theme_color: THEME.light.primary,
    })
  })

  test('le thème sombre par défaut est servi, le choix mémorisé l’emporte', async ({
    page,
    request,
  }) => {
    expect(await (await request.get(APP_URL)).text()).toContain('data-color-scheme="dark"')

    await page.goto(APP_URL)
    await expect(page.getByTestId('color-scheme-toggle')).toHaveAccessibleName('Thème : sombre')
    expect(await primaryToken(page)).toBe(THEME.dark.primary)

    await chooseLight(page)
    await page.goto(APP_URL)
    await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'light')
  })

  test('les couleurs saisies s’appliquent en clair et en sombre, jamais en mode renforcé', async ({
    page,
  }) => {
    await page.goto(APP_URL)
    await page.evaluate(() => localStorage.setItem('color-scheme', 'light'))
    await page.reload()
    await expect(page.locator('link[rel="stylesheet"][href="/theme.css"]')).toHaveCount(1)
    expect(await primaryToken(page)).toBe(THEME.light.primary)

    await page.evaluate(() => localStorage.setItem('color-scheme', 'dark'))
    await page.reload()
    expect(await primaryToken(page)).toBe(THEME.dark.primary)

    await page.evaluate(() => localStorage.setItem('a11y-mode', 'enhanced'))
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-a11y-mode', 'enhanced')
    expect(await primaryToken(page)).toBe(LIBRARY_PRIMARY.enhanced)
  })

  test('« système » reste choisi au rechargement malgré le défaut sombre', async ({ page }) => {
    await page.goto(APP_URL)
    // Un clic antérieur à l'hydratation est perdu : ouverture et choix rejoués jusqu'au changement.
    await expect(async () => {
      await page.getByTestId('color-scheme-toggle').click()
      await page.getByTestId('color-scheme-option-auto').click({ timeout: 1_000 })
      await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'auto', {
        timeout: 1_000,
      })
    }).toPass()
    expect(await page.evaluate(() => localStorage.getItem('color-scheme'))).toBe('auto')

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'auto')
    expect(await primaryToken(page)).toBe(THEME.light.primary)

    await page.emulateMedia({ colorScheme: 'dark' })
    await expect.poll(() => primaryToken(page)).toBe(THEME.dark.primary)
  })

  test('les favicons, le manifeste et le logo de l’Organization pointent vers l’icône saisie', async ({
    page,
    request,
  }) => {
    await page.goto(APP_URL)

    const icons = page.locator('link[rel="icon"]')
    await expect(icons).toHaveCount(1)
    await expect(icons).toHaveAttribute('href', ICON.png32)
    await expect(icons).toHaveAttribute('sizes', '32x32')
    await expect(icons).toHaveAttribute('type', 'image/png')
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', ICON.png180)

    const manifest = (await (await request.get(`${APP_URL}/manifest.webmanifest`)).json()) as {
      icons: { src: string; sizes: string }[]
    }
    expect(manifest.icons).toEqual([
      expect.objectContaining({ src: ICON.png192, sizes: '192x192' }),
      expect.objectContaining({ src: ICON.png512, sizes: '512x512' }),
    ])

    const organization = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    )
      .map((text) => JSON.parse(text) as { '@type': string; logo?: string })
      .find((item) => item['@type'] === 'Organization')
    expect(organization?.logo).toBe(ICON.png512)
  })

  test('l’image de partage saisie sert aux pages sans image propre, pas aux autres', async ({
    page,
  }) => {
    await page.goto(`${APP_URL}/contact`)
    expect(await meta(page, 'meta[property="og:image"]')).toBe(SHARE_IMAGE_URL)
    expect(await meta(page, 'meta[property="og:image:alt"]')).toBe('La serre d’Oraki')
    expect(await meta(page, 'meta[name="twitter:image"]')).toBe(SHARE_IMAGE_URL)

    await page.goto(`${APP_URL}/produit/${PRODUCT_WITH_META}`)
    expect(await meta(page, 'meta[property="og:image"]')).toMatch(
      /\/media\/[0-9a-f]{32}-\d+\.webp$/,
    )
  })

  test('les titres et descriptions saisis des pages fixes remplacent les leurs', async ({
    page,
  }) => {
    for (const [path, saisie] of [
      ['/', HOME_META],
      ['/donnees-personnelles', PRIVACY_META],
    ] as const) {
      await page.goto(`${APP_URL}${path}`)
      await expect(page).toHaveTitle(saisie.title)
      expect(await meta(page, 'meta[name="description"]')).toBe(saisie.description)
      expect(await meta(page, 'meta[property="og:title"]')).toBe(saisie.title)
      expect(await meta(page, 'meta[property="og:description"]')).toBe(saisie.description)
      expect((await page.title()).length).toBeLessThanOrEqual(60)
      expect(saisie.description.length).toBeLessThanOrEqual(160)
    }

    await page.goto(`${APP_URL}/plan-du-site`)
    await expect(page).toHaveTitle('Plan du site · Oraki')
  })

  test('les métadonnées saisies d’un produit et d’un article remplacent les leurs', async ({
    page,
    request,
  }) => {
    await page.goto(`${APP_URL}/produit/${PRODUCT_WITH_META}`)
    await expect(page).toHaveTitle(PRODUCT_META.metaTitle)
    expect(await meta(page, 'meta[name="description"]')).toBe(PRODUCT_META.metaDescription)
    expect(await meta(page, 'meta[property="og:title"]')).toBe(PRODUCT_META.metaTitle)

    const { excerpt } = (await (
      await request.get(`${API_URL}/api/articles/${ARTICLE_WITH_META}`)
    ).json()) as { excerpt: string }
    await page.goto(`${APP_URL}/blog/${ARTICLE_WITH_META}`)
    await expect(page).toHaveTitle(ARTICLE_META_TITLE)
    expect(await meta(page, 'meta[name="description"]')).toBe(excerpt)
  })

  test('un article sans rubrique n’a pas de sur-titre, ni sur sa carte ni sur sa fiche', async ({
    page,
  }) => {
    await page.goto(`${APP_URL}/blog`)
    const cards = page.getByTestId('blog-card')
    await expect(cards).toHaveCount(3)
    await expect(cards.getByTestId('article-section')).toHaveCount(2)
    await expect(
      cards.filter({ has: page.locator(`a[href="/blog/${ARTICLE_WITHOUT_SECTION}"]`) }),
    ).not.toContainText('Actualités')

    await page.goto(`${APP_URL}/blog/${ARTICLE_WITHOUT_SECTION}`)
    await expect(page.getByTestId('article-title')).toBeVisible()
    await expect(page.getByTestId('article-section')).toHaveCount(0)
    await expect(page.getByTestId('article-format')).toHaveCount(0)
  })

  for (const mode of MODES) {
    test(`l’accueil avec logo et couleurs en mode ${mode} ne présente aucune violation axe`, async ({
      page,
    }) => {
      if (mode === 'standard') await chooseLight(page)
      await useMode(page, mode)
      await page.goto(APP_URL)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Oraki')

      await expectNoViolations(page)
    })
  }
})
