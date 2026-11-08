import { buildCatalogMetadata, CatalogView } from '@/modules/catalog'
import { getSeoSettings } from '@/modules/site'

import type { Metadata } from 'next'

interface CatalogPageProps {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({
  params,
  searchParams,
}: CatalogPageProps): Promise<Metadata> {
  const [{ slug = [] }, query, settings] = await Promise.all([
    params,
    searchParams,
    getSeoSettings('catalog'),
  ])
  return buildCatalogMetadata(slug, query, settings)
}

export default async function CatalogPage({ params, searchParams }: CatalogPageProps) {
  const [{ slug = [] }, query] = await Promise.all([params, searchParams])
  return <CatalogView slugs={slug} searchParams={query} />
}
