import { render, screen } from '@testing-library/react'

import { staticImage } from '@/shared/ui/kit'

import { Carousel } from './Carousel'

const SLIDES: Carousel.Slide[] = [1, 2, 3, 4, 5].map((n) => ({
  id: String(n),
  title: `Diapositive ${n}`,
  text: `Texte ${n}`,
  image: staticImage(`/media/slide-${n}`, [640, 1280], { width: 1280, height: 720, alt: '' }),
}))

class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  // jsdom n'implémente ni matchMedia ni les observers dont Embla a besoin.
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
  }))
  vi.stubGlobal('ResizeObserver', ObserverStub)
  vi.stubGlobal('IntersectionObserver', ObserverStub)
})

afterAll(() => vi.unstubAllGlobals())

describe('Carousel', () => {
  it('désactive Précédent sur la première diapositive', () => {
    render(<Carousel title="À la une" slides={SLIDES} />)

    expect(screen.getByTestId('carousel-prev')).toBeDisabled()
  })

  it('relie les boutons à la piste et numérote les diapositives', () => {
    render(<Carousel title="À la une" slides={SLIDES} />)

    const trackId = screen.getByTestId('carousel-next').getAttribute('aria-controls')
    expect(document.getElementById(trackId ?? '')).toContainElement(
      screen.getAllByTestId('carousel-slide')[0] ?? null,
    )
    expect(screen.getByRole('region', { name: 'À la une' })).toHaveAttribute(
      'aria-roledescription',
      'carrousel',
    )
    expect(
      screen.getAllByTestId('carousel-slide').map((slide) => slide.getAttribute('aria-label')),
    ).toEqual(['1 sur 5', '2 sur 5', '3 sur 5', '4 sur 5', '5 sur 5'])
  })
})
