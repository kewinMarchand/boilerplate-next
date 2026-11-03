import { render, screen } from '@testing-library/react'

import { FeaturedCarousel } from './FeaturedCarousel'

const findSlides = vi.fn()
vi.mock('../infrastructure/slideRepository', () => ({ findSlides: () => findSlides() }))
vi.mock('@/shared/ui/carousel', () => ({
  Carousel: ({ slides }: { slides: { id: string }[] }) => (
    <ul data-testid="home-carousel">
      {slides.map((slide) => (
        <li key={slide.id}>{slide.id}</li>
      ))}
    </ul>
  ),
}))

describe('FeaturedCarousel', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  it("affiche un message d'erreur si l'API ne répond pas", async () => {
    findSlides.mockRejectedValue(new Error('500'))
    render(await FeaturedCarousel())

    expect(screen.getByTestId('home-carousel-error')).toHaveTextContent(
      'Impossible de charger le carrousel pour le moment.',
    )
  })

  it("n'affiche pas le carrousel sans diapositive", async () => {
    findSlides.mockResolvedValue([])
    const { container } = render(await FeaturedCarousel())

    expect(container).toBeEmptyDOMElement()
  })

  it('passe les diapositives au carrousel', async () => {
    findSlides.mockResolvedValue([{ id: 'heliconia' }, { id: 'anthurium' }])
    render(await FeaturedCarousel())

    expect(screen.getByTestId('home-carousel')).toHaveTextContent('heliconiaanthurium')
  })
})
