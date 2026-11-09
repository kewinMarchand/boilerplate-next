import { cache } from 'react'

import { SITE } from '@/shared/config'
import { FALLBACK_LOCALE } from '@/shared/i18n'

import { findSiteIdentity } from '../infrastructure/siteIdentityRepository'

import type { SiteIdentity } from '../domain/siteIdentity'
import type { LocaleContext } from '@/shared/i18n'

const FALLBACK: SiteIdentity.Entity = {
  name: SITE.name,
  tagline: SITE.description,
  logo: null,
  icon: null,
  shareImage: null,
  defaultColorScheme: 'auto',
  theme: null,
  salesEnabled: SITE.salesEnabled,
  locales: [FALLBACK_LOCALE],
}

/**
 * Lue une fois par rendu et par langue (layout, métadonnées et page la partagent), sans en-tête de
 * requête : les pages restent statiques et se régénèrent avec elles. API en erreur : la
 * configuration du site. Sans `locale` (manifeste, feuille de couleurs) : langue par défaut.
 */
export const getSiteIdentity = cache((locale?: string) =>
  findSiteIdentity(locale).catch((error: unknown) => {
    console.error(error)
    return FALLBACK
  }),
)

/**
 * Langue de la page (`getLocale()` du socle) et langues du site, pour les liens, le SEO et le
 * sélecteur. Le module ne lit pas lui-même le segment `[lang]` : son index est importé par
 * `src/proxy.ts`, où `next/root-params` n'existe pas.
 */
export const getLocaleContext = cache(async (locale: string): Promise<LocaleContext> => {
  const { locales } = await getSiteIdentity(locale)
  return { locale, locales, defaultLocale: locales[0] ?? locale }
})
