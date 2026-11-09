import { dictionaryFor } from '@/shared/i18n'
import { getLocale } from '@/shared/i18n/server'
import { buildMetadata } from '@/shared/seo'

import { getSeoSettings } from '@/modules/site'

import { LegalNoticeView } from '@/views/legal'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale()
  return buildMetadata({
    ...dictionaryFor(locale).meta.legalNotice,
    path: '/mentions-legales',
    settings: await getSeoSettings(locale, 'legal-notice'),
  })
}

export default function LegalNoticePage() {
  return <LegalNoticeView />
}
