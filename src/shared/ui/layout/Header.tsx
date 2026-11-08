import { Cluster, Container } from '@kewinmarchand/boilerplates-ui/react'

import { CATALOG_NAVIGATION, MAIN_NAVIGATION } from '@/shared/config'

import { A11yModeToggle } from '../a11y-mode/A11yModeToggle'
import { ColorSchemeToggle } from '../color-scheme/ColorSchemeToggle'
import { CategoryMenu } from './CategoryMenu'
import styles from './Header.module.css'
import { LogoLink } from './LogoLink'
import { MobileMenu } from './MobileMenu'
import { NavLink } from './NavLink'

import type { NavigationNode } from '@/shared/config'
import type { ReactNode } from 'react'

interface HeaderProps {
  categoryMenu: NavigationNode[]
  cartLink: ReactNode
}

export const Header = ({ categoryMenu, cartLink }: HeaderProps) => (
  <header className={styles.header}>
    <Container>
      <div className={styles.toolbar}>
        <LogoLink />
        <div className={styles.mobile}>
          <MobileMenu navigation={MAIN_NAVIGATION} categoryMenu={categoryMenu} />
        </div>
        <nav aria-label="Navigation principale" className={styles.desktop}>
          <Cluster as="ul" gap="2">
            {MAIN_NAVIGATION.map((item) => (
              <li key={item.href}>
                {item.href === CATALOG_NAVIGATION.href ? (
                  <CategoryMenu label={item.label} nodes={categoryMenu} />
                ) : (
                  <NavLink {...item} />
                )}
              </li>
            ))}
          </Cluster>
        </nav>
        {cartLink}
        <ColorSchemeToggle />
        <A11yModeToggle />
      </div>
    </Container>
  </header>
)
