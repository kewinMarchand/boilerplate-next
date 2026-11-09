import { Inter } from 'next/font/google'

import { SITE } from '@/shared/config'
import { dictionaryFor, dictionarySections, DOCUMENT_SECTIONS } from '@/shared/i18n/dictionaries'
import { Providers } from '@/shared/providers'
import { A11Y_MODE_SCRIPT } from '@/shared/ui/a11y-mode/a11yMode'
import { COLOR_SCHEME_SCRIPT } from '@/shared/ui/color-scheme/colorScheme'
import { ImageFallback } from '@/shared/ui/kit'
import { AppShell } from '@/shared/ui/layout'

import { CartLink } from '@/modules/cart'
import { getCategoryMenu } from '@/modules/catalog'
import { getSiteIdentity, siteIcons, SiteThemeStylesheet } from '@/modules/site'

import type { LocaleContext } from '@/shared/i18n'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import '@kewinmarchand/boilerplates-ui/tokens/tokens.css'
import '@kewinmarchand/boilerplates-ui/css/index.css'
import '@/shared/theme/global.css'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const SITE_VIEWPORT: Viewport = {
  themeColor: '#1d4ed8',
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
}

/** Métadonnées communes à toutes les pages, dans la langue de la page. */
export const siteMetadata = async (locale: string): Promise<Metadata> => {
  const { name, tagline, icon } = await getSiteIdentity(locale)
  return {
    metadataBase: new URL(SITE.url),
    title: { default: name, template: `%s · ${name}` },
    description: tagline,
    applicationName: name,
    formatDetection: { telephone: false, email: false, address: false },
    icons: siteIcons(icon),
  }
}

interface SiteDocumentProps {
  locale: LocaleContext
  /** Sélecteur de langue de la page, vide sur un site monolingue. */
  languages?: ReactNode
  children: ReactNode
}

/**
 * Document complet du site : `<html>` dans la langue de la page, en-tête, pied de page. Partagé par
 * le layout racine et la page introuvable globale (`src/app/global-not-found.tsx`), rendue sans lui.
 */
export const SiteDocument = async ({ locale, languages, children }: SiteDocumentProps) => {
  const [identity, categoryMenu] = await Promise.all([
    getSiteIdentity(locale.locale),
    getCategoryMenu(locale.locale),
  ])

  return (
    <html
      lang={locale.locale}
      className={inter.variable}
      data-color-scheme={identity.defaultColorScheme}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: A11Y_MODE_SCRIPT + COLOR_SCHEME_SCRIPT }} />
        <SiteThemeStylesheet theme={identity.theme} />
        <meta property="og:site_name" content={identity.name} />
      </head>
      <body>
        <ImageFallback />
        <Providers
          locale={locale}
          dictionary={dictionarySections(dictionaryFor(locale.locale), DOCUMENT_SECTIONS)}
        >
          <AppShell
            brand={{ name: identity.name, logo: identity.logo }}
            categoryMenu={categoryMenu}
            cartLink={identity.salesEnabled && <CartLink />}
            languages={languages}
          >
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  )
}
