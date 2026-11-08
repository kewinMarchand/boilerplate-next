'use client'

import { usePathname } from 'next/navigation'

import { Link, LogoMark, Picture } from '@/shared/ui/kit'

import styles from './LogoLink.module.css'

import type { ResponsiveImage } from '@/shared/ui/kit'

export interface SiteBrand {
  name: string
  logo: ResponsiveImage | null
}

const LOGO_HEIGHT = 40

interface LogoLinkProps {
  brand: SiteBrand
}

export const LogoLink = ({ brand: { name, logo } }: LogoLinkProps) => {
  const pathname = usePathname()

  return (
    <Link
      href="/"
      aria-current={pathname === '/' ? 'page' : undefined}
      data-testid="layout-logo"
      className={styles.logo}
    >
      {logo ? (
        <Picture
          image={{ ...logo, alt: name }}
          sizes={`${Math.round((LOGO_HEIGHT * logo.width) / logo.height)}px`}
          loading="eager"
          fetchPriority="high"
          style={{ height: LOGO_HEIGHT, width: 'auto' }}
        />
      ) : (
        <>
          <LogoMark size={36} />
          {name}
        </>
      )}
    </Link>
  )
}
