import { buildMetadata } from '@/shared/seo'
import { largestWebp } from '@/shared/ui/kit'

import { articleHref } from '../domain/article'
import { findArticle, findLatestArticles } from '../infrastructure/articleRepository'

import type { SeoSettings } from '@/shared/seo'
import type { Metadata } from 'next'

export const buildArticleMetadata = async (
  slug: string,
  settings: SeoSettings,
): Promise<Metadata> => {
  // API indisponible : métadonnées génériques, la page affiche l'erreur.
  const article = await findArticle(slug).catch(() => undefined)
  if (article === null) return { title: 'Page introuvable', robots: { index: false, follow: true } }
  if (article === undefined) return { title: 'Article', robots: { index: false, follow: true } }

  return buildMetadata({
    title: article.title,
    description: article.excerpt || article.title,
    path: articleHref(article.slug),
    publishedTime: article.publishedAt,
    settings: { ...settings, title: article.metaTitle, description: article.metaDescription },
    ...(article.image && {
      image: {
        url: largestWebp(article.image),
        width: article.image.width,
        height: article.image.height,
        alt: article.image.alt || article.title,
      },
    }),
  })
}

/** Chemins des fiches pour le sitemap et le pré-rendu ; aucun si l'API ne répond pas. */
export const listArticlePaths = async (): Promise<string[]> =>
  (await findLatestArticles().catch(() => [])).map((article) => articleHref(article.slug))
