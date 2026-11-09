'use client'

import { useDictionary } from '@/shared/i18n'
import { useA11yMode } from '@/shared/ui/a11y-mode/useA11yMode'
import { Icon } from '@/shared/ui/kit'

import styles from './A11yModeToggle.module.css'

export const A11yModeToggle = () => {
  // Sur mobile, seule l'icône reste visible : le nom accessible vient de aria-label.
  const { label } = useDictionary().a11yMode
  const { isEnhanced, toggle } = useA11yMode()

  return (
    <button
      type="button"
      className={`bui-button bui-button--nav ${styles.toggle}`}
      aria-pressed={isEnhanced}
      aria-label={label}
      onClick={toggle}
      data-testid="a11y-mode-toggle"
    >
      <Icon name="person-standing" />
      <span className={styles.label}>{label}</span>
    </button>
  )
}
