import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { LegalPageContent } from '@/modules/content'

export const LegalNoticeView = () => (
  <PageContainer breadcrumb={buildBreadcrumb('/mentions-legales')}>
    <LegalPageContent slug="mentions-legales" fallbackTitle="Mentions légales" />
  </PageContainer>
)
