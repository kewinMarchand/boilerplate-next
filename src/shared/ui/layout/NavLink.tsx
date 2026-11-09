'use client'

import { useLocalizePath, usePagePathname } from '@/shared/i18n'
import { Link } from '@/shared/ui/kit'

import styles from './NavLink.module.css'

import type { NavigationItem } from '@/shared/config'

export const NavLink = ({ href, label }: NavigationItem) => {
  const pathname = usePagePathname()
  const path = useLocalizePath()(href)
  const isActive = href === '/' ? pathname === path : pathname.startsWith(path)

  return (
    <Link href={href} className={styles.link} aria-current={isActive ? 'page' : undefined}>
      {label}
    </Link>
  )
}
