import { dictionaryFor } from '@/shared/i18n/dictionaries'
import { PageDictionary } from '@/shared/i18n/PageDictionary'
import { getLocale } from '@/shared/i18n/server'
import { buildMetadata } from '@/shared/seo'

import { getSeoSettings } from '@/modules/site'
import { TasksView } from '@/modules/task'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale()
  return buildMetadata({
    ...dictionaryFor(locale).meta.tasks,
    path: '/taches',
    settings: await getSeoSettings(locale),
  })
}

export default function TasksPage() {
  return (
    <PageDictionary sections={['tasks', 'ui']}>
      <TasksView />
    </PageDictionary>
  )
}
