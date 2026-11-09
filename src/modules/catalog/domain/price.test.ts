import { eurosToCents, formatPrice, InvalidPriceError, Price } from './price'

describe('Price', () => {
  it('convertit les euros de l’URL en centimes', () => {
    expect(eurosToCents(12.9)).toBe(1290)
    expect(eurosToCents(0)).toBe(0)
  })

  it('refuse un montant négatif ou fractionnaire en centimes', () => {
    expect(() => Price.fromCents(-1)).toThrow(InvalidPriceError)
    expect(() => Price.fromCents(10.5)).toThrow(InvalidPriceError)
  })

  it('formate un prix en euros, à la française', () => {
    expect(formatPrice(Price.fromCents(3490), 'fr-FR')).toBe('34,90 €')
  })
})
