import { ApiError } from '@/shared/api/client'
import { staticApiClient } from '@/shared/api/client.server'

import { toSlide } from './http/slideTranslation'

import type { Slide } from '../domain/slide'

export const findSlides = async (): Promise<Slide.Entity[]> => {
  const { data, response } = await staticApiClient().GET('/api/slides')
  if (!data) throw new ApiError(response)
  return data.map(toSlide)
}
