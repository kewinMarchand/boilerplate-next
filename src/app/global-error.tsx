'use client'

import { useParams } from 'next/navigation'

import { dictionaryFor, FALLBACK_LOCALE } from '@/shared/i18n'
import { useReportError } from '@/shared/observability'
import { Link } from '@/shared/ui/kit'

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useReportError(error)
  // Le layout racine (et sa langue) n'est plus là : la langue vient du segment [lang].
  const { lang = '' } = useParams<{ lang?: string }>()
  const t = dictionaryFor(lang).errors

  return (
    <html lang={lang || FALLBACK_LOCALE}>
      <head>
        <title>{t.serverTitle}</title>
        <meta name="robots" content="noindex" />
      </head>
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: 16 }}>
        <main style={{ maxWidth: 640, margin: '0 auto' }}>
          <h1>{t.serverTitle}</h1>
          <p>{t.globalIntro}</p>
          <p>
            <Link href="/">{t.home}</Link>
          </p>
        </main>
      </body>
    </html>
  )
}
