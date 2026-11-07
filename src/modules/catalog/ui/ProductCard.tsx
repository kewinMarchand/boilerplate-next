import { Badge } from '@kewinmarchand/boilerplates-ui/react'

import { AfterHydration, Picture } from '@/shared/ui/kit'

import { formatPrice } from '../domain/price'
import { EXPOSURE_LABELS } from './labels'
import styles from './ProductCard.module.css'

import type { Catalog } from '../domain/catalog'

interface ProductCardProps {
  product: Catalog.Product
  position: number
  isPriority: boolean
}

export const PRODUCT_IMAGE_SIZES = '(min-width: 1024px) 300px, (min-width: 600px) 50vw, 100vw'

export const ProductCard = ({ product, position, isPriority }: ProductCardProps) => {
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
          <h2 className={`bui-text bui-text--h3 ${styles.name}`}>{product.name}</h2>
          <p className={`bui-text ${styles.price}`} data-testid="catalog-product-price">
            {formatPrice(product.price)}
          </p>
          <p className={`bui-text bui-text--body-sm ${styles.meta}`}>
            Exposition : {EXPOSURE_LABELS[product.exposure]} · Taille {product.size}
          </p>
          {!product.inStock && (
            <p className={styles.stock}>
              <Badge>Rupture de stock</Badge>
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
