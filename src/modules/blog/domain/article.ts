import type { ResponsiveImage } from '@/shared/ui/kit'

export declare namespace Article {
  type Id = string

  /** Rubrique ou format, listes administrées dans l'API. */
  interface Term {
    slug: string
    name: string
  }

  interface Audio {
    src: string
    type: string
    durationSeconds: number
  }

  interface Entity {
    id: Id
    slug: string
    title: string
    excerpt: string
    publishedAt: string
    image: ResponsiveImage | null
    section: Term | null
  }

  /** Fiche : l'article et son texte en HTML, converti par l'API depuis le Markdown saisi dans l'admin. */
  interface Detail extends Entity {
    html: string
    format: Term | null
    audio: Audio | null
    /** Intervenant de l'audio (« Présenté par … »), vide si aucun. */
    speaker: string
    /** Titre et description saisis pour les moteurs de recherche, chaînes vides sinon. */
    metaTitle: string
    metaDescription: string
  }
}

export const articleHref = (slug: string) => `/blog/${slug}`

const DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' })

export const formatPublishedAt = (isoDate: string) => DATE_FORMAT.format(new Date(isoDate))

const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60

/** Durée lisible d'un audio : « 4 s », « 26 min », « 1 h 05 min ». */
export const formatDuration = (seconds: number) => {
  if (seconds < SECONDS_PER_MINUTE) return `${seconds} s`
  const minutes = Math.round(seconds / SECONDS_PER_MINUTE)
  if (minutes < MINUTES_PER_HOUR) return `${minutes} min`
  const rest = String(minutes % MINUTES_PER_HOUR).padStart(2, '0')
  return `${Math.floor(minutes / MINUTES_PER_HOUR)} h ${rest} min`
}

/** Paramètre d'URL du filtre par rubrique de `/blog` : une seule valeur retenue. */
export const sectionParam = (value: string | string[] | undefined) =>
  typeof value === 'string' && value !== '' ? value : undefined
