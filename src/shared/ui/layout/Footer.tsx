import { Container } from '@kewinmarchand/boilerplates-ui/react'

import { ACCESSIBILITY_COMPLIANCE, LEGAL_NAVIGATION } from '@/shared/config'
import { Link, LogoMark } from '@/shared/ui/kit'

import styles from './Footer.module.css'

// Le RGAA impose l'état de conformité dans le lien du pied de page, pas ailleurs.
const ACCESSIBILITY_PATH = '/accessibilite'

interface FooterProps {
  siteName: string
}

export const Footer = ({ siteName }: FooterProps) => (
  <footer className={styles.footer}>
    <Container>
      <nav aria-label="Liens légaux" className={styles.links}>
        {LEGAL_NAVIGATION.map(({ href, label }) => (
          <Link key={href} href={href} className={`bui-link ${styles.link}`}>
            {href === ACCESSIBILITY_PATH ? `Accessibilité : ${ACCESSIBILITY_COMPLIANCE}` : label}
          </Link>
        ))}
      </nav>
      {process.env.NODE_ENV !== 'production' && (
        <Link href="/charte-graphique" className={`bui-link ${styles.link}`}>
          Charte graphique (développement)
        </Link>
      )}
      <p className={`bui-text bui-text--body-sm ${styles.brand}`}>
        <LogoMark size={20} />
        {siteName}
      </p>
    </Container>
  </footer>
)
