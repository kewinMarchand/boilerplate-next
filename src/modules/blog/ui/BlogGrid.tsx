import { Alert, Skeleton } from '@kewinmarchand/boilerplates-ui/react'

import { getDictionary } from '@/shared/i18n/server'

import { ArticleCard } from './ArticleCard'
import styles from './BlogGrid.module.css'

import type { Article } from '../domain/article'

const LATEST_COUNT = 3
const FEATURED_SIZES = '(min-width: 1440px) 920px, (min-width: 1024px) 66vw, 100vw'
const SIDE_SIZES =
  '(min-width: 1440px) 460px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'

interface BlogGridProps {
  status: 'pending' | 'error' | 'success'
  articles: Article.Entity[] | undefined
  errorMessage?: string
}

export const BlogGrid = async ({ status, articles, errorMessage }: BlogGridProps) => {
  const { blog: t, language } = await getDictionary()
  if (status === 'pending') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label={t.loading}
        data-testid="home-blog-loading"
        className={styles.grid}
      >
        {[1, 2, 3].map((key) => (
          <Skeleton key={key} height="160px" />
        ))}
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div data-testid="home-blog-error">
        <Alert variant="error">{errorMessage}</Alert>
      </div>
    )
  }

  if (!articles?.length) {
    return (
      <div data-testid="home-blog-empty">
        <Alert>{t.empty}</Alert>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {articles.slice(0, LATEST_COUNT).map((article, index) => (
        <ArticleCard
          key={article.id}
          article={article}
          sizes={index === 0 ? FEATURED_SIZES : SIDE_SIZES}
          tag={language.tag}
          data-testid="home-blog-card"
        />
      ))}
    </div>
  )
}
