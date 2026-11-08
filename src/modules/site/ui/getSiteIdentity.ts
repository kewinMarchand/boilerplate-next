import { cache } from 'react'

import { SITE } from '@/shared/config'

import { findSiteIdentity } from '../infrastructure/siteIdentityRepository'

import type { SiteIdentity } from '../domain/siteIdentity'

const FALLBACK: SiteIdentity.Entity = {
  name: SITE.name,
  tagline: SITE.description,
  logo: null,
  icon: null,
  shareImage: null,
  defaultColorScheme: 'auto',
  theme: null,
}

/**
 * Lue une fois par rendu (layout, métadonnées et page la partagent), sans en-tête de requête : les
 * pages restent statiques et se régénèrent avec elles. API en erreur : la configuration du site.
 */
export const getSiteIdentity = cache(() =>
  findSiteIdentity().catch((error: unknown) => {
    console.error(error)
    return FALLBACK
  }),
)
