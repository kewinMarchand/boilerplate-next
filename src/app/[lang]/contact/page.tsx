import { dictionaryFor } from '@/shared/i18n/dictionaries'
import { PageDictionary } from '@/shared/i18n/PageDictionary'
import { getLocale } from '@/shared/i18n/server'
import { buildMetadata } from '@/shared/seo'

import { ContactView } from '@/modules/contact'
import { getSeoSettings } from '@/modules/site'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale()
  return buildMetadata({
    ...dictionaryFor(locale).meta.contact,
    path: '/contact',
    settings: await getSeoSettings(locale, 'contact'),
  })
}

interface ContactPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  return (
    <PageDictionary sections={['contact', 'ui']}>
      <ContactView searchParams={await searchParams} />
    </PageDictionary>
  )
}
