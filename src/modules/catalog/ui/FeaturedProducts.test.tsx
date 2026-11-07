import { render, screen } from '@testing-library/react'

import { Price } from '../domain/price'
import { FeaturedProducts } from './FeaturedProducts'

import type { Carousel } from '@/shared/ui/carousel'

const findFeaturedProducts = vi.fn()
vi.mock('../application/products', () => ({
  loadFeaturedProducts: () => findFeaturedProducts(),
}))
vi.mock('@/shared/ui/carousel', () => ({
  Carousel: ({ slides }: { slides: Carousel.Slide[] }) => (
    <ul data-testid="home-carousel">
      {slides.map((slide) => (
        <li key={slide.id}>
          <a href={slide.href}>{slide.title}</a> {slide.text}
        </li>
      ))}
    </ul>
  ),
}))

const product = (slug: string, cents: number) => ({
  id: slug,
  slug,
  name: slug,
  categorySlug: 'heliconia',
  price: Price.fromCents(cents),
  exposure: 'soleil',
  size: 'L',
  inStock: true,
  image: null,
})

describe('FeaturedProducts', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  it("affiche un message d'erreur si l'API ne répond pas", async () => {
    findFeaturedProducts.mockRejectedValue(new Error('500'))
    render(await FeaturedProducts())

    expect(screen.getByTestId('home-carousel-error')).toHaveTextContent(
      'Impossible de charger le carrousel pour le moment.',
    )
  })

  it("n'affiche pas le carrousel sans produit à la une", async () => {
    findFeaturedProducts.mockResolvedValue([])
    const { container } = render(await FeaturedProducts())

    expect(container).toBeEmptyDOMElement()
  })

  it('passe chaque produit au carrousel avec son prix et le lien de sa fiche', async () => {
    findFeaturedProducts.mockResolvedValue([product('heliconia-rostrata', 5490)])
    render(await FeaturedProducts())

    expect(screen.getByRole('link', { name: 'heliconia-rostrata' })).toHaveAttribute(
      'href',
      '/produit/heliconia-rostrata',
    )
    expect(screen.getByTestId('home-carousel')).toHaveTextContent(/54,90\s€/)
  })
})
