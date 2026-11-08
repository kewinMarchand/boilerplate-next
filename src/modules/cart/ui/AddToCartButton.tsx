'use client'

import { useState } from 'react'

import { Button } from '@kewinmarchand/boilerplates-ui/react'

import { useHydrated } from '@/shared/ui/hooks/useHydrated'
import { Link } from '@/shared/ui/kit'

import { CART_PATH } from './cartPath'
import { useCart } from './useCart'

import type { Cart } from '../domain/cart'

interface AddToCartButtonProps {
  item: Cart.Item
  isAvailable: boolean
}

/** Ajoute une unité du produit ; désactivé en rupture de stock. Absent sans JavaScript, le panier en dépend. */
export const AddToCartButton = ({ item, isAvailable }: AddToCartButtonProps) => {
  const { add } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  if (!useHydrated()) return null

  return (
    <div>
      <Button
        disabled={!isAvailable}
        onClick={() => {
          add(item)
          setIsAdded(true)
        }}
        data-testid="add-to-cart"
      >
        Ajouter au panier
      </Button>
      <p role="status" data-testid="add-to-cart-status">
        {isAdded && (
          <>
            {item.name} ajouté au panier.{' '}
            <Link href={CART_PATH} className="bui-link">
              Voir le panier
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
