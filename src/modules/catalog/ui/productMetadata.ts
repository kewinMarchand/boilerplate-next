import { buildMetadata } from '@/shared/seo'
import { largestWebp } from '@/shared/ui/kit'

import { loadProduct } from '../application/products'
import { productHref } from '../domain/catalog'
import { formatPrice } from '../domain/price'
import { EXPOSURE_LABELS } from './labels'

export const buildProductMetadata = async (slug: string) => {
  // API indisponible : métadonnées génériques, la page affiche l'erreur.
  const product = await loadProduct(slug).catch(() => undefined)
  if (product === null) return { title: 'Page introuvable', robots: { index: false, follow: true } }
  if (product === undefined) return { title: 'Produit', robots: { index: false, follow: true } }

  return buildMetadata({
    title: product.name,
    description: `${product.name} : exposition ${EXPOSURE_LABELS[product.exposure].toLowerCase()}, taille ${product.size}, ${formatPrice(product.price)}. ${product.inStock ? 'En stock' : 'En rupture de stock'}, rayon ${product.categoryPath.at(-1)?.name ?? 'catalogue'}.`,
    path: productHref(product.slug),
    ...(product.image && {
      image: {
        url: largestWebp(product.image),
        width: product.image.width,
        height: product.image.height,
        alt: product.image.alt || product.name,
      },
    }),
  })
}
