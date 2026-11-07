import { ArticleView, buildArticleMetadata, listArticlePaths } from '@/modules/blog'

import type { Metadata } from 'next'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

/** Fiches pré-rendues au build (régénérées comme le reste, toutes les 5 minutes) ; une fiche ajoutée depuis est rendue à la demande. */
export async function generateStaticParams() {
  return (await listArticlePaths()).map((path) => ({ slug: path.split('/').at(-1) }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  return buildArticleMetadata((await params).slug)
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  return <ArticleView slug={(await params).slug} />
}
