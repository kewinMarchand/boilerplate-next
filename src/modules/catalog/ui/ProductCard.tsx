'use client'

import { Badge } from '@kewinmarchand/boilerplates-ui/react'

import { format, useDictionary } from '@/shared/i18n'
import { AfterHydration, Link, Picture } from '@/shared/ui/kit'

import { productHref } from '../domain/catalog'
import { formatPrice } from '../domain/price'
import styles from './ProductCard.module.css'

import type { Catalog } from '../domain/catalog'

interface ProductCardProps {
  product: Catalog.Product
  position: number
  isPriority: boolean
  /** `false` quand la vente en ligne est coupée. */
  showPrice?: boolean
}

export const PRODUCT_IMAGE_SIZES = '(min-width: 1024px) 300px, (min-width: 600px) 50vw, 100vw'

export const ProductCard = ({
  product,
  position,
  isPriority,
  showPrice = true,
}: ProductCardProps) => {
  const t = useDictionary()
  const placeholder = <div className={styles.placeholder} />
  const image = product.image && (
    <Picture
      image={product.image}
      sizes={PRODUCT_IMAGE_SIZES}
      loading={isPriority ? 'eager' : 'lazy'}
      fetchPriority={position === 1 ? 'high' : 'low'}
      style={{ display: 'block', width: '100%', height: 'auto' }}
    />
  )

  return (
    <article
      id={`produit-${position}`}
      data-testid="catalog-product"
      className={`bui-card ${styles.card}`}
    >
      <div className={styles.layout}>
        {!image ? (
          placeholder
        ) : isPriority ? (
          image
        ) : (
          // Au-delà des premières, l'image attend l'hydratation pour laisser la bande passante à l'image LCP.
          <AfterHydration placeholder={placeholder}>{image}</AfterHydration>
        )}
        <div className={styles.body}>
          <h2 className={`bui-text bui-text--h3 ${styles.name}`}>
            <Link
              href={productHref(product.slug)}
              className={`bui-link ${styles.link}`}
              data-testid="catalog-product-link"
            >
              {product.name}
            </Link>
          </h2>
          {showPrice && (
            <p className={`bui-text ${styles.price}`} data-testid="catalog-product-price">
              {formatPrice(product.price, t.language.tag)}
            </p>
          )}
          <p className={`bui-text bui-text--body-sm ${styles.meta}`}>
            {format(t.catalog.cardMeta, {
              exposure: t.catalog.exposures[product.exposure],
              size: product.size,
            })}
          </p>
          {!product.inStock && (
            <p className={styles.stock}>
              <Badge>{t.catalog.outOfStock}</Badge>
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
