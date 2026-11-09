import { Text } from '@kewinmarchand/boilerplates-ui/react'

import { getDictionary } from '@/shared/i18n/server'
import { isAudienceMeasurementEnabled } from '@/shared/observability'
import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { LegalPageContent } from '@/modules/content'

import { LegalSection } from './LegalSection'
import { OppositionMesure } from './OppositionMesure'

export const PersonalDataView = async () => {
  const t = await getDictionary()
  return (
    <PageContainer breadcrumb={buildBreadcrumb(t.nav, '/donnees-personnelles')}>
      <LegalPageContent slug="donnees-personnelles" fallbackTitle={t.nav.privacy} />

      {isAudienceMeasurementEnabled && (
        <div data-testid="legal-audience-measurement">
          <LegalSection title={t.legal.audienceTitle}>
            <Text>{t.legal.audienceText}</Text>
            <Text>{t.legal.oppositionText}</Text>
            <OppositionMesure />
          </LegalSection>
        </div>
      )}
    </PageContainer>
  )
}
