'use client'

import { Button } from '@kewinmarchand/boilerplates-ui/react'

import { useDictionary } from '@/shared/i18n'
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
  const t = useDictionary()
  const { lines, changeQuantity, remove } = useCart()
  const { listRef, emptyRef, markRemoved } = useFocusAfterRemoval(lines.length)

  if (!useHydrated()) return null

  if (lines.length === 0) {
    return (
      <p ref={emptyRef} tabIndex={-1} data-testid="cart-empty">
        {t.cart.empty}{' '}
        <Link href={CATALOG_PATH} className="bui-link">
          {t.cart.browseCatalog}
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
            <span>{t.cart.unitPrice(formatPrice(line.price, t.language.tag))}</span>
            <label className={styles.quantity}>
              <span>{t.cart.quantityOf(line.name)}</span>
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
            <span className={styles.subtotal}>
              {formatPrice(line.price * line.quantity, t.language.tag)}
            </span>
            <Button
              variant="outline"
              aria-label={t.cart.removeItem(line.name)}
              onClick={() => {
                markRemoved(index)
                remove(line.slug)
              }}
              data-testid="cart-remove"
            >
              {t.cart.remove}
            </Button>
          </li>
        ))}
      </ul>
      <p className={styles.total}>
        {t.cart.total}
        <span data-testid="cart-total">{formatPrice(totalPrice(lines), t.language.tag)}</span>
      </p>
      <p>{t.cart.soon}</p>
    </>
  )
}
