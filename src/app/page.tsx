import { buildMetadata } from '@/shared/seo'

import { getSeoSettings, getSiteIdentity } from '@/modules/site'

import { HomeView } from '@/views/home'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  const [{ name, tagline }, settings] = await Promise.all([
    getSiteIdentity(),
    getSeoSettings('home'),
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
  return <HomeView />
}
