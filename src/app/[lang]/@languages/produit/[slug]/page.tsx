import { getLocale } from '@/shared/i18n/server'
import { LanguageSwitcher } from '@/shared/ui/layout'

import { loadProductAlternates } from '@/modules/catalog'
import { getLocaleContext } from '@/modules/site'

interface ProductLanguagesProps {
  params: Promise<{ slug: string }>
}

export default async function ProductLanguages({ params }: ProductLanguagesProps) {
  const [{ slug }, locale] = await Promise.all([params, getLocale().then(getLocaleContext)])
  return (
    <LanguageSwitcher
      locale={locale}
      alternates={await loadProductAlternates(slug, locale.locale)}
    />
  )
}
