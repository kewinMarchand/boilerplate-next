import { Alert, Skeleton } from '@kewinmarchand/boilerplates-ui/react'

import { Link, Picture } from '@/shared/ui/kit'

import { articleHref, formatPublishedAt } from '../domain/article'
import styles from './BlogGrid.module.css'

import type { Article } from '../domain/article'

interface BlogGridProps {
  status: 'pending' | 'error' | 'success'
  articles: Article.Entity[] | undefined
  errorMessage?: string
}

export const BlogGrid = ({ status, articles, errorMessage }: BlogGridProps) => {
  if (status === 'pending') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Chargement des articles"
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
        <Alert>Aucun article publié pour l'instant. Revenez bientôt !</Alert>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {articles.map((article) => (
        <article
          key={article.id}
          data-testid="home-blog-card"
          className={`bui-card ${styles.card}`}
        >
          {article.image && (
            <Picture
              image={article.image}
              sizes="(min-width: 1440px) 460px, (min-width: 1024px) 33vw, (min-width: 600px) 50vw, 100vw"
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
          )}
          <div className={styles.body}>
            <h3 className={`bui-text bui-text--h3 ${styles.title}`}>
              <Link href={articleHref(article.slug)} className={`bui-link ${styles.link}`}>
                {article.title}
              </Link>
            </h3>
            <p className={`bui-text ${styles.excerpt}`}>{article.excerpt}</p>
            <p className={`bui-text bui-text--body-sm ${styles.date}`}>
              <time dateTime={article.publishedAt}>{formatPublishedAt(article.publishedAt)}</time>
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}
