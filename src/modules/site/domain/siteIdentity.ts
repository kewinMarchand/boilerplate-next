import type { ColorScheme } from '@/shared/ui/color-scheme/colorScheme'
import type { ResponsiveImage } from '@/shared/ui/kit'

export const THEME_TOKEN_KEYS = [
  'primary',
  'primary-dark',
  'on-primary',
  'primary-surface-subtle',
  'primary-surface',
  'primary-surface-strong',
  'secondary',
  'secondary-dark',
  'on-secondary',
  'secondary-surface-subtle',
  'secondary-surface',
  'secondary-surface-strong',
] as const

export declare namespace SiteIdentity {
  type ThemeTokenKey = (typeof THEME_TOKEN_KEYS)[number]

  /** Couleurs de marque en `#rrggbb`, calculées par l'API, noms sans le préfixe `--bui-color-`. */
  type ThemeTokens = Record<ThemeTokenKey, string>

  interface Theme {
    light: ThemeTokens
    dark: ThemeTokens
  }

  /** Favicons en PNG tirés par l'API de l'icône saisie dans l'admin, adresses absolues. */
  interface Icon {
    png32: string
    png180: string
    png192: string
    png512: string
  }

  interface Entity {
    name: string
    tagline: string
    logo: ResponsiveImage | null
    /** `null` sans icône saisie : les fichiers du site servent. */
    icon: Icon | null
    /** Image de partage par défaut (1200 × 630), `null` sans image saisie : `og-image.jpg` sert. */
    shareImage: ResponsiveImage | null
    defaultColorScheme: ColorScheme
    /** `null` sans couleurs saisies : les jetons de boilerplates-ui s'appliquent tels quels. */
    theme: Theme | null
  }
}
