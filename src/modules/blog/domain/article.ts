import type { LanguageAlternate } from '@/shared/i18n'
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
    /** La fiche dans chaque langue activée, vide sur un site monolingue. */
    alternates: LanguageAlternate[]
  }
}

export const articleHref = (slug: string) => `/blog/${slug}`

/** Date lisible selon la langue de la page (`tag` BCP 47 : « 29 septembre 2026 » en `fr-FR`). */
export const formatPublishedAt = (isoDate: string, tag: string) =>
  new Intl.DateTimeFormat(tag, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(isoDate))

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
