import type { ResponsiveImage } from '@/shared/ui/kit'

export declare namespace Slide {
  interface Entity {
    id: string
    title: string
    text: string
    image: ResponsiveImage | null
  }
}
