import { useEffect, useRef } from 'react'

/**
 * Après un retrait, le focus va au bouton « Retirer » de la ligne qui prend la place, sinon de la
 * précédente, sinon au message de panier vide : sans cela, il retombe en haut de la page.
 */
export const useFocusAfterRemoval = (lineCount: number) => {
  const listRef = useRef<HTMLUListElement>(null)
  const emptyRef = useRef<HTMLParagraphElement>(null)
  const removedIndex = useRef<number | null>(null)

  useEffect(() => {
    if (removedIndex.current === null) return
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>(':scope > li button')
    const target = buttons?.[Math.min(removedIndex.current, lineCount - 1)] ?? emptyRef.current
    target?.focus()
    removedIndex.current = null
  }, [lineCount])

  return {
    listRef,
    emptyRef,
    markRemoved: (index: number) => {
      removedIndex.current = index
    },
  }
}
