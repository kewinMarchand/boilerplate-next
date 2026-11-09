import { dictionaryFor, FALLBACK_LOCALE } from './locale'

/**
 * Langue de la page : le segment `[lang]` du layout racine, réécrit par `src/proxy.ts` ; la langue de
 * repli hors de ce segment (page introuvable globale). Import à la demande : les index des modules,
 * qui exportent aussi des composants serveur, sont lus par les routes de fichiers (sitemap,
 * manifeste), où `next/root-params` n'exporte rien.
 */
export const getLocale = async (): Promise<string> =>
  (await (await import('next/root-params')).lang()) ?? FALLBACK_LOCALE

/** Libellés de l'interface dans la langue de la page, pour les composants serveur. */
export const getDictionary = async () => dictionaryFor(await getLocale())
