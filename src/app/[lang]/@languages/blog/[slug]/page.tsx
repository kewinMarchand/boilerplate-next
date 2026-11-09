import { getLocale } from '@/shared/i18n/server'
import { LanguageSwitcher } from '@/shared/ui/layout'

import { loadArticleAlternates } from '@/modules/blog'
import { getLocaleContext } from '@/modules/site'

interface ArticleLanguagesProps {
  params: Promise<{ slug: string }>
}

export default async function ArticleLanguages({ params }: ArticleLanguagesProps) {
  const [{ slug }, locale] = await Promise.all([params, getLocale().then(getLocaleContext)])
  return (
    <LanguageSwitcher
      locale={locale}
      alternates={await loadArticleAlternates(slug, locale.locale)}
    />
  )
}
