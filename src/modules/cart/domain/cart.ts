export declare namespace Cart {
  /** Slug et nom du produit dans une langue du site. */
  interface Translation {
    locale: string
    slug: string
    name: string
  }

  /**
   * Ligne du panier, identifiée par le produit ; prix en centimes, relevé à l'ajout. `slug` et `name`
   * dans la langue de l'ajout, `translations` dans chaque langue du site (vide sur un site monolingue).
   */
  interface Line {
    id: string
    slug: string
    name: string
    price: number
    quantity: number
    translations: Translation[]
  }

  type Item = Omit<Line, 'quantity'>
}

export const MAX_QUANTITY = 99

const clampQuantity = (quantity: number) =>
  Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(quantity)))

/** Ajoute une unité ; un produit déjà présent voit sa quantité augmenter, plafonnée. */
export const addItem = (lines: readonly Cart.Line[], item: Cart.Item): Cart.Line[] =>
  lines.some((line) => line.id === item.id)
    ? lines.map((line) =>
        line.id === item.id ? { ...line, quantity: clampQuantity(line.quantity + 1) } : line,
      )
    : [...lines, { ...item, quantity: 1 }]

export const setQuantity = (
  lines: readonly Cart.Line[],
  id: string,
  quantity: number,
): Cart.Line[] =>
  lines.map((line) => (line.id === id ? { ...line, quantity: clampQuantity(quantity) } : line))

export const removeItem = (lines: readonly Cart.Line[], id: string): Cart.Line[] =>
  lines.filter((line) => line.id !== id)

/** Slug et nom de la ligne dans la langue de la page, ceux de la langue de l'ajout à défaut. */
export const lineIn = (line: Cart.Line, locale: string): Pick<Cart.Line, 'slug' | 'name'> =>
  line.translations.find((translation) => translation.locale === locale) ?? line

export const countItems = (lines: readonly Cart.Line[]) =>
  lines.reduce((count, line) => count + line.quantity, 0)

export const totalPrice = (lines: readonly Cart.Line[]) =>
  lines.reduce((total, line) => total + line.price * line.quantity, 0)
