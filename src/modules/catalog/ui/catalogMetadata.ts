import { buildMetadata } from '@/shared/seo'

import { findCategoryPath } from '../application/catalogNavigation'
import { isFiltered, withoutPriceCriteria } from '../domain/catalogQuery'
import { categoryHref } from '../domain/categoryPath'
import { parseCatalogQuery } from '../domain/parseCatalogQuery'

import type { SearchParams } from '../domain/catalogQuery'
import type { SeoSettings } from '@/shared/seo'
import type { Metadata } from 'next'

// Vente coupée (section 27) : le prix n'est ni affiché ni filtrable, la description ne le cite pas
const rootDescription = (salesEnabled: boolean) =>
  `Catalogue de démonstration d’une jardinerie tropicale : plantes d’intérieur, d’extérieur et aquatiques, filtrables par exposition, ${salesEnabled ? 'taille, prix et stock' : 'taille et stock'}.`

export const buildCatalogMetadata = async (
  slugs: string[],
  searchParams: SearchParams,
  settings: SeoSettings,
  salesEnabled = true,
): Promise<Metadata> => {
  // API indisponible : métadonnées de la racine du catalogue, la page affiche l'erreur.
  const categoryPath = await findCategoryPath(slugs).catch(() => [])
  if (!categoryPath) return { title: 'Page introuvable', robots: { index: false, follow: true } }

  const parsed = parseCatalogQuery(searchParams)
  const query = salesEnabled ? parsed : withoutPriceCriteria(parsed)
  const path = categoryHref(slugs)
  const name = categoryPath.at(-1)?.name
  const canonical = query.page > 1 ? `${path}?page=${query.page}` : path

  return buildMetadata({
    title: name ? `${name} · Catalogue` : 'Catalogue de plantes tropicales',
    description: name
      ? `${name} : sélection de plantes tropicales de démonstration, à filtrer par exposition, ${salesEnabled ? 'taille, prix et disponibilité' : 'taille et disponibilité'}, avec tri et pagination.`
      : rootDescription(salesEnabled),
    path: canonical,
    noindex: isFiltered(query),
    // Titre et description saisis pour la page fixe « catalogue » : sa racine seulement
    settings: name ? { ...settings, title: '', description: '' } : settings,
  })
}
