import { EXPOSURES, PAGE_SIZE, SIZES } from '@/modules/catalog/domain/catalog'
import { categoryHref } from '@/modules/catalog/domain/categoryPath'
import { eurosToCents, Price } from '@/modules/catalog/domain/price'

import type { Catalog } from '@/modules/catalog/domain/catalog'
import type { CatalogPage } from '@/modules/catalog/infrastructure/catalogRepository'
import type { components, operations } from '@/shared/api/client'

type CategoryDto = components['schemas']['Category']
type ProductDto = components['schemas']['ProductItem']
type ProductDetailDto = components['schemas']['ProductDetail']
type ProductListDto = components['schemas']['ProductList']
type FacetDto = components['schemas']['FacetValue']
export type ProductsQuery = NonNullable<operations['api_products_get']['parameters']['query']>

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
})

const toFacetCounts = <T extends string>(values: readonly T[], dtos: FacetDto[]) =>
  values.map((value) => ({
    value,
    count: dtos.find((dto) => dto.value === value)?.count ?? 0,
  }))

/** Euros de l'URL en centimes, tri du front en `order[...]`, listes en clés répétées. */
export const toProductsQuery = (slugs: string[], query: Catalog.Query): ProductsQuery => {
  const category = slugs.at(-1)
  return {
    ...(category && { category }),
    ...(query.exposures.length > 0 && { 'exposure[]': query.exposures }),
    ...(query.sizes.length > 0 && { 'size[]': query.sizes }),
    ...(query.priceMin !== null && { priceMin: eurosToCents(query.priceMin) }),
    ...(query.priceMax !== null && { priceMax: eurosToCents(query.priceMax) }),
    ...(query.inStock && { inStock: true }),
    ...SORT_PARAMS[query.sort],
    page: query.page,
    itemsPerPage: PAGE_SIZE,
  }
}

export const toCatalogPage = (dto: ProductListDto, slugs: string[]): CatalogPage => ({
  products: dto.items.map(toProduct),
  total: dto.totalItems,
  page: dto.page,
  pageCount: Math.max(1, dto.totalPages),
  facets: {
    exposure: toFacetCounts(EXPOSURES, dto.facets.exposure),
    size: toFacetCounts(SIZES, dto.facets.size),
  },
  subcategories: dto.facets.category.map((child) => ({
    href: categoryHref([...slugs, child.slug]),
    name: child.name,
    count: child.count,
  })),
})
