import { buildMetadata } from '@/shared/seo'

import { ContactView } from '@/modules/contact'
import { getSeoSettings } from '@/modules/site'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> =>
  buildMetadata({
    title: 'Contact',
    description:
      'Démo de formulaire : validation par schéma zod avec react-hook-form, erreurs liées aux champs et envoi par mutation.',
    path: '/contact',
    settings: await getSeoSettings('contact'),
  })

export default function ContactPage() {
  return <ContactView />
}
