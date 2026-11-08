import { useRef, useState } from 'react'

import type { KeyboardEvent } from 'react'

const STEPS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 }

/** Image affichée de la galerie ; flèches gauche et droite d'une vignette à l'autre, en boucle. */
export const useProductGallery = (count: number) => {
  const [selected, setSelected] = useState(0)
  const thumbsRef = useRef<HTMLUListElement>(null)

  const onThumbKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = STEPS[event.key]
    if (!step) return
    event.preventDefault()
    const next = (index + step + count) % count
    setSelected(next)
    thumbsRef.current?.querySelectorAll('button')[next]?.focus()
  }

  return { selected, select: setSelected, thumbsRef, onThumbKeyDown }
}
