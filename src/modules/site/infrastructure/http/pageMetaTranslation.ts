import type { PageMeta } from '@/modules/site/domain/pageMeta'
import type { components } from '@/shared/api/client'

type PageMetaDto = components['schemas']['PageMeta']

export const toPageMetas = (dtos: PageMetaDto[]): Partial<Record<PageMeta.Page, PageMeta.Entity>> =>
  Object.fromEntries(dtos.map(({ page, title, description }) => [page, { title, description }]))
