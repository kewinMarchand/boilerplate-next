import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { makeQueryClient } from '@/shared/providers'

import { sendContactMessage } from '@/modules/contact/infrastructure/sendContactMessage'

import { ContactForm } from './ContactForm'

vi.mock('@/modules/contact/infrastructure/sendContactMessage', () => ({
  sendContactMessage: vi.fn(async () => ({ status: 'sent' })),
}))

const PRODUCT = {
  slug: 'monstera-deliciosa',
  name: 'Monstera deliciosa',
  href: '/produit/monstera-deliciosa',
}

const renderForm = (product: typeof PRODUCT | null = null) =>
  render(
    <QueryClientProvider client={makeQueryClient()}>
      <ContactForm product={product} />
    </QueryClientProvider>,
  )

const fillForm = async () => {
  await userEvent.type(screen.getByTestId('contact-name'), 'Ada')
  await userEvent.type(screen.getByTestId('contact-email'), 'ada@exemple.fr')
  await userEvent.type(screen.getByTestId('contact-message'), 'Bonjour, ceci est un message.')
}

describe('ContactForm', () => {
  it('signale chaque champ obligatoire dans son libellé et le déclare required', () => {
    renderForm()

    for (const testId of ['contact-name', 'contact-email', 'contact-message']) {
      expect(screen.getByTestId(testId)).toBeRequired()
      expect(screen.getByTestId(testId)).toHaveAccessibleName(/\(obligatoire\)$/)
    }
  })

  it('lie le message d’erreur au champ invalide', async () => {
    renderForm()
    await userEvent.click(screen.getByTestId('contact-submit'))

    const email = screen.getByTestId('contact-email')
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveAccessibleDescription(/adresse e-mail valide/)
  })

  it('confirme l’envoi quand le formulaire est valide', async () => {
    renderForm()
    await userEvent.type(screen.getByTestId('contact-name'), 'Ada')
    await userEvent.type(screen.getByTestId('contact-email'), 'ada@exemple.fr')
    await userEvent.type(screen.getByTestId('contact-message'), 'Bonjour, ceci est un message.')
    await userEvent.click(screen.getByTestId('contact-submit'))

    expect(await screen.findByTestId('contact-success')).toBeInTheDocument()
  })

  it('envoie le produit d’une demande de renseignement et confirme la demande', async () => {
    renderForm(PRODUCT)
    await fillForm()
    await userEvent.click(screen.getByTestId('contact-submit'))

    expect(await screen.findByTestId('contact-success')).toHaveTextContent(
      'Votre demande de renseignement a bien été envoyée.',
    )
    expect(vi.mocked(sendContactMessage).mock.lastCall?.[0]).toMatchObject({
      message: { product: 'monstera-deliciosa' },
      locale: 'fr',
    })
  })

  it('affiche la violation 422 du produit pour tout le formulaire', async () => {
    vi.mocked(sendContactMessage).mockResolvedValueOnce({
      status: 'invalid',
      fieldErrors: [{ field: 'product', message: 'Ce produit n’existe pas.' }],
    })
    renderForm(PRODUCT)
    await fillForm()
    await userEvent.click(screen.getByTestId('contact-submit'))

    expect(await screen.findByTestId('contact-error')).toHaveTextContent('Ce produit n’existe pas.')
    expect(screen.queryByTestId('contact-success')).not.toBeInTheDocument()
  })

  it('relaie sous le champ la violation 422 renvoyée par l’API', async () => {
    vi.mocked(sendContactMessage).mockResolvedValueOnce({
      status: 'invalid',
      fieldErrors: [{ field: 'name', message: 'Votre nom ne doit pas dépasser 255 caractères.' }],
    })
    renderForm()
    await userEvent.type(screen.getByTestId('contact-name'), 'Ada')
    await userEvent.type(screen.getByTestId('contact-email'), 'ada@exemple.fr')
    await userEvent.type(screen.getByTestId('contact-message'), 'Bonjour, ceci est un message.')
    await userEvent.click(screen.getByTestId('contact-submit'))

    const name = screen.getByTestId('contact-name')
    expect(
      await screen.findByText('Votre nom ne doit pas dépasser 255 caractères.'),
    ).toBeInTheDocument()
    expect(name).toHaveAttribute('aria-invalid', 'true')
    expect(name).toHaveAccessibleDescription('Votre nom ne doit pas dépasser 255 caractères.')
    expect(screen.queryByTestId('contact-success')).not.toBeInTheDocument()
  })
})
