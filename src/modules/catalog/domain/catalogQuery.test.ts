import {
  catalogHref,
  clearFilters,
  countActiveFilters,
  DEFAULT_QUERY,
  serializeCatalogQuery,
  withAttribute,
  withFilter,
  withoutPriceCriteria,
} from './catalogQuery'
import { parseCatalogQuery } from './parseCatalogQuery'

describe('parseCatalogQuery', () => {
  it('retourne la requête par défaut sans paramètre', () => {
    expect(parseCatalogQuery({})).toEqual(DEFAULT_QUERY)
  })

  it('lit les clés répétées et ignore les valeurs invalides', () => {
    const query = parseCatalogQuery({
      exposition: ['soleil', 'lune', 'soleil'],
      taille: 'XL',
      prix_min: 'abc',
      prix_max: '40',
      en_stock: '1',
      tri: 'hasard',
      vue: 'liste',
      page: '-3',
    })

    expect(query).toEqual({
      ...DEFAULT_QUERY,
      exposures: ['soleil'],
      priceMax: 40,
      inStock: true,
      view: 'liste',
    })
  })
})

describe('attributs dans l’URL', () => {
  it('lit attr-<code> répété, sans doublon, et ignore code ou valeur invalides', () => {
    const query = parseCatalogQuery({
      'attr-feuillage': ['persistant', 'caduc', 'persistant', 'Caduc!'],
      'attr-hauteur-adulte': '',
      'attr-Mauvais': 'x',
      attr: 'x',
    })

    expect(query.attributes).toEqual({ feuillage: ['persistant', 'caduc'] })
  })

  it('fait l’aller-retour URL ↔ requête', () => {
    const query = {
      ...DEFAULT_QUERY,
      attributes: { feuillage: ['caduc'], couleur: ['rouge', 'blanc'] },
    }
    const search = serializeCatalogQuery(query)

    expect(search.toString()).toBe('attr-feuillage=caduc&attr-couleur=rouge&attr-couleur=blanc')
    expect(
      parseCatalogQuery(
        Object.fromEntries([...new Set(search.keys())].map((key) => [key, search.getAll(key)])),
      ),
    ).toEqual(query)
  })

  it('withAttribute revient à la page 1 et retire un attribut vidé', () => {
    const query = { ...DEFAULT_QUERY, page: 3, attributes: { feuillage: ['caduc'] } }

    expect(withAttribute(query, 'feuillage', ['caduc', 'persistant'])).toEqual({
      ...query,
      page: 1,
      attributes: { feuillage: ['caduc', 'persistant'] },
    })
    expect(withAttribute(query, 'feuillage', []).attributes).toEqual({})
    expect(countActiveFilters({ ...query, attributes: { a: ['x', 'y'], b: ['z'] } })).toBe(3)
  })
})

describe('serializeCatalogQuery', () => {
  it('fait l’aller-retour sans perte et omet les valeurs par défaut', () => {
    const query = {
      ...DEFAULT_QUERY,
      exposures: ['mi-ombre' as const, 'ombre' as const],
      sizes: ['L' as const],
      priceMin: 10,
      sort: 'prix-asc' as const,
      view: 'liste' as const,
      page: 2,
    }
    const search = serializeCatalogQuery(query)

    expect(search.toString()).toBe(
      'exposition=mi-ombre&exposition=ombre&taille=L&prix_min=10&tri=prix-asc&vue=liste&page=2',
    )
    expect(
      parseCatalogQuery(
        Object.fromEntries(
          ['exposition', 'taille', 'prix_min', 'tri', 'vue', 'page'].map((key) => [
            key,
            search.getAll(key),
          ]),
        ),
      ),
    ).toEqual(query)
    expect(catalogHref('/catalogue', DEFAULT_QUERY)).toBe('/catalogue')
  })
})

describe('withFilter et clearFilters', () => {
  it('revient à la page 1 en conservant les autres paramètres', () => {
    const query = { ...DEFAULT_QUERY, view: 'liste' as const, sort: 'nom' as const, page: 3 }

    expect(withFilter(query, { inStock: true })).toEqual({ ...query, inStock: true, page: 1 })
  })

  it('efface filtres et tri mais garde la vue', () => {
    const query = { ...DEFAULT_QUERY, view: 'liste' as const, sort: 'nom' as const, inStock: true }

    expect(clearFilters(query)).toEqual({ ...DEFAULT_QUERY, view: 'liste' })
  })
})

describe('withoutPriceCriteria', () => {
  it('ignore filtre et tri par prix, garde le reste', () => {
    const query = { ...DEFAULT_QUERY, exposures: ['soleil' as const], priceMin: 10, priceMax: 50 }

    expect(withoutPriceCriteria({ ...query, sort: 'prix-asc' })).toEqual({
      ...DEFAULT_QUERY,
      exposures: ['soleil'],
    })
    expect(withoutPriceCriteria({ ...query, sort: 'nom' }).sort).toBe('nom')
  })
})
