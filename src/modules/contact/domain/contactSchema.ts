import * as z from 'zod/mini'

/** Messages d'erreur des champs, dans la langue de la page. */
export interface ContactMessages {
  name: string
  email: string
  message: string
}

// zod/mini plutôt que zod : le schéma part dans le JavaScript du navigateur avec le formulaire,
// et l'API fonctionnelle de zod/mini n'y embarque que les validations utilisées.
export const createContactSchema = (messages: ContactMessages) =>
  z.object({
    name: z.string().check(z.trim(), z.minLength(2, { error: messages.name })),
    email: z.email({ error: messages.email }),
    message: z.string().check(z.trim(), z.minLength(10, { error: messages.message })),
  })

export const CONTACT_PATH = '/contact'

export const inquiryHref = (productSlug: string) =>
  `${CONTACT_PATH}?produit=${encodeURIComponent(productSlug)}`

export declare namespace Contact {
  type FormValues = z.infer<ReturnType<typeof createContactSchema>>

  /** Produit d'une demande de renseignement : `slug` envoyé avec le message, `name` affiché. */
  interface InquiryProduct {
    slug: string
    name: string
    href: string
  }
}
