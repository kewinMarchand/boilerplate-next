import { notFound } from 'next/navigation'

import { Alert } from '@kewinmarchand/boilerplates-ui/react'

import { localizePath } from '@/shared/i18n'
import { getDictionary } from '@/shared/i18n/server'
import { blogPostingJsonLd, JsonLd } from '@/shared/seo'
import { largestWebp, Link, Picture, RichHtml } from '@/shared/ui/kit'
import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { articleHref, formatPublishedAt } from '../domain/article'
import { findArticle } from '../infrastructure/articleRepository'
import { ArticleAudio } from './ArticleAudio'
import styles from './ArticleView.module.css'

import type { LocaleContext } from '@/shared/i18n'

const IMAGE_SIZES = '(min-width: 800px) 760px, calc(100vw - 32px)'

interface ArticleViewProps {
  slug: string
  locale: LocaleContext
}

/** Fiche d'un article : texte en HTML venu de l'API (HTML saisi échappé, liens dangereux retirés), injecté tel quel. */
export const ArticleView = async ({ slug, locale }: ArticleViewProps) => {
  const [article, t] = await Promise.all([
    findArticle(slug, locale.locale).catch((error: unknown) => {
      console.error(error)
      return undefined
    }),
    getDictionary(),
  ])

  if (article === null) notFound()

  if (article === undefined) {
    return (
      <PageContainer
        breadcrumb={buildBreadcrumb(t.nav, '/blog', [
          { label: t.blog.articleFallbackTitle, href: articleHref(slug) },
        ])}
      >
        <h1 className={`bui-text bui-text--h1 ${styles.title}`}>{t.blog.articleFallbackTitle}</h1>
        <div data-testid="article-error">
          <Alert variant="error" prefix={t.ui.alert.error}>
            {t.blog.articleError}
          </Alert>
        </div>
      </PageContainer>
    )
  }

  const path = articleHref(article.slug)

  return (
    <PageContainer
      breadcrumb={buildBreadcrumb(t.nav, '/blog', [{ label: article.title, href: path }])}
    >
      <article className={styles.article} data-testid="article-page">
        <h1 className={`bui-text bui-text--h1 ${styles.title}`} data-testid="article-title">
          {article.title}
        </h1>
        {(article.section || article.format) && (
          <p className={`bui-text bui-text--body-sm ${styles.terms}`}>
            {article.section && <span data-testid="article-section">{article.section.name}</span>}
            {article.format && <span data-testid="article-format">{article.format.name}</span>}
          </p>
        )}
        <p className={`bui-text bui-text--body-sm ${styles.date}`}>
          {t.blog.publishedOn}
          <time dateTime={article.publishedAt}>
            {formatPublishedAt(article.publishedAt, t.language.tag)}
          </time>
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
        {article.audio && <ArticleAudio audio={article.audio} speaker={article.speaker} />}
        <RichHtml html={article.html} data-testid="article-body" />
        <p className={styles.back}>
          <Link href="/blog" className="bui-link" data-testid="article-blog-link">
            {t.blog.all}
          </Link>
        </p>
      </article>
      <JsonLd
        data={blogPostingJsonLd({
          title: article.title,
          description: article.excerpt,
          path: localizePath(path, locale.locale, locale.defaultLocale),
          publishedAt: article.publishedAt,
          image: article.image ? largestWebp(article.image) : undefined,
          inLanguage: t.language.tag,
        })}
      />
    </PageContainer>
  )
}
