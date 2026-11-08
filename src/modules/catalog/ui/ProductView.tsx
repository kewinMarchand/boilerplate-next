import { notFound } from 'next/navigation'

import { Alert, Badge } from '@kewinmarchand/boilerplates-ui/react'

import { JsonLd, productJsonLd } from '@/shared/seo'
import { largestWebp, Link, Picture } from '@/shared/ui/kit'
import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { ProductLoadError } from '../application/ProductLoadError'
import { loadProduct } from '../application/products'
import { productHref } from '../domain/catalog'
import { CATALOG_ROOT_PATH, categoryTrail } from '../domain/categoryPath'
import { formatPrice } from '../domain/price'
import { EXPOSURE_LABELS } from './labels'
import styles from './ProductView.module.css'
import { SimilarProducts } from './SimilarProducts'

import type { Catalog } from '../domain/catalog'
import type { ReactNode } from 'react'

const IMAGE_SIZES = '(min-width: 1440px) 680px, (min-width: 768px) 50vw, calc(100vw - 32px)'

interface ProductViewProps {
  slug: string
  /** Bouton d'achat, fourni par la couche de routage (module panier). */
  purchase?: (product: Catalog.ProductDetail) => ReactNode
}

/** Fiche d'un produit, lue dans l'API : image, prix, description, caractéristiques et chemin de sa catégorie. */
export const ProductView = async ({ slug, purchase }: ProductViewProps) => {
  const product = await loadProduct(slug).catch((error: unknown) => {
    console.error(error)
    return undefined
  })

  if (product === null) notFound()

  if (product === undefined) {
    return (
      <PageContainer
        breadcrumb={buildBreadcrumb(CATALOG_ROOT_PATH, [
          { label: 'Produit', href: productHref(slug) },
        ])}
      >
        <h1 className="bui-text bui-text--h1">Produit</h1>
        <div data-testid="product-error">
          <Alert variant="error">{new ProductLoadError().message}</Alert>
        </div>
      </PageContainer>
    )
  }

  const path = productHref(product.slug)
  const category = product.categoryPath.at(-1)

  return (
    <PageContainer
      breadcrumb={buildBreadcrumb(CATALOG_ROOT_PATH, [
        ...categoryTrail(product.categoryPath),
        { label: product.name, href: path },
      ])}
    >
      <article className={styles.product} data-testid="product-page">
        {product.image && (
          <Picture
            image={product.image}
            sizes={IMAGE_SIZES}
            isPriority
            style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8 }}
          />
        )}
        <div>
          <h1 className={`bui-text bui-text--h1 ${styles.title}`} data-testid="product-title">
            {product.name}
          </h1>
          <p className={`bui-text bui-text--lead ${styles.price}`} data-testid="product-price">
            {formatPrice(product.price)}
          </p>
          {product.description.length > 0 && (
            <div data-testid="product-description">
              {product.description.map((paragraph) => (
                <p key={paragraph} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}
          <dl className={styles.features}>
            <dt>Exposition</dt>
            <dd>{EXPOSURE_LABELS[product.exposure]}</dd>
            <dt>Taille</dt>
            <dd>{product.size}</dd>
            <dt>Disponibilité</dt>
            <dd>{product.inStock ? 'En stock' : <Badge>Rupture de stock</Badge>}</dd>
          </dl>
          {purchase?.(product)}
          {category && (
            <p>
              <Link href={category.href} className="bui-link">
                Voir les autres produits : {category.name}
              </Link>
            </p>
          )}
        </div>
      </article>
      <div className={styles.similar}>
        <SimilarProducts categorySlug={product.categorySlug} productSlug={product.slug} />
      </div>
      <JsonLd
        data={productJsonLd({
          name: product.name,
          description: product.description.join(' '),
          path,
          sku: product.slug,
          category: category?.name,
          image: product.image ? largestWebp(product.image) : undefined,
          price: (product.price / 100).toFixed(2),
          inStock: product.inStock,
        })}
      />
    </PageContainer>
  )
}
