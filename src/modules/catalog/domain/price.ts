declare const PRICE: unique symbol

/**
 * Prix en centimes d'euro, entier positif ou nul, comme dans l'API. Le type marqué interdit de
 * passer un nombre quelconque là où un prix est attendu : seuls fromCents et eurosToCents en
 * produisent un. Les euros n'existent que dans l'URL et à l'affichage.
 */
export type Price = number & { readonly [PRICE]: true }

export class InvalidPriceError extends Error {
  constructor(cents: number) {
    super(`Un prix ne peut pas être négatif ni fractionnaire : ${cents} centimes.`)
    this.name = 'InvalidPriceError'
  }
}

export const Price = {
  fromCents: (cents: number): Price => {
    if (!Number.isSafeInteger(cents) || cents < 0) throw new InvalidPriceError(cents)
    // Seul point de création d'un Price : la marque n'existe qu'à la compilation, le nombre est vérifié juste au-dessus.
    return cents as Price
  },
}

export const eurosToCents = (euros: number): Price => Price.fromCents(Math.round(euros * 100))

/** Prix affiché selon la langue de la page (`tag` BCP 47 : « 34,90 € » en `fr-FR`). */
export const formatPrice = (price: Price, tag: string) =>
  new Intl.NumberFormat(tag, { style: 'currency', currency: 'EUR' }).format(price / 100)
