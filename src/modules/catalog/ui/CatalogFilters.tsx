'use client'

import { useId, useState } from 'react'

import { Button, Drawer } from '@kewinmarchand/boilerplates-ui/react'

import { format, plural, useDictionary } from '@/shared/i18n'
import { useHydrated } from '@/shared/ui/hooks/useHydrated'
import { Icon } from '@/shared/ui/kit'

import { countActiveFilters } from '../domain/catalogQuery'
import styles from './CatalogFilters.module.css'
import { FiltersForm } from './FiltersForm'
import { useCatalogNavigation } from './hooks/useCatalogNavigation'

import type { Catalog } from '../domain/catalog'

interface CatalogFiltersProps {
  path: string
  query: Catalog.Query
  facets: Catalog.Facets
  subcategories: Catalog.CategoryLink[]
  total: number
  salesEnabled: boolean
}

export const CatalogFilters = ({
  path,
  query,
  facets,
  subcategories,
  total,
  salesEnabled,
}: CatalogFiltersProps) => {
  const {
    catalog: t,
    language: { tag },
  } = useDictionary()
  const isHydrated = useHydrated()
  const titleId = useId()
  const drawerId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const navigation = useCatalogNavigation(path, query)
  const activeCount = countActiveFilters(navigation.query)

  const form = (
    <FiltersForm
      path={path}
      query={navigation.query}
      facets={facets}
      subcategories={subcategories}
      isHydrated={isHydrated}
      salesEnabled={salesEnabled}
      onApply={navigation.apply}
    />
  )

  const filterLabel =
    activeCount > 0 ? plural(t.filterButtonActive, activeCount, tag) : t.filterButton

  return (
    <>
      {!isHydrated && (
        <details className={styles.mobileOnly}>
          <summary className={styles.summary} data-testid="catalog-filters-summary">
            <Icon name="sliders-horizontal" />
            {filterLabel}
          </summary>
          {form}
        </details>
      )}
      {isHydrated && (
        <div className={styles.mobileOnly}>
          <Button
            variant="outline"
            icon="sliders-horizontal"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={drawerId}
            onClick={() => setIsOpen(true)}
            data-testid="catalog-filters-open"
          >
            {filterLabel}
          </Button>
        </div>
      )}

      {!isOpen && (
        <aside aria-labelledby={titleId} className={styles.desktopOnly}>
          <h2 id={titleId} className={`bui-text bui-text--title ${styles.title}`}>
            {t.filters}
          </h2>
          {form}
        </aside>
      )}

      <Drawer
        id={drawerId}
        title={t.filters}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        side="start"
        closeLabel={t.closeFilters}
        footer={
          <Button fullWidth onClick={() => setIsOpen(false)}>
            {format(t.showProducts, { total })}
          </Button>
        }
      >
        {isOpen && form}
      </Drawer>
    </>
  )
}
