import { useQuery } from '@tanstack/react-query'

import { useLocale } from '@/shared/i18n'

import { findAllTasks } from '@/modules/task/infrastructure/taskRepository'
import { TasksLoadError } from '@/modules/task/infrastructure/TasksLoadError'

export const TASKS_QUERY_KEY = ['tasks'] as const

const fetchTasks = async (locale: string) => {
  try {
    return await findAllTasks(locale)
  } catch {
    throw new TasksLoadError()
  }
}

export const useTasks = () => {
  const { locale } = useLocale()
  return useQuery({ queryKey: [...TASKS_QUERY_KEY, locale], queryFn: () => fetchTasks(locale) })
}
