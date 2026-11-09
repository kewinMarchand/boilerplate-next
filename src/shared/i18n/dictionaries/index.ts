import { en } from './en'
import { fr } from './fr'

import type { ClientDictionary, Dictionary } from './dictionary'

const DICTIONARIES: Record<string, Dictionary> = { fr, en }

/**
 * Dictionnaire d'une langue, celui du français sans fichier de traduction. Côté serveur seulement :
 * le navigateur reçoit celui de la page par `LocaleProvider`, sans charger les autres.
 */
export const dictionaryFor = (locale: string): Dictionary => DICTIONARIES[locale] ?? fr

/** Sections lues par les composants client, sérialisées dans la page par le layout. */
export const clientDictionary = (t: Dictionary): ClientDictionary => ({
  language: t.language,
  nav: t.nav,
  layout: t.layout,
  a11yMode: t.a11yMode,
  colorScheme: t.colorScheme,
  carousel: t.carousel,
  catalog: t.catalog,
  product: t.product,
  cart: t.cart,
  contact: t.contact,
  tasks: t.tasks,
  opposition: t.opposition,
  errors: t.errors,
})
