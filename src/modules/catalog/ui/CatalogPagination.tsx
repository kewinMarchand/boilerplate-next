'use client'

import { useDictionary, useLocalizePath } from '@/shared/i18n'

import { catalogHref } from '../domain/catalogQuery'
import styles from './CatalogPagination.module.css'
import { paginationWindow } from './pagination'
import { TitleFocusLink } from './TitleFocusLink'

import type { Catalog } from '../domain/catalog'

interface CatalogPaginationProps {
  path: string
  query: Catalog.Query
  page: number
  pageCount: number
}

const LINK = 'bui-pagination__link'

export const CatalogPagination = ({ path, query, page, pageCount }: CatalogPaginationProps) => {
  const t = useDictionary().catalog
  const localizePath = useLocalizePath()
  if (pageCount <= 1) return null

  const hrefOf = (target: number) => catalogHref(path, { ...query, page: target })
  const previous = page > 1 ? hrefOf(page - 1) : null
  const next = page < pageCount ? hrefOf(page + 1) : null

  return (
    <nav aria-label={t.pagination} data-testid="catalog-pagination" className={styles.pagination}>
      {previous && <link rel="prev" href={localizePath(previous)} />}
      {next && <link rel="next" href={localizePath(next)} />}
      <ul className={`bui-pagination__list ${styles.list}`}>
        <li>
          {previous ? (
            <TitleFocusLink href={previous} rel="prev" className={LINK}>
              {t.previous}
            </TitleFocusLink>
          ) : (
            <span className={`${LINK} ${styles.disabled}`}>{t.previous}</span>
          )}
        </li>
        {paginationWindow(page, pageCount).map((entry, index) => (
          <li key={entry === 'ellipsis' ? `ellipsis-${index}` : entry}>
            {entry === 'ellipsis' ? (
              <span aria-hidden="true" className="bui-pagination__ellipsis">
                …
              </span>
            ) : entry === page ? (
              <span aria-current="page" className={LINK}>
                <span className="bui-visually-hidden">{t.page}</span>
                {entry}
              </span>
            ) : (
              <TitleFocusLink href={hrefOf(entry)} aria-label={t.pageLink(entry)} className={LINK}>
                {entry}
              </TitleFocusLink>
            )}
          </li>
        ))}
        <li>
          {next ? (
            <TitleFocusLink href={next} rel="next" className={LINK}>
              {t.next}
            </TitleFocusLink>
          ) : (
            <span className={`${LINK} ${styles.disabled}`}>{t.next}</span>
          )}
        </li>
      </ul>
    </nav>
  )
}
