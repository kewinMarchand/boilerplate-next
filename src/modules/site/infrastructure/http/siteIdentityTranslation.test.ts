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

const ICON: components['schemas']['SiteIcon'] = {
  png32: 'https://api.test/icon-32.png',
  png180: 'https://api.test/icon-180.png',
  png192: 'https://api.test/icon-192.png',
  png512: 'https://api.test/icon-512.png',
}

const SHARE_IMAGE: components['schemas']['ImageView'] = {
  alt: 'Serre d’Oraki',
  width: 1200,
  height: 630,
  sources: [{ type: 'image/webp', srcset: 'https://api.test/share-1200.webp 1200w' }],
  src: 'https://api.test/share-1200.webp',
}

const DTO: components['schemas']['SiteIdentity'] = {
  name: 'Oraki',
  tagline: 'Plantes rares et tropicales, livrées chez vous.',
  logo: LOGO,
  icon: ICON,
  shareImage: SHARE_IMAGE,
  defaultColorScheme: 'dark',
  theme: { light: TOKENS, dark: { ...TOKENS, primary: '#f8a77f' } },
  salesEnabled: true,
  locales: ['fr', 'en'],
}

describe('toSiteIdentity', () => {
  it('reprend nom, accroche, logo, icône, image de partage, thème par défaut et couleurs', () => {
    expect(toSiteIdentity(DTO)).toEqual({
      name: 'Oraki',
      tagline: 'Plantes rares et tropicales, livrées chez vous.',
      logo: LOGO,
      icon: ICON,
      shareImage: SHARE_IMAGE,
      defaultColorScheme: 'dark',
      theme: { light: TOKENS, dark: { ...TOKENS, primary: '#f8a77f' } },
      salesEnabled: true,
      locales: ['fr', 'en'],
    })
  })

  it('reste monolingue quand une API d’avant les langues n’envoie pas `locales`', () => {
    const legacy: Partial<typeof DTO> = { ...DTO }
    delete legacy.locales
    // Réponse hors contrat simulée : le type généré exige `locales`.
    expect(toSiteIdentity(legacy as typeof DTO).locales).toEqual(['fr'])
  })

  it('reprend la vente en ligne coupée', () => {
    expect(toSiteIdentity({ ...DTO, salesEnabled: false }).salesEnabled).toBe(false)
  })

  it('garde l’absence de logo, d’icône, d’image de partage et de couleurs', () => {
    expect(
      toSiteIdentity({ ...DTO, logo: null, icon: null, shareImage: null, theme: null }),
    ).toMatchObject({ logo: null, icon: null, shareImage: null, theme: null })
  })

  it('écarte le thème si un jeton n’est pas une couleur #rrggbb', () => {
    const dark = { ...TOKENS, primary: 'red;}body{display:none' }
    expect(toSiteIdentity({ ...DTO, theme: { light: TOKENS, dark } }).theme).toBeNull()
  })
})
