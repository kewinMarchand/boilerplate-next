import { getDictionary } from '@/shared/i18n/server'
import { Link } from '@/shared/ui/kit'

import styles from './SectionFilter.module.css'

import type { Article } from '../domain/article'

interface SectionFilterProps {
  sections: Article.Term[]
  active: string | undefined
}

/** Filtre de `/blog` par rubrique, en liens : marche sans JavaScript, chaque rubrique a son adresse. */
export const SectionFilter = async ({ sections, active }: SectionFilterProps) => {
  const t = (await getDictionary()).blog
  return (
    <nav aria-label={t.sections} className={styles.filter} data-testid="blog-sections">
      <ul className="bui-chip-list">
        {[{ slug: undefined, name: t.allSections }, ...sections].map(({ slug, name }) => (
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
}
