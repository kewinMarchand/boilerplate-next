import { notFound } from 'next/navigation'

import { Cluster } from '@kewinmarchand/boilerplates-ui/react'

import { itemListJsonLd, JsonLd } from '@/shared/seo'
import { Link, PicturePreload } from '@/shared/ui/kit'
import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { loadCatalogPage } from '../application/loadCatalogPage'
import { catalogHref, clearFilters } from '../domain/catalogQuery'
import { CATALOG_ROOT_PATH, categoryHref, categoryTrail } from '../domain/categoryPath'
import { ActiveFilters } from './ActiveFilters'
import { CatalogFilters } from './CatalogFilters'
import { CatalogPagination } from './CatalogPagination'
import { CatalogTitle } from './CatalogTitle'
import { CatalogTransitionProvider, PendingResults } from './CatalogTransition'
import styles from './CatalogView.module.css'
import { PRODUCT_IMAGE_SIZES } from './ProductCard'
import { ProductResults } from './ProductResults'
import { SortSelect } from './SortSelect'
import { ViewToggle } from './ViewToggle'

import type { SearchParams } from '../domain/catalogQuery'

interface CatalogViewProps {
  slugs: string[]
  searchParams: SearchParams
  /** Vente en ligne coupée : ni prix, ni filtre ni tri par prix. */
  salesEnabled: boolean
}

const productCount = (count: number) => `${count} produit${count > 1 ? 's' : ''}`

export const CatalogView = async ({ slugs, searchParams, salesEnabled }: CatalogViewProps) => {
  const load = await loadCatalogPage(slugs, searchParams, salesEnabled)
  if (load.status === 'not-found') notFound()

  const { query, categoryPath, subcategories, result } = load
  const page = result.status === 'success' ? result.page : null
  const path = categoryHref(slugs)
  const title = categoryPath.at(-1)?.name ?? 'Catalogue'
  const href = catalogHref(path, query)

  const firstImage = page?.products[0]?.image

  return (
    <>
      {firstImage && <PicturePreload image={firstImage} sizes={PRODUCT_IMAGE_SIZES} />}
      <PageContainer breadcrumb={buildBreadcrumb(CATALOG_ROOT_PATH, categoryTrail(categoryPath))}>
        <CatalogTitle title={title} focusKey={href} />
        {subcategories.length > 0 && (
          <ul aria-label="Sous-catégories" className={`bui-chip-list ${styles.subcategories}`}>
            {subcategories.map((child) => (
              <li key={child.slug}>
                <Link href={child.href} className="bui-chip">
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <CatalogTransitionProvider>
          <div className={styles.layout}>
            <div>
              {page && (
                <CatalogFilters
                  path={path}
                  query={query}
                  facets={page.facets}
                  subcategories={page.subcategories}
                  total={page.total}
                  salesEnabled={salesEnabled}
                />
              )}
            </div>
            <div>
              <ActiveFilters
                path={path}
                query={query}
                attributeFacets={page?.facets.attributes ?? []}
              />
              <Cluster justify="between" gap="4" className={styles.toolbar}>
                <p role="status" className={styles.count} data-testid="catalog-results-count">
                  {page ? productCount(page.total) : ''}
                </p>
                <Cluster gap="4">
                  <SortSelect path={path} query={query} salesEnabled={salesEnabled} />
                  <ViewToggle path={path} query={query} />
                </Cluster>
              </Cluster>
              {result.status === 'success' ? (
                <>
                  <PendingResults view={query.view}>
                    <ProductResults
                      status="success"
                      products={result.page.products}
                      view={query.view}
                      clearHref={catalogHref(path, clearFilters(query))}
                      salesEnabled={salesEnabled}
                    />
                  </PendingResults>
                  <CatalogPagination
                    path={path}
                    query={query}
                    page={result.page.page}
                    pageCount={result.page.pageCount}
                  />
                  <JsonLd
                    data={itemListJsonLd(
                      path,
                      result.page.products.map((product) => product.name),
                    )}
                  />
                </>
              ) : (
                <ProductResults
                  status="error"
                  products={undefined}
                  view={query.view}
                  errorMessage={result.message}
                  retryHref={href}
                />
              )}
            </div>
          </div>
        </CatalogTransitionProvider>
      </PageContainer>
    </>
  )
}
