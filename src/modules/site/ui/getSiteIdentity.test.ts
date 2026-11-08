import { SITE } from '@/shared/config'

import { findSiteIdentity } from '../infrastructure/siteIdentityRepository'
import { getSiteIdentity } from './getSiteIdentity'

vi.mock('../infrastructure/siteIdentityRepository', () => ({ findSiteIdentity: vi.fn() }))

describe('getSiteIdentity', () => {
  it('reprend la configuration du site quand l’API échoue', async () => {
    vi.mocked(findSiteIdentity).mockRejectedValue(new Error('API injoignable'))
    vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(await getSiteIdentity()).toEqual({
      name: SITE.name,
      tagline: SITE.description,
      logo: null,
      icon: null,
      shareImage: null,
      defaultColorScheme: 'auto',
      theme: null,
    })
  })
})
