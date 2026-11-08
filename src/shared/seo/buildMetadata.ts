import { SITE } from '@/shared/config'

import type { Metadata } from 'next'

export interface OgImage {
  url: string
  width: number
  height: number
  alt: string
}

/** Référencement saisi dans l'admin, chaînes vides et `null` quand rien n'est saisi. */
export interface SeoSettings {
  /** Titre complet, sans le nom du site ajouté. */
  title: string
  description: string
  /** Sert quand la page n'a pas d'image propre. */
  shareImage: OgImage | null
}

const DEFAULT_OG_IMAGE: OgImage = {
  url: '/images/og-image.jpg',
  width: 1200,
  height: 630,
  alt: SITE.name,
}

interface PageSeo {
  title: string
  description: string
  path: string
  noindex?: boolean
  image?: OgImage
  settings?: SeoSettings
  isAbsoluteTitle?: boolean
  /** Page d'article : `og:type` article et date de publication (AAAA-MM-JJ). */
  publishedTime?: string
}

export const absoluteUrl = (path: string) => new URL(path, SITE.url).toString()

export const buildMetadata = ({
  title: pageTitle,
  description: pageDescription,
  path,
  noindex = false,
  image: pageImage,
  isAbsoluteTitle = false,
  publishedTime,
  settings,
}: PageSeo): Metadata => {
  const title = settings?.title || pageTitle
  const description = settings?.description || pageDescription
  const image = pageImage ?? settings?.shareImage ?? DEFAULT_OG_IMAGE
  return {
    title: isAbsoluteTitle || settings?.title ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      ...(publishedTime ? { type: 'article', publishedTime } : { type: 'website' }),
      title,
      description,
      url: path,
      locale: SITE.locale,
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  }
}
