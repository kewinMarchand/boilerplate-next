export declare namespace Cart {
  /** Ligne du panier ; prix en centimes, relevé à l'ajout. */
  interface Line {
    slug: string
    name: string
    price: number
    quantity: number
  }

  type Item = Omit<Line, 'quantity'>
}

export const MAX_QUANTITY = 99

const clampQuantity = (quantity: number) =>
  Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(quantity)))

/** Ajoute une unité ; un produit déjà présent voit sa quantité augmenter, plafonnée. */
export const addItem = (lines: readonly Cart.Line[], item: Cart.Item): Cart.Line[] =>
  lines.some((line) => line.slug === item.slug)
    ? lines.map((line) =>
        line.slug === item.slug ? { ...line, quantity: clampQuantity(line.quantity + 1) } : line,
      )
    : [...lines, { ...item, quantity: 1 }]

export const setQuantity = (
  lines: readonly Cart.Line[],
  slug: string,
  quantity: number,
): Cart.Line[] =>
  lines.map((line) => (line.slug === slug ? { ...line, quantity: clampQuantity(quantity) } : line))

export const removeItem = (lines: readonly Cart.Line[], slug: string): Cart.Line[] =>
  lines.filter((line) => line.slug !== slug)

export const countItems = (lines: readonly Cart.Line[]) =>
  lines.reduce((count, line) => count + line.quantity, 0)

export const totalPrice = (lines: readonly Cart.Line[]) =>
  lines.reduce((total, line) => total + line.price * line.quantity, 0)
