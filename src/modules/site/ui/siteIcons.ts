import type { SiteIdentity } from '../domain/siteIdentity'
import type { Metadata, MetadataRoute } from 'next'

const SITE_ICONS: Metadata['icons'] = {
  icon: [
    { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
    { url: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
  ],
  apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
}

/** Favicons tirés de l'icône saisie dans l'admin, sinon les fichiers du site. */
export const siteIcons = (icon: SiteIdentity.Icon | null): Metadata['icons'] =>
  icon
    ? {
        icon: [{ url: icon.png32, sizes: '32x32', type: 'image/png' }],
        apple: [{ url: icon.png180, sizes: '180x180', type: 'image/png' }],
      }
    : SITE_ICONS

export const manifestIcons = (icon: SiteIdentity.Icon | null): MetadataRoute.Manifest['icons'] => [
  { src: icon?.png192 ?? '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
  { src: icon?.png512 ?? '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
]
