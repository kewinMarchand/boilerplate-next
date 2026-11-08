import { buildMetadata } from '@/shared/seo'

import { getSeoSettings } from '@/modules/site'

import { AccessibilityView } from '@/views/legal'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> =>
  buildMetadata({
    title: 'Déclaration d’accessibilité',
    description:
      'Déclaration d’accessibilité RGAA 4.1.2 : état de conformité, tests menés, mode accessibilité renforcée, contact et voies de recours.',
    path: '/accessibilite',
    settings: await getSeoSettings('accessibility'),
  })

export default function AccessibilityPage() {
  return <AccessibilityView />
}
