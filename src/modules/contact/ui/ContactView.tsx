import { getDictionary, getLocale } from '@/shared/i18n/server'
import { Link } from '@/shared/ui/kit'
import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { findInquiryProduct } from '../infrastructure/inquiryProductRepository'
import { ContactForm } from './ContactForm'
import styles from './ContactView.module.css'

type SearchParams = Record<string, string | string[] | undefined>

/** Produit de `?produit=<slug>` ; slug absent, inconnu ou API en erreur : message de contact simple. */
const loadInquiryProduct = (searchParams: SearchParams, locale: string) => {
  const { produit } = searchParams
  if (typeof produit !== 'string' || produit === '') return null
  return findInquiryProduct(produit, locale).catch((error: unknown) => {
    console.error(error)
    return null
  })
}

export const ContactView = async ({ searchParams }: { searchParams: SearchParams }) => {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()])
  const product = await loadInquiryProduct(searchParams, locale)

  return (
    <PageContainer breadcrumb={buildBreadcrumb(t.nav, '/contact')}>
      <h1 className={`bui-text bui-text--h1 ${styles.title}`}>{t.contact.title}</h1>
      <p className={`bui-text ${styles.intro}`}>{t.contact.intro}</p>
      {product && (
        <p className={`bui-text ${styles.intro}`} data-testid="contact-product">
          {t.contact.product}
          <Link href={product.href} className="bui-link">
            {product.name}
          </Link>
        </p>
      )}
      <ContactForm product={product} />
    </PageContainer>
  )
}
