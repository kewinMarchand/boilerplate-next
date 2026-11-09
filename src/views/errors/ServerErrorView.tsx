'use client'

import { Button } from '@kewinmarchand/boilerplates-ui/react'

import { useDictionary } from '@/shared/i18n'
import { useReportError } from '@/shared/observability'
import { Icon, Link } from '@/shared/ui/kit'
// Chemins directs : l'index du layout exporte aussi des composants serveur (en-tête, pied de page).
import { Breadcrumb } from '@/shared/ui/layout/Breadcrumb'
import { buildBreadcrumb } from '@/shared/ui/layout/breadcrumbTrail'
import { PageContainer } from '@/shared/ui/layout/PageContainer'

import styles from './errors.module.css'

interface ServerErrorViewProps {
  error?: Error & { digest?: string }
}

export const ServerErrorView = ({ error }: ServerErrorViewProps) => {
  useReportError(error)
  const t = useDictionary()

  return (
    <PageContainer>
      <Breadcrumb
        items={buildBreadcrumb(t.nav, '/', [{ label: t.errors.serverTitle, href: '/500' }])}
        withJsonLd={false}
      />
      <h1 className={`bui-text bui-text--h1 ${styles.title}`}>{t.errors.serverTitle}</h1>
      <p className={`bui-text ${styles.intro}`}>{t.errors.serverIntro}</p>
      <div className={styles.actions}>
        <Button onClick={() => window.location.reload()} data-testid="errors-retry">
          <Icon name="rotate-cw" />
          {t.errors.retry}
        </Button>
        <Link href="/" className="bui-button bui-button--outline" data-testid="errors-home-link">
          {t.errors.home}
        </Link>
      </div>
    </PageContainer>
  )
}
