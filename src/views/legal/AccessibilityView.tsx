import { getDictionary } from '@/shared/i18n/server'
import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { LegalPageContent } from '@/modules/content'

export const AccessibilityView = async () => {
  const t = await getDictionary()
  return (
    <PageContainer breadcrumb={buildBreadcrumb(t.nav, '/accessibilite')}>
      <LegalPageContent slug="accessibilite" fallbackTitle={t.legal.accessibilityTitle} />
    </PageContainer>
  )
}
