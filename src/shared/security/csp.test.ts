import { describe, expect, it, vi } from 'vitest'

import { cspReportRoute } from '@kewinmarchand/csp'

import { siteCsp } from './csp'

describe('siteCsp', () => {
  it('autorise l’API et pointe la route de rapport', () => {
    const csp = siteCsp({ apiUrl: 'http://localhost:8091' })
    expect(csp).toContain("connect-src 'self' http://localhost:8091")
    expect(csp).toContain("img-src 'self' data: https: http://localhost:8091")
    expect(csp).toContain('report-uri /api/csp-report')
    expect(csp).not.toContain('matomo')
  })

  it('ajoute Matomo et GlitchTip seulement quand ils sont configurés', () => {
    const csp = siteCsp({
      apiUrl: 'http://localhost:8091',
      matomoUrl: 'https://matomo.exemple.com/',
      glitchtipDsn: 'https://cle@erreurs.exemple.com/2',
    })
    expect(csp).toContain("script-src 'self' 'unsafe-inline' https://matomo.exemple.com")
    expect(csp).toContain(
      "connect-src 'self' http://localhost:8091 https://matomo.exemple.com https://erreurs.exemple.com",
    )
  })
})

describe('route de rapport', () => {
  it('écrit la phrase du rapport sur la sortie standard', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    const report = {
      'csp-report': {
        'blocked-uri': 'https://cdn.exemple.com/lib.js',
        'effective-directive': 'script-src-elem',
        'document-uri': 'http://localhost:5173/contact?email=x',
      },
    }
    const response = await cspReportRoute()(
      new Request('http://localhost/api/csp-report', {
        method: 'POST',
        body: JSON.stringify(report),
      }),
    )
    expect(response.status).toBe(204)
    expect(info).toHaveBeenCalledExactlyOnceWith(
      "[csp-report] https://cdn.exemple.com a besoin d'une autorisation de type script (script-src) — bloqué sur /contact",
    )
    info.mockRestore()
  })
})
