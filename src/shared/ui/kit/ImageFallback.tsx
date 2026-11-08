'use client'

import { useEffect } from 'react'

import { initImageFallback } from '@kewinmarchand/boilerplates-ui/vanilla'

/** Fond de remplacement des images `bui-picture` en échec, y compris celles du rendu serveur échouées avant l'hydratation. */
export const ImageFallback = () => {
  useEffect(() => initImageFallback(), [])
  return null
}
