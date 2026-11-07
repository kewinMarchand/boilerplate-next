export const ROUTES = [
  '/',
  '/taches',
  '/contact',
  '/catalogue',
  '/catalogue/plantes-interieur',
  '/catalogue/plantes-interieur/feuillages',
  '/mentions-legales',
  '/donnees-personnelles',
  '/accessibilite',
  '/plan-du-site',
  '/blog/le-mode-accessibilite-renforcee',
] as const

/** Affichages testés : clair (standard), sombre forcé, accessibilité renforcée. */
export const MODES = ['standard', 'dark', 'enhanced'] as const

export type Mode = (typeof MODES)[number]
