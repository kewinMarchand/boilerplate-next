import { dictionaryFor } from '@/shared/i18n/dictionaries'
import { getLocale } from '@/shared/i18n/server'
import { buildMetadata } from '@/shared/seo'

import { getSeoSettings } from '@/modules/site'

import { SitemapView } from '@/views/legal'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale()
  return buildMetadata({
    ...dictionaryFor(locale).meta.sitemap,
    path: '/plan-du-site',
    settings: await getSeoSettings(locale, 'sitemap'),
  })
}

export default function SitemapPage() {
  return <SitemapView />
}
