import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

import { useMode } from '../e2e/helpers'
import { MODES, ROUTES } from '../e2e/routes'

import type { Page } from '@playwright/test'

const EXTRA_ROUTES = [
  '/catalogue?exposition=soleil&taille=M&tri=prix-asc&vue=liste',
  '/catalogue?attr-feuillage=persistant',
  '/blog?rubrique=conseils',
  '/blog/un-carrousel-accessible-sans-dependance',
  '/route-inexistante',
  '/_erreur-test',
  '/panier',
]

const expectNoViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  expect(results.violations).toEqual([])
}

for (const mode of MODES) {
  for (const route of [...ROUTES, ...EXTRA_ROUTES]) {
    test(`la page ${route} en mode ${mode} ne présente aucune violation axe WCAG 2.1 AA`, async ({
      page,
    }) => {
      await useMode(page, mode)
      await page.goto(route)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      if (mode === 'enhanced') {
        await expect(page.locator('html')).toHaveAttribute('data-a11y-mode', 'enhanced')
      }
      if (mode === 'dark') {
        await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'dark')
      }

      await expectNoViolations(page)
    })
  }

  test(`le panier rempli en mode ${mode} ne présente aucune violation axe`, async ({ page }) => {
    await useMode(page, mode)
    await page.goto('/produit/monstera-deliciosa')
    await page.getByTestId('add-to-cart').click()
    await expect(page.getByTestId('cart-count')).toHaveText('1')
    await page.goto('/panier')
    await expect(page.getByTestId('cart-line')).toHaveCount(1)

    await expectNoViolations(page)
  })

  test(`le menu de navigation ouvert en mode ${mode} ne présente aucune violation axe`, async ({
    page,
    isMobile,
  }) => {
    await useMode(page, mode)
    await page.goto('/')

    if (isMobile) {
      await page.getByTestId('layout-mobile-menu-toggle').click()
      await page.getByTestId('layout-mobile-menu-descend-catalogue').click()
    } else {
      await page.getByTestId('layout-category-menu-toggle').click()
      // Premier lien de catégorie après « Tout le catalogue ».
      await page.getByTestId('layout-category-link').nth(1).hover()
    }

    await expectNoViolations(page)
  })
}
