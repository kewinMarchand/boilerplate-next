import { Link, Picture } from '@/shared/ui/kit'

import { articleHref, formatPublishedAt } from '../domain/article'
import styles from './ArticleCard.module.css'

import type { Article } from '../domain/article'

interface ArticleCardProps {
  article: Article.Entity
  sizes: string
  /** `h2` quand aucun intertitre ne précède la grille (page `/blog`), pour ne pas sauter de niveau. */
  heading?: 'h2' | 'h3'
  'data-testid': string
}

export const ArticleCard = ({
  article,
  sizes,
  heading: Heading = 'h3',
  'data-testid': testId,
}: ArticleCardProps) => (
  <article data-testid={testId} className={`bui-card ${styles.card}`}>
    {article.image && <Picture image={article.image} sizes={sizes} />}
    <div className={styles.body}>
      {article.section && (
        <p className={`bui-text bui-text--body-sm ${styles.section}`} data-testid="article-section">
          {article.section.name}
        </p>
      )}
      <Heading className={`bui-text bui-text--h3 ${styles.title}`}>
        <Link href={articleHref(article.slug)} className={`bui-link ${styles.link}`}>
          {article.title}
        </Link>
      </Heading>
      <p className={`bui-text ${styles.excerpt}`}>{article.excerpt}</p>
      <p className={`bui-text bui-text--body-sm ${styles.date}`}>
        <time dateTime={article.publishedAt}>{formatPublishedAt(article.publishedAt)}</time>
      </p>
    </div>
  </article>
)
