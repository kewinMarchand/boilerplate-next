import { useRouter } from 'next/navigation'
import { useOptimistic } from 'react'

import { useLocalizePath } from '@/shared/i18n'

import { catalogHref } from '@/modules/catalog/domain/catalogQuery'
import { useCatalogTransition } from '@/modules/catalog/ui/CatalogTransition'

import type { Catalog } from '@/modules/catalog/domain/catalog'

export const useCatalogNavigation = (path: string, query: Catalog.Query) => {
  const router = useRouter()
  const localizePath = useLocalizePath()
  const { startTransition } = useCatalogTransition()
  const [optimisticQuery, setOptimisticQuery] = useOptimistic(query)

  const apply = (next: Catalog.Query) =>
    startTransition(() => {
      setOptimisticQuery(next)
      router.push(localizePath(catalogHref(path, next)), { scroll: false })
    })

  return { query: optimisticQuery, apply }
}
