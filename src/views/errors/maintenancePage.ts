import { SITE } from '@/shared/config'
import { dictionaryFor } from '@/shared/i18n/dictionaries'
import { format } from '@/shared/i18n/format'

export const MAINTENANCE_RETRY_AFTER_SECONDS = 3600

/** Page 503 autonome, dans la langue de l'adresse : aucun script, styles en ligne. */
export const maintenancePage = (locale: string) => {
  const t = dictionaryFor(locale).maintenance
  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${t.title} · ${SITE.name}</title>
<style>body{margin:0;font-family:system-ui,sans-serif;color:#111;background:#fff;display:grid;place-items:center;min-height:100vh;padding:16px;box-sizing:border-box}main{max-width:40rem}h1{font-size:2rem}</style>
</head>
<body>
<main>
<h1>${t.title}</h1>
<p>${format(t.text, { name: SITE.name })}</p>
</main>
</body>
</html>`
}
