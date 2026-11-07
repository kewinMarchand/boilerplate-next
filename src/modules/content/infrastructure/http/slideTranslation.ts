import type { Slide } from '@/modules/content/domain/slide'
import type { components } from '@/shared/api/client'

type SlideDto = components['schemas']['Slide']

export const toSlide = (dto: SlideDto): Slide.Entity => ({
  id: dto.slug,
  title: dto.title,
  text: dto.text,
  image: dto.image,
})
