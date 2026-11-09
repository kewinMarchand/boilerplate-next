import type { fr } from './fr'

/** Libellés de l'interface : la forme du dictionnaire français, que chaque langue reprend clé pour clé. */
export type Dictionary = typeof fr

/** Sections lues par les composants client : seules celles-ci peuvent partir au navigateur. */
export type ClientDictionary = Pick<
  Dictionary,
  | 'language'
  | 'nav'
  | 'layout'
  | 'ui'
  | 'a11yMode'
  | 'colorScheme'
  | 'carousel'
  | 'catalog'
  | 'product'
  | 'cart'
  | 'contact'
  | 'tasks'
  | 'opposition'
  | 'errors'
>

export type ClientSection = keyof ClientDictionary
