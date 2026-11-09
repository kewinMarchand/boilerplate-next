import type { Dictionary } from '@/shared/i18n'

/** Clé du libellé dans le dictionnaire de la langue de la page (`nav`). */
export type NavigationKey = keyof Dictionary['nav']

export interface NavigationEntry {
  href: string
  key: NavigationKey
}

export interface NavigationItem {
  href: string
  label: string
}

/** Nœud de menu générique : le socle l'affiche sans connaître le module qui le fournit. */
export interface NavigationNode {
  id: string
  label: string
  href: string
  children: NavigationNode[]
}

export const CATALOG_NAVIGATION: NavigationEntry = { href: '/catalogue', key: 'catalog' }

export const MAIN_NAVIGATION: NavigationEntry[] = [
  { href: '/', key: 'home' },
  CATALOG_NAVIGATION,
  { href: '/blog', key: 'blog' },
  { href: '/taches', key: 'tasks' },
  { href: '/contact', key: 'contact' },
]

export const LEGAL_NAVIGATION: NavigationEntry[] = [
  { href: '/mentions-legales', key: 'legalNotice' },
  { href: '/donnees-personnelles', key: 'privacy' },
  { href: '/accessibilite', key: 'accessibility' },
  { href: '/plan-du-site', key: 'sitemap' },
]

export const SITE_MAP: NavigationEntry[] = [...MAIN_NAVIGATION, ...LEGAL_NAVIGATION]

/** Entrées libellées dans la langue de la page. */
export const labelNavigation = (entries: NavigationEntry[], labels: Dictionary['nav']) =>
  entries.map(({ href, key }): NavigationItem => ({ href, label: labels[key] }))
