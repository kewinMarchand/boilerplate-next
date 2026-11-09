import { en } from './dictionaries/en'
import { fr } from './dictionaries/fr'

import type { Dictionary } from './dictionaries/dictionary'

/** Langue des libellés quand une langue activée n'a pas de fichier de traduction. */
export const FALLBACK_LOCALE = 'fr'

const DICTIONARIES: Record<string, Dictionary> = { fr, en }

export const dictionaryFor = (locale: string): Dictionary => DICTIONARIES[locale] ?? fr

/** Langue de la page et langues du site (`locales` de l'identité, la première est la langue par défaut). */
export interface LocaleContext {
  locale: string
  defaultLocale: string
  locales: string[]
}

export const MONOLINGUAL: LocaleContext = {
  locale: FALLBACK_LOCALE,
  defaultLocale: FALLBACK_LOCALE,
  locales: [FALLBACK_LOCALE],
}

/** Un élément dans une langue : chemin sans préfixe de langue (`/produit/swiss-cheese-plant`). */
export interface LanguageAlternate {
  locale: string
  path: string
}

const isInternalPath = (path: string) => path.startsWith('/') && !path.startsWith('//')

/** Chemin dans une langue : sans préfixe pour la langue par défaut, `/en/...` pour les autres. */
export const localizePath = (path: string, locale: string, defaultLocale: string) => {
  if (locale === defaultLocale || !isInternalPath(path)) return path
  return path === '/' ? `/${locale}` : `/${locale}${path}`
}

/**
 * Chemin interne de l'App Router (`/<langue>/...`) d'une adresse publique : un préfixe de langue
 * activée autre que la langue par défaut est gardé, tout le reste passe sous la langue par défaut.
 * Un préfixe inconnu ou celui de la langue par défaut finit donc en 404.
 */
export const internalPath = (pathname: string, locales: string[]) => {
  const [defaultLocale = FALLBACK_LOCALE, ...prefixed] = locales
  const first = pathname.split('/')[1] ?? ''
  if (prefixed.includes(first)) return pathname
  return pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`
}

/**
 * Une entrée par langue du site, dans l'ordre de `locales` : l'équivalent donné par `alternates`,
 * sinon `fallback` (l'accueil pour une page détaillée sans équivalent).
 */
export const languageLinks = (
  { locales, defaultLocale }: LocaleContext,
  alternates: LanguageAlternate[],
  fallback = '/',
) =>
  locales.map((locale) => ({
    locale,
    href: localizePath(
      alternates.find((alternate) => alternate.locale === locale)?.path ?? fallback,
      locale,
      defaultLocale,
    ),
  }))

/** Même chemin dans chaque langue : pages fixes, dont les segments ne se traduisent pas. */
export const samePathInEveryLocale = ({ locales }: LocaleContext, path: string) =>
  locales.map((locale) => ({ locale, path }))

interface LocaleEntries {
  locale: string
  entries: { key: string; path: string }[]
}

/**
 * Un groupe par élément (sitemap) : son chemin dans chaque langue, associé par `key` (identifiant
 * de l'API), dans l'ordre de la première langue, la langue par défaut.
 */
export const alternatesByKey = ([first, ...others]: LocaleEntries[]): LanguageAlternate[][] =>
  first
    ? first.entries.map(({ key, path }) => [
        { locale: first.locale, path },
        ...others.flatMap(({ locale, entries }) => {
          const match = entries.find((entry) => entry.key === key)
          return match ? [{ locale, path: match.path }] : []
        }),
      ])
    : []

/** Nom d'une langue dans cette langue (« Français », « English »), pour le sélecteur. */
export const languageName = (locale: string) => {
  const name = new Intl.DisplayNames([locale], { type: 'language' }).of(locale) ?? locale
  return name.charAt(0).toUpperCase() + name.slice(1)
}
