import { Alert } from '@kewinmarchand/boilerplates-ui/react'

import { Carousel } from '@/shared/ui/carousel'

import { FeaturedProductsLoadError } from '../application/FeaturedProductsLoadError'
import { loadFeaturedProducts } from '../application/products'
import { productHref } from '../domain/catalog'
import { formatPrice } from '../domain/price'

/**
 * Carrousel des produits « À la une », chacun lié à sa fiche.
 * Sans `Suspense` : React sort un gros bloc suspendu du HTML initial et ne le remet en place qu'avec
 * JavaScript. Le carrousel doit défiler sans JavaScript, et l'accueil est pré-rendu de toute façon.
 */
export const FeaturedProducts = async ({ showPrices }: { showPrices: boolean }) => {
  const products = await loadFeaturedProducts().catch((error: unknown) => {
    console.error(error)
    return null
  })

  if (!products) {
    return (
      <div data-testid="home-carousel-error">
        <Alert variant="error">{new FeaturedProductsLoadError().message}</Alert>
      </div>
    )
  }

  // Sans produit à la une, le carrousel n'a rien à montrer : la section disparaît de l'accueil
  if (!products.length) return null

  return (
    <Carousel
      title="À la une"
      slides={products.map((product) => ({
        id: product.id,
        title: product.name,
        ...(showPrices && { text: formatPrice(product.price) }),
        image: product.image,
        href: productHref(product.slug),
      }))}
      data-testid="home-carousel"
    />
  )
}
