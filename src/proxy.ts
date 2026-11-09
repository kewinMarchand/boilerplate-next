import { NextResponse } from 'next/server'

import { internalPath } from '@/shared/i18n/locale'

import { getRoutingLocales } from '@/modules/site'

import { MAINTENANCE_RETRY_AFTER_SECONDS, maintenancePage } from '@/views/errors/maintenancePage'

import type { NextRequest } from 'next/server'

// Fichiers (`/robots.txt`, `/icons.svg`, `/theme.css`) et routes d'API : servis tels quels, hors langue.
const isPagePath = (pathname: string) =>
  !pathname.startsWith('/api/') && !pathname.split('/').at(-1)?.includes('.')

export async function proxy(request: NextRequest) {
  if (process.env.MAINTENANCE === '1') {
    return new NextResponse(maintenancePage(), {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Retry-After': String(MAINTENANCE_RETRY_AFTER_SECONDS),
      },
    })
  }

  const { pathname } = request.nextUrl
  if (!isPagePath(pathname)) return NextResponse.next()

  // Les pages vivent sous src/app/[lang]/ : la langue par défaut, sans préfixe, y est réécrite.
  const url = request.nextUrl.clone()
  url.pathname = internalPath(pathname, await getRoutingLocales())
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!_next/|images/|icons/|favicon.ico|icon.svg|apple-icon.png).*)'],
}
