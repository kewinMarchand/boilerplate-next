import { dictionarySections } from './dictionaries'
import { PageSectionsProvider } from './LocaleProvider'
import { getDictionary } from './server'

import type { ClientSection } from './dictionaries/dictionary'
import type { ReactNode } from 'react'

interface PageDictionaryProps {
  /** Sections lues par les composants client de la page, en plus de celles du document. */
  sections: readonly ClientSection[]
  children: ReactNode
}

/**
 * Sections du dictionnaire propres à une page, posées par la couche de routage : elles ne partent
 * qu'avec cette page (HTML ou charge de navigation), le layout n'envoie que celles du document.
 */
export const PageDictionary = async ({ sections, children }: PageDictionaryProps) => (
  <PageSectionsProvider sections={dictionarySections(await getDictionary(), sections)}>
    {children}
  </PageSectionsProvider>
)
