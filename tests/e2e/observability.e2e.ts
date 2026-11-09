import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { gunzipSync } from 'node:zlib'
import { expect, test } from '@playwright/test'

import type { Page } from '@playwright/test'
import type { ChildProcess } from 'node:child_process'
import type { Server } from 'node:http'

const APP_PORT = 4006
const GLITCHTIP_PORT = 4007
const APP_URL = `http://localhost:${APP_PORT}`
const DSN = `http://clefactice@localhost:${GLITCHTIP_PORT}/1`
const MATOMO_URL = 'http://matomo.test/'

// Les variables publiques sont figées au build : ce test construit sa propre version dans
// .next-obs, avec des valeurs factices, et ne contacte aucune instance réelle.
const ENV = {
  ...process.env,
  NEXT_DIST_DIR: '.next-obs',
  NEXT_PUBLIC_SITE_URL: APP_URL,
  ENABLE_TEST_ROUTES: '1',
  GLITCHTIP_DSN: DSN,
  NEXT_PUBLIC_GLITCHTIP_DSN: DSN,
  NEXT_PUBLIC_MATOMO_URL: MATOMO_URL,
  NEXT_PUBLIC_MATOMO_SITE_ID: '1',
}

/** Traceur factice : applique la file `_paq` et envoie une requête par page vue, comme Matomo. */
const FAKE_TRACKER = `(() => {
  const state = {}
  window.__matomoCommands = []
  const apply = (...commands) => commands.forEach((command) => {
    window.__matomoCommands.push(command)
    const [name, value] = command
    if (name === 'setTrackerUrl') state.tracker = value
    if (name === 'setSiteId') state.site = value
    if (name === 'setCustomUrl') state.url = value
    if (name === 'setDocumentTitle') state.title = value
    if (name === 'trackPageView') {
      const params = new URLSearchParams({ idsite: state.site, url: state.url, action_name: state.title })
      fetch(state.tracker + '?' + params, { mode: 'no-cors' })
    }
  })
  apply(...(window._paq ?? []))
  window._paq = { push: apply }
})()`

const pageViews: URL[] = []

const routeMatomo = (page: Page) =>
  page.route(`${MATOMO_URL}**`, (route) => {
    const url = new URL(route.request().url())
    if (url.pathname.endsWith('/matomo.js')) {
      return route.fulfill({ contentType: 'application/javascript', body: FAKE_TRACKER })
    }
    pageViews.push(url)
    return route.fulfill({ status: 204 })
  })

const envelopes: string[] = []
const events = () => envelopes.filter((body) => body.includes('"type":"event"'))

const startFakeGlitchtip = () =>
  createServer((request, response) => {
    response.setHeader('access-control-allow-origin', '*')
    response.setHeader('access-control-allow-headers', '*')
    if (request.method === 'OPTIONS') {
      response.writeHead(204).end()
      return
    }
    const chunks: Buffer[] = []
    request.on('data', (chunk: Buffer) => chunks.push(chunk))
    request.on('end', () => {
      const body = Buffer.concat(chunks)
      const gzipped = request.headers['content-encoding'] === 'gzip'
      envelopes.push((gzipped ? gunzipSync(body) : body).toString('utf8'))
      response.writeHead(200, { 'content-type': 'application/json' }).end('{}')
    })
  }).listen(GLITCHTIP_PORT)

