import { Inter } from 'next/font/google'

import { SITE } from '@/shared/config'
import { Providers } from '@/shared/providers'
import { A11Y_MODE_SCRIPT } from '@/shared/ui/a11y-mode/a11yMode'
import { COLOR_SCHEME_SCRIPT } from '@/shared/ui/color-scheme/colorScheme'
import { AppShell } from '@/shared/ui/layout'

import { CartLink } from '@/modules/cart'
import { getCategoryMenu } from '@/modules/catalog'

import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import '@kewinmarchand/boilerplates-ui/tokens/tokens.css'
import '@kewinmarchand/boilerplates-ui/css/index.css'
import '@/shared/theme/global.css'

// Le menu de catégories vient de l'API : les pages statiques se régénèrent toutes les 5 minutes,
// y compris celles construites sans API joignable (menu vide en repli).
export const revalidate = 300

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  themeColor: '#1d4ed8',
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={inter.variable} data-color-scheme="auto" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: A11Y_MODE_SCRIPT + COLOR_SCHEME_SCRIPT }} />
      </head>
      <body>
        <Providers>
          <AppShell categoryMenu={await getCategoryMenu()} cartLink={<CartLink />}>
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  )
}
