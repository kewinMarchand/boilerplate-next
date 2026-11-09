import { Suspense } from 'react'

import { getDictionary } from '@/shared/i18n/server'
import { Link } from '@/shared/ui/kit'

import { BlogGrid } from './BlogGrid'
import styles from './BlogSection.module.css'
import { LatestArticles } from './LatestArticles'

export const BlogSection = async () => {
  const t = (await getDictionary()).blog
  return (
    <section aria-labelledby="home-blog-title" data-testid="home-blog">
      <h2 id="home-blog-title" className={`bui-text bui-text--h2 ${styles.title}`}>
        {t.latest}
      </h2>
      <Suspense fallback={<BlogGrid status="pending" articles={undefined} />}>
        <LatestArticles />
      </Suspense>
      <p className={styles.all}>
        <Link href="/blog" className="bui-link" data-testid="home-blog-all">
          {t.all}
        </Link>
      </p>
    </section>
  )
}
