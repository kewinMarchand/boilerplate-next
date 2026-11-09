'use client'

import { plural, useDictionary } from '@/shared/i18n'
import { Icon, Link } from '@/shared/ui/kit'

import { countItems } from '../domain/cart'
import styles from './CartLink.module.css'
import { CART_PATH } from './cartPath'
import { useCart } from './useCart'

/**
 * Lien de l'en-tête vers le panier, avec le nombre d'articles (absent au rendu serveur).
 * Nom accessible « Panier, 3 articles » composé du texte visible et de compléments masqués : il contient le texte affiché.
 */
export const CartLink = () => {
  const {
    cart: t,
    language: { tag },
  } = useDictionary()
  const count = countItems(useCart().lines)

  return (
    <Link href={CART_PATH} className={styles.link} data-testid="cart-link">
      <Icon name="shopping-cart" />
      <span className={styles.label}>{t.link}</span>
      {count > 0 && (
        <>
          <span className="bui-visually-hidden">, </span>
          <span className={styles.count} data-testid="cart-count">
            {count}
          </span>
          <span className="bui-visually-hidden">{plural(t.itemCount, count, tag)}</span>
        </>
      )}
    </Link>
  )
}
