import { addItem, countItems, MAX_QUANTITY, removeItem, setQuantity, totalPrice } from './cart'

const MONSTERA = { slug: 'monstera-deliciosa', name: 'Monstera deliciosa', price: 3490 }
const FERN = { slug: 'fougere-de-boston', name: 'Fougère de Boston', price: 1590 }

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
    const lines = setQuantity(addItem([], MONSTERA), MONSTERA.slug, 250)

    expect(lines[0]?.quantity).toBe(MAX_QUANTITY)
    expect(addItem(lines, MONSTERA)[0]?.quantity).toBe(MAX_QUANTITY)
    expect(setQuantity(lines, MONSTERA.slug, 0)[0]?.quantity).toBe(1)
  })

  it('retire une ligne', () => {
    expect(removeItem(addItem(addItem([], MONSTERA), FERN), MONSTERA.slug)).toEqual([
      { ...FERN, quantity: 1 },
    ])
  })
})
