import type { Price } from './price'
import type { ResponsiveImage } from '@/shared/ui/kit'

export const EXPOSURES = ['soleil', 'mi-ombre', 'ombre'] as const
export const SIZES = ['S', 'M', 'L'] as const
export const SORTS = ['pertinence', 'prix-asc', 'prix-desc', 'nom'] as const
export const VIEWS = ['grille', 'liste'] as const
export const PAGE_SIZE = 12
/** Plus grande page acceptée par l'API. */
export const MAX_PAGE_SIZE = 48

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
  }

  interface Query {
    exposures: Exposure[]
    sizes: Size[]
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

  interface Facets {
    exposure: Facet<Exposure>[]
    size: Facet<Size>[]
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
