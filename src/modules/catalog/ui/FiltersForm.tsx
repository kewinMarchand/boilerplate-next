'use client'

import { useId } from 'react'

import { Button, Checkbox, Switch } from '@kewinmarchand/boilerplates-ui/react'

import { useDictionary, useLocalizePath } from '@/shared/i18n'
import { Link } from '@/shared/ui/kit'

import { attributeParam, withAttribute, withFilter } from '../domain/catalogQuery'
import styles from './FiltersForm.module.css'
import { QueryHiddenFields } from './QueryHiddenFields'

import type { Catalog } from '../domain/catalog'
import type { FocusEvent, FormEvent, ReactNode } from 'react'

interface FiltersFormProps {
  path: string
  query: Catalog.Query
  facets: Catalog.Facets
  subcategories: Catalog.CategoryLink[]
  isHydrated: boolean
  salesEnabled: boolean
  onApply: (next: Catalog.Query) => void
}

const FILTER_KEYS = ['exposition', 'taille', 'prix_min', 'prix_max', 'en_stock', 'page']

const toggle = <T,>(values: T[], value: T) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value]

const parsePrice = (raw: string) => {
  const value = Number.parseInt(raw, 10)
  return Number.isNaN(value) || value < 0 ? null : value
}

const FacetGroup = ({ legend, children }: { legend: string; children: ReactNode }) => (
  <details open className="bui-accordion__item">
    <summary className="bui-accordion__summary">{legend}</summary>
    <fieldset className={styles.fieldset}>
      <legend className="bui-visually-hidden">{legend}</legend>
      {children}
    </fieldset>
  </details>
)

interface PriceFieldProps {
  label: string
  name: string
  defaultValue: number | null
  onBlur: (event: FocusEvent<HTMLInputElement>) => void
  testId: string
}

const PriceField = ({ label, name, defaultValue, onBlur, testId }: PriceFieldProps) => {
  const id = useId()
  return (
    <div className="bui-field">
      <label className="bui-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        className="bui-field__input"
        id={id}
        name={name}
        type="number"
        min={0}
        inputMode="numeric"
        defaultValue={defaultValue ?? ''}
        onBlur={onBlur}
        data-testid={testId}
      />
    </div>
  )
}

export const FiltersForm = ({
  path,
  query,
  facets,
  subcategories,
  isHydrated,
  salesEnabled,
  onApply,
}: FiltersFormProps) => {
  const t = useDictionary().catalog
  const localizePath = useLocalizePath()
  const idPrefix = useId()
  const applyPrice = (key: 'priceMin' | 'priceMax') => (event: FocusEvent<HTMLInputElement>) => {
    const value = parsePrice(event.target.value)
    if (value !== query[key]) onApply(withFilter(query, { [key]: value }))
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!isHydrated) return
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    onApply(
      withFilter(query, {
        priceMin: parsePrice(String(data.get('prix_min') ?? '')),
        priceMax: parsePrice(String(data.get('prix_max') ?? '')),
      }),
    )
  }

  return (
    <form
      method="get"
      action={localizePath(path)}
      onSubmit={onSubmit}
      data-testid="catalog-filters"
    >
      <QueryHiddenFields
        query={query}
        omit={[...FILTER_KEYS, ...facets.attributes.map((facet) => attributeParam(facet.code))]}
      />

      <div className="bui-accordion">
        {subcategories.length > 0 && (
          <FacetGroup legend={t.category}>
            <ul className={styles.categories}>
              {subcategories.map((category) => (
                <li key={category.href}>
                  <Link href={category.href} className={`bui-link ${styles.category}`}>
                    {category.name} ({category.count})
                  </Link>
                </li>
              ))}
            </ul>
          </FacetGroup>
        )}

        <FacetGroup legend={t.exposure}>
          {facets.exposure.map((facet) => {
            const checked = query.exposures.includes(facet.value)
            return (
              <Checkbox
                key={facet.value}
                id={`${idPrefix}-exposition-${facet.value}`}
                label={`${t.exposures[facet.value]} (${facet.count})`}
                name="exposition"
                value={facet.value}
                checked={checked}
                disabled={facet.count === 0 && !checked}
                onChange={() =>
                  onApply(withFilter(query, { exposures: toggle(query.exposures, facet.value) }))
                }
                data-testid={`catalog-filter-exposure-${facet.value}`}
              />
            )
          })}
        </FacetGroup>

        <FacetGroup legend={t.size}>
          {facets.size.map((facet) => {
            const checked = query.sizes.includes(facet.value)
            return (
              <Checkbox
                key={facet.value}
                id={`${idPrefix}-taille-${facet.value}`}
                label={`${t.sizeLabel(facet.value)} (${facet.count})`}
                name="taille"
                value={facet.value}
                checked={checked}
                disabled={facet.count === 0 && !checked}
                onChange={() =>
                  onApply(withFilter(query, { sizes: toggle(query.sizes, facet.value) }))
                }
                data-testid={`catalog-filter-size-${facet.value}`}
              />
            )
          })}
        </FacetGroup>

        {facets.attributes.map((attribute) => {
          const selected = query.attributes[attribute.code] ?? []
          return (
            <FacetGroup key={attribute.code} legend={attribute.label}>
              {attribute.values.map((facet) => {
                const checked = selected.includes(facet.value)
                return (
                  <Checkbox
                    key={facet.value}
                    id={`${idPrefix}-${attributeParam(attribute.code)}-${facet.value}`}
                    label={`${facet.label} (${facet.count})`}
                    name={attributeParam(attribute.code)}
                    value={facet.value}
                    checked={checked}
                    disabled={facet.count === 0 && !checked}
                    onChange={() =>
                      onApply(withAttribute(query, attribute.code, toggle(selected, facet.value)))
                    }
                    data-testid={`catalog-filter-attribute-${attribute.code}-${facet.value}`}
                  />
                )
              })}
            </FacetGroup>
          )
        })}

        {salesEnabled && (
          <FacetGroup legend={t.price}>
            <div key={`${query.priceMin}-${query.priceMax}`} className={styles.prices}>
              <PriceField
                label={t.priceMin}
                name="prix_min"
                defaultValue={query.priceMin}
                onBlur={applyPrice('priceMin')}
                testId="catalog-filter-price-min"
              />
              <PriceField
                label={t.priceMax}
                name="prix_max"
                defaultValue={query.priceMax}
                onBlur={applyPrice('priceMax')}
                testId="catalog-filter-price-max"
              />
            </div>
          </FacetGroup>
        )}

        <FacetGroup legend={t.availability}>
          <Switch
            id={`${idPrefix}-en-stock`}
            label={t.inStockOnly}
            name="en_stock"
            value="1"
            checked={query.inStock}
            onChange={() => onApply(withFilter(query, { inStock: !query.inStock }))}
            data-testid="catalog-filter-in-stock"
          />
        </FacetGroup>
      </div>

      {/* Gardé caché une fois hydraté : il reste le bouton par défaut de la touche Entrée dans les champs de prix. */}
      <div className={isHydrated ? styles.hidden : styles.submit}>
        <Button type="submit" fullWidth data-testid="catalog-filters-submit">
          {t.applyFilters}
        </Button>
      </div>
      {isHydrated && <p className={`bui-text bui-text--body-sm ${styles.hint}`}>{t.filtersHint}</p>}
    </form>
  )
}
