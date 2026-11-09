import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TaskList } from './TaskList'

const TASKS = [
  { id: '1', title: 'Écrire les tests', done: false },
  { id: '2', title: 'Livrer', done: true },
]

describe('TaskList', () => {
  it('affiche un squelette pendant le chargement', () => {
    render(<TaskList status="pending" tasks={undefined} onRetry={() => {}} />)
    expect(screen.getByTestId('tasks-loading')).toBeInTheDocument()
  })

  it("affiche le message d'erreur et relance au clic", async () => {
    const onRetry = vi.fn()
    render(<TaskList status="error" tasks={undefined} onRetry={onRetry} />)

    expect(screen.getByTestId('tasks-error')).toHaveTextContent(
      'Impossible de charger les tâches pour le moment.',
    )
    await userEvent.click(screen.getByTestId('tasks-retry'))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('affiche un message quand la liste est vide', () => {
    render(<TaskList status="success" tasks={[]} onRetry={() => {}} />)
    expect(screen.getByTestId('tasks-empty')).toBeInTheDocument()
  })

  it('affiche chaque tâche avec son statut', () => {
    render(<TaskList status="success" tasks={TASKS} onRetry={() => {}} />)
    expect(screen.getAllByTestId('tasks-item')).toHaveLength(2)
    expect(screen.getByText('Terminée')).toBeInTheDocument()
  })
})
