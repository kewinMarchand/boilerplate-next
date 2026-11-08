import { expect, test } from '@playwright/test'

test.describe('Liste des articles', () => {
  test('affiche les articles de l’API, du plus récent au plus ancien', async ({
    page,
    request,
  }) => {
    const apiUrl = process.env.API_URL || 'http://localhost:8090'
    const articles = (await (await request.get(`${apiUrl}/api/articles`)).json()) as {
      title: string
    }[]

    await page.goto('/blog')

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Blog')
    await expect(page.getByTestId('layout-breadcrumb').getByRole('listitem')).toHaveText([
      'Accueil',
      'Blog',
    ])
    await expect(page.getByTestId('blog-list').getByTestId('blog-card').locator('h2')).toHaveText(
      articles.map((article) => article.title),
    )
    await expect(page.getByTestId('blog-empty')).toHaveCount(0)
    await expect(page.getByTestId('blog-error')).toHaveCount(0)
  })

  test('ouvre la fiche d’un article depuis sa carte', async ({ page }) => {
    await page.goto('/blog')

    const card = page.getByTestId('blog-card').first()
    const title = (await card.locator('h2').textContent()) ?? ''
    await card.getByRole('link').click()

    await expect(page).toHaveURL(/\/blog\/[a-z0-9-]+$/)
    await expect(page.getByTestId('article-title')).toHaveText(title)
  })

  test('est rejointe depuis la grille de l’accueil', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('home-blog-all').click()

    await expect(page).toHaveURL(/\/blog$/)
    await expect(page.getByTestId('blog-list')).toBeVisible()
  })

  test('expose ses données structurées Blog et BreadcrumbList', async ({ page }) => {
    await page.goto('/blog')

    const types = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(
      (text) => (JSON.parse(text) as { '@type': string })['@type'],
    )
    expect(types).toEqual(expect.arrayContaining(['Blog', 'BreadcrumbList']))
  })
})

test.describe('Rubriques des articles', () => {
  const API_URL = process.env.API_URL || 'http://localhost:8090'

  test('les cartes portent leur rubrique en sur-titre, sur /blog et sur l’accueil', async ({
    page,
    request,
  }) => {
    const articles = (await (await request.get(`${API_URL}/api/articles`)).json()) as {
      section: { name: string } | null
    }[]

    await page.goto('/blog')
    await expect(page.getByTestId('blog-card').getByTestId('article-section')).toHaveText(
      articles.flatMap((article) => (article.section ? [article.section.name] : [])),
    )

    await page.goto('/')
    await expect(
      page.getByTestId('home-blog-card').first().getByTestId('article-section'),
    ).toHaveText(articles[0]?.section?.name ?? '')
  })

  test('filtre la liste par rubrique, l’état dans l’URL', async ({ page, request }) => {
    const conseils = (await (
      await request.get(`${API_URL}/api/articles?section=conseils`)
    ).json()) as { title: string }[]

    await page.goto('/blog')
    const filter = page.getByRole('navigation', { name: 'Rubriques' })
    const links = filter.getByTestId('blog-section-link')
    await expect(links).toHaveText(['Toutes', 'Conseils', 'Actualités'])
    await expect(links.first()).toHaveAttribute('aria-current', 'page')

    await links.nth(1).click()

    await expect(page).toHaveURL(/\/blog\?rubrique=conseils$/)
    await expect(links.nth(1)).toHaveAttribute('aria-current', 'page')
    await expect(links.first()).not.toHaveAttribute('aria-current')
    await expect(page.getByTestId('blog-card').locator('h2')).toHaveText(
      conseils.map((article) => article.title),
    )
    await expect(page.getByTestId('blog-card').getByTestId('article-section')).toHaveText(
      conseils.map(() => 'Conseils'),
    )

    await links.first().click()
    await expect(page).toHaveURL(/\/blog$/)
  })

  test('une rubrique inconnue donne la liste vide, sans erreur', async ({ page }) => {
    await page.goto('/blog?rubrique=inconnue')

    await expect(page.getByTestId('blog-empty')).toBeVisible()
    await expect(page.getByTestId('blog-sections')).toBeVisible()
  })
})

test.describe('Liste des articles, API en erreur (X-Scenario: error)', () => {
  test.use({ extraHTTPHeaders: { 'X-Scenario': 'error' } })

  test('affiche un message et un lien pour réessayer', async ({ page }) => {
    await page.goto('/blog')

    await expect(page.getByTestId('blog-error')).toBeVisible()
    await expect(page.getByTestId('blog-retry')).toHaveAttribute('href', '/blog')
    await expect(page.getByTestId('blog-list')).toHaveCount(0)
  })
})

test.describe('Liste des articles, API sans données (X-Scenario: empty)', () => {
  test.use({ extraHTTPHeaders: { 'X-Scenario': 'empty' } })

  test('affiche un message amical', async ({ page }) => {
    await page.goto('/blog')

    await expect(page.getByTestId('blog-empty')).toBeVisible()
    await expect(page.getByTestId('blog-list')).toHaveCount(0)
  })

  test('n’affiche pas le filtre sans rubrique', async ({ page }) => {
    await page.goto('/blog')

    await expect(page.getByTestId('blog-empty')).toBeVisible()
    await expect(page.getByTestId('blog-sections')).toHaveCount(0)
  })
})
