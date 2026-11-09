/** Formes d'un libellé qui dépend d'un nombre (`Intl.PluralRules` : `one`, sinon `other`). */
export interface Plural {
  one: string
  other: string
}

type Values = Record<string, string | number>

/** Remplace `{nom}` par sa valeur : les dictionnaires restent des données, sérialisables. */
export const format = (template: string, values: Values = {}) =>
  template.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    name in values ? String(values[name]) : placeholder,
  )

/** Forme de `count` dans la langue `tag` (BCP 47), `{count}` remplacé. */
export const plural = (forms: Plural, count: number, tag: string, values: Values = {}) =>
  format(new Intl.PluralRules(tag).select(count) === 'one' ? forms.one : forms.other, {
    count,
    ...values,
  })
