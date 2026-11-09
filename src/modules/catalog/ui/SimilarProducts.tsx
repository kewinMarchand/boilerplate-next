import { getDictionary } from '@/shared/i18n/server'
import { Carousel } from '@/shared/ui/carousel'

import { loadSimilarProducts } from '../application/products'
import { productHref } from '../domain/catalog'
import { formatPrice } from '../domain/price'

interface SimilarProductsProps {
  categorySlug: string
  productSlug: string
  showPrices: boolean
  locale: string
}

/** Carrousel des autres produits de la catégorie ; absent s'il n'y en a pas ou si l'API échoue. */
export const SimilarProducts = async ({
  categorySlug,
  productSlug,
  showPrices,
  locale,
}: SimilarProductsProps) => {
  const [products, t] = await Promise.all([
    loadSimilarProducts(categorySlug, productSlug, locale),
    getDictionary(),
  ])
  if (!products.length) return null

  return (
    <Carousel
      title={t.product.similar}
      slides={products.map((product) => ({
        id: product.id,
        title: product.name,
        ...(showPrices && { text: formatPrice(product.price, t.language.tag) }),
        image: product.image,
        href: productHref(product.slug),
      }))}
      data-testid="product-similar"
    />
  )
}
