import { notFound } from 'next/navigation'

import { buildMetadata } from '@/shared/seo'
import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { CartView } from '@/modules/cart'
import { getSeoSettings, getSiteIdentity } from '@/modules/site'

import type { Metadata } from 'next'

const PATH = '/panier'

export const generateMetadata = async (): Promise<Metadata> =>
  buildMetadata({
    title: 'Panier',
    description:
      'Votre panier : les produits choisis, leurs quantités et le total, gardés dans ce navigateur.',
    path: PATH,
    noindex: true,
    settings: await getSeoSettings(),
  })

export default async function CartPage() {
  if (!(await getSiteIdentity()).salesEnabled) notFound()

  return (
    <PageContainer breadcrumb={buildBreadcrumb(PATH, [{ label: 'Panier', href: PATH }])}>
      <h1 className="bui-text bui-text--h1">Panier</h1>
      <noscript>
        <p>Le panier demande JavaScript.</p>
      </noscript>
      <CartView />
    </PageContainer>
  )
}
