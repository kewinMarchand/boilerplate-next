import { Picture, staticImage } from '@/shared/ui/kit'

import { BlogGrid } from '@/modules/blog'
import { Price, ProductCard } from '@/modules/catalog'

import styles from '../styleguide.module.css'
import { StyleguideSection } from '../StyleguideSection'

const PRODUCT = {
  id: 'exemple',
  slug: 'exemple',
  name: 'Heliconia rostrata',
  categorySlug: 'heliconia',
  price: Price.fromCents(3290),
  exposure: 'soleil',
  size: 'M',
  inStock: false,
  image: null,
} as const

/** Photo du site : la charte graphique est statique, elle ne lit pas l'API. */
const PHOTO = staticImage('/images/hero', [640, 1280], { width: 1280, height: 720, alt: '' })

const ARTICLE = {
  id: 'exemple',
  title: 'Carte de blog',
  excerpt: 'Illustration, titre, extrait et date lisible par les machines.',
  publishedAt: '2026-10-01',
  image: PHOTO,
}

export const MediaSection = () => (
  <StyleguideSection title="Médias et cartes">
    <BlogGrid status="success" articles={[ARTICLE]} />
    <div className={styles.cards}>
      <ProductCard product={PRODUCT} position={1} isPriority={false} />
      <ProductCard product={PRODUCT} position={2} isPriority={false} />
    </div>
    <p className={`bui-text bui-text--body-sm ${styles.caption}`}>
      La même carte produit en grille (colonne étroite) et en liste (colonne large), via une requête
      de conteneur.
    </p>
    <div className={styles.media}>
      <Picture
        image={PHOTO}
        sizes="480px"
        style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', borderRadius: 8 }}
      />
      <p className="bui-text bui-text--body-sm">Image au ratio 16:9, dimensions posées.</p>
    </div>
  </StyleguideSection>
)
