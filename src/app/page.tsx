import { buildMetadata } from '@/shared/seo'

import { getSiteIdentity } from '@/modules/site'

import { HomeView } from '@/views/home'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  const { name, tagline } = await getSiteIdentity()
  return buildMetadata({ title: name, description: tagline, path: '/', isAbsoluteTitle: true })
}

export default function HomePage() {
  return <HomeView />
}
