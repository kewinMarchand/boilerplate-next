/** Centimes affichés en euros selon la langue de la page (`tag` BCP 47 : « 34,90 € » en `fr-FR`). */
export const formatPrice = (cents: number, tag: string) =>
  new Intl.NumberFormat(tag, { style: 'currency', currency: 'EUR' }).format(cents / 100)
