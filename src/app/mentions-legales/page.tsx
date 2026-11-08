import { buildMetadata } from '@/shared/seo'

import { getSeoSettings } from '@/modules/site'

import { LegalNoticeView } from '@/views/legal'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> =>
  buildMetadata({
    title: 'Mentions légales',
    description:
      'Éditeur, directeur de la publication, hébergeur et propriété intellectuelle du site, avec les informations issues de la configuration.',
    path: '/mentions-legales',
    settings: await getSeoSettings('legal-notice'),
  })

export default function LegalNoticePage() {
  return <LegalNoticeView />
}
