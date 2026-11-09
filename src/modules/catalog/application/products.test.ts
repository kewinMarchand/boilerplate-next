import { findProduct } from '../infrastructure/catalogRepository'
import { loadProductTranslations } from './products'

import type { Catalog } from '../domain/catalog'

vi.mock('../infrastructure/catalogRepository', () => ({ findProduct: vi.fn() }))

const product = (alternates: Catalog.ProductDetail['alternates']) =>
  ({
    slug: 'monstera-deliciosa',
    name: 'Monstera deliciosa',
    alternates,
  }) as Catalog.ProductDetail

describe('loadProductTranslations', () => {
  it('ne demande rien sur un site monolingue', async () => {
    expect(await loadProductTranslations(product([]), 'fr')).toEqual([])
    expect(findProduct).not.toHaveBeenCalled()
  })

  it('lit le nom dans chaque autre langue et omet celle que l’API ne sert pas', async () => {
    vi.mocked(findProduct).mockImplementation(async (slug, locale) =>
      locale === 'en'
        ? ({ slug, name: 'Swiss cheese plant' } as Catalog.ProductDetail)
        : Promise.reject(new Error('API muette')),
    )

    expect(
      await loadProductTranslations(
        product([
          { locale: 'fr', path: '/produit/monstera-deliciosa' },
          { locale: 'en', path: '/produit/swiss-cheese-plant' },
          { locale: 'de', path: '/produit/fensterblatt' },
        ]),
        'fr',
      ),
    ).toEqual([
      { locale: 'fr', slug: 'monstera-deliciosa', name: 'Monstera deliciosa' },
      { locale: 'en', slug: 'swiss-cheese-plant', name: 'Swiss cheese plant' },
    ])
    expect(findProduct).toHaveBeenCalledWith('swiss-cheese-plant', 'en')
  })
})
