import { useMemo, useSyncExternalStore } from 'react'

import { addItem, removeItem, setQuantity } from '../domain/cart'
import { currentRawCart, parseCart, saveCart, subscribeToCart } from '../infrastructure/cartStorage'

import type { Cart } from '../domain/cart'

/** Panier du navigateur : vide au rendu serveur, lu au montage, partagé entre composants et onglets. */
export const useCart = () => {
  const raw = useSyncExternalStore(subscribeToCart, currentRawCart, () => null)
  const lines = useMemo(() => parseCart(raw), [raw])

  return {
    lines,
    add: (item: Cart.Item) => saveCart(addItem(parseCart(currentRawCart()), item)),
    changeQuantity: (slug: string, quantity: number) =>
      saveCart(setQuantity(parseCart(currentRawCart()), slug, quantity)),
    remove: (slug: string) => saveCart(removeItem(parseCart(currentRawCart()), slug)),
  }
}
