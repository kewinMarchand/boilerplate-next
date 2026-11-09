import { SITE } from '@/shared/config'

import { absoluteUrl } from './buildMetadata'

export interface BreadcrumbItem {
  label: string
  href: string
}

export const breadcrumbJsonLd = (items: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: absoluteUrl(item.href),
  })),
})

/** `logo` : adresse absolue de l'icône saisie dans l'admin, sinon l'icône 512 du site. */
export const organizationJsonLd = (name: string, logo?: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name,
  url: absoluteUrl('/'),
  logo: logo ?? absoluteUrl('/icons/icon-512.png'),
  email: SITE.publisher.email,
})

/** `path` : accueil dans la langue de la page ; `inLanguage` : étiquette BCP 47 (`fr-FR`). */
export const websiteJsonLd = (name: string, path: string, inLanguage: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name,
  url: absoluteUrl(path),
  inLanguage,
})

export const itemListJsonLd = (pagePath: string, names: string[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: names.map((name, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name,
    url: absoluteUrl(`${pagePath}#produit-${index + 1}`),
  })),
})

export const blogJsonLd = (
  blog: { name: string; path: string; inLanguage: string },
  posts: { title: string; path: string; publishedAt: string }[],
) => ({
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: blog.name,
  url: absoluteUrl(blog.path),
  inLanguage: blog.inLanguage,
  blogPost: posts.map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    url: absoluteUrl(post.path),
    datePublished: post.publishedAt,
  })),
})

export const blogPostingJsonLd = (article: {
  title: string
  description: string
  path: string
  publishedAt: string
  image?: string | undefined
  inLanguage: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: article.title,
  description: article.description,
  datePublished: article.publishedAt,
  url: absoluteUrl(article.path),
  ...(article.image && { image: article.image }),
  inLanguage: article.inLanguage,
  publisher: { '@type': 'Organization', name: SITE.publisher.legalName },
})

export const productJsonLd = (product: {
  name: string
  description: string
  path: string
  sku: string
  category: string | undefined
  image?: string | undefined
  /** Prix en euros, deux décimales (« 34.90 ») ; absent quand la vente est coupée : pas d'`offers`. */
  price?: string | undefined
  inStock: boolean
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  ...(product.description && { description: product.description }),
  sku: product.sku,
  url: absoluteUrl(product.path),
  ...(product.category && { category: product.category }),
  ...(product.image && { image: product.image }),
  ...(product.price !== undefined && {
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(product.path),
      priceCurrency: 'EUR',
      price: product.price,
      availability: `https://schema.org/${product.inStock ? 'InStock' : 'OutOfStock'}`,
    },
  }),
})
