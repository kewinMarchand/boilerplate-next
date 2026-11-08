'use client'

import { Button } from '@kewinmarchand/boilerplates-ui/react'

import { useHydrated } from '@/shared/ui/hooks/useHydrated'
import { Link } from '@/shared/ui/kit'

import { totalPrice } from '../domain/cart'
import { formatPrice } from '../domain/price'
import styles from './CartView.module.css'
import { useCart } from './useCart'
import { useFocusAfterRemoval } from './useFocusAfterRemoval'

const CATALOG_PATH = '/catalogue'
const productHref = (slug: string) => `/produit/${slug}`

/** Contenu de la page panier : le panier n'existe que dans le navigateur, il est lu après l'hydratation. */
export const CartView = () => {
  const { lines, changeQuantity, remove } = useCart()
  const { listRef, emptyRef, markRemoved } = useFocusAfterRemoval(lines.length)

  if (!useHydrated()) return null

  if (lines.length === 0) {
    return (
      <p ref={emptyRef} tabIndex={-1} data-testid="cart-empty">
        Votre panier est vide.{' '}
        <Link href={CATALOG_PATH} className="bui-link">
          Parcourir le catalogue
        </Link>
      </p>
    )
  }

  return (
    <>
      <ul ref={listRef} className={styles.lines}>
        {lines.map((line, index) => (
          <li key={line.slug} className={styles.line} data-testid="cart-line">
            <Link href={productHref(line.slug)} className={`bui-link ${styles.name}`}>
              {line.name}
            </Link>
            <span>{formatPrice(line.price)} l’unité</span>
            <label className={styles.quantity}>
              <span>Quantité de {line.name}</span>
              <input
                type="number"
                min={1}
                max={99}
                value={line.quantity}
                onChange={(event) => {
                  const quantity = event.currentTarget.valueAsNumber
                  if (!Number.isNaN(quantity)) changeQuantity(line.slug, quantity)
                }}
                className="bui-input"
                data-testid="cart-quantity"
              />
            </label>
            <span className={styles.subtotal}>{formatPrice(line.price * line.quantity)}</span>
            <Button
              variant="outline"
              aria-label={`Retirer ${line.name}`}
              onClick={() => {
                markRemoved(index)
                remove(line.slug)
              }}
              data-testid="cart-remove"
            >
              Retirer
            </Button>
          </li>
        ))}
      </ul>
      <p className={styles.total}>
        Total : <span data-testid="cart-total">{formatPrice(totalPrice(lines))}</span>
      </p>
      <p>La commande en ligne arrive bientôt.</p>
    </>
  )
}
