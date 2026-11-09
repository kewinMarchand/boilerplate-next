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

export const findCategoryTree = async (locale: string): Promise<Catalog.Category[]> => {
  const { data, response } = await staticApiClient().GET('/api/categories', {
    params: { query: { locale } },
  })
  if (!data) throw new ApiError(response)
  return data.map(toCategory)
}

export const findCatalogPage = async (
  slugs: string[],
  query: Catalog.Query,
  locale: string,
): Promise<CatalogPage> => {
  const client = await serverApiClient()
  const [products, facets] = await Promise.all([
    client.GET('/api/products', {
      params: { query: { ...toProductsQuery(slugs, query), locale } },
    }),
    client.GET('/api/product-facets', {
      params: { query: { ...toFacetsQuery(slugs, query), locale } },
    }),
  ])
  if (!products.data) throw new ApiError(products.response)
  if (!facets.data) throw new ApiError(facets.response)
  return toCatalogPage(products.data, facets.data, query.page, slugs)
}

/** `null` si l'API ne connaît pas le produit (404). */
export const findProduct = async (
  slug: string,
  locale: string,
): Promise<Catalog.ProductDetail | null> => {
  const { data, response } = await staticApiClient().GET('/api/products/{slug}', {
    params: { path: { slug }, query: { locale } },
  })
  if (response.status === 404) return null
  if (!data) throw new ApiError(response)
  return toProductDetail(data)
}

/** Produits de la catégorie, sans celui affiché : le carrousel de la fiche. */
export const findSimilarProducts = async (
  categorySlug: string,
  excludedSlug: string,
  locale: string,
): Promise<Catalog.Product[]> => {
  const { data, response } = await staticApiClient().GET('/api/products', {
    params: { query: { category: categorySlug, itemsPerPage: SIMILAR_LIMIT + 1, locale } },
  })
  if (!data) throw new ApiError(response)
  return data
    .map(toProduct)
    .filter((product) => product.slug !== excludedSlug)
    .slice(0, SIMILAR_LIMIT)
}

/** Produits « À la une » : le carrousel de l'accueil. */
export const findFeaturedProducts = async (locale: string): Promise<Catalog.Product[]> => {
  const { data, response } = await staticApiClient().GET('/api/featured-products', {
    params: { query: { locale } },
  })
  if (!data) throw new ApiError(response)
  return data.map(toProduct)
}

/** Slugs de tous les produits, page après page jusqu'à une page incomplète (sitemap et pré-rendu des fiches). */
export const findAllProductSlugs = async (locale: string): Promise<string[]> =>
  (await findAllProductEntries(locale)).map((entry) => entry.slug)

/** Identifiant et slug de tous les produits dans une langue : le sitemap associe les langues par l'identifiant. */
export const findAllProductEntries = async (
  locale: string,
): Promise<{ id: string; slug: string }[]> => {
  const entries: { id: string; slug: string }[] = []
  for (let page = 1; ; page += 1) {
    const { data, response } = await staticApiClient().GET('/api/products', {
      params: { query: { page, itemsPerPage: MAX_PAGE_SIZE, locale } },
    })
    if (!data) throw new ApiError(response)
    entries.push(...data.map((item) => ({ id: String(item.id), slug: item.slug })))
    if (data.length < MAX_PAGE_SIZE) return entries
  }
}
