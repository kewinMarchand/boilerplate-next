import { notFound } from 'next/navigation'

import { Alert } from '@kewinmarchand/boilerplates-ui/react'

import { blogPostingJsonLd, JsonLd } from '@/shared/seo'
import { largestWebp, Link, Picture, RichHtml } from '@/shared/ui/kit'
import { PageContainer } from '@/shared/ui/layout'

import { articleHref, formatPublishedAt } from '../domain/article'
import { ArticleLoadError } from '../infrastructure/ArticleLoadError'
import { findArticle } from '../infrastructure/articleRepository'
import styles from './ArticleView.module.css'

const HOME = { label: 'Accueil', href: '/' }
const IMAGE_SIZES = '(min-width: 800px) 760px, calc(100vw - 32px)'

interface ArticleViewProps {
  slug: string
}

/** Fiche d'un article : texte en HTML venu de l'API (HTML saisi échappé, liens dangereux retirés), injecté tel quel. */
export const ArticleView = async ({ slug }: ArticleViewProps) => {
  const article = await findArticle(slug).catch((error: unknown) => {
    console.error(error)
    return undefined
  })

  if (article === null) notFound()

  if (article === undefined) {
    return (
      <PageContainer breadcrumb={[HOME, { label: 'Article', href: articleHref(slug) }]}>
        <h1 className={`bui-text bui-text--h1 ${styles.title}`}>Article</h1>
        <div data-testid="article-error">
          <Alert variant="error">{new ArticleLoadError().message}</Alert>
        </div>
      </PageContainer>
    )
  }

  const path = articleHref(article.slug)

  return (
    <PageContainer breadcrumb={[HOME, { label: article.title, href: path }]}>
      <article className={styles.article} data-testid="article-page">
        <h1 className={`bui-text bui-text--h1 ${styles.title}`} data-testid="article-title">
          {article.title}
        </h1>
        <p className={`bui-text bui-text--body-sm ${styles.date}`}>
          Publié le{' '}
          <time dateTime={article.publishedAt}>{formatPublishedAt(article.publishedAt)}</time>
        </p>
        {article.image && (
          <Picture
            image={article.image}
            sizes={IMAGE_SIZES}
            isPriority
            style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8 }}
          />
        )}
        {article.excerpt && (
          <p className={`bui-text bui-text--lead ${styles.excerpt}`}>{article.excerpt}</p>
        )}
        <RichHtml html={article.html} data-testid="article-body" />
        <p className={styles.back}>
          <Link href="/" className="bui-link">
            Retour à l’accueil
          </Link>
        </p>
      </article>
      <JsonLd
        data={blogPostingJsonLd({
          title: article.title,
          description: article.excerpt,
          path,
          publishedAt: article.publishedAt,
          image: article.image ? largestWebp(article.image) : undefined,
        })}
      />
    </PageContainer>
  )
}
