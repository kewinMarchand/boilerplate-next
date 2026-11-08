import { toSiteIdentity } from './siteIdentityTranslation'

import type { components } from '@/shared/api/client'

const TOKENS: components['schemas']['ThemeTokens'] = {
  primary: '#c2410c',
  'primary-dark': '#923109',
  'on-primary': '#ffffff',
  'primary-surface-subtle': '#faefeb',
  'primary-surface': '#f4dfd7',
  'primary-surface-strong': '#ebc4b5',
  secondary: '#0f766e',
  'secondary-dark': '#0b5953',
  'on-secondary': '#ffffff',
  'secondary-surface-subtle': '#ebf4f3',
  'secondary-surface': '#d6eae8',
  'secondary-surface-strong': '#b6d8d5',
}

const LOGO: components['schemas']['ImageView'] = {
  alt: 'Oraki',
  width: 400,
  height: 120,
  sources: [{ type: 'image/webp', srcset: 'https://api.test/logo-200.webp 200w' }],
  src: 'https://api.test/logo-400.webp',
}

const DTO: components['schemas']['SiteIdentity'] = {
  name: 'Oraki',
  tagline: 'Plantes rares et tropicales, livrées chez vous.',
  logo: LOGO,
  defaultColorScheme: 'dark',
  theme: { light: TOKENS, dark: { ...TOKENS, primary: '#f8a77f' } },
}

describe('toSiteIdentity', () => {
  it('reprend nom, accroche, logo, thème par défaut et couleurs', () => {
    expect(toSiteIdentity(DTO)).toEqual({
      name: 'Oraki',
      tagline: 'Plantes rares et tropicales, livrées chez vous.',
      logo: LOGO,
      defaultColorScheme: 'dark',
      theme: { light: TOKENS, dark: { ...TOKENS, primary: '#f8a77f' } },
    })
  })

  it('garde l’absence de logo et de couleurs', () => {
    expect(toSiteIdentity({ ...DTO, logo: null, theme: null })).toMatchObject({
      logo: null,
      theme: null,
    })
  })

  it('écarte le thème si un jeton n’est pas une couleur #rrggbb', () => {
    const dark = { ...TOKENS, primary: 'red;}body{display:none' }
    expect(toSiteIdentity({ ...DTO, theme: { light: TOKENS, dark } }).theme).toBeNull()
  })
})
