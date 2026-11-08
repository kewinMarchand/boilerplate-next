import { EXPOSURES, PAGE_SIZE, SIZES } from '@/modules/catalog/domain/catalog'
import { categoryHref } from '@/modules/catalog/domain/categoryPath'
import { eurosToCents, Price } from '@/modules/catalog/domain/price'

import type { Catalog } from '@/modules/catalog/domain/catalog'
import type { CatalogPage } from '@/modules/catalog/infrastructure/catalogRepository'
import type { components, operations } from '@/shared/api/client'

type CategoryDto = components['schemas']['Category']
type ProductDto = components['schemas']['Product']
type ProductDetailDto = components['schemas']['ProductDetail']
type ProductFacetsDto = components['schemas']['ProductFacets']
type FacetDto = components['schemas']['FacetValue']
export type ProductsQuery = NonNullable<
  operations['api_products_get_collection']['parameters']['query']
>
export type ProductFacetsQuery = NonNullable<
  operations['api_product-facets_get']['parameters']['query']
>

const SORT_PARAMS: Record<Catalog.Sort, ProductsQuery> = {
  pertinence: {},
  'prix-asc': { 'order[price]': 'asc' },
  'prix-desc': { 'order[price]': 'desc' },
  nom: { 'order[name]': 'asc' },
}

export const toCategory = (dto: CategoryDto): Catalog.Category => ({
  slug: dto.slug,
  name: dto.name,
  children: dto.children.map(toCategory),
})

export const toProduct = (dto: ProductDto): Catalog.Product => ({
  id: String(dto.id),
  slug: dto.slug,
  name: dto.name,
  categorySlug: dto.categorySlug,
  price: Price.fromCents(dto.price),
  exposure: dto.exposure,
  size: dto.size,
  inStock: dto.inStock,
  image: dto.image,
})

export const toProductDetail = (dto: ProductDetailDto): Catalog.ProductDetail => ({
  ...toProduct(dto),
  categoryPath: dto.categoryPath.map((link, index) => ({
    slug: link.slug,
    name: link.name,
    href: categoryHref(dto.categoryPath.slice(0, index + 1).map((step) => step.slug)),
  })),
  // Le contrat sépare les paragraphes par une ligne vide
  description: dto.description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph !== ''),
})

const toFacetCounts = <T extends string>(values: readonly T[], dtos: FacetDto[]) =>
  values.map((value) => ({
    value,
    count: dtos.find((dto) => dto.value === value)?.count ?? 0,
  }))

/** Filtres communs à la liste et aux facettes : euros de l'URL en centimes, listes en clés répétées. */
export const toFacetsQuery = (slugs: string[], query: Catalog.Query): ProductFacetsQuery => {
  const category = slugs.at(-1)
  return {
    ...(category && { category }),
    ...(query.exposures.length > 0 && { 'exposure[]': query.exposures }),
    ...(query.sizes.length > 0 && { 'size[]': query.sizes }),
    ...(query.priceMin !== null && { priceMin: eurosToCents(query.priceMin) }),
    ...(query.priceMax !== null && { priceMax: eurosToCents(query.priceMax) }),
    ...(query.inStock && { inStock: true }),
  }
}

/** Filtres, tri du front en `order[...]` et page demandée. */
export const toProductsQuery = (slugs: string[], query: Catalog.Query): ProductsQuery => ({
  ...toFacetsQuery(slugs, query),
  ...SORT_PARAMS[query.sort],
  page: query.page,
  itemsPerPage: PAGE_SIZE,
})

export const toCatalogPage = (
  products: ProductDto[],
  facets: ProductFacetsDto,
  page: number,
  slugs: string[],
): CatalogPage => ({
  products: products.map(toProduct),
  total: facets.totalItems,
  page,
  pageCount: Math.max(1, Math.ceil(facets.totalItems / PAGE_SIZE)),
  facets: {
    exposure: toFacetCounts(EXPOSURES, facets.exposure),
    size: toFacetCounts(SIZES, facets.size),
  },
  subcategories: facets.category.map((child) => ({
    href: categoryHref([...slugs, child.slug]),
    name: child.name,
    count: child.count,
  })),
})
