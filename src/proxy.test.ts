// @vitest-environment node
import { NextRequest } from 'next/server'

import { proxy } from './proxy'

vi.mock('@/modules/site', () => ({ getRoutingLocales: async () => ['fr', 'en'] }))

const request = (path: string) => new NextRequest(new URL(path, 'http://localhost'))

const rewrittenTo = async (path: string) =>
  (await proxy(request(path))).headers.get('x-middleware-rewrite')

describe('proxy', () => {
  afterEach(() => {
    delete process.env.MAINTENANCE
  })

  it('réécrit une page sans préfixe vers la langue par défaut', async () => {
    expect(await rewrittenTo('/catalogue?page=2')).toBe('http://localhost/fr/catalogue?page=2')
    expect(await rewrittenTo('/')).toBe('http://localhost/fr')
  })

  it('garde le préfixe d’une autre langue activée', async () => {
    expect(await rewrittenTo('/en/catalogue')).toBe('http://localhost/en/catalogue')
  })

  it('laisse passer fichiers et routes d’API', async () => {
    expect(await rewrittenTo('/robots.txt')).toBeNull()
    expect(await rewrittenTo('/api/csp-report')).toBeNull()
  })

  it('répond 503 avec Retry-After et la page autonome quand MAINTENANCE=1', async () => {
    process.env.MAINTENANCE = '1'
    const response = await proxy(request('/'))

    expect(response.status).toBe(503)
    expect(response.headers.get('Retry-After')).toBe('3600')
    expect(await response.text()).toContain('<h1>Site en maintenance</h1>')
  })

  it('sert la page de maintenance dans la langue du préfixe, sinon dans la langue par défaut', async () => {
    process.env.MAINTENANCE = '1'
    const english = await (await proxy(request('/en/catalogue'))).text()
    const unknown = await (await proxy(request('/de/catalogue'))).text()

    expect(english).toContain('<html lang="en">')
    expect(english).toContain('<h1>Site under maintenance</h1>')
    expect(unknown).toContain('<html lang="fr">')
    expect(unknown).toContain('<h1>Site en maintenance</h1>')
  })

  it('pose la langue de l’adresse sur la requête, pour la page introuvable globale', async () => {
    const localeOf = async (path: string) =>
      (await proxy(request(path))).headers.get('x-middleware-request-x-page-locale')

    expect(await localeOf('/en/route-inexistante')).toBe('en')
    expect(await localeOf('/route-inexistante')).toBe('fr')
    expect(await localeOf('/de/route-inexistante')).toBe('fr')
    expect(await localeOf('/fichier-absent.txt')).toBe('fr')
  })
})
