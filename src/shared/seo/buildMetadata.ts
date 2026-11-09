import { SITE } from '@/shared/config'
import { dictionaryFor } from '@/shared/i18n/dictionaries'
import { localizePath, samePathInEveryLocale } from '@/shared/i18n/locale'

import type { LanguageAlternate, LocaleContext } from '@/shared/i18n/locale'
import type { Metadata } from 'next'

export interface OgImage {
  url: string
  width: number
  height: number
  alt: string
}

/** Référencement saisi dans l'admin, chaînes vides et `null` quand rien n'est saisi. */
export interface SeoSettings {
  /** Titre complet, sans le nom du site ajouté. */
  title: string
  description: string
  /** Sert quand la page n'a pas d'image propre. */
  shareImage: OgImage | null
  /** Langue de la page et langues du site ; absent, site monolingue. */
  locale?: LocaleContext
}

const DEFAULT_OG_IMAGE: OgImage = {
  url: '/images/og-image.jpg',
  width: 1200,
  height: 630,
  alt: SITE.name,
}

interface PageSeo {
  title: string
  description: string
  /** Chemin sans préfixe de langue. */
  path: string
  noindex?: boolean
  image?: OgImage
  settings?: SeoSettings
  isAbsoluteTitle?: boolean
  /** Page d'article : `og:type` article et date de publication (AAAA-MM-JJ). */
  publishedTime?: string
  /** Page détaillée : l'élément dans chaque langue (`alternates` de l'API). Sinon le même chemin partout. */
  alternates?: LanguageAlternate[]
}

/** `hreflang` de chaque langue où la page existe, plus `x-default` vers la langue par défaut. */
const languageAlternates = (locale: LocaleContext, alternates: LanguageAlternate[]) => {
  const languages = Object.fromEntries(
    alternates.map(({ locale: code, path }) => [
      code,
      localizePath(path, code, locale.defaultLocale),
    ]),
  )
  const fallback = alternates.find((alternate) => alternate.locale === locale.defaultLocale)
  return fallback ? { ...languages, 'x-default': fallback.path } : languages
}

export const buildMetadata = ({
  title: pageTitle,
  description: pageDescription,
  path: pagePath,
  noindex = false,
  image: pageImage,
  isAbsoluteTitle = false,
  publishedTime,
  settings,
  alternates,
}: PageSeo): Metadata => {
  const title = settings?.title || pageTitle
  const description = settings?.description || pageDescription
  const image = pageImage ?? settings?.shareImage ?? DEFAULT_OG_IMAGE
  const locale = settings?.locale
  const isMultilingual = !!locale && locale.locales.length > 1
  const path = locale ? localizePath(pagePath, locale.locale, locale.defaultLocale) : pagePath
  const language = dictionaryFor(locale?.locale ?? '').language
  return {
    title: isAbsoluteTitle || settings?.title ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
      ...(isMultilingual && {
        languages: languageAlternates(
          locale,
          alternates ?? samePathInEveryLocale(locale, pagePath),
        ),
      }),
    },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      ...(publishedTime ? { type: 'article', publishedTime } : { type: 'website' }),
      title,
      description,
      url: path,
      locale: language.ogLocale,
      ...(isMultilingual && {
        alternateLocale: (alternates?.map((alternate) => alternate.locale) ?? locale.locales)
          .filter((code) => code !== locale.locale)
          .map((code) => dictionaryFor(code).language.ogLocale),
      }),
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  }
}
