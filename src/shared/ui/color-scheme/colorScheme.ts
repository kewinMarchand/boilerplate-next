export const COLOR_SCHEME = {
  attribute: 'data-color-scheme',
  storageKey: 'color-scheme',
  choices: ['auto', 'light', 'dark'],
} as const

export type ColorScheme = (typeof COLOR_SCHEME.choices)[number]

const { attribute, storageKey } = COLOR_SCHEME

// Exécuté avant l'hydratation, avec le script du mode renforcé : le HTML servi porte le thème par défaut du site, le choix mémorisé le remplace sans flash.
export const COLOR_SCHEME_SCRIPT = `try{var c=localStorage.getItem('${storageKey}');if(c==='auto'||c==='light'||c==='dark')document.documentElement.setAttribute('${attribute}',c)}catch(e){}`
