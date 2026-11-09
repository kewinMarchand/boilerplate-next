'use client'

import NextLink from 'next/link'

import { useLocalizePath } from '@/shared/i18n'

import type { ComponentProps } from 'react'

type LinkProps = ComponentProps<typeof NextLink>

/** Lien interne : un chemin (`/catalogue`) prend le préfixe de la langue de la page (`/en/catalogue`). */
export const Link = ({ href, ...props }: LinkProps) => {
  const localizePath = useLocalizePath()
  return <NextLink href={typeof href === 'string' ? localizePath(href) : href} {...props} />
}
