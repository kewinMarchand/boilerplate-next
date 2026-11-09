import { NextResponse } from 'next/server'

import { internalPath, PAGE_LOCALE_HEADER, pageLocale } from '@/shared/i18n/locale'

import { getRoutingLocales } from '@/modules/site'

import { MAINTENANCE_RETRY_AFTER_SECONDS, maintenancePage } from '@/views/errors/maintenancePage'

import type { NextRequest } from 'next/server'

// Fichiers (`/robots.txt`, `/icons.svg`, `/theme.css`) et routes d'API : servis tels quels, hors langue.
const isPagePath = (pathname: string) =>
  !pathname.startsWith('/api/') && !pathname.split('/').at(-1)?.includes('.')

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const locales = await getRoutingLocales()
  const locale = pageLocale(pathname, locales)

  if (process.env.MAINTENANCE === '1') {
    return new NextResponse(maintenancePage(locale), {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Retry-After': String(MAINTENANCE_RETRY_AFTER_SECONDS),
      },
    })
  }

  // Langue de l'adresse pour la page introuvable globale, rendue hors du segment [lang].
  const headers = new Headers(request.headers)
  headers.set(PAGE_LOCALE_HEADER, locale)
  if (!isPagePath(pathname)) return NextResponse.next({ request: { headers } })

  // Les pages vivent sous src/app/[lang]/ : la langue par défaut, sans préfixe, y est réécrite.
  const url = request.nextUrl.clone()
  url.pathname = internalPath(pathname, locales)
  return NextResponse.rewrite(url, { request: { headers } })
}

export const config = {
  matcher: ['/((?!_next/|images/|icons/|favicon.ico|icon.svg|apple-icon.png).*)'],
}
