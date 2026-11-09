import { dictionaryFor, MONOLINGUAL } from '@/shared/i18n'
import { buildMetadata } from '@/shared/seo'
import { largestWebp } from '@/shared/ui/kit'

import { loadProduct } from '../application/products'
import { productHref } from '../domain/catalog'
import { formatPrice } from '../domain/price'

import type { SeoSettings } from '@/shared/seo'

export const buildProductMetadata = async (
  slug: string,
  settings: SeoSettings,
  salesEnabled = true,
) => {
  const { locale } = settings.locale ?? MONOLINGUAL
  const t = dictionaryFor(locale)
  // API indisponible : métadonnées génériques, la page affiche l'erreur.
  const product = await loadProduct(slug, locale).catch(() => undefined)
  if (product === null)
    return { title: t.errors.notFoundTitle, robots: { index: false, follow: true } }
  if (product === undefined) {
    return { title: t.product.fallbackTitle, robots: { index: false, follow: true } }
  }

  return buildMetadata({
    title: product.name,
    description: t.product.metaDescription({
      name: product.name,
      exposure: t.catalog.exposures[product.exposure],
      size: product.size,
      price: salesEnabled ? formatPrice(product.price, t.language.tag) : null,
      inStock: product.inStock,
      category: product.categoryPath.at(-1)?.name,
    }),
    path: productHref(product.slug),
    settings: { ...settings, title: product.metaTitle, description: product.metaDescription },
    alternates: product.alternates,
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
