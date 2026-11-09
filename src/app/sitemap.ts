import { SITE, SITE_MAP } from '@/shared/config'
import { localizePath } from '@/shared/i18n'

import { listArticlePathAlternates } from '@/modules/blog'
import { listCatalogPaths, listProductPathAlternates } from '@/modules/catalog'
import { getSiteIdentity } from '@/modules/site'

import type { LanguageAlternate } from '@/shared/i18n'
import type { MetadataRoute } from 'next'

export const revalidate = 300

/** Une entrée par adresse et par langue ; à plus d'une langue, chacune liste ses équivalents (`xhtml:link`). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { locales } = await getSiteIdentity()
  const [defaultLocale = ''] = locales
  const url = ({ locale, path }: LanguageAlternate) =>
    `${SITE.url}${localizePath(path, locale, defaultLocale)}`
  const [catalog, products, articles] = await Promise.all([
    listCatalogPaths(locales),
    listProductPathAlternates(locales),
    listArticlePathAlternates(locales),
  ])
  const pages = SITE_MAP.map(({ href }) => locales.map((locale) => ({ locale, path: href })))
  return [...pages, ...catalog, ...products, ...articles].flatMap((alternates) =>
    alternates.map((alternate) => ({
      url: url(alternate),
      ...(locales.length > 1 && {
        alternates: {
          languages: Object.fromEntries(alternates.map((item) => [item.locale, url(item)])),
        },
      }),
    })),
  )
}
