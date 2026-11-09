import { childCategories, findCategoryChain } from './categoryTree'

import type { Catalog } from './catalog'
import type { NavigationNode } from '@/shared/config'
import type { LanguageAlternate } from '@/shared/i18n'

export const CATALOG_ROOT_PATH = '/catalogue'
export const MAX_CATEGORY_DEPTH = 3

export const categoryHref = (slugs: string[]) =>
  slugs.length > 0 ? `${CATALOG_ROOT_PATH}/${slugs.join('/')}` : CATALOG_ROOT_PATH

/** Valide les slugs contre l'arbre et la profondeur : un chemin inconnu donne null, donc un 404. */
export const resolveCategoryPath = (
  tree: Catalog.Category[],
  slugs: string[],
): Catalog.CategoryPath | null => {
  if (slugs.length > MAX_CATEGORY_DEPTH) return null
  const chain = findCategoryChain(tree, slugs)
  return (
    chain?.map((category, index) => ({
      slug: category.slug,
      name: category.name,
      href: categoryHref(slugs.slice(0, index + 1)),
    })) ?? null
  )
}

/**
 * Le chemin de catégories dans chaque langue où la dernière a un slug : chaque niveau prend son slug
 * dans cette langue (`alternates` de l'arbre), sinon le sien. Racine du catalogue : aucun.
 */
export const categoryAlternates = (
  tree: Catalog.Category[],
  slugs: string[],
): LanguageAlternate[] => {
  const chain = findCategoryChain(tree, slugs) ?? []
  return (chain.at(-1)?.alternates ?? []).map(({ locale }) => ({
    locale,
    path: categoryHref(
      chain.map(
        (category) =>
          category.alternates?.find((alternate) => alternate.locale === locale)?.slug ??
          category.slug,
      ),
    ),
  }))
}

/** Liens vers les sous-catégories directes d'un chemin connu. */
export const subcategoryLinks = (
  tree: Catalog.Category[],
  slugs: string[],
): Catalog.CategoryPathLink[] =>
  childCategories(tree, findCategoryChain(tree, slugs) ?? []).map((child) => ({
    slug: child.slug,
    name: child.name,
    href: categoryHref([...slugs, child.slug]),
  }))

/** Piste du fil d'Ariane sous « Catalogue », catégorie courante comprise. */
export const categoryTrail = (path: Catalog.CategoryPath) =>
  path.map((link) => ({ label: link.name, href: link.href }))

export const listCategoryPaths = (tree: Catalog.Category[], parents: string[] = []): string[] =>
  tree.flatMap((category) => {
    const slugs = [...parents, category.slug]
    return [categoryHref(slugs), ...listCategoryPaths(category.children ?? [], slugs)]
  })

export const toCategoryMenu = (
  tree: Catalog.Category[],
  parents: string[] = [],
): NavigationNode[] =>
  tree.map((category) => {
    const slugs = [...parents, category.slug]
    return {
      id: category.slug,
      label: category.name,
      href: categoryHref(slugs),
      children: toCategoryMenu(category.children ?? [], slugs),
    }
  })
