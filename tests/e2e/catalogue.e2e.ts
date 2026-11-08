import { expect, test } from '@playwright/test'

import { waitForHydration } from './helpers'

import type { Page } from '@playwright/test'

const priceOf = async (page: Page, index: number) =>
  Number(
    (await page.getByTestId('catalog-product-price').nth(index).innerText())
      .replace(/[^\d,]/g, '')
      .replace(',', '.'),
  )

const openFiltersIfMobile = async (page: Page, isMobile: boolean) => {
  if (isMobile) await page.getByTestId('catalog-filters-open').click()
}

test.describe('Catalogue', () => {
  test('liste 24 produits sur deux pages, sans filtre actif', async ({ page }) => {
    await page.goto('/catalogue')

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Catalogue')
    await expect(page.getByTestId('catalog-results-count')).toHaveText('24 produits')
    await expect(page.getByTestId('catalog-product')).toHaveCount(12)
    await expect(page.getByTestId('catalog-active-filters')).toHaveCount(0)
    await expect(page.getByTestId('catalog-pagination')).toBeVisible()
  })

  test('filtrer par exposition met à jour l’URL, le compteur et les puces', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/catalogue/plantes-interieur')
    await waitForHydration(page)
    await openFiltersIfMobile(page, isMobile)

    await page.getByTestId('catalog-filter-exposure-ombre').check()

    await expect(page).toHaveURL(/\/catalogue\/plantes-interieur\?exposition=ombre$/)
    await expect(page.getByTestId('catalog-results-count')).toHaveText('3 produits')
    await expect(page.getByTestId('catalog-filter-exposure-ombre')).toBeFocused()
    if (isMobile) await page.keyboard.press('Escape')
    await expect(page.getByTestId('catalog-active-filter')).toHaveAccessibleName(
      'Retirer le filtre : Ombre',
    )
  })

  test('filtrer par attribut remet la page à 1, met à jour l’URL, le compteur et les puces', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/catalogue?page=2')
    await waitForHydration(page)
    await openFiltersIfMobile(page, isMobile)

    await page.getByTestId('catalog-filter-attribute-feuillage-caduc').check()

    await expect(page).toHaveURL(/\/catalogue\?attr-feuillage=caduc$/)
    await expect(page.getByTestId('catalog-results-count')).toHaveText('2 produits')
    await expect(page.getByTestId('catalog-filter-attribute-feuillage-caduc')).toBeFocused()
    if (isMobile) await page.keyboard.press('Escape')
    await expect(page.getByTestId('catalog-active-filter')).toHaveAccessibleName(
      'Retirer le filtre : Caduc',
    )

    await page.getByTestId('catalog-active-filter').click()
    await expect(page).toHaveURL(/\/catalogue$/)
    await expect(page.getByTestId('catalog-active-filters')).toHaveCount(0)
  })

  test('n’affiche aucune facette d’attribut dans une branche sans attribut filtrable', async ({
    page,
  }) => {
    await page.goto('/catalogue/plantes-exterieur/arbustes-a-fleurs')

    await expect(page.getByTestId('catalog-filter-exposure-soleil').first()).toBeAttached()
    await expect(page.getByTestId(/^catalog-filter-attribute-/)).toHaveCount(0)
  })

  test('retirer une puce supprime le filtre', async ({ page }) => {
    await page.goto('/catalogue?exposition=soleil&taille=M')

    await page.getByRole('link', { name: 'Retirer le filtre : Soleil' }).click()

    await expect(page).toHaveURL(/\/catalogue\?taille=M$/)
    await expect(page.getByTestId('catalog-active-filter')).toHaveCount(1)
  })

  test('tout effacer garde la catégorie et la vue, et rend le focus au titre', async ({ page }) => {
    await page.goto('/catalogue/plantes-interieur?exposition=mi-ombre&tri=nom&vue=liste')
    await waitForHydration(page)

    await page.getByTestId('catalog-active-filters').getByTestId('catalog-clear-filters').click()

    await expect(page).toHaveURL(/\/catalogue\/plantes-interieur\?vue=liste$/)
    await expect(page.getByTestId('catalog-active-filters')).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  })

  test('le tri par prix croissant ordonne les produits et conserve les filtres', async ({
    page,
  }) => {
    await page.goto('/catalogue?en_stock=1')
    await waitForHydration(page)

    await page.getByTestId('catalog-sort').selectOption('prix-asc')

    await expect(page).toHaveURL(/\/catalogue\?en_stock=1&tri=prix-asc$/)
    await expect(page.getByTestId('catalog-sort')).toHaveValue('prix-asc')
    expect(await priceOf(page, 0)).toBeLessThanOrEqual(await priceOf(page, 1))
  })

  test('la pagination mène à la page 2 et revient', async ({ page }) => {
    await page.goto('/catalogue?vue=liste')
    await waitForHydration(page)
    const pagination = page.getByTestId('catalog-pagination')

    await pagination.getByRole('link', { name: 'Page 2' }).click()
    await expect(page).toHaveURL(/\/catalogue\?vue=liste&page=2$/)
    await expect(pagination.locator('[aria-current="page"]')).toHaveText('Page 2')
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused()

    await pagination.getByRole('link', { name: 'Précédent' }).click()
    await expect(page).toHaveURL(/\/catalogue\?vue=liste$/)
  })

  test('la vue liste persiste quand on filtre', async ({ page, isMobile }) => {
    await page.goto('/catalogue')
    await waitForHydration(page)

    await page.getByTestId('catalog-view-list').click()
    await expect(page).toHaveURL(/\?vue=liste$/)
    await expect(page.getByTestId('catalog-view-list')).toHaveAttribute('aria-current', 'page')

    await openFiltersIfMobile(page, isMobile)
    await page.getByTestId('catalog-filter-in-stock').check()
    await expect(page).toHaveURL(/\?en_stock=1&vue=liste$/)
  })

  test('affiche un état vide avec « Tout effacer »', async ({ page }) => {
    await page.goto('/catalogue?prix_max=1')

    await expect(page.getByTestId('catalog-empty')).toBeVisible()
    await expect(page.getByTestId('catalog-product')).toHaveCount(0)
    await expect(
      page.getByTestId('catalog-empty').getByTestId('catalog-clear-filters'),
    ).toHaveAttribute('href', '/catalogue')
  })

  test('le panneau de filtres mobile se ferme avec Échap et rend le focus', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'Panneau latéral réservé aux écrans étroits')
    await page.goto('/catalogue')

    const open = page.getByTestId('catalog-filters-open')
    await open.click()
    await expect(page.getByRole('dialog', { name: 'Filtres' })).toBeVisible()
    await expect(open).toHaveAttribute('aria-expanded', 'true')

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Filtres' })).toHaveCount(0)
    await expect(open).toBeFocused()
  })

  test.describe('sans JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('le formulaire GET applique les filtres en conservant le tri', async ({
      page,
      isMobile,
    }) => {
      await page.goto('/catalogue?tri=nom')
      if (isMobile) await page.getByTestId('catalog-filters-summary').click()

      await page.getByTestId('catalog-filter-size-L').locator('visible=true').check()
      await page.getByTestId('catalog-filters-submit').locator('visible=true').click()

      await expect(page).toHaveURL(/\/catalogue\?tri=nom&taille=L&prix_min=&prix_max=$/)
      await expect(page.getByTestId('catalog-results-count')).toHaveText('9 produits')
    })

    test('le formulaire GET applique une facette d’attribut', async ({ page, isMobile }) => {
      await page.goto('/catalogue')
      if (isMobile) await page.getByTestId('catalog-filters-summary').click()

      await page
        .getByTestId('catalog-filter-attribute-feuillage-persistant')
        .locator('visible=true')
        .check()
      await page.getByTestId('catalog-filters-submit').locator('visible=true').click()

      await expect(page).toHaveURL(/\/catalogue\?attr-feuillage=persistant&prix_min=&prix_max=$/)
      await expect(page.getByTestId('catalog-results-count')).toHaveText('6 produits')
    })
  })
})

test.describe('Catalogue, API en erreur (X-Scenario: error)', () => {
  test.use({ extraHTTPHeaders: { 'X-Scenario': 'error' } })

  test('affiche l’erreur et la relance', async ({ page }) => {
    await page.goto('/catalogue')

    await expect(page.getByTestId('catalog-error')).toBeVisible()
    await expect(page.getByTestId('catalog-retry')).toBeVisible()
    await expect(page.getByTestId('catalog-product')).toHaveCount(0)
  })
})

test.describe('Catalogue, API sans données (X-Scenario: empty)', () => {
  test.use({ extraHTTPHeaders: { 'X-Scenario': 'empty' } })

  test('affiche le message de liste vide', async ({ page }) => {
    await page.goto('/catalogue')

    await expect(page.getByTestId('catalog-empty')).toBeVisible()
    await expect(page.getByTestId('catalog-error')).toHaveCount(0)
  })
})
