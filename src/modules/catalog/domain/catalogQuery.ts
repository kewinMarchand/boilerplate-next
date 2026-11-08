import type { Catalog } from './catalog'

export type SearchParams = Record<string, string | string[] | undefined>

export const DEFAULT_QUERY: Catalog.Query = {
  exposures: [],
  sizes: [],
  attributes: {},
  priceMin: null,
  priceMax: null,
  inStock: false,
  sort: 'pertinence',
  view: 'grille',
  page: 1,
}

export const ATTRIBUTE_PARAM_PREFIX = 'attr-'

export const attributeParam = (code: string) => `${ATTRIBUTE_PARAM_PREFIX}${code}`

export const serializeCatalogQuery = (query: Catalog.Query) => {
  const params = new URLSearchParams()
  query.exposures.forEach((value) => params.append('exposition', value))
  query.sizes.forEach((value) => params.append('taille', value))
  Object.entries(query.attributes).forEach(([code, values]) =>
    values.forEach((value) => params.append(attributeParam(code), value)),
  )
  if (query.priceMin !== null) params.set('prix_min', String(query.priceMin))
  if (query.priceMax !== null) params.set('prix_max', String(query.priceMax))
  if (query.inStock) params.set('en_stock', '1')
  if (query.sort !== DEFAULT_QUERY.sort) params.set('tri', query.sort)
  if (query.view !== DEFAULT_QUERY.view) params.set('vue', query.view)
  if (query.page > 1) params.set('page', String(query.page))
  return params
}

export const catalogHref = (path: string, query: Catalog.Query) => {
  const search = serializeCatalogQuery(query).toString()
  return search ? `${path}?${search}` : path
}

/** Tout changement de filtre ou de tri revient à la page 1 et conserve le reste. */
export const withFilter = (
  query: Catalog.Query,
  changes: Partial<Catalog.Query>,
): Catalog.Query => ({
  ...query,
  ...changes,
  page: 1,
})

/** Remplace les valeurs retenues d'un attribut ; un attribut sans valeur quitte la requête. */
export const withAttribute = (query: Catalog.Query, code: string, values: string[]) =>
  withFilter(query, {
    attributes: Object.fromEntries(
      Object.entries({ ...query.attributes, [code]: values }).filter(([, kept]) => kept.length > 0),
    ),
  })

export const clearFilters = (query: Catalog.Query): Catalog.Query => ({
  ...DEFAULT_QUERY,
  view: query.view,
})

export const countActiveFilters = (query: Catalog.Query) =>
  query.exposures.length +
  query.sizes.length +
  Object.values(query.attributes).flat().length +
  (query.priceMin !== null ? 1 : 0) +
  (query.priceMax !== null ? 1 : 0) +
  (query.inStock ? 1 : 0)

const PRICE_SORTS: Catalog.Sort[] = ['prix-asc', 'prix-desc']

export const isPriceSort = (sort: Catalog.Sort) => PRICE_SORTS.includes(sort)

/** Vente en ligne coupée : filtre et tris par prix ignorés, comme une valeur invalide. */
export const withoutPriceCriteria = (query: Catalog.Query): Catalog.Query => ({
  ...query,
  priceMin: null,
  priceMax: null,
  sort: isPriceSort(query.sort) ? DEFAULT_QUERY.sort : query.sort,
})

export const isFiltered = (query: Catalog.Query) =>
  countActiveFilters(query) > 0 || query.sort !== DEFAULT_QUERY.sort
