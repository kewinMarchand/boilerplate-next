import { format, localizePath } from '@/shared/i18n'
import { getDictionary } from '@/shared/i18n/server'

import { catalogHref } from '../domain/catalogQuery'
import styles from './CatalogPagination.module.css'
import { paginationWindow } from './pagination'
import { TitleFocusLink } from './TitleFocusLink'

import type { Catalog } from '../domain/catalog'
import type { LocaleContext } from '@/shared/i18n'

interface CatalogPaginationProps {
  path: string
  query: Catalog.Query
  page: number
  pageCount: number
  /** Langue de la page : `<link rel="prev">` n'est pas un `Link`, son adresse se préfixe ici. */
  locale: LocaleContext
}

const LINK = 'bui-pagination__link'

export const CatalogPagination = async ({
  path,
  query,
  page,
  pageCount,
  locale,
}: CatalogPaginationProps) => {
  if (pageCount <= 1) return null
  const t = (await getDictionary()).catalog
  const localize = (href: string) => localizePath(href, locale.locale, locale.defaultLocale)

  const hrefOf = (target: number) => catalogHref(path, { ...query, page: target })
  const previous = page > 1 ? hrefOf(page - 1) : null
  const next = page < pageCount ? hrefOf(page + 1) : null

  return (
    <nav aria-label={t.pagination} data-testid="catalog-pagination" className={styles.pagination}>
      {previous && <link rel="prev" href={localize(previous)} />}
      {next && <link rel="next" href={localize(next)} />}
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
              <TitleFocusLink
                href={hrefOf(entry)}
                aria-label={format(t.pageLink, { page: entry })}
                className={LINK}
              >
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
