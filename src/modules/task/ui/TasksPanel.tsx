'use client'

import { useTasks } from './hooks/useTasks'
import { TaskList } from './TaskList'

export const TasksPanel = () => {
  const { status, data, refetch } = useTasks()

  return (
    <div aria-live="polite">
      <TaskList status={status} tasks={data} onRetry={() => void refetch()} />
    </div>
  )
}
