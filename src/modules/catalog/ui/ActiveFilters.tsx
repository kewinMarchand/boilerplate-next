import { Cluster } from '@kewinmarchand/boilerplates-ui/react'

import { Icon, Link } from '@/shared/ui/kit'

import {
  catalogHref,
  clearFilters,
  isFiltered,
  withAttribute,
  withFilter,
} from '../domain/catalogQuery'
import styles from './ActiveFilters.module.css'
import { EXPOSURE_LABELS, sizeLabel } from './labels'
import { TitleFocusLink } from './TitleFocusLink'

import type { Catalog } from '../domain/catalog'

interface ActiveFiltersProps {
  path: string
  query: Catalog.Query
  attributeFacets: Catalog.AttributeFacet[]
}

const attributeValueLabel = (facets: Catalog.AttributeFacet[], code: string, value: string) =>
  facets.find((facet) => facet.code === code)?.values.find((item) => item.value === value)?.label ??
  value

const activeFilters = (query: Catalog.Query, attributeFacets: Catalog.AttributeFacet[]) => [
  ...query.exposures.map((value) => ({
    label: EXPOSURE_LABELS[value],
    next: withFilter(query, { exposures: query.exposures.filter((item) => item !== value) }),
  })),
  ...query.sizes.map((value) => ({
    label: sizeLabel(value),
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
    ? [{ label: `Dès ${query.priceMin} €`, next: withFilter(query, { priceMin: null }) }]
    : []),
  ...(query.priceMax !== null
    ? [{ label: `Jusqu'à ${query.priceMax} €`, next: withFilter(query, { priceMax: null }) }]
    : []),
  ...(query.inStock ? [{ label: 'En stock', next: withFilter(query, { inStock: false }) }] : []),
]

export const ActiveFilters = ({ path, query, attributeFacets }: ActiveFiltersProps) => {
  if (!isFiltered(query)) return null

  return (
    <Cluster gap="2" data-testid="catalog-active-filters" className={styles.filters}>
      <ul className="bui-chip-list" role="list">
        {activeFilters(query, attributeFacets).map((filter) => (
          <li key={filter.label}>
            <Link
              href={catalogHref(path, filter.next)}
              scroll={false}
              data-testid="catalog-active-filter"
              className="bui-chip"
            >
              <span className="bui-visually-hidden">Retirer le filtre : </span>
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
        Tout effacer
      </TitleFocusLink>
    </Cluster>
  )
}
