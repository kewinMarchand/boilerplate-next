import { CATALOG_NAVIGATION } from '@/shared/config'
import { getDictionary } from '@/shared/i18n/server'
import { Link } from '@/shared/ui/kit'
import { Breadcrumb, buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import styles from './errors.module.css'

export const NotFoundView = async () => {
  const t = await getDictionary()
  return (
    <PageContainer>
      <Breadcrumb
        items={buildBreadcrumb(t.nav, '/', [{ label: t.errors.notFoundTitle, href: '/404' }])}
        withJsonLd={false}
      />
      <h1 className={`bui-text bui-text--h1 ${styles.title}`}>{t.errors.notFoundTitle}</h1>
      <p className={`bui-text ${styles.intro}`}>{t.errors.notFoundIntro}</p>
      <div className={styles.actions}>
        <Link href="/" className="bui-button" data-testid="errors-home-link">
          {t.errors.home}
        </Link>
        <Link href="/plan-du-site" className="bui-button bui-button--outline">
          {t.nav.sitemap}
        </Link>
        <Link href={CATALOG_NAVIGATION.href} className="bui-button bui-button--outline">
          {t.nav.catalog}
        </Link>
      </div>
    </PageContainer>
  )
}
