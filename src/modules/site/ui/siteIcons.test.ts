import { manifestIcons, siteIcons } from './siteIcons'

const ICON = {
  png32: 'https://api.test/icon-32.png',
  png180: 'https://api.test/icon-180.png',
  png192: 'https://api.test/icon-192.png',
  png512: 'https://api.test/icon-512.png',
}

describe('siteIcons', () => {
  it('pointe vers les PNG de l’icône saisie', () => {
    expect(siteIcons(ICON)).toEqual({
      icon: [{ url: ICON.png32, sizes: '32x32', type: 'image/png' }],
      apple: [{ url: ICON.png180, sizes: '180x180', type: 'image/png' }],
    })
    expect(manifestIcons(ICON)?.map((icon) => icon.src)).toEqual([ICON.png192, ICON.png512])
  })

  it('garde les fichiers du site sans icône', () => {
    expect(siteIcons(null)).toMatchObject({
      icon: [{ url: '/favicon.ico' }, { url: '/icon.svg' }],
      apple: [{ url: '/apple-icon.png' }],
    })
    expect(manifestIcons(null)?.map((icon) => icon.src)).toEqual([
      '/icons/icon-192.png',
      '/icons/icon-512.png',
    ])
  })
})
