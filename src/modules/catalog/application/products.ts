import { productHref } from '../domain/catalog'
import {
  findAllProductEntries,
  findAllProductSlugs,
  findFeaturedProducts,
  findProduct,
  findSimilarProducts,
} from '../infrastructure/catalogRepository'

import type { Catalog } from '../domain/catalog'
import type { LanguageAlternate } from '@/shared/i18n'

/** Fiche d'un produit ; `null` si l'API ne le connaît pas, rejet si elle ne répond pas. */
export const loadProduct = (slug: string, locale: string) => findProduct(slug, locale)

/** La fiche dans chaque langue (sélecteur de langue) ; aucune si l'API ne la connaît pas ou ne répond pas. */
export const loadProductAlternates = async (
  slug: string,
  locale: string,
): Promise<LanguageAlternate[]> =>
  (await findProduct(slug, locale).catch(() => null))?.alternates ?? []

/**
 * Slug et nom de la fiche dans chaque langue du site (panier affiché dans une autre langue que celle
 * de l'ajout) ; aucun sur un site monolingue. Une langue que l'API ne sert pas est omise.
 */
export const loadProductTranslations = async (
  product: Catalog.ProductDetail,
  locale: string,
): Promise<Catalog.ProductTranslation[]> => {
  const translations = await Promise.all(
    product.alternates.map(async (alternate) => {
      if (alternate.locale === locale) return { locale, slug: product.slug, name: product.name }
      const slug = alternate.path.slice(productHref('').length)
      const translated = await findProduct(slug, alternate.locale).catch(() => null)
      return (
        translated && { locale: alternate.locale, slug: translated.slug, name: translated.name }
      )
    }),
  )
  return translations.filter((translation) => translation !== null)
}

/** Produits similaires de la fiche (même catégorie) ; aucun si l'API ne répond pas : la fiche reste l'essentiel. */
export const loadSimilarProducts = (categorySlug: string, excludedSlug: string, locale: string) =>
  findSimilarProducts(categorySlug, excludedSlug, locale).catch((error: unknown) => {
    console.error(error)
    return []
  })

/** Produits « À la une » du carrousel de l'accueil ; rejet si l'API ne répond pas. */
export const loadFeaturedProducts = (locale: string) => findFeaturedProducts(locale)

/** Chemins des fiches d'une langue pour le pré-rendu ; aucun si l'API ne répond pas. */
export const listProductPaths = async (locale: string): Promise<string[]> =>
  (await findAllProductSlugs(locale).catch(() => [])).map(productHref)

/** Chemins des fiches d'une langue, par identifiant, pour le sitemap ; aucun si l'API ne répond pas. */
export const listProductEntries = async (locale: string) => ({
  locale,
  entries: (await findAllProductEntries(locale).catch(() => [])).map(({ id, slug }) => ({
    key: id,
    path: productHref(slug),
  })),
})
