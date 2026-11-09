import { getDictionary } from '@/shared/i18n/server'
import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { LegalPageContent } from '@/modules/content'

export const LegalNoticeView = async () => {
  const t = await getDictionary()
  return (
    <PageContainer breadcrumb={buildBreadcrumb(t.nav, '/mentions-legales')}>
      <LegalPageContent slug="mentions-legales" fallbackTitle={t.nav.legalNotice} />
    </PageContainer>
  )
}
