import { headers } from 'next/headers'

import { createApiClient } from './client'

const apiUrl = () => process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || ''

/**
 * Données communes aux pages (menu, blog, sitemap) : sans l'en-tête `X-Scenario` de la requête, la page reste statique et se
 * régénère selon le `revalidate` de sa route. `API_URL` est relue à chaque régénération.
 */
export const staticApiClient = () => createApiClient(apiUrl())

/**
 * Client de la requête en cours : `X-Scenario` reçu relayé à l'API, pour les états d'erreur et de
 * liste vide des tests e2e. Lire les en-têtes rend la route dynamique.
 */
export const serverApiClient = async () =>
  createApiClient(apiUrl(), (await headers()).get('X-Scenario') ?? undefined)
