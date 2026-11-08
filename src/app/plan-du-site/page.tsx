import { buildMetadata } from '@/shared/seo'

import { getSeoSettings } from '@/modules/site'

import { SitemapView } from '@/views/legal'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> =>
  buildMetadata({
    title: 'Plan du site',
    description:
      'Plan du site : liste de toutes les pages, générée depuis la configuration de navigation qui alimente aussi le sitemap XML.',
    path: '/plan-du-site',
    settings: await getSeoSettings('sitemap'),
  })

export default function SitemapPage() {
  return <SitemapView />
}
