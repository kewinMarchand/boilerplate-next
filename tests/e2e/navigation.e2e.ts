import { expect, test } from '@playwright/test'

test.describe('Navigation', () => {
  test('le lien actif porte aria-current', async ({ page, isMobile }) => {
    test.skip(isMobile, 'La navigation principale passe dans le menu latéral sur mobile')
    await page.goto('/contact')

    const nav = page.getByRole('navigation', { name: 'Navigation principale' })
    await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute('aria-current', 'page')
    await expect(nav.getByRole('link', { name: 'Accueil' })).not.toHaveAttribute('aria-current')
  })

  test('le lien « Blog » suit « Catalogue » et mène à la liste des articles', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'La navigation principale passe dans le menu latéral sur mobile')
    await page.goto('/')

    const nav = page.getByRole('navigation', { name: 'Navigation principale' })
    await expect(nav.locator('ul').first().locator(':scope > li')).toContainText([
      'Accueil',
      'Catalogue',
      'Blog',
      'Tâches',
      'Contact',
    ])
    await nav.getByRole('link', { name: 'Blog', exact: true }).click()

    await expect(page).toHaveURL(/\/blog$/)
    await expect(nav.getByRole('link', { name: 'Blog', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  test('le lien d’évitement mène au contenu principal', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')

    const skipLink = page.getByRole('link', { name: 'Aller au contenu principal' })
    await expect(skipLink).toBeFocused()
    await skipLink.press('Enter')
    await expect(page).toHaveURL(/#main$/)
  })

  test('le logo porte le nom du site et aria-current sur l’accueil seulement', async ({ page }) => {
    await page.goto('/')
    const logo = page.getByTestId('layout-logo')

    await expect(logo).toHaveAccessibleName('Boilerplate')
    await expect(logo).toHaveAttribute('href', '/')
    await expect(logo).toHaveAttribute('aria-current', 'page')

    await page.goto('/contact')
    await expect(page.getByTestId('layout-logo')).not.toHaveAttribute('aria-current')
  })
})
