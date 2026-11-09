'use client'

import { Menu } from '@kewinmarchand/boilerplates-ui/react'

import { useDictionary } from '@/shared/i18n'
import { useA11yMode } from '@/shared/ui/a11y-mode/useA11yMode'
import { useColorScheme } from '@/shared/ui/color-scheme/useColorScheme'

import { COLOR_SCHEME } from './colorScheme'

import type { ColorScheme } from './colorScheme'

const ICONS = { auto: 'monitor', light: 'sun', dark: 'moon' } as const

const isColorScheme = (value: string): value is ColorScheme =>
  COLOR_SCHEME.choices.some((choice) => choice === value)

export const ColorSchemeToggle = () => {
  const t = useDictionary().colorScheme
  const { colorScheme, choose } = useColorScheme()
  const { isEnhanced } = useA11yMode()
  // Le mode renforcé impose le clair : un autre choix reste mémorisé mais suspendu.
  const suspended = isEnhanced && colorScheme !== 'light'
  const items = COLOR_SCHEME.choices.map((choice) => ({
    id: choice,
    label: t.choices[choice].charAt(0).toUpperCase() + t.choices[choice].slice(1),
    testId: `color-scheme-option-${choice}`,
  }))

  return (
    <Menu
      id="color-scheme"
      label={`${t.label(t.choices[colorScheme])}${suspended ? t.suspended : ''}`}
      items={items}
      checked={colorScheme}
      triggerIcon={ICONS[colorScheme]}
      triggerVariant="nav"
      testId="color-scheme-toggle"
      onSelect={(id) => {
        if (isColorScheme(id)) choose(id)
      }}
    />
  )
}
