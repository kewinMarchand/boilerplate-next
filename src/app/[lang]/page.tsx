import { PageDictionary } from '@/shared/i18n/PageDictionary'
import { getLocale } from '@/shared/i18n/server'
import { buildMetadata } from '@/shared/seo'

import { getSeoSettings, getSiteIdentity } from '@/modules/site'

import { HomeView } from '@/views/home'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale()
  const [{ name, tagline }, settings] = await Promise.all([
    getSiteIdentity(locale),
    getSeoSettings(locale, 'home'),
  ])
  return buildMetadata({
    title: name,
    description: tagline,
    path: '/',
    isAbsoluteTitle: true,
    settings,
  })
}

export default function HomePage() {
  return (
    <PageDictionary sections={['carousel']}>
      <HomeView />
    </PageDictionary>
  )
}
