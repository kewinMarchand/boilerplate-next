'use client'

import { createContext, useContext } from 'react'

import { localizePath, MONOLINGUAL } from './locale'

import type { ClientDictionary } from './dictionaries/dictionary'
import type { LocaleContext } from './locale'
import type { ReactNode } from 'react'

interface ClientLocale extends LocaleContext {
  /** Sections du document et de la page. Absent hors du layout racine (page d'erreur globale). */
  dictionary?: Partial<ClientDictionary>
}

export const Context = createContext<ClientLocale>(MONOLINGUAL)

interface LocaleProviderProps {
  value: LocaleContext
  /** Sections du document, passées par le serveur : le navigateur ne charge aucun dictionnaire. */
  dictionary: Partial<ClientDictionary>
  children: ReactNode
}

/** Langue de la page pour les composants client, posée par le layout racine. */
export const LocaleProvider = ({ value, dictionary, children }: LocaleProviderProps) => (
  <Context.Provider value={{ ...value, dictionary }}>{children}</Context.Provider>
)

interface PageSectionsProviderProps {
  sections: Partial<ClientDictionary>
  children: ReactNode
}

/** Ajoute aux sections du document celles que lisent les composants client d'une page (`PageDictionary`). */
export const PageSectionsProvider = ({ sections, children }: PageSectionsProviderProps) => {
  const parent = useContext(Context)
  return (
    <Context.Provider value={{ ...parent, dictionary: { ...parent.dictionary, ...sections } }}>
      {children}
    </Context.Provider>
  )
}

export const useLocale = (): LocaleContext => useContext(Context)

export const useDictionary = (): ClientDictionary => {
  const { dictionary } = useContext(Context)
  if (!dictionary) throw new Error('useDictionary demande LocaleProvider (layout racine).')
  // Une section que ni le document ni la page n'ont posée manque : son composant échoue au rendu, ce
  // que le build (pages pré-rendues) et les e2e (dictionnaire.e2e.ts, pages dynamiques) détectent
  return dictionary as ClientDictionary
}

/** Préfixe de la langue de la page sur un chemin interne. */
export const useLocalizePath = () => {
  const { locale, defaultLocale } = useContext(Context)
  return (path: string) => localizePath(path, locale, defaultLocale)
}