const run = (command: string, args: string[]) =>
  new Promise<void>((resolve, reject) => {
    spawn(command, args, { env: ENV, stdio: 'ignore' }).on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} ${args.join(' ')} : code ${code}`)),
    )
  })

const throwInBrowser = async (page: Page, message: string) => {
  await page.waitForFunction(() => '__SENTRY__' in window)
  await page.evaluate((text) => {
    setTimeout(() => {
      throw new Error(text)
    })
  }, message)
}

test.describe('Observabilité, avec un DSN et une instance Matomo factices', () => {
  test.describe.configure({ mode: 'serial' })

  let app: ChildProcess | undefined
  let glitchtip: Server | undefined

  test.beforeAll(async () => {
    test.skip(test.info().project.name !== 'desktop', 'Vérification des envois, une seule fois.')
    test.setTimeout(300_000)
    glitchtip = startFakeGlitchtip()
    await run('yarn', ['build'])
    app = spawn('yarn', ['start', '--port', String(APP_PORT)], { env: ENV, stdio: 'ignore' })
    await expect
      .poll(async () => (await fetch(APP_URL).catch(() => null))?.status, { timeout: 30_000 })
      .toBe(200)
  })

  test.afterAll(() => {
    app?.kill()
    glitchtip?.close()
  })

  test.beforeEach(async ({ page }) => {
    envelopes.length = 0
    pageViews.length = 0
    await routeMatomo(page)
  })

  test('une erreur serveur inattendue est envoyée', async ({ request }) => {
    expect((await request.get(`${APP_URL}/_erreur-test`)).status()).toBe(500)

    await expect
      .poll(() => events().some((body) => body.includes('Erreur volontaire de la route de test')))
      .toBe(true)
  })

  test('une erreur du navigateur est envoyée après l’affichage', async ({ page }) => {
    await page.goto(APP_URL)
    await throwInBrowser(page, 'Erreur navigateur volontaire')

    await expect
      .poll(() => events().some((body) => body.includes('Erreur navigateur volontaire')))
      .toBe(true)
  })

  test('rien n’est envoyé pour une 404 ni pour un scénario de test', async ({ page, request }) => {
    expect((await page.goto(`${APP_URL}/route-inexistante`))?.status()).toBe(404)
    const scenario = await request.get(`${APP_URL}/_erreur-test`, {
      headers: { 'X-Scenario': 'error' },
    })
    expect(scenario.status()).toBe(500)

    await throwInBrowser(page, 'Témoin après la 404')
    await expect.poll(() => events().length).toBeGreaterThan(0)

    expect(events()).toHaveLength(1)
    expect(events()[0]).toContain('Témoin après la 404')
  })

  test('Matomo envoie une page vue par navigation, avec l’URL et le titre à jour', async ({
    page,
  }) => {
    await page.goto(APP_URL)
    await expect.poll(() => pageViews.length).toBe(1)
    expect(pageViews[0]?.searchParams.get('url')).toBe(`${APP_URL}/`)

    await page
      .getByRole('navigation', { name: 'Navigation principale' })
      .getByRole('link', { name: 'Contact' })
      .click()
    await expect(page).toHaveURL(`${APP_URL}/contact`)
    await expect.poll(() => pageViews.length).toBe(2)
    expect(pageViews[1]?.searchParams.get('url')).toBe(`${APP_URL}/contact`)
    expect(pageViews[1]?.searchParams.get('action_name')).toMatch(/^Contact · /)
  })

  test('Matomo ne pose aucun cookie et désactive les cookies en premier', async ({
    page,
    context,
  }) => {
    await page.goto(`${APP_URL}/taches`)
    await expect.poll(() => pageViews.length).toBe(1)

    expect(await context.cookies()).toEqual([])
    expect(await page.evaluate(() => document.cookie)).toBe('')
    expect(
      await page.evaluate(
        () => (window as unknown as { __matomoCommands: string[][] }).__matomoCommands[0],
      ),
    ).toEqual(['disableCookies'])
  })

  test('la page Données personnelles décrit la mesure d’audience quand elle est active', async ({
    page,
  }) => {
    await page.goto(`${APP_URL}/donnees-personnelles`)
    await expect(page.getByTestId('legal-audience-measurement')).toBeVisible()
  })

  test('un visiteur qui s’oppose à la mesure n’est plus mesuré, même après rechargement', async ({
    page,
  }) => {
    await page.goto(`${APP_URL}/donnees-personnelles`)
    await expect.poll(() => pageViews.length).toBe(1)

    await page.getByTestId('legal-opposition-mesure').check()
    await expect(page.getByTestId('legal-opposition-etat')).toHaveText(/ne sont plus mesurées/)

    // Le refus est lu avant la première commande : la file Matomo n'est jamais créée, donc aucun
    // traceur chargé ni aucune requête, sans dépendre d'un délai d'attente.
    await page.reload()
    await expect(page.getByTestId('legal-opposition-etat')).toHaveText(/ne sont plus mesurées/)
    expect(
      await page.evaluate(() => (window as unknown as { _paq?: unknown })._paq),
    ).toBeUndefined()
    expect(pageViews).toHaveLength(1)

    await page.getByTestId('legal-opposition-mesure').uncheck()
    await expect(page.getByTestId('legal-opposition-etat')).toHaveText(/sont mesurées, de façon/)
  })
})
