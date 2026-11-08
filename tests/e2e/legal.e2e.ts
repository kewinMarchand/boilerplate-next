import { expect, test } from '@playwright/test'

const LEGAL_LINKS = [
  'Mentions légales',
  'Données personnelles',
  'Accessibilité : non conforme',
  'Plan du site',
]

test.describe('Pages légales', () => {
  test('n’affiche pas la mesure d’audience sans Matomo', async ({ page }) => {
    await page.goto('/donnees-personnelles')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByTestId('legal-audience-measurement')).toHaveCount(0)
  })

  test('le footer mène aux quatre pages légales', async ({ page }) => {
    await page.goto('/')

    const nav = page.getByRole('navigation', { name: 'Liens légaux' })
    for (const name of LEGAL_LINKS) {
      await expect(nav.getByRole('link', { name })).toBeVisible()
    }
    await expect(
      page.getByRole('contentinfo').getByRole('link', { name: /Charte graphique/ }),
    ).toHaveCount(0)
  })

  test("les mentions légales affichent le texte de l'API, section par section", async ({
    page,
  }) => {
    await page.goto('/mentions-legales')

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mentions légales')
    await expect(page.getByTestId('legal-section')).toHaveCount(4)
    await expect(page.getByTestId('legal-section').first()).toContainText('Exemple SAS')
    await expect(page.getByTestId('legal-error')).toHaveCount(0)
  })

  test('la déclaration est non conforme tant qu’aucun audit n’est renseigné', async ({ page }) => {
    await page.goto('/accessibilite')

    await expect(page.getByRole('heading', { level: 1 })).toHaveText("Déclaration d'accessibilité")
    const compliance = page.getByTestId('legal-section').first()
    await expect(compliance).toContainText('non conforme')
    await expect(compliance).toContainText("Aucun audit n'a encore été réalisé.")
    await expect(page.getByTestId('layout-breadcrumb').getByRole('listitem').last()).toHaveText(
      'Déclaration d’accessibilité',
    )
  })

  test('le plan du site liste les pages et toutes les catégories', async ({ page }) => {
    await page.goto('/plan-du-site')

    const sitemap = page.getByTestId('legal-sitemap')
    await expect(sitemap.getByRole('link')).toHaveCount(23)
    await expect(sitemap.getByRole('link', { name: 'Accueil' })).toHaveAttribute('href', '/')
    await expect(sitemap.getByRole('link', { name: 'Nénuphars' })).toHaveAttribute(
      'href',
      '/catalogue/plantes-aquatiques/nenuphars',
    )
  })
})
