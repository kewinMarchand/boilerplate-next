import type { ResponsiveImage } from '@/shared/ui/kit'

export declare namespace Article {
  type Id = string

  interface Entity {
    id: Id
    title: string
    excerpt: string
    publishedAt: string
    image: ResponsiveImage | null
  }
}

const DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' })

export const formatPublishedAt = (isoDate: string) => DATE_FORMAT.format(new Date(isoDate))
