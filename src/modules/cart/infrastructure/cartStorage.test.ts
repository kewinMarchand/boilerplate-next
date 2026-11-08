import { parseCart } from './cartStorage'

describe('parseCart', () => {
  it('lit un panier valide', () => {
    const lines = [
      { slug: 'monstera-deliciosa', name: 'Monstera deliciosa', price: 3490, quantity: 2 },
    ]

    expect(parseCart(JSON.stringify(lines))).toEqual(lines)
  })

  it('rend un panier vide pour une entrée absente, illisible ou invalide', () => {
    expect(parseCart(null)).toEqual([])
    expect(parseCart('{pas du json')).toEqual([])
    expect(parseCart(JSON.stringify([{ slug: 'x', name: 'X', price: -1, quantity: 1 }]))).toEqual(
      [],
    )
    expect(parseCart(JSON.stringify([{ slug: 'x', name: 'X', price: 1, quantity: 100 }]))).toEqual(
      [],
    )
  })
})
