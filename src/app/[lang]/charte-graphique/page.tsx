import { notFound } from 'next/navigation'

import { PageDictionary } from '@/shared/i18n/PageDictionary'

import { StyleguideView } from '@/views/styleguide'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Charte graphique',
  robots: { index: false, follow: false },
}

export default function StyleguidePage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <PageDictionary sections={['catalog']}>
      <StyleguideView />
    </PageDictionary>
  )
}
