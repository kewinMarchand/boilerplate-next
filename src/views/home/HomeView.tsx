import { JsonLd, organizationJsonLd, websiteJsonLd } from '@/shared/seo'
import { PageContainer } from '@/shared/ui/layout'

import { BlogSection } from '@/modules/blog'
import { FeaturedProducts } from '@/modules/catalog'
import { getSiteIdentity } from '@/modules/site'

import { HomeHero } from './HomeHero'
import styles from './HomeView.module.css'

export const HomeView = async () => {
  const { name, tagline } = await getSiteIdentity()

  return (
    <>
      <HomeHero name={name} tagline={tagline} />
      <PageContainer>
        <div className={styles.sections}>
          <FeaturedProducts />
          <BlogSection />
        </div>
      </PageContainer>
      <JsonLd data={organizationJsonLd(name)} />
      <JsonLd data={websiteJsonLd(name)} />
    </>
  )
}
