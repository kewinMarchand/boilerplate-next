import { Carousel } from '@/shared/ui/carousel'

import { loadSimilarProducts } from '../application/products'
import { productHref } from '../domain/catalog'
import { formatPrice } from '../domain/price'

interface SimilarProductsProps {
  categorySlug: string
  productSlug: string
  showPrices: boolean
}

/** Carrousel des autres produits de la catégorie ; absent s'il n'y en a pas ou si l'API échoue. */
export const SimilarProducts = async ({
  categorySlug,
  productSlug,
  showPrices,
}: SimilarProductsProps) => {
  const products = await loadSimilarProducts(categorySlug, productSlug)
  if (!products.length) return null

  return (
    <Carousel
      title="Produits similaires"
      slides={products.map((product) => ({
        id: product.id,
        title: product.name,
        ...(showPrices && { text: formatPrice(product.price) }),
        image: product.image,
        href: productHref(product.slug),
      }))}
      data-testid="product-similar"
    />
  )
}
