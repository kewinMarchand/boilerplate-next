import { Alert } from '@kewinmarchand/boilerplates-ui/react'

import { getDictionary, getLocale } from '@/shared/i18n/server'
import { Carousel } from '@/shared/ui/carousel'

import { loadFeaturedProducts } from '../application/products'
import { productHref } from '../domain/catalog'
import { formatPrice } from '../domain/price'

/**
 * Carrousel des produits « À la une », chacun lié à sa fiche.
 * Sans `Suspense` : React sort un gros bloc suspendu du HTML initial et ne le remet en place qu'avec
 * JavaScript. Le carrousel doit défiler sans JavaScript, et l'accueil est pré-rendu de toute façon.
 */
export const FeaturedProducts = async ({ showPrices }: { showPrices: boolean }) => {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()])
  const products = await loadFeaturedProducts(locale).catch((error: unknown) => {
    console.error(error)
    return null
  })

  if (!products) {
    return (
      <div data-testid="home-carousel-error">
        <Alert variant="error">{t.catalog.featuredError}</Alert>
      </div>
    )
  }

  // Sans produit à la une, le carrousel n'a rien à montrer : la section disparaît de l'accueil
  if (!products.length) return null

  return (
    <Carousel
      title={t.catalog.featured}
      slides={products.map((product) => ({
        id: product.id,
        title: product.name,
        ...(showPrices && { text: formatPrice(product.price, t.language.tag) }),
        image: product.image,
        href: productHref(product.slug),
      }))}
      data-testid="home-carousel"
    />
  )
}
