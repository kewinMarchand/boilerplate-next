import { dictionaryFor } from '@/shared/i18n/dictionaries'
import { getLocale } from '@/shared/i18n/server'
import { buildMetadata } from '@/shared/seo'

import { getSeoSettings } from '@/modules/site'

import { AccessibilityView } from '@/views/legal'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale()
  return buildMetadata({
    ...dictionaryFor(locale).meta.accessibility,
    path: '/accessibilite',
    settings: await getSeoSettings(locale, 'accessibility'),
  })
}

export default function AccessibilityPage() {
  return <AccessibilityView />
}
