import { Alert } from '@kewinmarchand/boilerplates-ui/react'

import { blogJsonLd, JsonLd } from '@/shared/seo'
import { Link } from '@/shared/ui/kit'
import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { articleHref } from '../domain/article'
import { findArticles } from '../infrastructure/articleRepository'
import { ArticlesLoadError } from '../infrastructure/ArticlesLoadError'
import { ArticleCard } from './ArticleCard'
import styles from './BlogView.module.css'

const BLOG_PATH = '/blog'
const CARD_SIZES =
  '(min-width: 1440px) 460px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'

export const BlogView = async () => {
  const articles = await findArticles().catch((error: unknown) => {
    console.error(error)
    return null
  })

  return (
    <PageContainer breadcrumb={buildBreadcrumb(BLOG_PATH)}>
      <h1 className={`bui-text bui-text--h1 ${styles.title}`}>Blog</h1>
      {!articles ? (
        <div data-testid="blog-error">
          <Alert
            variant="error"
            action={
              <Link
                href={BLOG_PATH}
                className="bui-button bui-button--ghost"
                data-testid="blog-retry"
              >
                Réessayer
              </Link>
            }
          >
            {new ArticlesLoadError().message}
          </Alert>
        </div>
      ) : articles.length === 0 ? (
        <div data-testid="blog-empty">
          <Alert>Aucun article publié pour l'instant. Revenez bientôt !</Alert>
        </div>
      ) : (
        <div className={styles.list} data-testid="blog-list">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              sizes={CARD_SIZES}
              heading="h2"
              data-testid="blog-card"
            />
          ))}
        </div>
      )}
      <JsonLd
        data={blogJsonLd(
          BLOG_PATH,
          (articles ?? []).map((article) => ({
            title: article.title,
            path: articleHref(article.slug),
            publishedAt: article.publishedAt,
          })),
        )}
      />
    </PageContainer>
  )
}
