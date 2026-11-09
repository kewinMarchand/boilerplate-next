import { Cluster } from '@kewinmarchand/boilerplates-ui/react'

import { getDictionary } from '@/shared/i18n/server'
import { Icon, Link } from '@/shared/ui/kit'

import {
  catalogHref,
  clearFilters,
  isFiltered,
  withAttribute,
  withFilter,
} from '../domain/catalogQuery'
import styles from './ActiveFilters.module.css'
import { TitleFocusLink } from './TitleFocusLink'

import type { Catalog } from '../domain/catalog'
import type { Dictionary } from '@/shared/i18n'

interface ActiveFiltersProps {
  path: string
  query: Catalog.Query
  attributeFacets: Catalog.AttributeFacet[]
}

const attributeValueLabel = (facets: Catalog.AttributeFacet[], code: string, value: string) =>
  facets.find((facet) => facet.code === code)?.values.find((item) => item.value === value)?.label ??
  value

const activeFilters = (
  query: Catalog.Query,
  attributeFacets: Catalog.AttributeFacet[],
  t: Dictionary['catalog'],
) => [
  ...query.exposures.map((value) => ({
    label: t.exposures[value],
    next: withFilter(query, { exposures: query.exposures.filter((item) => item !== value) }),
  })),
  ...query.sizes.map((value) => ({
    label: t.sizeLabel(value),
    next: withFilter(query, { sizes: query.sizes.filter((item) => item !== value) }),
  })),
  ...Object.entries(query.attributes).flatMap(([code, values]) =>
    values.map((value) => ({
      label: attributeValueLabel(attributeFacets, code, value),
      next: withAttribute(
        query,
        code,
        values.filter((item) => item !== value),
      ),
    })),
  ),
  ...(query.priceMin !== null
    ? [{ label: t.fromPrice(query.priceMin), next: withFilter(query, { priceMin: null }) }]
    : []),
  ...(query.priceMax !== null
    ? [{ label: t.upToPrice(query.priceMax), next: withFilter(query, { priceMax: null }) }]
    : []),
  ...(query.inStock ? [{ label: t.inStock, next: withFilter(query, { inStock: false }) }] : []),
]

export const ActiveFilters = async ({ path, query, attributeFacets }: ActiveFiltersProps) => {
  if (!isFiltered(query)) return null
  const t = (await getDictionary()).catalog

  return (
    <Cluster gap="2" data-testid="catalog-active-filters" className={styles.filters}>
      <ul className="bui-chip-list" role="list">
        {activeFilters(query, attributeFacets, t).map((filter) => (
          <li key={filter.label}>
            <Link
              href={catalogHref(path, filter.next)}
              scroll={false}
              data-testid="catalog-active-filter"
              className="bui-chip"
            >
              <span className="bui-visually-hidden">{t.removeFilter}</span>
              {filter.label}
              <Icon name="x" size={16} />
            </Link>
          </li>
        ))}
      </ul>
      <TitleFocusLink
        href={catalogHref(path, clearFilters(query))}
        data-testid="catalog-clear-filters"
        className={`bui-link ${styles.clear}`}
      >
        {t.clearFilters}
      </TitleFocusLink>
    </Cluster>
  )
}
