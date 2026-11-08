import { AddToCartButton } from '@/modules/cart'
import { buildProductMetadata, listProductPaths, ProductView } from '@/modules/catalog'
import { getSeoSettings } from '@/modules/site'

import type { Metadata } from 'next'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

/** Fiches pré-rendues au build (régénérées comme le reste, toutes les 5 minutes) ; un produit ajouté depuis est rendu à la demande. */
export async function generateStaticParams() {
  return (await listProductPaths()).map((path) => ({ slug: path.split('/').at(-1) }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const [{ slug }, settings] = await Promise.all([params, getSeoSettings()])
  return buildProductMetadata(slug, settings)
}

export default async function ProductPage({ params }: ProductPageProps) {
  return (
    <ProductView
      slug={(await params).slug}
      purchase={(product) => (
        <AddToCartButton
          item={{ slug: product.slug, name: product.name, price: product.price }}
          isAvailable={product.inStock}
        />
      )}
    />
  )
}
