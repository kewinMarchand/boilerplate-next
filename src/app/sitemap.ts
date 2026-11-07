import { SITE, SITE_MAP } from '@/shared/config'

import { listArticlePaths } from '@/modules/blog'
import { listCatalogPaths, listProductPaths } from '@/modules/catalog'

import type { MetadataRoute } from 'next'

export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [catalog, products, articles] = await Promise.all([
    listCatalogPaths(),
    listProductPaths(),
    listArticlePaths(),
  ])
  return [...SITE_MAP.map(({ href }) => href), ...catalog, ...products, ...articles].map(
    (href) => ({
      url: `${SITE.url}${href}`,
    }),
  )
}
