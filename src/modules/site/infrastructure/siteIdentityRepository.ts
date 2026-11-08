import { ApiError } from '@/shared/api/client'
import { staticApiClient } from '@/shared/api/client.server'

import { toSiteIdentity } from './http/siteIdentityTranslation'

import type { SiteIdentity } from '../domain/siteIdentity'

export const findSiteIdentity = async (): Promise<SiteIdentity.Entity> => {
  const { data, response } = await staticApiClient().GET('/api/site-identity')
  if (!data) throw new ApiError(response)
  return toSiteIdentity(data)
}
