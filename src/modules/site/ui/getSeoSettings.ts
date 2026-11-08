import { cache } from 'react'

import { largestWebp } from '@/shared/ui/kit'

import { findPageMetas } from '../infrastructure/pageMetaRepository'
import { getSiteIdentity } from './getSiteIdentity'

import type { PageMeta } from '../domain/pageMeta'
import type { SeoSettings } from '@/shared/seo'

const getPageMetas = cache(() =>
  findPageMetas().catch((error: unknown): Partial<Record<PageMeta.Page, PageMeta.Entity>> => {
    console.error(error)
    return {}
  }),
)

/**
 * Référencement saisi dans l'admin : titre et description de la page fixe `page`, image de partage du
 * site. Lus côté serveur et régénérés comme l'identité ; API en erreur, rien de saisi.
 */
export const getSeoSettings = async (page?: PageMeta.Page): Promise<SeoSettings> => {
  const [{ name, shareImage }, meta] = await Promise.all([
    getSiteIdentity(),
    page ? getPageMetas().then((metas) => metas[page]) : undefined,
  ])
  return {
    title: meta?.title ?? '',
    description: meta?.description ?? '',
    shareImage: shareImage && {
      url: largestWebp(shareImage),
      width: shareImage.width,
      height: shareImage.height,
      alt: shareImage.alt || name,
    },
  }
}
