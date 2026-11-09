'use client'

import { usePathname } from 'next/navigation'
import { createContext, useContext } from 'react'

import { dictionaryFor, localizePath, MONOLINGUAL } from './locale'

import type { LocaleContext } from './locale'
import type { ReactNode } from 'react'

const Context = createContext<LocaleContext>(MONOLINGUAL)

interface LocaleProviderProps {
  value: LocaleContext
  children: ReactNode
}

/** Langue de la page pour les composants client, posée par le layout racine. */
export const LocaleProvider = ({ value, children }: LocaleProviderProps) => (
  <Context.Provider value={value}>{children}</Context.Provider>
)

export const useLocale = () => useContext(Context)

export const useDictionary = () => dictionaryFor(useContext(Context).locale)

/** Préfixe de la langue de la page sur un chemin interne. */
export const useLocalizePath = () => {
  const { locale, defaultLocale } = useContext(Context)
  return (path: string) => localizePath(path, locale, defaultLocale)
}

/**
 * Chemin public de la page (`/en/catalogue`, `/catalogue`). Au pré-rendu, `usePathname` donne le
 * chemin interne réécrit par le proxy (`/fr/catalogue`) : le segment de la langue par défaut est retiré.
 */
export const usePagePathname = () => {
  const pathname = usePathname()
  const { locale, defaultLocale } = useContext(Context)
  const internal = `/${defaultLocale}`
  if (locale !== defaultLocale) return pathname
  if (pathname === internal) return '/'
  return pathname.startsWith(`${internal}/`) ? pathname.slice(internal.length) : pathname
}
