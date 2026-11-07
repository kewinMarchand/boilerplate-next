import type { CSSProperties } from 'react'

/** Forme de l'objet `image` du contrat de l'API : variantes AVIF puis WebP, adresses prêtes à poser. */
export interface ResponsiveImage {
  alt: string
  width: number
  height: number
  sources: { type: string; srcset: string }[]
  src: string
}

/** Image livrée par le site lui-même : `/images/hero` et ses variantes `/images/hero-640.avif`, etc. */
export const staticImage = (
  base: string,
  widths: number[],
  { width, height, alt }: Pick<ResponsiveImage, 'width' | 'height' | 'alt'>,
): ResponsiveImage => {
  const srcset = (extension: string) =>
    widths.map((size) => `${base}-${size}.${extension} ${size}w`).join(', ')
  return {
    alt,
    width,
    height,
    sources: [
      { type: 'image/avif', srcset: srcset('avif') },
      { type: 'image/webp', srcset: srcset('webp') },
    ],
    src: `${base}-${widths.at(-1)}.webp`,
  }
}

/** Plus grande variante WebP, aux dimensions `width` × `height` de l'image (partage social, données structurées). */
export const largestWebp = (image: ResponsiveImage) =>
  image.sources
    .find((source) => source.type === 'image/webp')
    ?.srcset.split(', ')
    .at(-1)
    ?.split(' ')[0] ?? image.src

interface PicturePreloadProps {
  image: ResponsiveImage
  sizes: string
}

/** Précharge la première source (AVIF). À placer le plus haut possible dans la page pour l'image LCP. */
export const PicturePreload = ({ image, sizes }: PicturePreloadProps) => {
  const [first] = image.sources
  return (
    first && (
      <link
        rel="preload"
        as="image"
        type={first.type}
        imageSrcSet={first.srcset}
        imageSizes={sizes}
        fetchPriority="high"
      />
    )
  )
}

interface PictureProps {
  image: ResponsiveImage
  sizes: string
  isPriority?: boolean
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
  draggable?: boolean
  style?: CSSProperties
}

/** Variantes AVIF puis WebP générées à l'avance : aucun encodage à la volée par le serveur. */
export const Picture = ({
  image,
  sizes,
  isPriority = false,
  loading = isPriority ? 'eager' : 'lazy',
  fetchPriority = isPriority ? 'high' : 'auto',
  draggable,
  style,
}: PictureProps) => (
  <>
    {isPriority && <PicturePreload image={image} sizes={sizes} />}
    <picture>
      {image.sources.map((source) => (
        <source key={source.type} type={source.type} srcSet={source.srcset} sizes={sizes} />
      ))}
      <img
        src={image.src}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        draggable={draggable}
        style={style}
      />
    </picture>
  </>
)
