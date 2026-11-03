import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { LegalPageContent } from '@/modules/content'

export const AccessibilityView = () => (
  <PageContainer breadcrumb={buildBreadcrumb('/accessibilite')}>
    <LegalPageContent slug="accessibilite" fallbackTitle="Déclaration d'accessibilité" />
  </PageContainer>
)
