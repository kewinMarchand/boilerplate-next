import { toCatalogPage, toCategory, toProductDetail, toProductsQuery } from './catalogTranslation'

import type { Catalog } from '@/modules/catalog/domain/catalog'

const QUERY: Catalog.Query = {
  exposures: [],
  sizes: [],
  priceMin: null,
  priceMax: null,
  inStock: false,
  sort: 'pertinence',
  view: 'grille',
  page: 1,
}

describe('toProductsQuery', () => {
  it('n’envoie que la pagination sans filtre ni tri', () => {
    expect(toProductsQuery([], QUERY)).toEqual({ page: 1, itemsPerPage: 12 })
  })

  it('traduit catégorie, filtres, prix en centimes et tri', () => {
    expect(
      toProductsQuery(['plantes-interieur', 'feuillages'], {
        ...QUERY,
        exposures: ['soleil', 'ombre'],
        sizes: ['M'],
        priceMin: 10,
        priceMax: 49,
        inStock: true,
        sort: 'prix-desc',
        page: 2,
      }),
    ).toEqual({
      category: 'feuillages',
      'exposure[]': ['soleil', 'ombre'],
      'size[]': ['M'],
      priceMin: 1000,
      priceMax: 4900,
      inStock: true,
      'order[price]': 'desc',
      page: 2,
      itemsPerPage: 12,
    })
    expect(toProductsQuery([], { ...QUERY, sort: 'nom' })).toMatchObject({ 'order[name]': 'asc' })
  })

  it('garde un prix minimum à zéro', () => {
    expect(toProductsQuery([], { ...QUERY, priceMin: 0 })).toMatchObject({ priceMin: 0 })
  })
})

describe('toCategory', () => {
  it('traduit l’arbre en gardant les enfants', () => {
    expect(
      toCategory({
        slug: 'plantes-aquatiques',
        name: 'Plantes aquatiques',
        parent: null,
        children: [
          { slug: 'nenuphars', name: 'Nénuphars', parent: 'plantes-aquatiques', children: [] },
        ],
      }),
    ).toEqual({
      slug: 'plantes-aquatiques',
      name: 'Plantes aquatiques',
      children: [{ slug: 'nenuphars', name: 'Nénuphars', children: [] }],
    })
  })
})

describe('toCatalogPage', () => {
  it('traduit identifiants, prix, sous-catégories et facettes dans l’ordre du domaine', () => {
    const page = toCatalogPage(
      [
        {
          id: 7,
          slug: 'kentia',
          name: 'Kentia',
          categorySlug: 'palmiers',
          price: 5990,
          exposure: 'mi-ombre',
          size: 'L',
          inStock: true,
          image: null,
        },
      ],
      {
        totalItems: 1,
        exposure: [
          { value: 'ombre', count: 0 },
          { value: 'mi-ombre', count: 1 },
        ],
        size: [{ value: 'L', count: 1 }],
        category: [{ slug: 'palmiers', name: 'Palmiers', count: 1 }],
      },
      1,
      ['plantes-exterieur'],
    )

    expect(page.products[0]).toMatchObject({ id: '7', price: 5990 })
    expect(page.subcategories).toEqual([
      { href: '/catalogue/plantes-exterieur/palmiers', name: 'Palmiers', count: 1 },
    ])
    expect(page.facets.exposure).toEqual([
      { value: 'soleil', count: 0 },
      { value: 'mi-ombre', count: 1 },
      { value: 'ombre', count: 0 },
    ])
  })

  it('garde au moins une page quand il n’y a aucun résultat', () => {
    const page = toCatalogPage([], { totalItems: 0, exposure: [], size: [], category: [] }, 1, [])

    expect(page.pageCount).toBe(1)
  })

  it('calcule le nombre de pages à partir du total des facettes', () => {
    const page = toCatalogPage([], { totalItems: 25, exposure: [], size: [], category: [] }, 3, [])

    expect(page).toMatchObject({ total: 25, page: 3, pageCount: 3 })
  })
})

describe('toProductDetail', () => {
  it('relie chaque étape du chemin de la catégorie à sa page du catalogue', () => {
    const detail = toProductDetail({
      id: 1,
      slug: 'monstera-deliciosa',
      name: 'Monstera deliciosa',
      categorySlug: 'monstera',
      price: 3490,
      exposure: 'mi-ombre',
      size: 'M',
      inStock: true,
      image: null,
      categoryPath: [
        { slug: 'plantes-interieur', name: 'Plantes d’intérieur' },
        { slug: 'feuillages', name: 'Feuillages' },
        { slug: 'monstera', name: 'Monstera' },
      ],
      description: '',
    })

    expect(detail.id).toBe('1')
    expect(detail.description).toEqual([])
    expect(detail.categoryPath.map((link) => link.href)).toEqual([
      '/catalogue/plantes-interieur',
      '/catalogue/plantes-interieur/feuillages',
      '/catalogue/plantes-interieur/feuillages/monstera',
    ])
  })

  it('découpe la description en paragraphes aux lignes vides', () => {
    const detail = toProductDetail({
      id: 1,
      slug: 'palmier-nain',
      name: 'Palmier nain',
      categorySlug: 'palmiers',
      price: 4490,
      exposure: 'soleil',
      size: 'M',
      inStock: true,
      image: null,
      categoryPath: [{ slug: 'palmiers', name: 'Palmiers' }],
      description: 'Rustique.\n\n  \nRésiste au vent,\naux embruns.',
    })

    expect(detail.description).toEqual(['Rustique.', 'Résiste au vent,\naux embruns.'])
  })
})
