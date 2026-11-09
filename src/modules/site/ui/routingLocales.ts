import { FALLBACK_LOCALE } from '@/shared/i18n/locale'

import { findSiteIdentity } from '../infrastructure/siteIdentityRepository'

const TTL_MS = 300_000
const RETRY_MS = 30_000
const TIMEOUT_MS = 2_000

let cached: { locales: string[]; expiresAt: number } | undefined

/**
 * Langues du site pour `src/proxy.ts`, qui réécrit chaque adresse vers sa langue : gardées 5 minutes
 * comme les pages statiques. API muette au-delà de 2 secondes : la dernière liste connue, sinon la
 * langue par défaut du front, redemandées 30 secondes plus tard.
 */
export const getRoutingLocales = async (): Promise<string[]> => {
  const now = Date.now()
  if (cached && cached.expiresAt > now) return cached.locales
  try {
    const { locales } = await findSiteIdentity(undefined, AbortSignal.timeout(TIMEOUT_MS))
    cached = { locales, expiresAt: now + TTL_MS }
  } catch (error) {
    console.error(error)
    cached = { locales: cached?.locales ?? [FALLBACK_LOCALE], expiresAt: now + RETRY_MS }
  }
  return cached.locales
}
