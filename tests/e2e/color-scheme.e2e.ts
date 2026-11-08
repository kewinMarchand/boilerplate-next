import { expect, test } from '@playwright/test'

import type { Page } from '@playwright/test'

const html = (page: Page) => page.locator('html')

// Un clic antérieur à l'hydratation est perdu : on rejoue ouverture et choix jusqu'à ce que l'attribut change.
const choose = async (page: Page, choice: 'auto' | 'light' | 'dark') => {
  await expect(async () => {
    await page.getByTestId('color-scheme-toggle').click()
    await page.getByTestId(`color-scheme-option-${choice}`).click({ timeout: 1_000 })
    await expect(html(page)).toHaveAttribute('data-color-scheme', choice, { timeout: 1_000 })
  }).toPass()
}

const backgroundOf = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor)

test.describe('Thème', () => {
  test('suit le système par défaut, sans choix mémorisé', async ({ page }) => {
    await page.goto('/')

    await expect(html(page)).toHaveAttribute('data-color-scheme', 'auto')
    await expect(page.getByTestId('color-scheme-toggle')).toHaveAccessibleName('Thème : système')
    expect(await page.evaluate(() => localStorage.getItem('color-scheme'))).toBeNull()
  })

  test('chaque choix pose l’attribut, est mémorisé et persiste au rechargement', async ({
    page,
  }) => {
    await page.goto('/')

    for (const choice of ['dark', 'light'] as const) {
      await choose(page, choice)
      expect(await page.evaluate(() => localStorage.getItem('color-scheme'))).toBe(choice)

      await page.reload()
      await expect(html(page)).toHaveAttribute('data-color-scheme', choice)
      await expect(page.getByTestId(`color-scheme-option-${choice}`)).toHaveAttribute(
        'aria-checked',
        'true',
      )
    }
  })

  test('« système » écrit auto et le garde au rechargement', async ({ page }) => {
    await page.addInitScript(() => {
      if (!sessionStorage.getItem('init')) {
        sessionStorage.setItem('init', '1')
        localStorage.setItem('color-scheme', 'dark')
      }
    })
    await page.goto('/')
    await expect(html(page)).toHaveAttribute('data-color-scheme', 'dark')

    await choose(page, 'auto')
    expect(await page.evaluate(() => localStorage.getItem('color-scheme'))).toBe('auto')

    await page.reload()
    await expect(html(page)).toHaveAttribute('data-color-scheme', 'auto')
  })

  test('auto donne le sombre quand le système est sombre', async ({ page }) => {
    await page.goto('/')
    const light = await backgroundOf(page)

    await page.emulateMedia({ colorScheme: 'dark' })
    await expect.poll(() => backgroundOf(page)).not.toBe(light)
  })

  test('sans flash : le choix mémorisé est posé avant le premier DOMContentLoaded', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('color-scheme', 'dark')
      document.addEventListener('DOMContentLoaded', () => {
        sessionStorage.setItem(
          'au-chargement',
          document.documentElement.getAttribute('data-color-scheme') ?? '',
        )
      })
    })
    await page.goto('/')

    expect(await page.evaluate(() => sessionStorage.getItem('au-chargement'))).toBe('dark')
  })

  test('le mode renforcé garde la page en clair et suspend le choix sombre', async ({ page }) => {
    await page.goto('/')
    const light = await backgroundOf(page)

    await page.addInitScript(() => {
      localStorage.setItem('color-scheme', 'dark')
      localStorage.setItem('a11y-mode', 'enhanced')
    })
    await page.reload()

    await expect(html(page)).toHaveAttribute('data-color-scheme', 'dark')
    await expect(html(page)).toHaveAttribute('data-a11y-mode', 'enhanced')
    await expect(page.getByTestId('color-scheme-toggle')).toHaveAccessibleName(
      "Thème : sombre, suspendu par l'accessibilité renforcée",
    )
    expect(await backgroundOf(page)).toBe(light)
  })
})
