'use client'

import { useId } from 'react'

import { Checkbox } from '@kewinmarchand/boilerplates-ui/react'

import { useDictionary } from '@/shared/i18n'
import { useOppositionMesure } from '@/shared/observability'

/** Case d'opposition à la mesure d'audience, gardée dans ce navigateur (fiche CNIL n° 17). */
export const OppositionMesure = () => {
  const t = useDictionary().legal
  const { refusee, changer } = useOppositionMesure()
  const inputId = useId()

  return (
    <>
      <Checkbox
        id={inputId}
        label={t.oppositionLabel}
        checked={refusee}
        onChange={(event) => changer(event.target.checked)}
        data-testid="legal-opposition-mesure"
      />
      <p className="bui-text" role="status" aria-live="polite" data-testid="legal-opposition-etat">
        {refusee ? t.refused : t.measured}
      </p>
    </>
  )
}
