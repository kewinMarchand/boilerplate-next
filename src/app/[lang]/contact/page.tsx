import { dictionaryFor } from '@/shared/i18n'
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
  return <ContactView searchParams={await searchParams} />
}
