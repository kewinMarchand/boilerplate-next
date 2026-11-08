import { Inter } from 'next/font/google'

import { SITE } from '@/shared/config'
import { Providers } from '@/shared/providers'
import { A11Y_MODE_SCRIPT } from '@/shared/ui/a11y-mode/a11yMode'
import { COLOR_SCHEME_SCRIPT } from '@/shared/ui/color-scheme/colorScheme'
import { AppShell } from '@/shared/ui/layout'

import { CartLink } from '@/modules/cart'
import { getCategoryMenu } from '@/modules/catalog'
import { getSiteIdentity, SiteThemeStylesheet } from '@/modules/site'

import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import '@kewinmarchand/boilerplates-ui/tokens/tokens.css'
import '@kewinmarchand/boilerplates-ui/css/index.css'
import '@/shared/theme/global.css'

// Le menu de catégories et l'identité du site viennent de l'API : les pages statiques se régénèrent toutes les 5 minutes,
// y compris celles construites sans API joignable (menu vide en repli).
export const revalidate = 300

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const generateMetadata = async (): Promise<Metadata> => {
  const { name, tagline } = await getSiteIdentity()
  return {
    metadataBase: new URL(SITE.url),
    title: { default: name, template: `%s · ${name}` },
    description: tagline,
    applicationName: name,
    formatDetection: { telephone: false, email: false, address: false },
  }
}

export const viewport: Viewport = {
  themeColor: '#1d4ed8',
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [identity, categoryMenu] = await Promise.all([getSiteIdentity(), getCategoryMenu()])

  return (
    <html
      lang="fr"
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
        <Providers>
          <AppShell
            brand={{ name: identity.name, logo: identity.logo }}
            categoryMenu={categoryMenu}
            cartLink={<CartLink />}
          >
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  )
}
