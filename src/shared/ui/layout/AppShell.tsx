import { Suspense } from 'react'

import { isAudienceMeasurementEnabled, MatomoTracker } from '@/shared/observability'

import styles from './AppShell.module.css'
import { Footer } from './Footer'
import { Header } from './Header'
import { SkipLink } from './SkipLink'

import type { SiteBrand } from './LogoLink'
import type { NavigationNode } from '@/shared/config'
import type { ReactNode } from 'react'

interface AppShellProps {
  brand: SiteBrand
  categoryMenu: NavigationNode[]
  /** Lien du panier, fourni par la couche de routage : le socle n'importe pas de module. */
  cartLink: ReactNode
  children: ReactNode
}

export const AppShell = ({ brand, categoryMenu, cartLink, children }: AppShellProps) => (
  <div className={styles.shell}>
    {isAudienceMeasurementEnabled && (
      // Avant la page : React exécute les effets dans l'ordre du rendu, ceux du traceur (dont
      // disableCookies) passent ainsi avant ceux d'une page qui envoie un événement au chargement.
      // useSearchParams impose une frontière Suspense sur les pages statiques.
      <Suspense fallback={null}>
        <MatomoTracker />
      </Suspense>
    )}
    <SkipLink />
    <Header brand={brand} categoryMenu={categoryMenu} cartLink={cartLink} />
    <main id="main" tabIndex={-1} className={styles.main}>
      {children}
    </main>
    <Footer siteName={brand.name} />
  </div>
)
