import { Container } from '@kewinmarchand/boilerplates-ui/react'

import { ACCESSIBILITY_COMPLIANCE, labelNavigation, LEGAL_NAVIGATION } from '@/shared/config'
import { format } from '@/shared/i18n'
import { getDictionary } from '@/shared/i18n/server'
import { Link, LogoMark } from '@/shared/ui/kit'

import styles from './Footer.module.css'

// Le RGAA impose l'état de conformité dans le lien du pied de page, pas ailleurs.
const ACCESSIBILITY_PATH = '/accessibilite'

interface FooterProps {
  siteName: string
}

export const Footer = async ({ siteName }: FooterProps) => {
  const t = await getDictionary()

  return (
    <footer className={styles.footer}>
      <Container>
        <nav aria-label={t.layout.legalLinks} className={styles.links}>
          {labelNavigation(LEGAL_NAVIGATION, t.nav).map(({ href, label }) => (
            <Link key={href} href={href} className={`bui-link ${styles.link}`}>
              {href === ACCESSIBILITY_PATH
                ? format(t.layout.accessibilityStatus, {
                    status: t.compliance[ACCESSIBILITY_COMPLIANCE],
                  })
                : label}
            </Link>
          ))}
        </nav>
        {process.env.NODE_ENV !== 'production' && (
          <Link href="/charte-graphique" className={`bui-link ${styles.link}`}>
            {t.layout.styleguide}
          </Link>
        )}
        <p className={`bui-text bui-text--body-sm ${styles.brand}`}>
          <LogoMark size={20} />
          {siteName}
        </p>
      </Container>
    </footer>
  )
}
