import { buildMetadata } from '@/shared/seo'

import { BlogView } from '@/modules/blog'
import { getSeoSettings } from '@/modules/site'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> =>
  buildMetadata({
    title: 'Blog',
    description:
      'Tous les articles du blog : accessibilité renforcée, carrousel sans dépendance, rendu serveur et autres choix techniques expliqués.',
    path: '/blog',
    settings: await getSeoSettings('blog'),
  })

interface BlogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  return <BlogView searchParams={await searchParams} />
}
