import { ApiError } from '@/shared/api/client'
import { staticApiClient } from '@/shared/api/client.server'

import { toPageMetas } from './http/pageMetaTranslation'

export const findPageMetas = async () => {
  const { data, response } = await staticApiClient().GET('/api/page-metas')
  if (!data) throw new ApiError(response)
  return toPageMetas(data)
}
