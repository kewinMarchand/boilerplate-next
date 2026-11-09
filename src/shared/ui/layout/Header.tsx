import { Cluster, Container } from '@kewinmarchand/boilerplates-ui/react'

import { CATALOG_NAVIGATION, labelNavigation, MAIN_NAVIGATION } from '@/shared/config'
import { getDictionary } from '@/shared/i18n/server'

import { A11yModeToggle } from '../a11y-mode/A11yModeToggle'
import { ColorSchemeToggle } from '../color-scheme/ColorSchemeToggle'
import { CategoryMenu } from './CategoryMenu'
import styles from './Header.module.css'
import { LogoLink } from './LogoLink'
import { MobileMenu } from './MobileMenu'
import { NavLink } from './NavLink'

import type { SiteBrand } from './LogoLink'
import type { NavigationNode } from '@/shared/config'
import type { ReactNode } from 'react'

interface HeaderProps {
  brand: SiteBrand
  categoryMenu: NavigationNode[]
  cartLink: ReactNode
  languages: ReactNode
}

export const Header = async ({ brand, categoryMenu, cartLink, languages }: HeaderProps) => {
  const t = await getDictionary()
  const navigation = labelNavigation(MAIN_NAVIGATION, t.nav)

  return (
    <header className={styles.header}>
      <Container>
        {languages}
        <div className={styles.toolbar}>
          <LogoLink brand={brand} />
          <div className={styles.mobile}>
            <MobileMenu navigation={navigation} categoryMenu={categoryMenu} />
          </div>
          <nav aria-label={t.layout.mainNavigation} className={styles.desktop}>
            <Cluster as="ul" gap="2">
              {navigation.map((item) => (
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
}
