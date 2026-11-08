import { findCatalogPage, findCategoryTree } from '../infrastructure/catalogRepository'
import { loadCatalogPage } from './loadCatalogPage'

import type { Catalog } from '../domain/catalog'
import type { CatalogPage } from '../infrastructure/catalogRepository'

vi.mock('../infrastructure/catalogRepository', () => ({
  findCategoryTree: vi.fn(),
  findCatalogPage: vi.fn(),
}))

const TREE: Catalog.Category[] = [
  {
    slug: 'plantes-interieur',
    name: 'Plantes d’intérieur',
    children: [
      {
        slug: 'feuillages',
        name: 'Feuillages',
        children: [
          { slug: 'monstera', name: 'Monstera', children: [] },
          { slug: 'fougeres', name: 'Fougères', children: [] },
        ],
      },
    ],
  },
]

const PAGE: CatalogPage = {
  products: [],
  total: 0,
  page: 1,
  pageCount: 1,
  facets: { exposure: [], size: [], attributes: [] },
  subcategories: [],
}

describe('loadCatalogPage', () => {
  beforeEach(() => {
    vi.mocked(findCategoryTree).mockResolvedValue(TREE)
    vi.mocked(findCatalogPage).mockResolvedValue(PAGE)
  })

  it('renvoie la page d’une catégorie connue, avec l’état de recherche lu dans l’URL', async () => {
    const load = await loadCatalogPage(['plantes-interieur', 'feuillages'], { tri: 'nom' })

    expect(findCatalogPage).toHaveBeenCalledWith(
      ['plantes-interieur', 'feuillages'],
      expect.objectContaining({ sort: 'nom' }),
    )
    expect(load).toMatchObject({ status: 'ok', result: { status: 'success', page: PAGE } })
    if (load.status !== 'ok') throw new Error('page attendue')
    expect(load.categoryPath.map((link) => link.slug)).toEqual(['plantes-interieur', 'feuillages'])
    expect(load.subcategories.map((link) => link.slug)).toEqual(['monstera', 'fougeres'])
  })

  it('déclare introuvables une catégorie inconnue et un chemin trop profond', async () => {
    expect(await loadCatalogPage(['inconnue'], {})).toEqual({ status: 'not-found' })
    expect(await loadCatalogPage(['a', 'b', 'c', 'd'], {})).toEqual({ status: 'not-found' })
  })

  it('déclare introuvable une page au-delà de la dernière', async () => {
    vi.mocked(findCatalogPage).mockResolvedValueOnce({ ...PAGE, page: 9, pageCount: 2 })

    expect(await loadCatalogPage(['plantes-interieur'], { page: '9' })).toEqual({
      status: 'not-found',
    })
  })

  it('transforme un échec de l’API en résultat d’erreur affichable', async () => {
    vi.mocked(findCatalogPage).mockRejectedValueOnce(new Error('panne'))
    vi.spyOn(console, 'error').mockImplementationOnce(() => {})

    expect(await loadCatalogPage(['plantes-interieur'], {})).toMatchObject({
      status: 'ok',
      categoryPath: [{ slug: 'plantes-interieur' }],
      result: { status: 'error', message: 'Impossible de charger le catalogue pour le moment.' },
    })
  })

  it('affiche l’erreur à la racine du catalogue quand l’arbre ne peut pas être lu', async () => {
    vi.mocked(findCategoryTree).mockRejectedValueOnce(new Error('panne'))
    vi.spyOn(console, 'error').mockImplementationOnce(() => {})

    expect(await loadCatalogPage(['plantes-interieur'], {})).toMatchObject({
      status: 'ok',
      query: expect.objectContaining({ page: 1 }),
      categoryPath: [],
      subcategories: [],
      result: { status: 'error' },
    })
  })
})
