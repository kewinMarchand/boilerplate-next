import { Link } from '@/shared/ui/kit'

import styles from './SectionFilter.module.css'

import type { Article } from '../domain/article'

interface SectionFilterProps {
  sections: Article.Term[]
  active: string | undefined
}

/** Filtre de `/blog` par rubrique, en liens : marche sans JavaScript, chaque rubrique a son adresse. */
export const SectionFilter = ({ sections, active }: SectionFilterProps) => (
  <nav aria-label="Rubriques" className={styles.filter} data-testid="blog-sections">
    <ul className="bui-chip-list">
      {[{ slug: undefined, name: 'Toutes' }, ...sections].map(({ slug, name }) => (
        <li key={slug ?? ''}>
          <Link
            href={slug ? `/blog?rubrique=${slug}` : '/blog'}
            className="bui-chip"
            aria-current={slug === active ? 'page' : undefined}
            data-testid="blog-section-link"
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
)
