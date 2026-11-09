import { alternatesByKey, MONOLINGUAL } from '@/shared/i18n'
import { dictionaryFor } from '@/shared/i18n/dictionaries'
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
  const { locale } = settings.locale ?? MONOLINGUAL
  const t = dictionaryFor(locale)
  // API indisponible : métadonnées génériques, la page affiche l'erreur.
  const article = await findArticle(slug, locale).catch(() => undefined)
  if (article === null)
    return { title: t.errors.notFoundTitle, robots: { index: false, follow: true } }
  if (article === undefined) {
    return { title: t.blog.articleFallbackTitle, robots: { index: false, follow: true } }
  }

  return buildMetadata({
    title: article.title,
    description: article.excerpt || article.title,
    path: articleHref(article.slug),
    publishedTime: article.publishedAt,
    settings: { ...settings, title: article.metaTitle, description: article.metaDescription },
    alternates: article.alternates,
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

/** Chemins des fiches d'une langue pour le pré-rendu ; aucun si l'API ne répond pas. */
export const listArticlePaths = async (locale: string): Promise<string[]> =>
  (await findLatestArticles(locale).catch(() => [])).map((article) => articleHref(article.slug))

/** La fiche dans chaque langue (sélecteur de langue) ; aucune si l'API ne la connaît pas ou ne répond pas. */
export const loadArticleAlternates = async (slug: string, locale: string) =>
  (await findArticle(slug, locale).catch(() => null))?.alternates ?? []

/** Chemins des fiches pour le sitemap, chacune dans chaque langue du site ; aucun si l'API ne répond pas. */
export const listArticlePathAlternates = async (locales: string[]) =>
  alternatesByKey(
    await Promise.all(
      locales.map(async (locale) => ({
        locale,
        entries: (await findLatestArticles(locale).catch(() => [])).map((article) => ({
          key: article.id,
          path: articleHref(article.slug),
        })),
      })),
    ),
  )
