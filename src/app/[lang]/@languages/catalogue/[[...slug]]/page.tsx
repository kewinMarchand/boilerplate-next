import { samePathInEveryLocale } from '@/shared/i18n'
import { getLocale } from '@/shared/i18n/server'
import { LanguageSwitcher } from '@/shared/ui/layout'

import { findCategoryAlternates } from '@/modules/catalog'
import { getLocaleContext } from '@/modules/site'

interface CatalogLanguagesProps {
  params: Promise<{ slug?: string[] }>
}

export default async function CatalogLanguages({ params }: CatalogLanguagesProps) {
  const [{ slug = [] }, locale] = await Promise.all([params, getLocale().then(getLocaleContext)])
  return (
    <LanguageSwitcher
      locale={locale}
      alternates={
        slug.length > 0
          ? await findCategoryAlternates(slug, locale.locale)
          : samePathInEveryLocale(locale, '/catalogue')
      }
    />
  )
}
