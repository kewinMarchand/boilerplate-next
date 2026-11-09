import { en } from './en'
import { fr } from './fr'

import type { ClientDictionary, ClientSection, Dictionary } from './dictionary'

const DICTIONARIES: Record<string, Dictionary> = { fr, en }

/**
 * Dictionnaire d'une langue, celui du français sans fichier de traduction. Côté serveur seulement :
 * le navigateur ne reçoit que des sections du dictionnaire de la page (`dictionarySections`).
 */
export const dictionaryFor = (locale: string): Dictionary => DICTIONARIES[locale] ?? fr

/** Sections lues par les composants client du document (en-tête, menus, lien du panier, page d'erreur). */
export const DOCUMENT_SECTIONS = [
  'language',
  'nav',
  'layout',
  'a11yMode',
  'colorScheme',
  'cart',
  'errors',
] as const satisfies readonly ClientSection[]

/**
 * Sections d'un dictionnaire sérialisées dans la page : celles du document par le layout, celles d'une
 * page par `PageDictionary`, jamais le dictionnaire entier.
 */
export const dictionarySections = (
  t: Dictionary,
  sections: readonly ClientSection[],
): Partial<ClientDictionary> => Object.fromEntries(sections.map((section) => [section, t[section]]))
