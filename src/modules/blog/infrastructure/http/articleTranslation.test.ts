import { toArticle, toArticleDetail } from './articleTranslation'

import type { components } from '@/shared/api/client'

const ARTICLE: components['schemas']['Article'] = {
  id: 2,
  slug: 'un-carrousel-accessible-sans-dependance',
  title: 'Un carrousel accessible sans dépendance',
  excerpt: 'Extrait.',
  publishedAt: '2026-05-02',
  image: null,
  section: { slug: 'conseils', name: 'Conseils' },
  format: { slug: 'guide', name: 'Guide' },
  audio: { src: 'https://api.test/media/bip.mp3', type: 'audio/mpeg', durationSeconds: 4 },
  speaker: 'Présenté par Hina Teriierooiterai',
}

describe('toArticle', () => {
  it('garde la rubrique, ou son absence', () => {
    expect(toArticle(ARTICLE).section).toEqual({ slug: 'conseils', name: 'Conseils' })
    expect(toArticle({ ...ARTICLE, section: null }).section).toBeNull()
  })
})

describe('toArticleDetail', () => {
  const DETAIL = { ...ARTICLE, html: '<p>Texte</p>', metaTitle: '', metaDescription: '' }

  it('reprend format, audio, intervenant et métadonnées', () => {
    expect(toArticleDetail({ ...DETAIL, metaTitle: 'Titre saisi' })).toMatchObject({
      format: { slug: 'guide', name: 'Guide' },
      audio: { src: 'https://api.test/media/bip.mp3', type: 'audio/mpeg', durationSeconds: 4 },
      speaker: 'Présenté par Hina Teriierooiterai',
      metaTitle: 'Titre saisi',
      metaDescription: '',
    })
  })

  it('garde l’absence de format et d’audio', () => {
    expect(toArticleDetail({ ...DETAIL, format: null, audio: null, speaker: '' })).toMatchObject({
      format: null,
      audio: null,
      speaker: '',
    })
  })
})
