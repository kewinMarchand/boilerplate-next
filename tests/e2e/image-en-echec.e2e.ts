import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

import { useMode } from './helpers'
import { MODES } from './routes'

import type { Page } from '@playwright/test'

const firstCard = (page: Page) => page.getByTestId('catalog-product').first()

/** Charge le catalogue normalement et renvoie l'adresse des variantes de l'image de la première carte, sans largeur ni extension. */
const firstImageBase = async (page: Page) => {
  await page.goto('/catalogue')
  const src = await firstCard(page).locator('img').getAttribute('src')
  expect(src).toMatch(/-\d+\.webp$/)
  return src!.replace(/-\d+\.webp$/, '')
}

const failImage = (page: Page, base: string) =>
  page.route(`${base}-*`, (route) => route.fulfill({ status: 404 }))

const expectNoBrokenImageVisible = async (page: Page) => {
  const visibleBroken = await page
    .locator('img')
    .evaluateAll(
      (images: HTMLImageElement[]) =>
        images.filter(
          (image) =>
            image.complete && image.naturalWidth === 0 && getComputedStyle(image).opacity !== '0',
        ).length,
    )
  expect(visibleBroken).toBe(0)
}

test.describe('Image de l’API en échec', () => {
  test('une image chargée ne porte pas la marque d’échec', async ({ page }) => {
    await page.goto('/catalogue')
    const picture = firstCard(page).locator('picture')

    await expect(picture).toHaveClass(/\bbui-picture\b/)
    await expect(firstCard(page).locator('img')).toHaveJSProperty('complete', true)
    await expect(picture).not.toHaveAttribute('data-image-error')
  })

  test('une image en 404 laisse un fond de remplacement aux dimensions de la carte', async ({
    page,
  }) => {
    const base = await firstImageBase(page)
    await expect(firstCard(page).locator('img')).toHaveJSProperty('complete', true)
    const loadedBox = await firstCard(page).boundingBox()

    await failImage(page, base)
    await page.reload()

    const picture = firstCard(page).locator('picture')
    await expect(picture).toHaveAttribute('data-image-error')
    await expect(firstCard(page).locator('img')).toHaveCSS('opacity', '0')
    expect(await firstCard(page).boundingBox()).toEqual(loadedBox)
    await expectNoBrokenImageVisible(page)
  })

  test('une vignette de la galerie en 404 porte la marque d’échec', async ({ page }) => {
    await page.goto('/produit/monstera-deliciosa')
    const thumb = page.getByTestId('product-gallery-thumb').nth(1)
    const src = await thumb.locator('img').getAttribute('src')
    expect(src).toMatch(/-\d+\.webp$/)

    await failImage(page, src!.replace(/-\d+\.webp$/, ''))
    await page.reload()
    await thumb.scrollIntoViewIfNeeded()

    await expect(thumb.locator('picture')).toHaveAttribute('data-image-error')
    await expect(thumb.locator('img')).toHaveCSS('opacity', '0')
    await expect(
      page.getByTestId('product-gallery-thumb').first().locator('picture'),
    ).not.toHaveAttribute('data-image-error')
  })

  test('une diapositive en 404 garde la taille de son image, fond sans débordement', async ({
    page,
  }) => {
    await page.goto('/')
    const slide = page.getByTestId('carousel-slide').first()
    const image = slide.locator('img')
    await expect(image).toHaveJSProperty('complete', true)
    const loadedBox = await image.boundingBox()
    expect(await slide.locator('picture').boundingBox()).toEqual(loadedBox)

    await failImage(page, (await image.getAttribute('src'))!.replace(/-\d+\.webp$/, ''))
    await page.reload()

    await expect(slide.locator('picture')).toHaveAttribute('data-image-error')
    const failedBox = await slide.locator('picture').boundingBox()
    expect(failedBox?.height).toBe(loadedBox?.height)
    expect(failedBox?.width).toBe(loadedBox?.width)
    expect(await image.boundingBox()).toEqual(failedBox)
  })

  for (const mode of MODES) {
    test(`une image en 404 en mode ${mode} ne présente aucune violation axe`, async ({ page }) => {
      const base = await firstImageBase(page)
      await useMode(page, mode)
      await failImage(page, base)
      await page.reload()
      if (mode === 'enhanced') {
        await expect(page.locator('html')).toHaveAttribute('data-a11y-mode', 'enhanced')
      }
      if (mode === 'dark') {
        await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'dark')
      }
      await expect(firstCard(page).locator('picture')).toHaveAttribute('data-image-error')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
      expect(results.violations).toEqual([])
    })
  }
})
