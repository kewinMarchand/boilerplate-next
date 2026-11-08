import { buildMetadata } from '@/shared/seo'

import { getSeoSettings } from '@/modules/site'

import { PersonalDataView } from '@/views/legal'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> =>
  buildMetadata({
    title: 'Données personnelles',
    description:
      'Traitement des données du formulaire de contact : responsable, finalité, base légale, durée de conservation, droits et réclamation CNIL.',
    path: '/donnees-personnelles',
    settings: await getSeoSettings('privacy'),
  })

export default function PersonalDataPage() {
  return <PersonalDataView />
}
