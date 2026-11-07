import { ApiError } from '@/shared/api/client'
import { staticApiClient } from '@/shared/api/client.server'

import { toArticle, toArticleDetail } from './http/articleTranslation'

import type { Article } from '../domain/article'

export const findLatestArticles = async (): Promise<Article.Entity[]> => {
  const { data, response } = await staticApiClient().GET('/api/articles')
  if (!data) throw new ApiError(response)
  return data.map(toArticle)
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
