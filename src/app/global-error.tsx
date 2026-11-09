'use client'

import { useEffect, useState } from 'react'

// Chemins directs et lien simple : hors de [lang], cette page forme son propre groupe de chunks, et
// tout module qu'elle partage avec le layout (index du kit, next/link, contexte de langue) y serait
// dupliqué dans le JavaScript initial de chaque page.
import { FALLBACK_LOCALE } from '@/shared/i18n/locale'
import { useReportError } from '@/shared/observability/useReportError'

import type { Dictionary } from '@/shared/i18n'

interface Labels {
  lang: string
  errors: Dictionary['errors']
}

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useReportError(error)
  // Libellés de la langue du préfixe de l'adresse (langue de repli sans préfixe), chargés à la
  // demande pour ne pas peser sur le JavaScript initial de chaque page.
  const [labels, setLabels] = useState<Labels | null>(null)
  useEffect(() => {
    const lang = /^\/([a-z]{2})(?:\/|$)/.exec(window.location.pathname)?.[1] ?? FALLBACK_LOCALE
    void import('@/shared/i18n/dictionaries').then(({ dictionaryFor }) =>
      setLabels({ lang, errors: dictionaryFor(lang).errors }),
    )
  }, [])
  const t = labels?.errors

  return (
    <html lang={labels?.lang ?? FALLBACK_LOCALE}>
      <head>
        <title>{t?.serverTitle}</title>
        <meta name="robots" content="noindex" />
      </head>
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: 16 }}>
        {t && (
          <main style={{ maxWidth: 640, margin: '0 auto' }}>
            <h1>{t.serverTitle}</h1>
            <p>{t.globalIntro}</p>
            <p>
              {/* Rechargement complet : le document a échoué, rien à garder du routeur. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- voir CLAUDE.md, règles ESLint */}
              <a href="/">{t.home}</a>
            </p>
          </main>
        )}
      </body>
    </html>
  )
}
