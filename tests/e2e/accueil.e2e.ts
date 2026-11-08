import { expect, test } from '@playwright/test'

import type { Page } from '@playwright/test'

const waitForCarousel = (page: Page) =>
  expect(page.getByTestId('carousel-viewport')).toHaveAttribute('data-embla-ready', 'true')

const blogCardBoxes = async (page: Page) => {
  const cards = page.getByTestId('home-blog-card')
  await expect(cards).toHaveCount(3)
  const boxes = await Promise.all([0, 1, 2].map((index) => cards.nth(index).boundingBox()))
  const [featured, second, third] = boxes
  if (!featured || !second || !third) throw new Error('Cartes du blog introuvables')
  return { featured, second, third }
}

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
    // Le geste part d'une diapositive cliquable : il fait défiler sans ouvrir la fiche
    await expect(page).toHaveURL('/')
  })

  test('une diapositive ouvre la fiche de son produit', async ({ page }) => {
    await page.goto('/')
    await waitForCarousel(page)

    const link = page.getByTestId('carousel-slide-link').first()
    const name = (await link.textContent()) ?? ''
    await page.getByTestId('carousel-slide').first().click()

    await expect(page).toHaveURL(/\/produit\/[a-z0-9-]+$/)
    await expect(page.getByTestId('product-title')).toHaveText(name)
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

  test('les diapositives du carrousel débordent du conteneur sans faire défiler la page', async ({
    page,
  }, testInfo) => {
    await page.goto('/')
    await waitForCarousel(page)

    const section = await page.getByTestId('home-carousel').boundingBox()
    if (!section) throw new Error('Carrousel introuvable')
    const sectionRight = section.x + section.width
    const slides = await page.getByTestId('carousel-slide').evaluateAll((elements) =>
      elements.map((slide) => {
        const { left, right } = slide.getBoundingClientRect()
        return { left, right }
      }),
    )
    expect(Math.max(...slides.map((slide) => slide.right))).toBeGreaterThan(sectionRight)
    if (testInfo.project.name === 'mobile') {
      const next = slides[1]
      if (!next) throw new Error('Deuxième diapositive introuvable')
      expect(next.left).toBeLessThan(sectionRight)
      expect(next.right).toBeGreaterThan(sectionRight)
    }

    const { scrollWidth, innerWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }))
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth)
  })

  test.describe('grille de blog', () => {
    test('l’image de l’article à la une demande une variante plus large que les autres', async ({
      page,
    }) => {
      await page.goto('/')

      const cards = page.getByTestId('home-blog-card')
      const featuredSources = cards.first().locator('source')
      await expect(featuredSources).not.toHaveCount(0)
      for (const source of await featuredSources.all()) {
        await expect(source).toHaveAttribute(
          'sizes',
          '(min-width: 1440px) 920px, (min-width: 1024px) 66vw, 100vw',
        )
      }
      await expect(cards.nth(1).locator('source').first()).toHaveAttribute(
        'sizes',
        '(min-width: 1440px) 460px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw',
      )
    })

    test('sur ordinateur, l’article à la une prend deux tiers et les deux autres sont empilés à droite', async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name === 'mobile', 'Largeur ordinateur')
      await page.setViewportSize({ width: 1280, height: 900 })
      await page.goto('/')

      const { featured, second, third } = await blogCardBoxes(page)
      expect(featured.width / second.width).toBeGreaterThan(1.8)
      expect(featured.width / second.width).toBeLessThan(2.3)
      expect(second.x).toBeGreaterThan(featured.x + featured.width)
      expect(third.x).toBeCloseTo(second.x, 0)
      expect(third.width).toBeCloseTo(second.width, 0)
      expect(third.y).toBeGreaterThan(second.y + second.height)
      expect(featured.y).toBeCloseTo(second.y, 0)
      expect(featured.y + featured.height).toBeCloseTo(third.y + third.height, 0)
    })

    test('sur tablette, l’article à la une et les deux autres ont la même largeur, côte à côte', async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name === 'mobile', 'Largeur tablette')
      await page.setViewportSize({ width: 768, height: 900 })
      await page.goto('/')

      const { featured, second, third } = await blogCardBoxes(page)
      expect(featured.width).toBeCloseTo(second.width, 0)
      expect(second.x).toBeGreaterThan(featured.x + featured.width)
      expect(featured.y).toBeCloseTo(second.y, 0)
      expect(third.x).toBeCloseTo(second.x, 0)
      expect(third.y).toBeGreaterThan(second.y + second.height)
    })

    test('sur mobile, les trois articles ont la même largeur et sont empilés', async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name === 'desktop', 'Largeur mobile')
      await page.goto('/')

      const { featured, second, third } = await blogCardBoxes(page)
      expect(second.width).toBeCloseTo(featured.width, 0)
      expect(third.width).toBeCloseTo(featured.width, 0)
      expect(second.x).toBeCloseTo(featured.x, 0)
      expect(third.x).toBeCloseTo(featured.x, 0)
      expect(second.y).toBeGreaterThan(featured.y + featured.height)
      expect(third.y).toBeGreaterThan(second.y + second.height)
    })
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
