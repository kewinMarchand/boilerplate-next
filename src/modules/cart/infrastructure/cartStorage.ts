import { z } from 'zod'

import { MAX_QUANTITY } from '../domain/cart'

import type { Cart } from '../domain/cart'

const STORAGE_KEY = 'panier'
const CHANGE_EVENT = 'panier:change'

const linesSchema = z.array(
  z
    .object({
      id: z.string().min(1).optional(),
      slug: z.string().min(1),
      name: z.string().min(1),
      price: z.int().min(0),
      quantity: z.int().min(1).max(MAX_QUANTITY),
      translations: z
        .array(
          z.object({
            locale: z.string().min(1),
            slug: z.string().min(1),
            name: z.string().min(1),
          }),
        )
        .default([]),
    })
    // Panier enregistré avant les langues : sans identifiant ni traductions, le slug identifie la ligne.
    .transform(({ id, ...line }) => ({ ...line, id: id ?? line.slug })),
)

/** Panier enregistré ; vide si le stockage est indisponible, illisible ou invalide. */
export const parseCart = (raw: string | null): Cart.Line[] => {
  if (raw === null) return []
  try {
    const result = linesSchema.safeParse(JSON.parse(raw))
    return result.success ? result.data : []
  } catch {
    return []
  }
}

export const readRawCart = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

let memory: string | null = null

/** Valeur brute, gardée en mémoire si le stockage refuse l'écriture (navigation privée, quota). */
export const currentRawCart = () => readRawCart() ?? memory

export const saveCart = (lines: readonly Cart.Line[]) => {
  memory = JSON.stringify(lines)
  try {
    localStorage.setItem(STORAGE_KEY, memory)
  } catch {
    // Le panier vaut alors pour la page en cours.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** Prévient des changements de cet onglet et des autres (événement `storage`). */
export const subscribeToCart = (onChange: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) onChange()
  }
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onStorage)
  }
}
