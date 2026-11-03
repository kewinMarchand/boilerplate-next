import { Alert } from '@kewinmarchand/boilerplates-ui/react'

import { Carousel } from '@/shared/ui/carousel'

import { findSlides } from '../infrastructure/slideRepository'
import { SlidesLoadError } from '../infrastructure/SlidesLoadError'

/**
 * Sans `Suspense` : React sort un gros bloc suspendu du HTML initial et ne le remet en place qu'avec
 * JavaScript. Le carrousel doit défiler sans JavaScript, et l'accueil est pré-rendu de toute façon.
 */
export const FeaturedCarousel = async () => {
  const slides = await findSlides().catch((error: unknown) => {
    console.error(error)
    return null
  })

  if (!slides) {
    return (
      <div data-testid="home-carousel-error">
        <Alert variant="error">{new SlidesLoadError().message}</Alert>
      </div>
    )
  }

  // Sans diapositive, le carrousel n'a rien à montrer : la section disparaît de l'accueil
  if (!slides.length) return null

  return <Carousel title="À la une" slides={slides} data-testid="home-carousel" />
}
