import createClient from 'openapi-fetch'

import type { paths } from './schema'

export type { components, operations } from './schema'

/**
 * Client typé de l'API. `X-Scenario` (error, empty, bilingual) n'a d'effet qu'en dev et en test côté
 * API : le relayer permet aux tests e2e de provoquer les états d'erreur et de liste vide. Un build
 * peut en fixer un pour tous ses appels (`API_SCENARIO`, figé au build par `next.config.ts`) : le
 * build bilingue des tests e2e lit l'API avec `bilingual`.
 */
export const createApiClient = (
  baseUrl: string,
  scenario: string | null = process.env.NEXT_PUBLIC_API_SCENARIO || null,
) =>
  createClient<paths, 'application/json'>({
    baseUrl,
    headers: scenario ? { 'X-Scenario': scenario } : {},
  })

/** Navigateur : origine figée au build depuis `API_URL` (`next.config.ts`). */
export const browserApiClient = () => createApiClient(process.env.NEXT_PUBLIC_API_URL ?? '')

export class ApiError extends Error {
  constructor(response: Response) {
    super(`Réponse ${response.status} de l'API (${response.url})`)
    this.name = 'ApiError'
  }
}
