import { buildMetadata } from './buildMetadata'
import { breadcrumbJsonLd, organizationJsonLd } from './structuredData'

describe('buildMetadata', () => {
  it('pose canonique, Open Graph et carte Twitter', () => {
    const metadata = buildMetadata({ title: 'Contact', description: 'Desc', path: '/contact' })

    expect(metadata.alternates?.canonical).toBe('/contact')
    expect(metadata.robots).toEqual({ index: true, follow: true })
    expect(metadata.openGraph).toMatchObject({ title: 'Contact', url: '/contact' })
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' })
  })

  it('passe la page en noindex, follow sur demande', () => {
    const metadata = buildMetadata({ title: 'T', description: 'D', path: '/', noindex: true })

    expect(metadata.robots).toEqual({ index: false, follow: true })
  })

  const SHARE_IMAGE = { url: 'https://api.test/share.webp', width: 1200, height: 630, alt: 'Oraki' }

  it('prend le titre et la description saisis, et l’image de partage à défaut d’image propre', () => {
    const metadata = buildMetadata({
      title: 'Blog',
      description: 'Desc',
      path: '/blog',
      settings: { title: 'Le blog d’Oraki', description: 'Saisie', shareImage: SHARE_IMAGE },
    })

    expect(metadata.title).toEqual({ absolute: 'Le blog d’Oraki' })
    expect(metadata.description).toBe('Saisie')
    expect(metadata.openGraph).toMatchObject({
      title: 'Le blog d’Oraki',
      description: 'Saisie',
      images: [SHARE_IMAGE],
    })
    expect(metadata.twitter).toMatchObject({ images: [SHARE_IMAGE.url] })
  })

  it('garde ses valeurs quand rien n’est saisi, et son image propre', () => {
    const image = { url: 'https://api.test/produit.webp', width: 800, height: 800, alt: 'P' }
    const metadata = buildMetadata({
      title: 'Blog',
      description: 'Desc',
      path: '/blog',
      image,
      settings: { title: '', description: '', shareImage: SHARE_IMAGE },
    })

    expect(metadata.title).toBe('Blog')
    expect(metadata.description).toBe('Desc')
    expect(metadata.openGraph).toMatchObject({ images: [image] })
  })

  it('sert og-image.jpg sans image de partage', () => {
    const metadata = buildMetadata({ title: 'T', description: 'D', path: '/' })

    expect(metadata.openGraph).toMatchObject({ images: [{ url: '/images/og-image.jpg' }] })
  })
})

describe('breadcrumbJsonLd', () => {
  it('numérote les éléments et rend les URL absolues', () => {
    const data = breadcrumbJsonLd([
      { label: 'Accueil', href: '/' },
      { label: 'Contact', href: '/contact' },
    ])

    expect(data.itemListElement).toHaveLength(2)
    expect(data.itemListElement[1]).toMatchObject({ position: 2, name: 'Contact' })
    expect(data.itemListElement[1]?.item).toMatch(/^https?:\/\/.+\/contact$/)
  })
})

describe('organizationJsonLd', () => {
  it('prend l’icône saisie comme logo, sinon l’icône 512 du site', () => {
    expect(organizationJsonLd('Oraki', 'https://api.test/icon-512.png').logo).toBe(
      'https://api.test/icon-512.png',
    )
    expect(organizationJsonLd('Oraki').logo).toMatch(/^https?:\/\/.+\/icons\/icon-512\.png$/)
  })
})
