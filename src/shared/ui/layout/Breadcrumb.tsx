'use client'

import { useDictionary, useLocalizePath } from '@/shared/i18n'
// Chemins directs : l'index du SEO exporte aussi buildMetadata, qui lit les dictionnaires.
import { JsonLd } from '@/shared/seo/JsonLd'
import { breadcrumbJsonLd } from '@/shared/seo/structuredData'
import { Link } from '@/shared/ui/kit'

import styles from './Breadcrumb.module.css'

import type { BreadcrumbItem } from '@/shared/seo/structuredData'

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  withJsonLd?: boolean
}

// Composant client : le JSON-LD prend les adresses dans la langue de la page, comme les liens.
export const Breadcrumb = ({ items, withJsonLd = true }: BreadcrumbProps) => {
  const t = useDictionary()
  const localizePath = useLocalizePath()

  return (
    <nav
      aria-label={t.layout.breadcrumb}
      data-testid="layout-breadcrumb"
      className={styles.breadcrumb}
    >
      <ol className={`bui-text bui-text--body-sm ${styles.list}`}>
        {items.map((item, index) =>
          index === items.length - 1 ? (
            <li key={item.href} aria-current="page">
              {item.label}
            </li>
          ) : (
            <li key={item.href}>
              <Link href={item.href} className={`bui-link ${styles.link}`}>
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ol>
      {withJsonLd && (
        <JsonLd
          data={breadcrumbJsonLd(items.map((item) => ({ ...item, href: localizePath(item.href) })))}
        />
      )}
    </nav>
  )
}
