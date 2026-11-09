import { getLocale } from '@/shared/i18n/server'

import { getLocaleContext, getSiteIdentity } from '@/modules/site'

import { SITE_VIEWPORT, SiteDocument, siteMetadata } from '@/views/document'

import type { ReactNode } from 'react'

// Le menu de catégories et l'identité du site viennent de l'API : les pages statiques se régénèrent toutes les 5 minutes,
// y compris celles construites sans API joignable (menu vide en repli).
export const revalidate = 300

/** Une génération par langue du site ; une langue activée depuis est rendue à la demande. */
export async function generateStaticParams() {
  return (await getSiteIdentity()).locales.map((lang) => ({ lang }))
}

export const generateMetadata = async () => siteMetadata(await getLocale())

export const viewport = SITE_VIEWPORT

export default async function RootLayout({
  children,
  languages,
}: {
  children: ReactNode
  /** Sélecteur de langue de la page (route parallèle `@languages`), vide sur un site monolingue. */
  languages: ReactNode
}) {
  return (
    <SiteDocument locale={await getLocaleContext(await getLocale())} languages={languages}>
      {children}
    </SiteDocument>
  )
}
