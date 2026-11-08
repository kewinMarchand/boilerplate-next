import { ApiError } from '@/shared/api/client'
import { serverApiClient, staticApiClient } from '@/shared/api/client.server'

import { toArticle, toArticleDetail, toArticleTerm } from './http/articleTranslation'

import type { Article } from '../domain/article'

const listArticles = async (
  client: ReturnType<typeof staticApiClient>,
  section?: string,
): Promise<Article.Entity[]> => {
  const { data, response } = await client.GET('/api/articles', {
    params: { query: section ? { section } : {} },
  })
  if (!data) throw new ApiError(response)
  return data.map(toArticle)
}

export const findLatestArticles = () => listArticles(staticApiClient())

/**
 * Un build de test (`ENABLE_TEST_ROUTES=1`) relaie `X-Scenario`, pour que les tests e2e provoquent
 * les états d'erreur et de liste vide de `/blog`.
 */
const blogPageClient = async () =>
  process.env.ENABLE_TEST_ROUTES === '1' ? serverApiClient() : staticApiClient()

/** Page `/blog`, filtrée par rubrique (slug inconnu : liste vide). */
export const findArticles = async (section?: string) =>
  listArticles(await blogPageClient(), section)

/** Rubriques par position, y compris celles qu'aucun article ne porte. */
export const findArticleSections = async (): Promise<Article.Term[]> => {
  const { data, response } = await (await blogPageClient()).GET('/api/article-sections')
  if (!data) throw new ApiError(response)
  return data.map(toArticleTerm)
}

/** `null` si l'API ne connaît pas l'article (404). */
export const findArticle = async (slug: string): Promise<Article.Detail | null> => {
  const { data, response } = await staticApiClient().GET('/api/articles/{slug}', {
    params: { path: { slug } },
  })
  if (response.status === 404) return null
  if (!data) throw new ApiError(response)
  return toArticleDetail(data)
}
