import { Chip, Cluster } from '@kewinmarchand/boilerplates-ui/react'

import { dictionaryFor, FALLBACK_LOCALE } from '@/shared/i18n'
import { Link } from '@/shared/ui/kit'
import { Breadcrumb, buildBreadcrumb } from '@/shared/ui/layout'

import { CatalogPagination } from '@/modules/catalog'

import styles from '../styleguide.module.css'
import { StyleguideSection } from '../StyleguideSection'

const QUERY = {
  exposures: [],
  sizes: [],
  priceMin: null,
  priceMax: null,
  inStock: false,
  sort: 'pertinence',
  view: 'grille',
  page: 5,
} as const

export const NavigationSection = () => (
  <StyleguideSection title="Navigation">
    <Breadcrumb
      items={buildBreadcrumb(dictionaryFor(FALLBACK_LOCALE).nav, '/catalogue', [
        { label: 'Plantes aquatiques', href: '/catalogue/plantes-aquatiques' },
      ])}
      withJsonLd={false}
    />
    <CatalogPagination
      path="/catalogue"
      query={{ ...QUERY, exposures: [], sizes: [], attributes: {} }}
      page={5}
      pageCount={10}
    />
    <ul className={`bui-chip-list ${styles.chips}`}>
      <li>
        <Chip removable>Mi-ombre</Chip>
      </li>
      <li>
        <Chip removable>Taille M</Chip>
      </li>
    </ul>
    <Cluster gap="6">
      <Link href="/" className="bui-link">
        Lien interne
      </Link>
      <a className="bui-link" href="https://www.w3.org/WAI/standards-guidelines/wcag/fr">
        Lien externe : les WCAG sur le site du W3C
      </a>
    </Cluster>
  </StyleguideSection>
)
