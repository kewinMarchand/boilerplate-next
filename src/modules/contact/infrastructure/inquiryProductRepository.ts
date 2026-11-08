import { ApiError } from '@/shared/api/client'
import { staticApiClient } from '@/shared/api/client.server'

import { toInquiryProduct } from './http/contactTranslation'

import type { Contact } from '../domain/contactSchema'

/** Produit d'une demande de renseignement, lu au rendu serveur de `/contact` ; `null` si l'API ne le connaît pas. */
export const findInquiryProduct = async (slug: string): Promise<Contact.InquiryProduct | null> => {
  const { data, response } = await staticApiClient().GET('/api/products/{slug}', {
    params: { path: { slug } },
  })
  if (response.status === 404) return null
  if (!data) throw new ApiError(response)
  return toInquiryProduct(data)
}
