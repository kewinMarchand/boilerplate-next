import { render, screen } from '@testing-library/react'

import { staticImage } from '@/shared/ui/kit'

import { BlogGrid } from './BlogGrid'

const ARTICLES = [
  {
    id: '1',
    slug: 'premier',
    title: 'Premier',
    excerpt: 'Extrait 1',
    publishedAt: '2026-09-29',
    image: staticImage('http://api.test/media/a', [480, 960], {
      width: 960,
      height: 540,
      alt: 'Illustration du premier article',
    }),
  },
  {
    id: '2',
    slug: 'second',
    title: 'Second',
    excerpt: 'Extrait 2',
    publishedAt: '2026-09-15',
    image: null,
  },
]

describe('BlogGrid', () => {
  it('affiche un squelette pendant le chargement', () => {
    render(<BlogGrid status="pending" articles={undefined} />)
    expect(screen.getByTestId('home-blog-loading')).toBeInTheDocument()
  })

  it("affiche le message d'erreur", () => {
    render(<BlogGrid status="error" articles={undefined} errorMessage="Oups" />)
    expect(screen.getByTestId('home-blog-error')).toHaveTextContent('Oups')
  })

  it('affiche un message amical quand il n’y a aucun article', () => {
    render(<BlogGrid status="success" articles={[]} />)
    expect(screen.getByTestId('home-blog-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('home-blog-card')).not.toBeInTheDocument()
  })

  it('affiche chaque article avec sa date lisible et machine', () => {
    render(<BlogGrid status="success" articles={ARTICLES} />)

    expect(screen.getAllByTestId('home-blog-card')).toHaveLength(2)
    expect(screen.getByRole('heading', { level: 3, name: 'Premier' })).toBeInTheDocument()
    expect(screen.getByText('29 septembre 2026')).toHaveAttribute('datetime', '2026-09-29')
  })

  it('relie chaque carte à sa fiche par son titre', () => {
    render(<BlogGrid status="success" articles={ARTICLES} />)

    expect(screen.getByRole('link', { name: 'Premier' })).toHaveAttribute('href', '/blog/premier')
  })

  it('pose l’image de l’API, et aucune image quand l’article n’en a pas', () => {
    render(<BlogGrid status="success" articles={ARTICLES} />)

    const [withImage, withoutImage] = screen.getAllByTestId('home-blog-card')
    expect(withImage?.querySelector('img')).toHaveAttribute(
      'alt',
      'Illustration du premier article',
    )
    expect(withImage?.querySelector('source[type="image/avif"]')).toHaveAttribute(
      'srcset',
      'http://api.test/media/a-480.avif 480w, http://api.test/media/a-960.avif 960w',
    )
    expect(withoutImage?.querySelector('img')).toBeNull()
  })
})
