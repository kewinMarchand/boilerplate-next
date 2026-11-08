import { ApiError } from '@/shared/api/client'
import { serverApiClient, staticApiClient } from '@/shared/api/client.server'

import { MAX_PAGE_SIZE, SIMILAR_LIMIT } from '../domain/catalog'
import {
  toCatalogPage,
  toCategory,
  toFacetsQuery,
  toProduct,
  toProductDetail,
  toProductsQuery,
} from './http/catalogTranslation'

import type { Catalog } from '../domain/catalog'

export interface CatalogPage extends Catalog.Result {
  subcategories: Catalog.CategoryLink[]
}

export const findCategoryTree = async (): Promise<Catalog.Category[]> => {
  const { data, response } = await staticApiClient().GET('/api/categories')
  if (!data) throw new ApiError(response)
  return data.map(toCategory)
}

export const findCatalogPage = async (
  slugs: string[],
  query: Catalog.Query,
): Promise<CatalogPage> => {
  const client = await serverApiClient()
  const [products, facets] = await Promise.all([
    client.GET('/api/products', { params: { query: toProductsQuery(slugs, query) } }),
    client.GET('/api/product-facets', { params: { query: toFacetsQuery(slugs, query) } }),
  ])
  if (!products.data) throw new ApiError(products.response)
  if (!facets.data) throw new ApiError(facets.response)
  return toCatalogPage(products.data, facets.data, query.page, slugs)
}

/** `null` si l'API ne connaît pas le produit (404). */
export const findProduct = async (slug: string): Promise<Catalog.ProductDetail | null> => {
  const { data, response } = await staticApiClient().GET('/api/products/{slug}', {
    params: { path: { slug } },
  })
  if (response.status === 404) return null
  if (!data) throw new ApiError(response)
  return toProductDetail(data)
}

/** Produits de la catégorie, sans celui affiché : le carrousel de la fiche. */
export const findSimilarProducts = async (
  categorySlug: string,
  excludedSlug: string,
): Promise<Catalog.Product[]> => {
  const { data, response } = await staticApiClient().GET('/api/products', {
    params: { query: { category: categorySlug, itemsPerPage: SIMILAR_LIMIT + 1 } },
  })
  if (!data) throw new ApiError(response)
  return data
    .map(toProduct)
    .filter((product) => product.slug !== excludedSlug)
    .slice(0, SIMILAR_LIMIT)
}

/** Produits « À la une » : le carrousel de l'accueil. */
export const findFeaturedProducts = async (): Promise<Catalog.Product[]> => {
  const { data, response } = await staticApiClient().GET('/api/featured-products')
  if (!data) throw new ApiError(response)
  return data.map(toProduct)
}

/** Slugs de tous les produits, page après page jusqu'à une page incomplète (sitemap et pré-rendu des fiches). */
export const findAllProductSlugs = async (): Promise<string[]> => {
  const slugs: string[] = []
  for (let page = 1; ; page += 1) {
    const { data, response } = await staticApiClient().GET('/api/products', {
      params: { query: { page, itemsPerPage: MAX_PAGE_SIZE } },
    })
    if (!data) throw new ApiError(response)
    slugs.push(...data.map((item) => item.slug))
    if (data.length < MAX_PAGE_SIZE) return slugs
  }
}
