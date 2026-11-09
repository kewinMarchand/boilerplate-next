import { dictionaryFor } from '@/shared/i18n'
import { getLocale } from '@/shared/i18n/server'

import { getLocaleContext, getSiteIdentity } from '@/modules/site'

import { SITE_VIEWPORT, SiteDocument, siteMetadata } from '@/views/document'
import { NotFoundView } from '@/views/errors'

import type { Metadata } from 'next'

// Adresse sans route : page pré-rendue hors du layout racine, sans segment [lang] (langue des libellés de repli).
export const revalidate = 300

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale()
  const { name } = await getSiteIdentity(locale)
  return {
    ...(await siteMetadata(locale)),
    title: `${dictionaryFor(locale).errors.notFoundTitle} · ${name}`,
    robots: { index: false, follow: true },
  }
}

export const viewport = SITE_VIEWPORT

export default async function GlobalNotFound() {
  return (
    <SiteDocument locale={await getLocaleContext(await getLocale())}>
      <NotFoundView />
    </SiteDocument>
  )
}
