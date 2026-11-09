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

    const home = await (await request.get('/')).text()
    expect(home).toContain(fr.carousel.goTo)
    expect(home).not.toContain(fr.contact.validation.message)
    expect(home).not.toContain(fr.catalog.closeFilters)
  })

  test('une navigation dans le navigateur reçoit les sections de la page d’arrivée', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByTestId('carousel-viewport')).toHaveAttribute('data-embla-ready', 'true')
    await page.getByTestId('home-contact-link').click()
    await expect(page).toHaveURL(/\/contact$/)

    await page.getByTestId('contact-submit').click()
    await expect(page.getByTestId('contact-name')).toHaveAccessibleDescription(
      fr.contact.validation.name,
    )
  })
})
