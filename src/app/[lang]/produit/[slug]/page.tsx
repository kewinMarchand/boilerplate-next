import { getLocale } from '@/shared/i18n/server'

import { AddToCartButton } from '@/modules/cart'
import { buildProductMetadata, listProductPaths, ProductView } from '@/modules/catalog'
import { ProductInquiryLink } from '@/modules/contact'
import { getLocaleContext, getSeoSettings, getSiteIdentity } from '@/modules/site'

import type { Metadata } from 'next'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

/** Fiches pré-rendues au build (régénérées comme le reste, toutes les 5 minutes) ; un produit ajouté depuis est rendu à la demande. */
export async function generateStaticParams() {
  return (await listProductPaths(await getLocale())).map((path) => ({
    slug: path.split('/').at(-1),
  }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const locale = await getLocale()
  const [{ slug }, settings, { salesEnabled }] = await Promise.all([
    params,
    getSeoSettings(locale),
    getSiteIdentity(locale),
  ])
  return buildProductMetadata(slug, settings, salesEnabled)
}

export default async function ProductPage({ params }: ProductPageProps) {
  const lang = await getLocale()
  const [{ slug }, { salesEnabled }, locale] = await Promise.all([
    params,
    getSiteIdentity(lang),
    getLocaleContext(lang),
  ])
  return (
    <ProductView
      slug={slug}
      salesEnabled={salesEnabled}
      locale={locale}
      purchase={(product) =>
        salesEnabled ? (
          <AddToCartButton
            item={{ slug: product.slug, name: product.name, price: product.price }}
            isAvailable={product.inStock}
          />
        ) : (
          <ProductInquiryLink slug={product.slug} name={product.name} />
        )
      }
    />
  )
}
