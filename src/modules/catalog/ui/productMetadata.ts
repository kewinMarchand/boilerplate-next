import { buildMetadata } from '@/shared/seo'
import { largestWebp } from '@/shared/ui/kit'

import { loadProduct } from '../application/products'
import { productHref } from '../domain/catalog'
import { formatPrice } from '../domain/price'
import { EXPOSURE_LABELS } from './labels'

import type { SeoSettings } from '@/shared/seo'

export const buildProductMetadata = async (
  slug: string,
  settings: SeoSettings,
  salesEnabled = true,
) => {
  // API indisponible : métadonnées génériques, la page affiche l'erreur.
  const product = await loadProduct(slug).catch(() => undefined)
  if (product === null) return { title: 'Page introuvable', robots: { index: false, follow: true } }
  if (product === undefined) return { title: 'Produit', robots: { index: false, follow: true } }

  return buildMetadata({
    title: product.name,
    description: `${product.name} : exposition ${EXPOSURE_LABELS[product.exposure].toLowerCase()}, taille ${product.size}${salesEnabled ? `, ${formatPrice(product.price)}` : ''}. ${product.inStock ? 'En stock' : 'En rupture de stock'}, rayon ${product.categoryPath.at(-1)?.name ?? 'catalogue'}.`,
    path: productHref(product.slug),
    settings: { ...settings, title: product.metaTitle, description: product.metaDescription },
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
