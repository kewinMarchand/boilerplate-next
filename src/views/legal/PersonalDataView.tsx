import { Text } from '@kewinmarchand/boilerplates-ui/react'

import { isAudienceMeasurementEnabled } from '@/shared/observability'
import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { LegalPageContent } from '@/modules/content'

import { LegalSection } from './LegalSection'
import { OppositionMesure } from './OppositionMesure'

export const PersonalDataView = () => (
  <PageContainer breadcrumb={buildBreadcrumb('/donnees-personnelles')}>
    <LegalPageContent slug="donnees-personnelles" fallbackTitle="Données personnelles" />

    {isAudienceMeasurementEnabled && (
      <div data-testid="legal-audience-measurement">
        <LegalSection title="Mesure d'audience">
          <Text>
            La fréquentation du site est mesurée avec Matomo, hébergé par l'éditeur, configuré sans
            cookie et sans identifiant : aucun suivi d'un site à l'autre, aucune donnée transmise à
            un tiers. Les statistiques produites sont anonymes et servent uniquement à améliorer le
            site. Les données brutes sont conservées 25 mois au plus.
          </Text>
          <Text>
            Vous pouvez vous opposer à cette mesure : votre choix est gardé dans ce navigateur, sans
            cookie.
          </Text>
          <OppositionMesure />
        </LegalSection>
      </div>
    )}
  </PageContainer>
)
