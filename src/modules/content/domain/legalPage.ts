export declare namespace LegalPage {
  type Slug = 'mentions-legales' | 'donnees-personnelles' | 'accessibilite'

  interface Section {
    title: string
    /** HTML produit par l'API depuis le Markdown de l'admin, HTML saisi échappé. */
    html: string
  }

  interface Entity {
    title: string
    introduction: string
    sections: Section[]
  }
}
