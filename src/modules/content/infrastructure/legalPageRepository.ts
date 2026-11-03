import { ApiError } from '@/shared/api/client'
import { staticApiClient } from '@/shared/api/client.server'

import { toLegalPage } from './http/legalPageTranslation'

import type { LegalPage } from '../domain/legalPage'

/** `null` si l'API ne connaît pas la page (404). */
export const findLegalPage = async (slug: LegalPage.Slug): Promise<LegalPage.Entity | null> => {
  const { data, response } = await staticApiClient().GET('/api/legal_pages/{slug}', {
    params: { path: { slug } },
  })
  if (response.status === 404) return null
  if (!data) throw new ApiError(response)
  return toLegalPage(data)
}
