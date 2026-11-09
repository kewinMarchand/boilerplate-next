import { withoutPriceCriteria } from '../domain/catalogQuery'
import { resolveCategoryPath, subcategoryLinks } from '../domain/categoryPath'
import { parseCatalogQuery } from '../domain/parseCatalogQuery'
import { findCatalogPage, findCategoryTree } from '../infrastructure/catalogRepository'

import type { Catalog } from '../domain/catalog'
import type { SearchParams } from '../domain/catalogQuery'
import type { CatalogPage } from '../infrastructure/catalogRepository'

export type CatalogPageResult = { status: 'success'; page: CatalogPage } | { status: 'error' }

export type CatalogPageLoad =
  | { status: 'not-found' }
  | {
      status: 'ok'
      query: Catalog.Query
      categoryPath: Catalog.CategoryPath
      subcategories: Catalog.CategoryPathLink[]
      result: CatalogPageResult
    }

const unavailable = (error: unknown): CatalogPageResult => {
  console.error(error)
  return { status: 'error' }
}

/**
 * Cas d'utilisation « afficher une page du catalogue » : valide le chemin contre l'arbre, lit
 * l'état de recherche, interroge le dépôt, puis décide. Catégorie inconnue ou page au-delà de la
 * dernière : introuvable. Échec de l'API : résultat en erreur, que l'interface affiche avec une
 * relance (à la racine du catalogue si l'arbre lui-même n'a pas pu être lu).
 */
export const loadCatalogPage = async (
  slugs: string[],
  searchParams: SearchParams,
  salesEnabled: boolean,
  locale: string,
): Promise<CatalogPageLoad> => {
  const parsed = parseCatalogQuery(searchParams)
  const query = salesEnabled ? parsed : withoutPriceCriteria(parsed)

  let tree: Catalog.Category[]
  try {
    tree = await findCategoryTree(locale)
  } catch (error) {
    return { status: 'ok', query, categoryPath: [], subcategories: [], result: unavailable(error) }
  }

  const categoryPath = resolveCategoryPath(tree, slugs)
  if (!categoryPath) return { status: 'not-found' }

  const base = {
    status: 'ok' as const,
    query,
    categoryPath,
    subcategories: subcategoryLinks(tree, slugs),
  }

  let page: CatalogPage
  try {
    page = await findCatalogPage(slugs, query, locale)
  } catch (error) {
    return { ...base, result: unavailable(error) }
  }
  if (query.page > page.pageCount) return { status: 'not-found' }
  return { ...base, result: { status: 'success', page } }
}
