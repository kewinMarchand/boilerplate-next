import type { Price } from './price'
import type { LanguageAlternate } from '@/shared/i18n'
import type { ResponsiveImage } from '@/shared/ui/kit'

export const EXPOSURES = ['soleil', 'mi-ombre', 'ombre'] as const
export const SIZES = ['S', 'M', 'L'] as const
export const SORTS = ['pertinence', 'prix-asc', 'prix-desc', 'nom'] as const
export const VIEWS = ['grille', 'liste'] as const
export const PAGE_SIZE = 12
/** Plus grande page acceptée par l'API. */
export const MAX_PAGE_SIZE = 48

/** Produits du carrousel « Produits similaires » de la fiche. */
export const SIMILAR_LIMIT = 8

export const productHref = (slug: string) => `/produit/${slug}`

export declare namespace Catalog {
  type Exposure = (typeof EXPOSURES)[number]
  type Size = (typeof SIZES)[number]
  type Sort = (typeof SORTS)[number]
  type View = (typeof VIEWS)[number]
  interface Category {
    slug: string
    name: string
    children?: Category[]
    /** Slug de la catégorie dans chaque langue activée, vide sur un site monolingue. */
    alternates?: CategoryAlternate[]
  }

  interface CategoryAlternate {
    locale: string
    slug: string
  }

  interface CategoryPathLink {
    slug: string
    name: string
    href: string
  }

  /** Chaîne des catégories de la racine à la catégorie courante, validée contre l'arbre. */
  type CategoryPath = CategoryPathLink[]

  interface Product {
    id: string
    slug: string
    name: string
    categorySlug: string
    price: Price
    exposure: Exposure
    size: Size
    inStock: boolean
    image: ResponsiveImage | null
  }

  /** Fiche : le produit, sa description et le chemin de sa catégorie, de la racine à elle (fil d'Ariane). */
  interface ProductDetail extends Product {
    categoryPath: CategoryPath
    /** Paragraphes de la description, vide si l'admin n'en a pas écrit. */
    description: string[]
    attributes: ProductAttribute[]
    /** Images supplémentaires, dans l'ordre, sans l'image principale ; vide si aucune. */
    gallery: ResponsiveImage[]
    /** Titre et description saisis pour les moteurs de recherche, chaînes vides sinon. */
    metaTitle: string
    metaDescription: string
    /** La fiche dans chaque langue activée, vide sur un site monolingue. */
    alternates: LanguageAlternate[]
  }

  /** Attribut configurable renseigné sur un produit, valeur déjà en libellé. */
  interface ProductAttribute {
    code: string
    label: string
    value: string
    unit: string | null
  }

  interface Query {
    exposures: Exposure[]
    sizes: Size[]
    /** Valeurs retenues par code d'attribut filtrable. */
    attributes: Record<string, string[]>
    priceMin: number | null
    priceMax: number | null
    inStock: boolean
    sort: Sort
    view: View
    page: number
  }

  interface Facet<T extends string> {
    value: T
    count: number
  }

  interface AttributeFacet {
    code: string
    label: string
    values: (Facet<string> & { label: string })[]
  }

  interface Facets {
    exposure: Facet<Exposure>[]
    size: Facet<Size>[]
    attributes: AttributeFacet[]
  }

  interface CategoryLink {
    href: string
    name: string
    count: number
  }

  interface Result {
    products: Product[]
    total: number
    page: number
    pageCount: number
    facets: Facets
  }
}
