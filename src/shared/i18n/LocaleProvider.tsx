'use client'

import { createContext, useContext } from 'react'

import { localizePath, MONOLINGUAL } from './locale'

import type { ClientDictionary } from './dictionaries/dictionary'
import type { LocaleContext } from './locale'
import type { ReactNode } from 'react'

interface ClientLocale extends LocaleContext {
  /** Absent hors du layout racine (page d'erreur globale). */
  dictionary?: ClientDictionary
}

export const Context = createContext<ClientLocale>(MONOLINGUAL)

interface LocaleProviderProps {
  value: LocaleContext
  /** Le seul dictionnaire de la page, passé par le serveur : le navigateur ne charge pas les autres. */
  dictionary: ClientDictionary
  children: ReactNode
}

/** Langue de la page pour les composants client, posée par le layout racine. */
export const LocaleProvider = ({ value, dictionary, children }: LocaleProviderProps) => (
  <Context.Provider value={{ ...value, dictionary }}>{children}</Context.Provider>
)

export const useLocale = (): LocaleContext => useContext(Context)

export const useDictionary = (): ClientDictionary => {
  const { dictionary } = useContext(Context)
  if (!dictionary) throw new Error('useDictionary demande LocaleProvider (layout racine).')
  return dictionary
}

/** Préfixe de la langue de la page sur un chemin interne. */
export const useLocalizePath = () => {
  const { locale, defaultLocale } = useContext(Context)
  return (path: string) => localizePath(path, locale, defaultLocale)
}
