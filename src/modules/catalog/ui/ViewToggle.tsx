import { Cluster } from '@kewinmarchand/boilerplates-ui/react'

import { getDictionary } from '@/shared/i18n/server'
import { Icon, Link } from '@/shared/ui/kit'

import { catalogHref } from '../domain/catalogQuery'

import type { Catalog } from '../domain/catalog'

interface ViewToggleProps {
  path: string
  query: Catalog.Query
}

const OPTIONS = [
  { view: 'grille', icon: 'layout-grid', testId: 'catalog-view-grid' },
  { view: 'liste', icon: 'list', testId: 'catalog-view-list' },
] as const

export const ViewToggle = async ({ path, query }: ViewToggleProps) => {
  const t = (await getDictionary()).catalog
  return (
    <nav aria-label={t.display}>
      <Cluster as="ul" gap="2">
        {OPTIONS.map((option) => {
          const isActive = query.view === option.view
          return (
            <li key={option.view}>
              <Link
                href={catalogHref(path, { ...query, view: option.view })}
                scroll={false}
                aria-current={isActive ? 'page' : undefined}
                data-testid={option.testId}
                className={isActive ? 'bui-button' : 'bui-button bui-button--outline'}
              >
                <Icon name={option.icon} />
                {t.views[option.view]}
              </Link>
            </li>
          )
        })}
      </Cluster>
    </nav>
  )
}
