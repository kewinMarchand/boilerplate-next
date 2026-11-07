import { JsonLd, organizationJsonLd, websiteJsonLd } from '@/shared/seo'
import { PageContainer } from '@/shared/ui/layout'

import { BlogSection } from '@/modules/blog'
import { FeaturedProducts } from '@/modules/catalog'

import { HomeHero } from './HomeHero'
import styles from './HomeView.module.css'

export const HomeView = () => (
  <>
    <HomeHero />
    <PageContainer>
      <div className={styles.sections}>
        <FeaturedProducts />
        <BlogSection />
      </div>
    </PageContainer>
    <JsonLd data={organizationJsonLd()} />
    <JsonLd data={websiteJsonLd()} />
  </>
)
