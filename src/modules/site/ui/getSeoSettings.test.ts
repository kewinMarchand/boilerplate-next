import { findPageMetas } from '../infrastructure/pageMetaRepository'
import { findSiteIdentity } from '../infrastructure/siteIdentityRepository'
import { getSeoSettings } from './getSeoSettings'

vi.mock('../infrastructure/siteIdentityRepository', () => ({ findSiteIdentity: vi.fn() }))
vi.mock('../infrastructure/pageMetaRepository', () => ({ findPageMetas: vi.fn() }))

const SHARE_IMAGE = {
  alt: '',
  width: 1200,
  height: 630,
  sources: [{ type: 'image/webp', srcset: 'https://api.test/share-1200.webp 1200w' }],
  src: 'https://api.test/share-1200.webp',
}

describe('getSeoSettings', () => {
  it('reprend la page fixe saisie et l’image de partage, nommée par le site à défaut de texte', async () => {
    vi.mocked(findSiteIdentity).mockResolvedValue({
      name: 'Oraki',
      tagline: '',
      logo: null,
      icon: null,
      shareImage: SHARE_IMAGE,
      defaultColorScheme: 'auto',
      theme: null,
      salesEnabled: true,
      locales: ['fr'],
    })
    vi.mocked(findPageMetas).mockResolvedValue({
      blog: { title: 'Le blog', description: 'Conseils et actualités.' },
    })

    expect(await getSeoSettings('fr', 'blog')).toEqual({
      title: 'Le blog',
      description: 'Conseils et actualités.',
      shareImage: {
        url: 'https://api.test/share-1200.webp',
        width: 1200,
        height: 630,
        alt: 'Oraki',
      },
      locale: { locale: 'fr', defaultLocale: 'fr', locales: ['fr'] },
    })
  })

  it('ne rend rien de saisi quand l’API échoue', async () => {
    vi.mocked(findSiteIdentity).mockRejectedValue(new Error('API injoignable'))
    vi.mocked(findPageMetas).mockRejectedValue(new Error('API injoignable'))
    vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(await getSeoSettings('fr', 'home')).toEqual({
      title: '',
      description: '',
      shareImage: null,
      locale: { locale: 'fr', defaultLocale: 'fr', locales: ['fr'] },
    })
  })
})
