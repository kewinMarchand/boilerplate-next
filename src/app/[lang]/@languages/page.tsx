import { samePathInEveryLocale } from '@/shared/i18n'
import { getLocale } from '@/shared/i18n/server'
import { LanguageSwitcher } from '@/shared/ui/layout'

import { getLocaleContext } from '@/modules/site'

export default async function HomeLanguages() {
  const locale = await getLocaleContext(await getLocale())
  return <LanguageSwitcher locale={locale} alternates={samePathInEveryLocale(locale, '/')} />
}
