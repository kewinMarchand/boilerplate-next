import { getSiteIdentity, manifestIcons } from '@/modules/site'

import type { MetadataRoute } from 'next'

export const revalidate = 300

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { name, tagline, theme, icon } = await getSiteIdentity()
  return {
    name,
    short_name: name,
    description: tagline,
    lang: 'fr',
    start_url: '/',
    display: 'standalone',
    theme_color: theme?.light.primary ?? '#1d4ed8',
    background_color: '#ffffff',
    icons: manifestIcons(icon),
  }
}
