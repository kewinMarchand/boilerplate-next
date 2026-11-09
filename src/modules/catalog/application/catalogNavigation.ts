import {
  categoryAlternates,
  listCategoryPaths,
  resolveCategoryPath,
  toCategoryMenu,
} from '../domain/categoryPath'
import { findCategoryTree } from '../infrastructure/catalogRepository'

import type { LanguageAlternate } from '@/shared/i18n'

/** API indisponible, au build compris : arbre vide, la page reste servie. */
const findCategoryTreeOrEmpty = (locale: string) =>
  findCategoryTree(locale).catch((error: unknown) => {
    console.error(error)
    return []
  })

export const getCategoryMenu = async (locale: string) =>
  toCategoryMenu(await findCategoryTreeOrEmpty(locale))

/**
 * Chemins des catégories pour le sitemap, chacun dans chaque langue du site (la première est la
 * langue par défaut, dont l'arbre donne les slugs des autres).
 */
export const listCatalogPaths = async (locales: string[]): Promise<LanguageAlternate[][]> => {
  const [defaultLocale = ''] = locales
  const tree = await findCategoryTreeOrEmpty(defaultLocale)
  return listCategoryPaths(tree).map((path) => {
    const alternates = categoryAlternates(tree, path.split('/').slice(2))
    return alternates.length > 0 ? alternates : [{ locale: defaultLocale, path }]
  })
}

export const findCategoryPath = async (slugs: string[], locale: string) =>
  resolveCategoryPath(await findCategoryTree(locale), slugs)

/** Le chemin de catégories dans chaque langue (sélecteur de langue) ; aucun si l'API ne répond pas. */
export const findCategoryAlternates = async (slugs: string[], locale: string) =>
  categoryAlternates(await findCategoryTreeOrEmpty(locale), slugs)
