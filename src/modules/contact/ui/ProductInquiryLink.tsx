import { format } from '@/shared/i18n'
import { getDictionary } from '@/shared/i18n/server'
import { Link } from '@/shared/ui/kit'

import { inquiryHref } from '../domain/contactSchema'

interface ProductInquiryLinkProps {
  slug: string
  name: string
}

/** Remplace l'ajout au panier quand la vente en ligne est coupée ; un lien, il marche sans JavaScript. */
export const ProductInquiryLink = async ({ slug, name }: ProductInquiryLinkProps) => {
  const t = (await getDictionary()).contact
  return (
    <p>
      <Link href={inquiryHref(slug)} className="bui-button" data-testid="product-inquiry">
        {t.inquiry}
        <span className="bui-visually-hidden">{format(t.inquiryAbout, { name })}</span>
      </Link>
    </p>
  )
}
