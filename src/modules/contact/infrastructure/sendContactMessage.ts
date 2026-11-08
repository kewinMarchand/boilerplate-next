import { ApiError, browserApiClient } from '@/shared/api/client'

import { toFieldErrors } from './http/contactTranslation'

import type { Contact } from '../domain/contactSchema'
import type { FieldError } from './http/contactTranslation'

export type ContactSendResult =
  { status: 'sent' } | { status: 'invalid'; fieldErrors: FieldError[] }

export interface ContactMessage extends Contact.FormValues {
  /** Slug du produit d'une demande de renseignement, `null` pour un message de contact simple. */
  product: string | null
}

/** Appelée dans le navigateur, par la mutation du formulaire. */
export const sendContactMessage = async (message: ContactMessage): Promise<ContactSendResult> => {
  const { error, response } = await browserApiClient().POST('/api/contact_messages', {
    body: message,
  })
  if (response.status === 422) return { status: 'invalid', fieldErrors: toFieldErrors(error) }
  if (!response.ok) throw new ApiError(response)
  return { status: 'sent' }
}
