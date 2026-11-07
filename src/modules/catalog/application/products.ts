import { productHref } from '../domain/catalog'
import {
  findAllProductSlugs,
  findFeaturedProducts,
  findProduct,
} from '../infrastructure/catalogRepository'

/** Fiche d'un produit ; `null` si l'API ne le connaît pas, rejet si elle ne répond pas. */
export const loadProduct = (slug: string) => findProduct(slug)

/** Produits « À la une » du carrousel de l'accueil ; rejet si l'API ne répond pas. */
export const loadFeaturedProducts = () => findFeaturedProducts()

/** Chemins des fiches pour le sitemap et le pré-rendu ; aucun si l'API ne répond pas. */
export const listProductPaths = async (): Promise<string[]> =>
  (await findAllProductSlugs().catch(() => [])).map(productHref)
