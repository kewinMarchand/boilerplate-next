import { getDictionary, getLocale } from '@/shared/i18n/server'

import { findLatestArticles } from '../infrastructure/articleRepository'
import { BlogGrid } from './BlogGrid'

export const LatestArticles = async () => {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()])
  const articles = await findLatestArticles(locale).catch((error: unknown) => {
    console.error(error)
    return null
  })

  if (!articles) {
    return <BlogGrid status="error" articles={undefined} errorMessage={t.blog.latestError} />
  }

  return <BlogGrid status="success" articles={articles} />
}
