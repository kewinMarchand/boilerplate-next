import type { LegalPage } from '@/modules/content/domain/legalPage'
import type { components } from '@/shared/api/client'

type LegalPageDto = components['schemas']['LegalPage']

export const toLegalPage = (dto: LegalPageDto): LegalPage.Entity => ({
  title: dto.title,
  introduction: dto.introduction,
  sections: dto.sections.map(({ title, html }) => ({ title, html })),
})
