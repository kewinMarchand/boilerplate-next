'use client'

import { useId } from 'react'

import { Button, Select } from '@kewinmarchand/boilerplates-ui/react'

import { useDictionary, useLocalizePath } from '@/shared/i18n'
import { useHydrated } from '@/shared/ui/hooks/useHydrated'

import { SORTS } from '../domain/catalog'
import { isPriceSort, withFilter } from '../domain/catalogQuery'
import { useCatalogNavigation } from './hooks/useCatalogNavigation'
import { QueryHiddenFields } from './QueryHiddenFields'
import styles from './SortSelect.module.css'

import type { Catalog } from '../domain/catalog'
import type { Dictionary } from '@/shared/i18n'

interface SortSelectProps {
  path: string
  query: Catalog.Query
  salesEnabled: boolean
}

const options = (salesEnabled: boolean, labels: Dictionary['catalog']['sorts']) =>
  SORTS.filter((sort) => salesEnabled || !isPriceSort(sort)).map((sort) => ({
    value: sort,
    label: labels[sort],
  }))

const isSort = (value: string): value is Catalog.Sort => SORTS.some((sort) => sort === value)

export const SortSelect = ({ path, query, salesEnabled }: SortSelectProps) => {
  const t = useDictionary().catalog
  const localizePath = useLocalizePath()
  const isHydrated = useHydrated()
  const selectId = useId()
  const navigation = useCatalogNavigation(path, query)

  return (
    <form method="get" action={localizePath(path)} className={styles.form}>
      <QueryHiddenFields query={query} omit={['tri', 'page']} />
      <Select
        id={selectId}
        name="tri"
        label={t.sortBy}
        options={options(salesEnabled, t.sorts)}
        value={navigation.query.sort}
        onChange={(event) => {
          if (isSort(event.target.value)) {
            navigation.apply(withFilter(query, { sort: event.target.value }))
          }
        }}
        data-testid="catalog-sort"
      />
      {!isHydrated && (
        <Button type="submit" variant="outline">
          {t.sort}
        </Button>
      )}
    </form>
  )
}
