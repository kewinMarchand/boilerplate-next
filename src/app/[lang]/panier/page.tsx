import { notFound } from 'next/navigation'

import { dictionaryFor } from '@/shared/i18n/dictionaries'
import { getLocale } from '@/shared/i18n/server'
import { buildMetadata } from '@/shared/seo'
import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { CartView } from '@/modules/cart'
import { getSeoSettings, getSiteIdentity } from '@/modules/site'

import type { Metadata } from 'next'

const PATH = '/panier'

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale()
  return buildMetadata({
    ...dictionaryFor(locale).meta.cart,
    path: PATH,
    noindex: true,
    settings: await getSeoSettings(locale),
  })
}

export default async function CartPage() {
  const locale = await getLocale()
  const { salesEnabled } = await getSiteIdentity(locale)
  const t = dictionaryFor(locale)
  if (!salesEnabled) notFound()

  return (
    <PageContainer breadcrumb={buildBreadcrumb(t.nav, PATH, [{ label: t.cart.title, href: PATH }])}>
      <h1 className="bui-text bui-text--h1">{t.cart.title}</h1>
      <noscript>
        <p>{t.cart.noScript}</p>
      </noscript>
      <CartView />
    </PageContainer>
  )
}
