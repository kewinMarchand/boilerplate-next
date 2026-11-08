import { THEME_TOKEN_KEYS } from '../domain/siteIdentity'
import { getSiteIdentity } from './getSiteIdentity'

import type { SiteIdentity } from '../domain/siteIdentity'

export const SITE_THEME_PATH = '/theme.css'

// Mêmes conditions que les jetons de boilerplates-ui, jamais en mode renforcé. `:root` en tête rend
// chaque règle plus spécifique que celle de la bibliothèque, quel que soit l'ordre des feuilles.
const NOT_ENHANCED = ':not([data-a11y-mode="enhanced"])'

const declarations = (tokens: SiteIdentity.ThemeTokens) =>
  THEME_TOKEN_KEYS.map((key) => `--bui-color-${key}:${tokens[key]};`).join('')

export const themeStylesheet = ({ light, dark }: SiteIdentity.Theme) =>
  [
    `:root${NOT_ENHANCED}{${declarations(light)}}`,
    `:root[data-color-scheme="dark"]${NOT_ENHANCED}{${declarations(dark)}}`,
    `@media (prefers-color-scheme: dark){:root[data-color-scheme="auto"]${NOT_ENHANCED}{${declarations(dark)}}}`,
  ].join('\n')

export const siteThemeResponse = async () => {
  const { theme } = await getSiteIdentity()
  return new Response(theme ? themeStylesheet(theme) : '', {
    headers: { 'Content-Type': 'text/css; charset=utf-8' },
  })
}
