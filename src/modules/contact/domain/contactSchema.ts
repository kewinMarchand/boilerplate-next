import * as z from 'zod/mini'

// zod/mini plutôt que zod : le schéma part dans le JavaScript du navigateur avec le formulaire,
// et l'API fonctionnelle de zod/mini n'y embarque que les validations utilisées.
export const contactSchema = z.object({
  name: z
    .string()
    .check(z.trim(), z.minLength(2, { error: 'Indiquez votre nom (2 caractères minimum).' })),
  email: z.email({ error: 'Indiquez une adresse e-mail valide, par exemple nom@domaine.fr.' }),
  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(10, { error: 'Votre message doit contenir au moins 10 caractères.' }),
    ),
})

export const CONTACT_PATH = '/contact'

export const inquiryHref = (productSlug: string) =>
  `${CONTACT_PATH}?produit=${encodeURIComponent(productSlug)}`

export declare namespace Contact {
  type FormValues = z.infer<typeof contactSchema>

  /** Produit d'une demande de renseignement : `slug` envoyé avec le message, `name` affiché. */
  interface InquiryProduct {
    slug: string
    name: string
    href: string
  }
}
