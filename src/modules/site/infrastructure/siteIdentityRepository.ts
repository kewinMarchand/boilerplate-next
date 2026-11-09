import { ApiError } from '@/shared/api/client'
import { staticApiClient } from '@/shared/api/client.server'

import { toSiteIdentity } from './http/siteIdentityTranslation'

import type { SiteIdentity } from '../domain/siteIdentity'

/** `locale` absent : langue par défaut du site (manifeste, feuille de couleurs, routage). */
export const findSiteIdentity = async (
  locale?: string,
  signal?: AbortSignal,
): Promise<SiteIdentity.Entity> => {
  const { data, response } = await staticApiClient().GET('/api/site-identity', {
    params: { query: locale ? { locale } : {} },
    ...(signal && { signal }),
  })
  if (!data) throw new ApiError(response)
  return toSiteIdentity(data)
}
