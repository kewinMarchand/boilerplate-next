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

  interface Entity {
    name: string
    tagline: string
    logo: ResponsiveImage | null
    defaultColorScheme: ColorScheme
    /** `null` sans couleurs saisies : les jetons de boilerplates-ui s'appliquent tels quels. */
    theme: Theme | null
  }
}
