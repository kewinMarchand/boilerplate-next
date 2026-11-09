import { getDictionary } from '@/shared/i18n/server'
import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { TasksPanel } from './TasksPanel'
import styles from './TasksView.module.css'

export const TasksView = async () => {
  const t = await getDictionary()
  return (
    <PageContainer breadcrumb={buildBreadcrumb(t.nav, '/taches')}>
      <h1 className={`bui-text bui-text--h1 ${styles.title}`}>{t.tasks.title}</h1>
      <p className={`bui-text ${styles.intro}`}>{t.tasks.intro}</p>
      <TasksPanel />
    </PageContainer>
  )
}
