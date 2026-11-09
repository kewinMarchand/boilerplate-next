import { localizePath } from '@/shared/i18n'
import { getDictionary, getLocale } from '@/shared/i18n/server'
import { JsonLd, organizationJsonLd, websiteJsonLd } from '@/shared/seo'
import { PageContainer } from '@/shared/ui/layout'

import { BlogSection } from '@/modules/blog'
import { FeaturedProducts } from '@/modules/catalog'
import { getLocaleContext, getSiteIdentity } from '@/modules/site'

import { HomeHero } from './HomeHero'
import styles from './HomeView.module.css'

export const HomeView = async () => {
  const locale = await getLocaleContext(await getLocale())
  const [{ name, tagline, icon, salesEnabled }, t] = await Promise.all([
    getSiteIdentity(locale.locale),
    getDictionary(),
  ])

  return (
    <>
      <HomeHero name={name} tagline={tagline} />
      <PageContainer>
        <div className={styles.sections}>
          <FeaturedProducts showPrices={salesEnabled} />
          <BlogSection />
        </div>
      </PageContainer>
      <JsonLd data={organizationJsonLd(name, icon?.png512)} />
      <JsonLd
        data={websiteJsonLd(
          name,
          localizePath('/', locale.locale, locale.defaultLocale),
          t.language.tag,
        )}
      />
    </>
  )
}
