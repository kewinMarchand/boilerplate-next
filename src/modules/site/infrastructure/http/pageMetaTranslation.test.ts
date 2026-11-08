import { toPageMetas } from './pageMetaTranslation'

describe('toPageMetas', () => {
  it('indexe titre et description par page fixe', () => {
    expect(
      toPageMetas([
        { page: 'home', title: '', description: '' },
        { page: 'blog', title: 'Le blog', description: 'Conseils et actualités.' },
      ]),
    ).toEqual({
      home: { title: '', description: '' },
      blog: { title: 'Le blog', description: 'Conseils et actualités.' },
    })
  })
})
