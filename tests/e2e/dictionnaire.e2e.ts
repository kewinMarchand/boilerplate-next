import { expect, test } from '@playwright/test'

import { fr } from '@/shared/i18n/dictionaries/fr'

test.describe('Dictionnaire envoyé au navigateur', () => {
  test('une page ne porte que les sections du document et les siennes', async ({ request }) => {
    const contact = await (await request.get('/contact')).text()
    expect(contact).toContain(fr.contact.validation.message)
    expect(contact).toContain(fr.errors.serverIntro)
    expect(contact).not.toContain(fr.catalog.closeFilters)
    expect(contact).not.toContain(fr.product.galleryImage)
    expect(contact).not.toContain(fr.carousel.slideRoleDescription)
    expect(contact).not.toContain(fr.tasks.loadError)
    expect(contact).not.toContain(fr.opposition.refused)

    const product = await (await request.get('/produit/monstera-deliciosa')).text()
    expect(product).toContain(fr.carousel.goTo)
    expect(product).not.toContain(fr.contact.validation.message)
    expect(product).not.toContain(fr.catalog.closeFilters)
  })

  test('une navigation dans le navigateur reçoit les sections de la page d’arrivée', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/produit/monstera-deliciosa')
    await expect(page.getByTestId('carousel-viewport')).toHaveAttribute('data-embla-ready', 'true')
    if (isMobile) await page.getByTestId('layout-mobile-menu-toggle').click()
    const menu = isMobile
      ? page.getByTestId('layout-mobile-menu')
      : page.getByRole('navigation', { name: fr.layout.mainNavigation })
    await menu.getByRole('link', { name: fr.nav.contact, exact: true }).click()
    await expect(page).toHaveURL(/\/contact$/)

    await page.getByTestId('contact-submit').click()
    await expect(page.getByTestId('contact-name')).toHaveAccessibleDescription(
      fr.contact.validation.name,
    )
  })
})
