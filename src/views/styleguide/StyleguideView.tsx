import { Text } from '@kewinmarchand/boilerplates-ui/react'

import { FALLBACK_LOCALE } from '@/shared/i18n'
import { dictionaryFor } from '@/shared/i18n/dictionaries'
import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { ButtonsSection } from './sections/ButtonsSection'
import { ColorsSection } from './sections/ColorsSection'
import { FeedbackSection } from './sections/FeedbackSection'
import { FormsSection } from './sections/FormsSection'
import { IconsLogoSection } from './sections/IconsLogoSection'
import { MediaSection } from './sections/MediaSection'
import { NavigationSection } from './sections/NavigationSection'
import { SpacingSection } from './sections/SpacingSection'
import { TypographySection } from './sections/TypographySection'
import styles from './styleguide.module.css'

export const StyleguideView = () => (
  <PageContainer
    breadcrumb={buildBreadcrumb(dictionaryFor(FALLBACK_LOCALE).nav, '/', [
      { label: 'Charte graphique', href: '/charte-graphique' },
    ])}
  >
    <h1 className={`bui-text bui-text--h1 ${styles.title}`}>Charte graphique</h1>
    <Text>
      Page de développement : composants et jetons réels du projet. Le bouton « Accessibilité
      renforcée » de l'en-tête permet de comparer les deux modes.
    </Text>
    <ColorsSection />
    <TypographySection />
    <SpacingSection />
    <ButtonsSection />
    <FormsSection />
    <FeedbackSection />
    <NavigationSection />
    <MediaSection />
    <IconsLogoSection />
  </PageContainer>
)
