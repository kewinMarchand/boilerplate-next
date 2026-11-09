import { alternatesByKey } from '@/shared/i18n'

import { listProductEntries } from '../application/products'

/** Chemins des fiches pour le sitemap, chacune dans chaque langue du site. */
export const listProductPathAlternates = async (locales: string[]) =>
  alternatesByKey(await Promise.all(locales.map(listProductEntries)))
