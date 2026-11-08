import { expect, test } from '@playwright/test'

import type { Page } from '@playwright/test'

const PRODUCT = '/produit/monstera-deliciosa'

test.describe('Fiche produit', () => {
  test('s’ouvre depuis une carte du catalogue', async ({ page }) => {
    await page.goto('/catalogue')

    const card = page.getByTestId('catalog-product').first()
    const name = (await card.locator('h2').textContent()) ?? ''
    await card.getByTestId('catalog-product-link').click()

    await expect(page).toHaveURL(/\/produit\/[a-z0-9-]+$/)
    await expect(page.getByTestId('product-title')).toHaveText(name)
  })

  test('affiche le nom, le prix, la description, les caractéristiques, l’image de l’API et le chemin de sa catégorie', async ({
    page,
  }) => {
    await page.goto(PRODUCT)

    await expect(page.getByTestId('product-title')).toHaveText('Monstera deliciosa')
    await expect(page.getByTestId('product-price')).toHaveText(/34,90\s€/)
    const description = page.getByTestId('product-description').locator('p')
    await expect(description).toHaveCount(2)
    await expect(description.first()).toContainText('Grandes feuilles vert profond')
    await expect(page.getByTestId('product-page').locator('dd').first()).toHaveText('Mi-ombre')
    const image = page.getByTestId('product-page').locator('img').first()
    await expect(image).toHaveAttribute('fetchpriority', 'high')
    await expect
      .poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth))
      .toBeGreaterThan(0)
    const breadcrumb = page.getByTestId('layout-breadcrumb')
    await expect(breadcrumb).toContainText('Feuillages')
    await expect(breadcrumb.getByRole('link', { name: 'Monstera', exact: true })).toHaveAttribute(
      'href',
      '/catalogue/plantes-interieur/feuillages/monstera',
    )
  })

  test('affiche ses attributs : libellé, valeur et unité', async ({ page }) => {
    await page.goto(PRODUCT)

    const attributes = page.getByTestId('product-attributes')
    await expect(attributes.locator('dt')).toHaveText(['Feuillage', 'Hauteur adulte'])
    await expect(attributes.locator('dd')).toHaveText(['Persistant', '300 cm'])
  })

  test('n’affiche pas de liste d’attributs pour un produit qui n’en a pas', async ({ page }) => {
    await page.goto('/produit/monstera-thai-constellation')

    await expect(page.getByTestId('product-title')).toBeVisible()
    await expect(page.getByTestId('product-attributes')).toHaveCount(0)
  })

  test('expose ses données structurées de produit', async ({ page }) => {
    await page.goto(PRODUCT)

    const data = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(
      (text) =>
        JSON.parse(text) as { '@type': string; description?: string; offers?: { price: string } },
    )
    expect(data.map((item) => item['@type'])).toEqual(
      expect.arrayContaining(['Product', 'BreadcrumbList']),
    )
    const product = data.find((item) => item['@type'] === 'Product')
    expect(product?.offers?.price).toBe('34.90')
    expect(product?.description).toMatch(/^Grandes feuilles vert profond.+aide à grimper\.$/)
  })

  test('propose les autres produits de sa catégorie, sans lui-même', async ({ page }) => {
    await page.goto(PRODUCT)

    const similar = page.getByTestId('product-similar')
    await expect(similar.getByRole('heading', { level: 2 })).toHaveText('Produits similaires')
    const links = similar.getByTestId('carousel-slide-link')
    await expect(links).toHaveCount(2)
    await expect(similar).not.toContainText('Monstera deliciosa')
    const name = ((await links.first().textContent()) ?? '').trim()
    await links.first().click()

    await expect(page).toHaveURL(/\/produit\/monstera-/)
    await expect(page.getByTestId('product-title')).toHaveText(name)
  })

  test('répond 404 pour un produit inconnu', async ({ page }) => {
    const response = await page.goto('/produit/produit-inconnu')

    expect(response?.status()).toBe(404)
  })
})

test.describe('Galerie de la fiche produit', () => {
  const mainImage = (page: Page) => page.getByTestId('product-gallery').locator('img').first()
  const thumbImage = (page: Page, index: number) =>
    page.getByTestId('product-gallery-thumb').nth(index).locator('img')
  const hydratedThumbs = async (page: Page) => {
    const thumbs = page.getByTestId('product-gallery-thumb')
    await expect(thumbs.first()).toHaveJSProperty('tagName', 'BUTTON')
    return thumbs
  }

  test('affiche l’image principale en grand et une vignette par image, la principale comprise', async ({
    page,
  }) => {
    await page.goto(PRODUCT)
    const thumbs = await hydratedThumbs(page)

    await expect(thumbs).toHaveCount(3)
    await expect(thumbs.nth(1)).toHaveAccessibleName('Voir l’image 2 sur 3')
    await expect(thumbs.first()).toHaveAttribute('aria-current', 'true')
    await expect(thumbs.nth(1)).not.toHaveAttribute('aria-current')
    await expect(mainImage(page)).toHaveAttribute('fetchpriority', 'high')
    await expect(thumbImage(page, 0)).toHaveAttribute('loading', 'lazy')
    await expect(mainImage(page)).toHaveAttribute(
      'src',
      (await thumbImage(page, 0).getAttribute('src')) ?? '',
    )
  })

  test('change l’image affichée au clic sur une vignette', async ({ page }) => {
    await page.goto(PRODUCT)
    const thumbs = await hydratedThumbs(page)

    await thumbs.nth(2).click()

    await expect(thumbs.nth(2)).toHaveAttribute('aria-current', 'true')
    await expect(thumbs.first()).not.toHaveAttribute('aria-current')
    await expect(mainImage(page)).toHaveAttribute(
      'src',
      (await thumbImage(page, 2).getAttribute('src')) ?? '',
    )
  })

  test('passe d’une vignette à l’autre aux flèches du clavier, en boucle', async ({ page }) => {
    await page.goto(PRODUCT)
    const thumbs = await hydratedThumbs(page)

    await thumbs.first().focus()
    await page.keyboard.press('ArrowRight')
    await expect(thumbs.nth(1)).toBeFocused()
    await expect(thumbs.nth(1)).toHaveAttribute('aria-current', 'true')
    await expect(mainImage(page)).toHaveAttribute(
      'src',
      (await thumbImage(page, 1).getAttribute('src')) ?? '',
    )

    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowLeft')
    await expect(thumbs.nth(2)).toBeFocused()
    await expect(thumbs.nth(2)).toHaveAttribute('aria-current', 'true')
  })

  test('n’apparaît pas pour un produit sans galerie, qui garde son image seule', async ({
    page,
  }) => {
    await page.goto('/produit/monstera-thai-constellation')

    await expect(page.getByTestId('product-title')).toBeVisible()
    await expect(page.getByTestId('product-gallery')).toHaveCount(0)
    await expect(page.getByTestId('product-gallery-thumb')).toHaveCount(0)
  })
})

test.describe('Galerie de la fiche produit, sans JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('les vignettes sont des liens vers l’image en grand', async ({ page }) => {
    await page.goto(PRODUCT)

    const thumbs = page.locator('a[data-testid="product-gallery-thumb"]')
    await expect(thumbs).toHaveCount(3)
    await expect(thumbs.nth(1)).toHaveAttribute(
      'href',
      /^https?:\/\/.+\/media\/[0-9a-f]{32}-\d+\.webp$/,
    )
    await expect(thumbs.first()).toHaveAttribute('aria-current', 'true')
  })
})
