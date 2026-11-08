'use client'

import { useHydrated } from '@/shared/ui/hooks/useHydrated'
import { largestWebp, Picture } from '@/shared/ui/kit'

import { useProductGallery } from './hooks/useProductGallery'
import styles from './ProductGallery.module.css'

import type { ResponsiveImage } from '@/shared/ui/kit'

const THUMB_SIZES = '72px'
const IMAGE_STYLE = { display: 'block', width: '100%', height: 'auto' } as const

interface ProductGalleryProps {
  images: ResponsiveImage[]
  sizes: string
}

/**
 * Image en grand et vignettes qui la remplacent. Avant l'hydratation (et sans JavaScript), les
 * vignettes sont des liens vers l'image en grand.
 */
export const ProductGallery = ({ images, sizes }: ProductGalleryProps) => {
  const isHydrated = useHydrated()
  const { selected, select, thumbsRef, onThumbKeyDown } = useProductGallery(images.length)
  const image = images[selected] ?? images[0]

  return (
    <div className={styles.gallery} data-testid="product-gallery">
      {image && (
        <Picture
          key={selected}
          image={image}
          sizes={sizes}
          isPriority={selected === 0}
          loading="eager"
          style={{ ...IMAGE_STYLE, borderRadius: 8 }}
        />
      )}
      <ul className={styles.thumbs} ref={thumbsRef}>
        {images.map((thumb, index) => {
          const label = `Voir l’image ${index + 1} sur ${images.length}`
          const isCurrent = index === selected ? 'true' : undefined
          const picture = (
            <Picture image={{ ...thumb, alt: '' }} sizes={THUMB_SIZES} style={IMAGE_STYLE} />
          )
          return (
            <li key={thumb.src}>
              {isHydrated ? (
                <button
                  type="button"
                  aria-label={label}
                  aria-current={isCurrent}
                  className={styles.thumb}
                  onClick={() => select(index)}
                  onKeyDown={(event) => onThumbKeyDown(event, index)}
                  data-testid="product-gallery-thumb"
                >
                  {picture}
                </button>
              ) : (
                <a
                  href={largestWebp(thumb)}
                  aria-label={label}
                  aria-current={isCurrent}
                  className={styles.thumb}
                  data-testid="product-gallery-thumb"
                >
                  {picture}
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
