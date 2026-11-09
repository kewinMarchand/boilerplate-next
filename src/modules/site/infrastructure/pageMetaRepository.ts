import { ApiError } from '@/shared/api/client'
import { staticApiClient } from '@/shared/api/client.server'

import { toPageMetas } from './http/pageMetaTranslation'

export const findPageMetas = async (locale: string) => {
  const { data, response } = await staticApiClient().GET('/api/page-metas', {
    params: { query: { locale } },
  })
  if (!data) throw new ApiError(response)
  return toPageMetas(data)
}
