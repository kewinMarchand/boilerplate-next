import { THEME_TOKEN_KEYS } from '@/modules/site/domain/siteIdentity'

import type { SiteIdentity } from '@/modules/site/domain/siteIdentity'
import type { components } from '@/shared/api/client'

type SiteIdentityDto = components['schemas']['SiteIdentity']
type ThemeTokensDto = components['schemas']['ThemeTokens']

const HEX_COLOR = /^#[0-9a-f]{6}$/i

// Les jetons finissent dans une feuille de style : une valeur hors `#rrggbb` écarte tout le thème.
const isValidTokens = (tokens: ThemeTokensDto) =>
  THEME_TOKEN_KEYS.every((key) => HEX_COLOR.test(tokens[key]))

const toTheme = (theme: SiteIdentityDto['theme']): SiteIdentity.Theme | null =>
  theme && isValidTokens(theme.light) && isValidTokens(theme.dark)
    ? { light: theme.light, dark: theme.dark }
    : null

export const toSiteIdentity = (dto: SiteIdentityDto): SiteIdentity.Entity => ({
  name: dto.name,
  tagline: dto.tagline,
  logo: dto.logo,
  icon: dto.icon,
  shareImage: dto.shareImage,
  defaultColorScheme: dto.defaultColorScheme,
  theme: toTheme(dto.theme),
  salesEnabled: dto.salesEnabled,
})
