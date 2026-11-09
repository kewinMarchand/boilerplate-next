import { getLocale } from '@/shared/i18n/server'

import { buildCatalogMetadata, CatalogView } from '@/modules/catalog'
import { getLocaleContext, getSeoSettings, getSiteIdentity } from '@/modules/site'

import type { Metadata } from 'next'

interface CatalogPageProps {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({
  params,
  searchParams,
}: CatalogPageProps): Promise<Metadata> {
  const lang = await getLocale()
  const [{ slug = [] }, query, settings, { salesEnabled }] = await Promise.all([
    params,
    searchParams,
    getSeoSettings(lang, 'catalog'),
    getSiteIdentity(lang),
  ])
  return buildCatalogMetadata(slug, query, settings, salesEnabled)
}

export default async function CatalogPage({ params, searchParams }: CatalogPageProps) {
  const lang = await getLocale()
  const [{ slug = [] }, query, { salesEnabled }, locale] = await Promise.all([
    params,
    searchParams,
    getSiteIdentity(lang),
    getLocaleContext(lang),
  ])
  return (
    <CatalogView slugs={slug} searchParams={query} salesEnabled={salesEnabled} locale={locale} />
  )
}
