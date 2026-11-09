import { headers } from 'next/headers'

import { dictionaryFor } from './dictionaries'
import { FALLBACK_LOCALE, PAGE_LOCALE_HEADER } from './locale'

/**
 * Langue de la page : le segment `[lang]` du layout racine, réécrit par `src/proxy.ts`. Hors de ce
 * segment (page introuvable globale), la langue de l'adresse posée en en-tête par le proxy, ce qui
 * rend la page dynamique ; la langue de repli sans proxy. Import à la demande : les index des
 * modules, qui exportent aussi des composants serveur, sont lus par les routes de fichiers (sitemap,
 * manifeste), où `next/root-params` n'exporte rien.
 */
export const getLocale = async (): Promise<string> =>
  (await (await import('next/root-params')).lang()) ??
  (await headers()).get(PAGE_LOCALE_HEADER) ??
  FALLBACK_LOCALE

/** Libellés de l'interface dans la langue de la page, pour les composants serveur. */
export const getDictionary = async () => dictionaryFor(await getLocale())
