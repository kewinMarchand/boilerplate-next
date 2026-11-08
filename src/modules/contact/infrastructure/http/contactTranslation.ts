import type { Contact } from '@/modules/contact/domain/contactSchema'
import type { components } from '@/shared/api/client'

type ApiErrorDto = components['schemas']['ConstraintViolation'] | components['schemas']['Error']
type ProductDto = components['schemas']['ProductDetail']

/** `product` : champ caché, son erreur s'affiche pour tout le formulaire. */
export type MessageField = keyof Contact.FormValues | 'product'

export interface FieldError {
  field: MessageField
  message: string
}

const FIELDS: MessageField[] = ['name', 'email', 'message', 'product']

const isField = (path: string): path is MessageField => FIELDS.some((field) => field === path)

/** Violations 422 vers les erreurs de champ. Les messages de l'API sont déjà en français. */
export const toFieldErrors = (dto: ApiErrorDto | undefined): FieldError[] =>
  (dto && 'violations' in dto ? (dto.violations ?? []) : []).flatMap(({ propertyPath, message }) =>
    isField(propertyPath) ? [{ field: propertyPath, message }] : [],
  )

export const toInquiryProduct = (
  dto: Pick<ProductDto, 'slug' | 'name'>,
): Contact.InquiryProduct => ({
  slug: dto.slug,
  name: dto.name,
  href: `/produit/${dto.slug}`,
})
