import { expect, test } from '@playwright/test'

const ARTICLE = '/blog/un-carrousel-accessible-sans-dependance'

test.describe('Fiche article', () => {
  test('s’ouvre depuis une carte de l’accueil', async ({ page }) => {
    await page.goto('/')

    const card = page.getByTestId('home-blog-card').first()
    const title = (await card.locator('h3').textContent()) ?? ''
    await card.getByRole('link').click()

    await expect(page).toHaveURL(/\/blog\/[a-z0-9-]+$/)
    await expect(page.getByTestId('article-title')).toHaveText(title)
  })

  test('affiche le titre, la date, l’image de l’API et le texte rendu côté serveur', async ({
    page,
    request,
  }) => {
    const html = await (await request.get(ARTICLE)).text()
    expect(html).toContain('<h2>Partir du défilement natif</h2>')

    await page.goto(ARTICLE)
    await expect(page.getByTestId('article-title')).toHaveText(
      'Un carrousel accessible sans dépendance',
    )
    await expect(page.getByTestId('article-page').locator('time')).toHaveAttribute(
      'datetime',
      '2026-09-22',
    )
    await expect(page.getByTestId('article-body').locator('li')).toHaveCount(3)
    const image = page.getByTestId('article-page').locator('img').first()
    await expect(image).toHaveAttribute('fetchpriority', 'high')
    await expect
      .poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth))
      .toBeGreaterThan(0)
  })

  test('a un fil d’Ariane Accueil › Blog › titre qui mène à la liste', async ({ page }) => {
    await page.goto(ARTICLE)

    const breadcrumb = page.getByTestId('layout-breadcrumb')
    await expect(breadcrumb.getByRole('listitem')).toHaveText([
      'Accueil',
      'Blog',
      'Un carrousel accessible sans dépendance',
    ])
    await breadcrumb.getByRole('link', { name: 'Blog' }).click()

    await expect(page).toHaveURL(/\/blog$/)
    await expect(page.getByTestId('blog-list')).toBeVisible()
  })

  test('mène à la liste par le lien « Tous les articles »', async ({ page }) => {
    await page.goto(ARTICLE)
    await page.getByTestId('article-blog-link').click()

    await expect(page).toHaveURL(/\/blog$/)
    await expect(page.getByTestId('blog-list')).toBeVisible()
  })

  test('expose ses données structurées d’article', async ({ page }) => {
    await page.goto(ARTICLE)

    expect(await page.locator('meta[property="og:type"]').getAttribute('content')).toBe('article')
    const types = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(
      (text) => (JSON.parse(text) as { '@type': string })['@type'],
    )
    expect(types).toEqual(expect.arrayContaining(['BlogPosting', 'BreadcrumbList']))
  })

  test('affiche sa rubrique, et le lecteur audio avec sa durée et son intervenant', async ({
    page,
    request,
  }) => {
    await page.goto(ARTICLE)

    await expect(page.getByTestId('article-page').getByTestId('article-section')).toHaveText(
      'Conseils',
    )
    await expect(page.getByTestId('article-format')).toHaveCount(0)
    const audio = page.getByTestId('article-audio')
    await expect(audio).toHaveAttribute('controls', '')
    await expect(audio).toHaveAttribute('preload', 'none')
    await expect(audio).not.toHaveAttribute('autoplay')
    await expect(audio).toHaveJSProperty('paused', true)
    await expect(page.getByTestId('article-audio-duration')).toHaveText('4 s')
    await expect(page.getByTestId('article-audio-speaker')).toHaveText(
      'Présenté par Hina Teriierooiterai',
    )
    const source = audio.locator('source')
    await expect(source).toHaveAttribute('type', 'audio/mpeg')
    const file = await request.get((await source.getAttribute('src')) ?? '')
    expect(file.status()).toBe(200)
    expect(file.headers()['content-type']).toContain('audio/')
  })

  test('affiche son format, sans lecteur audio quand l’article n’en a pas', async ({ page }) => {
    await page.goto('/blog/pourquoi-rendre-le-contenu-cote-serveur')

    await expect(page.getByTestId('article-page').getByTestId('article-section')).toHaveText(
      'Conseils',
    )
    await expect(page.getByTestId('article-format')).toHaveText('Guide')
    await expect(page.getByTestId('article-title')).toBeVisible()
    await expect(page.getByTestId('article-audio')).toHaveCount(0)
    await expect(page.getByTestId('article-audio-speaker')).toHaveCount(0)
  })

  test('répond 404 pour un article inconnu', async ({ page }) => {
    const response = await page.goto('/blog/article-inconnu')

    expect(response?.status()).toBe(404)
  })
})
