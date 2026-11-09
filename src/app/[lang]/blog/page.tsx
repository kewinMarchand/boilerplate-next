import { dictionaryFor } from '@/shared/i18n/dictionaries'
import { getLocale } from '@/shared/i18n/server'
import { buildMetadata } from '@/shared/seo'

import { BlogView } from '@/modules/blog'
import { getLocaleContext, getSeoSettings } from '@/modules/site'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale()
  return buildMetadata({
    ...dictionaryFor(locale).meta.blog,
    path: '/blog',
    settings: await getSeoSettings(locale, 'blog'),
  })
}

interface BlogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const [query, locale] = await Promise.all([searchParams, getLocale().then(getLocaleContext)])
  return <BlogView searchParams={query} locale={locale} />
}
