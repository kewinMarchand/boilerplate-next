import { SITE, SITE_MAP } from '@/shared/config'

import { listArticlePaths } from '@/modules/blog'
import { listCatalogPaths } from '@/modules/catalog'

import type { MetadataRoute } from 'next'

export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [catalog, articles] = await Promise.all([listCatalogPaths(), listArticlePaths()])
  return [...SITE_MAP.map(({ href }) => href), ...catalog, ...articles].map((href) => ({
    url: `${SITE.url}${href}`,
  }))
}
