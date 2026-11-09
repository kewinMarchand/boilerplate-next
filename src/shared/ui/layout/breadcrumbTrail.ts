import { labelNavigation, SITE_MAP } from '@/shared/config'

import type { Dictionary } from '@/shared/i18n'
import type { BreadcrumbItem } from '@/shared/seo'

/** Accueil, page de la navigation pour `path`, puis les niveaux fournis ; libellés de la langue de la page. */
export const buildBreadcrumb = (
  labels: Dictionary['nav'],
  path: string,
  trailing: BreadcrumbItem[] = [],
): BreadcrumbItem[] => {
  const page =
    path === '/' ? undefined : labelNavigation(SITE_MAP, labels).find((item) => item.href === path)
  return [{ label: labels.home, href: '/' }, ...(page ? [page] : []), ...trailing]
}
