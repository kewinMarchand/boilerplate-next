import { getDictionary } from '@/shared/i18n/server'

import { NotFoundView } from '@/views/errors'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => ({
  title: (await getDictionary()).errors.notFoundTitle,
  robots: { index: false, follow: true },
})

export default function NotFound() {
  return <NotFoundView />
}
