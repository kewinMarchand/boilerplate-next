'use client'

import { usePathname } from 'next/navigation'
import { useContext } from 'react'

import { Context } from './LocaleProvider'

// Fichier à part : le contexte de langue, lu par chaque lien, n'embarque pas next/navigation.
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
