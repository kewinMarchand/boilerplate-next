import { dictionaryFor } from '@/shared/i18n/dictionaries'
import { getLocale } from '@/shared/i18n/server'
import { buildMetadata } from '@/shared/seo'

import { getSeoSettings } from '@/modules/site'

import { PersonalDataView } from '@/views/legal'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale()
  return buildMetadata({
    ...dictionaryFor(locale).meta.privacy,
    path: '/donnees-personnelles',
    settings: await getSeoSettings(locale, 'privacy'),
  })
}

export default function PersonalDataPage() {
  return <PersonalDataView />
}
