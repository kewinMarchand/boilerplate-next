import { buildMetadata } from '@/shared/seo'

import { getSeoSettings } from '@/modules/site'
import { TasksView } from '@/modules/task'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> =>
  buildMetadata({
    title: 'Tâches',
    description:
      'Démo TanStack Query : liste de tâches chargée côté client avec gestion du chargement, des erreurs et de la liste vide.',
    path: '/taches',
    settings: await getSeoSettings(),
  })

export default function TasksPage() {
  return <TasksView />
}
