import { dictionaryFor, MONOLINGUAL } from '@/shared/i18n'
import { buildMetadata } from '@/shared/seo'

import { findCategoryAlternates, findCategoryPath } from '../application/catalogNavigation'
import { isFiltered, withoutPriceCriteria } from '../domain/catalogQuery'
import { categoryHref } from '../domain/categoryPath'
import { parseCatalogQuery } from '../domain/parseCatalogQuery'

import type { SearchParams } from '../domain/catalogQuery'
import type { SeoSettings } from '@/shared/seo'
import type { Metadata } from 'next'

export const buildCatalogMetadata = async (
  slugs: string[],
  searchParams: SearchParams,
  settings: SeoSettings,
  salesEnabled = true,
): Promise<Metadata> => {
  const { locale } = settings.locale ?? MONOLINGUAL
  const t = dictionaryFor(locale)
  // API indisponible : métadonnées de la racine du catalogue, la page affiche l'erreur.
  const [categoryPath, alternates] = await Promise.all([
    findCategoryPath(slugs, locale).catch(() => []),
    findCategoryAlternates(slugs, locale),
  ])
  if (!categoryPath)
    return { title: t.errors.notFoundTitle, robots: { index: false, follow: true } }

  const parsed = parseCatalogQuery(searchParams)
  const query = salesEnabled ? parsed : withoutPriceCriteria(parsed)
  const pageQuery = query.page > 1 ? `?page=${query.page}` : ''
  const name = categoryPath.at(-1)?.name

  return buildMetadata({
    // Vente coupée (section 27) : le prix n'est ni affiché ni filtrable, la description ne le cite pas
    title: name ? t.catalog.metaTitle(name) : t.catalog.rootMetaTitle,
    description: name
      ? t.catalog.categoryMetaDescription(name, salesEnabled)
      : t.catalog.rootMetaDescription(salesEnabled),
    path: `${categoryHref(slugs)}${pageQuery}`,
    noindex: isFiltered(query),
    // Titre et description saisis pour la page fixe « catalogue » : sa racine seulement
    settings: name ? { ...settings, title: '', description: '' } : settings,
    ...(name && {
      alternates: alternates.map((alternate) => ({
        ...alternate,
        path: `${alternate.path}${pageQuery}`,
      })),
    }),
  })
}
