export declare namespace PageMeta {
  /** Pages fixes dont le titre et la description se saisissent dans l'admin. */
  type Page =
    | 'home'
    | 'catalog'
    | 'blog'
    | 'contact'
    | 'sitemap'
    | 'legal-notice'
    | 'privacy'
    | 'accessibility'

  /** Chaînes vides quand rien n'est saisi : la page garde ses valeurs. */
  interface Entity {
    title: string
    description: string
  }
}
