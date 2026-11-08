import { Alert, Skeleton } from '@kewinmarchand/boilerplates-ui/react'

import { Link } from '@/shared/ui/kit'

import { ProductCard } from './ProductCard'
import styles from './ProductResults.module.css'
import { TitleFocusLink } from './TitleFocusLink'

import type { Catalog } from '../domain/catalog'

interface ProductResultsProps {
  status: 'pending' | 'error' | 'success'
  products: Catalog.Product[] | undefined
  view: Catalog.View
  errorMessage?: string
  retryHref?: string
  clearHref?: string
  salesEnabled?: boolean
}

const PRIORITY_COUNT = 4

const listClass = (view: Catalog.View) => (view === 'liste' ? styles.list : styles.grid)

export const ProductResults = ({
  status,
  products,
  view,
  errorMessage,
  retryHref = '',
  clearHref = '',
  salesEnabled = true,
}: ProductResultsProps) => {
  if (status === 'pending') {
    return (
      <div
        role="status"
        aria-label="Chargement des produits"
        aria-busy="true"
        className={listClass(view)}
      >
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <Skeleton key={key} height="320px" />
        ))}
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div data-testid="catalog-error">
        <Alert
          variant="error"
          action={
            <Link
              href={retryHref}
              className="bui-button bui-button--ghost"
              data-testid="catalog-retry"
            >
              Réessayer
            </Link>
          }
        >
          {errorMessage}
        </Alert>
      </div>
    )
  }

  if (!products?.length) {
    return (
      <div data-testid="catalog-empty">
        <Alert>
          Aucun produit ne correspond à ces filtres.{' '}
          <TitleFocusLink href={clearHref} data-testid="catalog-clear-filters" className="bui-link">
            Tout effacer
          </TitleFocusLink>
        </Alert>
      </div>
    )
  }

  return (
    <ul className={listClass(view)}>
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            position={index + 1}
            isPriority={index < PRIORITY_COUNT}
            showPrice={salesEnabled}
          />
        </li>
      ))}
    </ul>
  )
}
