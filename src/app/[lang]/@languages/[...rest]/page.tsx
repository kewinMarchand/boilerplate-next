import { samePathInEveryLocale } from '@/shared/i18n'
import { getLocale } from '@/shared/i18n/server'
import { LanguageSwitcher } from '@/shared/ui/layout'

import { getLocaleContext } from '@/modules/site'

interface PageLanguagesProps {
  params: Promise<{ rest: string[] }>
}

/** Pages fixes : leurs segments ne se traduisent pas, le même chemin existe dans chaque langue. */
export default async function PageLanguages({ params }: PageLanguagesProps) {
  const [{ rest }, locale] = await Promise.all([params, getLocale().then(getLocaleContext)])
  return (
    <LanguageSwitcher
      locale={locale}
      alternates={samePathInEveryLocale(locale, `/${rest.join('/')}`)}
    />
  )
}
