import { Link } from '@/shared/ui/kit'
import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { findInquiryProduct } from '../infrastructure/inquiryProductRepository'
import { ContactForm } from './ContactForm'
import styles from './ContactView.module.css'

type SearchParams = Record<string, string | string[] | undefined>

/** Produit de `?produit=<slug>` ; slug absent, inconnu ou API en erreur : message de contact simple. */
const loadInquiryProduct = (searchParams: SearchParams) => {
  const { produit } = searchParams
  if (typeof produit !== 'string' || produit === '') return null
  return findInquiryProduct(produit).catch((error: unknown) => {
    console.error(error)
    return null
  })
}

export const ContactView = async ({ searchParams }: { searchParams: SearchParams }) => {
  const product = await loadInquiryProduct(searchParams)

  return (
    <PageContainer breadcrumb={buildBreadcrumb('/contact')}>
      <h1 className={`bui-text bui-text--h1 ${styles.title}`}>Contact</h1>
      <p className={`bui-text ${styles.intro}`}>
        Formulaire validé par un schéma zod et envoyé via une mutation TanStack Query.
      </p>
      {product && (
        <p className={`bui-text ${styles.intro}`} data-testid="contact-product">
          Votre demande concerne :{' '}
          <Link href={product.href} className="bui-link">
            {product.name}
          </Link>
        </p>
      )}
      <ContactForm product={product} />
    </PageContainer>
  )
}
