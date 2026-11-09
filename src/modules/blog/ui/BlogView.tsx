import { Alert } from '@kewinmarchand/boilerplates-ui/react'

import { localizePath } from '@/shared/i18n'
import { getDictionary } from '@/shared/i18n/server'
import { blogJsonLd, JsonLd } from '@/shared/seo'
import { Link } from '@/shared/ui/kit'
import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { articleHref, sectionParam } from '../domain/article'
import { findArticles, findArticleSections } from '../infrastructure/articleRepository'
import { ArticleCard } from './ArticleCard'
import styles from './BlogView.module.css'
import { SectionFilter } from './SectionFilter'

import type { LocaleContext } from '@/shared/i18n'

const BLOG_PATH = '/blog'
const CARD_SIZES =
  '(min-width: 1440px) 460px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'

interface BlogViewProps {
  searchParams: Record<string, string | string[] | undefined>
  locale: LocaleContext
}

export const BlogView = async ({ searchParams, locale }: BlogViewProps) => {
  const section = sectionParam(searchParams.rubrique)
  const localize = (path: string) => localizePath(path, locale.locale, locale.defaultLocale)
  const [articles, sections, t] = await Promise.all([
    findArticles(locale.locale, section).catch((error: unknown) => {
      console.error(error)
      return null
    }),
    // Sans rubriques lisibles, le filtre disparaît : la liste reste l'essentiel.
    findArticleSections(locale.locale).catch((error: unknown) => {
      console.error(error)
      return []
    }),
    getDictionary(),
  ])

  return (
    <PageContainer breadcrumb={buildBreadcrumb(t.nav, BLOG_PATH)}>
      <h1 className={`bui-text bui-text--h1 ${styles.title}`}>{t.blog.title}</h1>
      {sections.length > 0 && <SectionFilter sections={sections} active={section} />}
      {!articles ? (
        <div data-testid="blog-error">
          <Alert
            variant="error"
            action={
              <Link
                href={section ? `${BLOG_PATH}?rubrique=${encodeURIComponent(section)}` : BLOG_PATH}
                className="bui-button bui-button--ghost"
                data-testid="blog-retry"
              >
                {t.blog.retry}
              </Link>
            }
          >
            {t.blog.latestError}
          </Alert>
        </div>
      ) : articles.length === 0 ? (
        <div data-testid="blog-empty">
          <Alert>{t.blog.empty}</Alert>
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
          { name: t.blog.title, path: localize(BLOG_PATH), inLanguage: t.language.tag },
          (articles ?? []).map((article) => ({
            title: article.title,
            path: localize(articleHref(article.slug)),
            publishedAt: article.publishedAt,
          })),
        )}
      />
    </PageContainer>
  )
}
