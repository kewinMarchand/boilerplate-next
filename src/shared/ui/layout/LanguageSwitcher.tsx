import { languageLinks, languageName } from '@/shared/i18n'
import { getDictionary } from '@/shared/i18n/server'

import styles from './LanguageSwitcher.module.css'

import type { LanguageAlternate, LocaleContext } from '@/shared/i18n'

interface LanguageSwitcherProps {
  locale: LocaleContext
  /** La page dans chaque langue ; une langue absente mène à son accueil. */
  alternates: LanguageAlternate[]
}

/**
 * Sélecteur de langue de l'en-tête, absent sur un site monolingue. Des liens simples : changer de
 * langue recharge la page (`<html lang>`, libellés), et marche sans JavaScript.
 */
export const LanguageSwitcher = async ({ locale, alternates }: LanguageSwitcherProps) => {
  if (locale.locales.length < 2) return null
  const t = await getDictionary()

  return (
    <nav
      aria-label={t.layout.languages}
      className={styles.languages}
      data-testid="layout-languages"
    >
      <ul className={styles.list}>
        {languageLinks(locale, alternates).map((link) => (
          <li key={link.locale}>
            <a
              href={link.href}
              lang={link.locale}
              hrefLang={link.locale}
              aria-current={link.locale === locale.locale ? 'true' : undefined}
              className={styles.link}
              data-testid={`layout-language-${link.locale}`}
            >
              {languageName(link.locale)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
