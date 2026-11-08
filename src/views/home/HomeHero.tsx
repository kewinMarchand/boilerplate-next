import { Link, Picture, staticImage } from '@/shared/ui/kit'

import styles from './HomeHero.module.css'

const HERO = staticImage('/images/hero', [640, 960, 1280, 1920], {
  width: 1920,
  height: 1080,
  alt: '',
})

interface HomeHeroProps {
  name: string
  tagline: string
}

export const HomeHero = ({ name, tagline }: HomeHeroProps) => (
  <section aria-labelledby="home-hero-title" data-testid="home-hero" className={styles.hero}>
    <Picture
      image={HERO}
      isPriority
      sizes="100vw"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
    />
    <div aria-hidden="true" className={styles.overlay} />
    <div className={`bui-container ${styles.content}`}>
      <div className={styles.inner}>
        <p className={`bui-text bui-text--overline ${styles.overline}`}>
          Jardinerie tropicale de démonstration
        </p>
        <h1 id="home-hero-title" className={`bui-text bui-text--h1 ${styles.title}`}>
          {name}
        </h1>
        <p className={`bui-text bui-text--lead ${styles.lead}`}>{tagline}</p>
        <div className={styles.actions}>
          <Link href="/taches" className="bui-button bui-button--lg" data-testid="home-tasks-link">
            Voir la démo TanStack Query
          </Link>
          <Link
            href="/contact"
            className="bui-button bui-button--outline-light bui-button--lg"
            data-testid="home-contact-link"
          >
            Voir le formulaire
          </Link>
        </div>
      </div>
    </div>
  </section>
)
