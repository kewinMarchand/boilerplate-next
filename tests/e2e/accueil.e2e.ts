import { expect, test } from '@playwright/test'

import type { Page } from '@playwright/test'

const waitForCarousel = (page: Page) =>
  expect(page.getByTestId('carousel-viewport')).toHaveAttribute('data-embla-ready', 'true')

test.describe('Accueil', () => {
  test('affiche le hero, le carrousel et la grille de blog dans cet ordre', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    const blocks = ['home-hero', 'home-carousel', 'home-blog']
    const tops = await Promise.all(
      blocks.map(async (id) => (await page.getByTestId(id).boundingBox())?.y ?? -1),
    )
    expect(tops).toEqual([...tops].sort((a, b) => a - b))
    await expect(page.getByTestId('home-tasks-link')).toHaveAttribute('href', '/taches')
    await expect(page.getByTestId('home-contact-link')).toHaveAttribute('href', '/contact')
  })

  test('le hero occupe toute la largeur et son image est prioritaire', async ({ page }) => {
    await page.goto('/')

    const hero = await page.getByTestId('home-hero').boundingBox()
    expect(hero?.x).toBe(0)
    expect(hero?.width).toBe(page.viewportSize()?.width)

    const image = page.getByTestId('home-hero').locator('img')
    await expect(image).toHaveAttribute('fetchpriority', 'high')
    await expect(image).not.toHaveAttribute('loading', 'lazy')
    await expect(image).toHaveAttribute('width', '1920')
    await expect(image).toHaveAttribute('height', '1080')
  })

  test('le carrousel avance au clic et désactive Précédent au début', async ({ page }) => {
    await page.goto('/')
    await waitForCarousel(page)

    const dots = page.getByTestId('carousel-dot')
    await expect(page.getByTestId('carousel-prev')).toBeDisabled()
    await expect(dots.first()).toHaveAttribute('aria-current', 'true')

    await page.getByTestId('carousel-next').click()
    await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true')
    await expect(page.getByTestId('carousel-prev')).toBeEnabled()

    await page.getByTestId('carousel-prev').click()
    await expect(dots.first()).toHaveAttribute('aria-current', 'true')
  })

  test('le carrousel avance quand on le glisse à la souris', async ({ page }) => {
    await page.goto('/')
    await waitForCarousel(page)

    const viewport = page.getByTestId('carousel-viewport')
    await viewport.scrollIntoViewIfNeeded()
    const box = await viewport.boundingBox()
    if (!box) throw new Error('Piste du carrousel introuvable')

    const y = box.y + box.height / 3
    await page.mouse.move(box.x + box.width * 0.8, y)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width * 0.2, y, { steps: 10 })
    await page.mouse.up()

    await expect(page.getByTestId('carousel-dot').first()).not.toHaveAttribute('aria-current')
    await expect(page.getByTestId('carousel-prev')).toBeEnabled()
  })

  test('le carrousel avance à la molette horizontale', async ({ page }) => {
    await page.goto('/')
    await waitForCarousel(page)

    const viewport = page.getByTestId('carousel-viewport')
    await viewport.scrollIntoViewIfNeeded()
    const box = await viewport.boundingBox()
    if (!box) throw new Error('Piste du carrousel introuvable')

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 3)
    for (let step = 0; step < 6; step += 1) {
      await page.mouse.wheel(120, 0)
    }

    await expect(page.getByTestId('carousel-dot').first()).not.toHaveAttribute('aria-current')
    await expect(page.getByTestId('carousel-prev')).toBeEnabled()
  })

  test('affiche trois articles rendus côté serveur', async ({ page }) => {
    await page.goto('/')

    const cards = page.getByTestId('home-blog').getByTestId('home-blog-card')
    await expect(cards).toHaveCount(3)
    await expect(cards.first().locator('time')).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/)
    await expect(cards.first().locator('img')).toHaveAttribute('loading', 'lazy')
    await expect(page.getByTestId('home-blog-empty')).toHaveCount(0)
    await expect(page.getByTestId('home-blog-error')).toHaveCount(0)
  })

  test('affiche les illustrations des articles servies par l’API', async ({ page }) => {
    await page.goto('/')

    const image = page.getByTestId('home-blog-card').first().locator('img')
    await image.scrollIntoViewIfNeeded()
    const apiOrigin = new URL(process.env.API_URL ?? 'http://localhost:8090').origin
    await expect(image).toHaveAttribute('src', new RegExp(`^${apiOrigin}/media/`))
    await expect
      .poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth))
      .toBeGreaterThan(0)
  })

  test.describe('sans JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('la grille de blog est rendue et la piste du carrousel défile nativement', async ({
      page,
    }) => {
      await page.goto('/')

      await expect(page.getByTestId('home-blog-card')).toHaveCount(3)
      const viewport = page.getByTestId('carousel-viewport')
      await expect(viewport).not.toHaveAttribute('data-embla-ready')
      await expect(viewport).toHaveCSS('overflow-x', 'auto')
      const scrollLeft = await viewport.evaluate((element) => {
        element.scrollBy({ left: element.clientWidth, behavior: 'instant' })
        return element.scrollLeft
      })
      expect(scrollLeft).toBeGreaterThan(0)
    })
  })
})
