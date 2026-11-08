import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ColorSchemeToggle } from './ColorSchemeToggle'

describe('ColorSchemeToggle', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-color-scheme')
    document.documentElement.removeAttribute('data-a11y-mode')
    localStorage.clear()
  })

  it('suit le système par défaut', () => {
    render(<ColorSchemeToggle />)

    expect(screen.getByTestId('color-scheme-toggle')).toHaveAccessibleName('Thème : système')
    expect(screen.getByTestId('color-scheme-option-auto')).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByTestId('color-scheme-option-dark')).toHaveAttribute('aria-checked', 'false')
  })

  it('garde le thème par défaut servi par le site quand rien n’est mémorisé', () => {
    document.documentElement.setAttribute('data-color-scheme', 'dark')
    render(<ColorSchemeToggle />)

    expect(screen.getByTestId('color-scheme-toggle')).toHaveAccessibleName('Thème : sombre')
    expect(document.documentElement).toHaveAttribute('data-color-scheme', 'dark')
  })

  it('pose et mémorise le choix, « système » compris', async () => {
    render(<ColorSchemeToggle />)
    const toggle = screen.getByTestId('color-scheme-toggle')

    await userEvent.click(toggle)
    await userEvent.click(screen.getByTestId('color-scheme-option-dark'))
    await waitFor(() => expect(toggle).toHaveAccessibleName('Thème : sombre'))
    expect(document.documentElement).toHaveAttribute('data-color-scheme', 'dark')
    expect(localStorage.getItem('color-scheme')).toBe('dark')
    expect(screen.getByTestId('color-scheme-option-dark')).toHaveAttribute('aria-checked', 'true')

    await userEvent.click(toggle)
    await userEvent.click(screen.getByTestId('color-scheme-option-auto'))
    await waitFor(() => expect(toggle).toHaveAccessibleName('Thème : système'))
    expect(document.documentElement).toHaveAttribute('data-color-scheme', 'auto')
    expect(localStorage.getItem('color-scheme')).toBe('auto')
  })

  it('annonce un choix sombre suspendu par le mode renforcé', () => {
    document.documentElement.setAttribute('data-color-scheme', 'dark')
    document.documentElement.setAttribute('data-a11y-mode', 'enhanced')
    localStorage.setItem('color-scheme', 'dark')
    render(<ColorSchemeToggle />)

    expect(screen.getByTestId('color-scheme-toggle')).toHaveAccessibleName(
      "Thème : sombre, suspendu par l'accessibilité renforcée",
    )
  })
})
