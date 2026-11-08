import { buildCatalogMetadata, CatalogView } from '@/modules/catalog'
import { getSeoSettings, getSiteIdentity } from '@/modules/site'

import type { Metadata } from 'next'

interface CatalogPageProps {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({
  params,
  searchParams,
}: CatalogPageProps): Promise<Metadata> {
  const [{ slug = [] }, query, settings, { salesEnabled }] = await Promise.all([
    params,
    searchParams,
    getSeoSettings('catalog'),
    getSiteIdentity(),
  ])
  return buildCatalogMetadata(slug, query, settings, salesEnabled)
}

export default async function CatalogPage({ params, searchParams }: CatalogPageProps) {
  const [{ slug = [] }, query, { salesEnabled }] = await Promise.all([
    params,
    searchParams,
    getSiteIdentity(),
  ])
  return <CatalogView slugs={slug} searchParams={query} salesEnabled={salesEnabled} />
}
