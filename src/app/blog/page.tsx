import { buildMetadata } from '@/shared/seo'

import { BlogView } from '@/modules/blog'

import type { Metadata } from 'next'

export const metadata: Metadata = buildMetadata({
  title: 'Blog',
  description:
    'Tous les articles du blog : accessibilité renforcée, carrousel sans dépendance, rendu serveur et autres choix techniques expliqués.',
  path: '/blog',
})

export default function BlogPage() {
  return <BlogView />
}
