import {
  addItem,
  countItems,
  lineIn,
  MAX_QUANTITY,
  removeItem,
  setQuantity,
  totalPrice,
} from './cart'

const MONSTERA = {
  id: '1',
  slug: 'monstera-deliciosa',
  name: 'Monstera deliciosa',
  price: 3490,
  translations: [
    { locale: 'fr', slug: 'monstera-deliciosa', name: 'Monstera deliciosa' },
    { locale: 'en', slug: 'swiss-cheese-plant', name: 'Swiss cheese plant' },
  ],
}
const FERN = {
  id: '2',
  slug: 'fougere-de-boston',
  name: 'Fougère de Boston',
  price: 1590,
  translations: [],
}

describe('panier', () => {
  it('ajoute une ligne puis cumule les ajouts du même produit', () => {
    const lines = addItem(addItem(addItem([], MONSTERA), FERN), MONSTERA)

    expect(lines).toEqual([
      { ...MONSTERA, quantity: 2 },
      { ...FERN, quantity: 1 },
    ])
    expect(countItems(lines)).toBe(3)
    expect(totalPrice(lines)).toBe(2 * 3490 + 1590)
  })

  it('plafonne la quantité à 99 et la garde au moins à 1', () => {
    const lines = setQuantity(addItem([], MONSTERA), MONSTERA.id, 250)

    expect(lines[0]?.quantity).toBe(MAX_QUANTITY)
    expect(addItem(lines, MONSTERA)[0]?.quantity).toBe(MAX_QUANTITY)
    expect(setQuantity(lines, MONSTERA.id, 0)[0]?.quantity).toBe(1)
  })

  it('retire une ligne', () => {
    expect(removeItem(addItem(addItem([], MONSTERA), FERN), MONSTERA.id)).toEqual([
      { ...FERN, quantity: 1 },
    ])
  })

  it('cumule le même produit ajouté dans une autre langue', () => {
    const english = { ...MONSTERA, slug: 'swiss-cheese-plant', name: 'Swiss cheese plant' }

    expect(addItem(addItem([], MONSTERA), english)).toEqual([{ ...MONSTERA, quantity: 2 }])
  })

  it('nomme la ligne dans la langue de la page, sinon dans celle de l’ajout', () => {
    expect(lineIn({ ...MONSTERA, quantity: 1 }, 'en')).toMatchObject({
      slug: 'swiss-cheese-plant',
      name: 'Swiss cheese plant',
    })
    expect(lineIn({ ...FERN, quantity: 1 }, 'en')).toMatchObject({
      slug: 'fougere-de-boston',
      name: 'Fougère de Boston',
    })
  })
})
