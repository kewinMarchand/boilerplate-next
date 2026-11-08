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

export const organizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.publisher.legalName,
  url: absoluteUrl('/'),
  logo: absoluteUrl('/icons/icon-512.png'),
  email: SITE.publisher.email,
})

export const websiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: absoluteUrl('/'),
  inLanguage: 'fr-FR',
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

export const blogPostingJsonLd = (article: {
  title: string
  description: string
  path: string
  publishedAt: string
  image?: string | undefined
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: article.title,
  description: article.description,
  datePublished: article.publishedAt,
  url: absoluteUrl(article.path),
  ...(article.image && { image: article.image }),
  inLanguage: 'fr-FR',
  publisher: { '@type': 'Organization', name: SITE.publisher.legalName },
})

export const productJsonLd = (product: {
  name: string
  description: string
  path: string
  sku: string
  category: string | undefined
  image?: string | undefined
  /** Prix en euros, deux décimales (« 34.90 »). */
  price: string
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
  offers: {
    '@type': 'Offer',
    url: absoluteUrl(product.path),
    priceCurrency: 'EUR',
    price: product.price,
    availability: `https://schema.org/${product.inStock ? 'InStock' : 'OutOfStock'}`,
  },
})
