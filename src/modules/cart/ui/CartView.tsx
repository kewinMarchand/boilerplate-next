'use client'

import { Button } from '@kewinmarchand/boilerplates-ui/react'

import { format, useDictionary, useLocale } from '@/shared/i18n'
import { useHydrated } from '@/shared/ui/hooks/useHydrated'
import { Link } from '@/shared/ui/kit'

import { lineIn, totalPrice } from '../domain/cart'
import { formatPrice } from '../domain/price'
import styles from './CartView.module.css'
import { useCart } from './useCart'
import { useFocusAfterRemoval } from './useFocusAfterRemoval'

import type { Cart } from '../domain/cart'

const CATALOG_PATH = '/catalogue'
const productHref = (slug: string) => `/produit/${slug}`

const localized = (lines: Cart.Line[], locale: string) =>
  lines.map((line) => ({ ...line, ...lineIn(line, locale) }))

/** Contenu de la page panier : le panier n'existe que dans le navigateur, il est lu après l'hydratation. */
export const CartView = () => {
  const t = useDictionary()
  const { locale } = useLocale()
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
        {localized(lines, locale).map((line, index) => (
          <li key={line.id} className={styles.line} data-testid="cart-line">
            <Link href={productHref(line.slug)} className={`bui-link ${styles.name}`}>
              {line.name}
            </Link>
            <span>
              {format(t.cart.unitPrice, { price: formatPrice(line.price, t.language.tag) })}
            </span>
            <label className={styles.quantity}>
              <span>{format(t.cart.quantityOf, { name: line.name })}</span>
              <input
                type="number"
                min={1}
                max={99}
                value={line.quantity}
                onChange={(event) => {
                  const quantity = event.currentTarget.valueAsNumber
                  if (!Number.isNaN(quantity)) changeQuantity(line.id, quantity)
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
              aria-label={format(t.cart.removeItem, { name: line.name })}
              onClick={() => {
                markRemoved(index)
                remove(line.id)
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
