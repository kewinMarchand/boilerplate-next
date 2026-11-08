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

export const CATALOG_NAVIGATION: NavigationItem = { href: '/catalogue', label: 'Catalogue' }

export const MAIN_NAVIGATION: NavigationItem[] = [
  { href: '/', label: 'Accueil' },
  CATALOG_NAVIGATION,
  { href: '/blog', label: 'Blog' },
  { href: '/taches', label: 'Tâches' },
  { href: '/contact', label: 'Contact' },
]

export const LEGAL_NAVIGATION: NavigationItem[] = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/donnees-personnelles', label: 'Données personnelles' },
  { href: '/accessibilite', label: 'Déclaration d’accessibilité' },
  { href: '/plan-du-site', label: 'Plan du site' },
]

export const SITE_MAP: NavigationItem[] = [...MAIN_NAVIGATION, ...LEGAL_NAVIGATION]
