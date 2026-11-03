import { render, screen } from '@testing-library/react'

import { LegalPageContent } from './LegalPageContent'

const findLegalPage = vi.fn()
const notFound = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND')
})
vi.mock('../infrastructure/legalPageRepository', () => ({
  findLegalPage: (slug: string) => findLegalPage(slug),
}))
vi.mock('next/navigation', () => ({ notFound: () => notFound() }))

describe('LegalPageContent', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  it("garde le titre et affiche un message d'erreur si l'API ne répond pas", async () => {
    findLegalPage.mockRejectedValue(new Error('500'))
    render(await LegalPageContent({ slug: 'mentions-legales', fallbackTitle: 'Mentions légales' }))

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Mentions légales')
    expect(screen.getByTestId('legal-error')).toBeInTheDocument()
  })

  it('renvoie vers la page introuvable si l’API ne connaît pas la page', async () => {
    findLegalPage.mockResolvedValue(null)

    await expect(
      LegalPageContent({ slug: 'accessibilite', fallbackTitle: 'Accessibilité' }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
  })

  it('affiche le titre, l’introduction et chaque section avec son HTML', async () => {
    findLegalPage.mockResolvedValue({
      title: 'Données personnelles',
      introduction: '<p>Avant-propos.</p>',
      sections: [
        {
          title: 'Vos droits',
          html: '<ul><li>accès ;</li></ul><p><a href="https://www.cnil.fr/">CNIL</a></p>',
        },
      ],
    })
    render(await LegalPageContent({ slug: 'donnees-personnelles', fallbackTitle: '' }))

    expect(findLegalPage).toHaveBeenCalledWith('donnees-personnelles')
    expect(screen.getByText('Avant-propos.')).toBeInTheDocument()
    const section = screen.getByTestId('legal-section')
    expect(section).toHaveTextContent('Vos droits')
    expect(screen.getByRole('link', { name: 'CNIL' })).toHaveAttribute(
      'href',
      'https://www.cnil.fr/',
    )
    expect(screen.getByRole('listitem')).toHaveTextContent('accès ;')
  })
})
