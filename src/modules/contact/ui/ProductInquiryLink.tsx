import { Link } from '@/shared/ui/kit'

import { inquiryHref } from '../domain/contactSchema'

interface ProductInquiryLinkProps {
  slug: string
  name: string
}

/** Remplace l'ajout au panier quand la vente en ligne est coupée ; un lien, il marche sans JavaScript. */
export const ProductInquiryLink = ({ slug, name }: ProductInquiryLinkProps) => (
  <p>
    <Link href={inquiryHref(slug)} className="bui-button" data-testid="product-inquiry">
      Demande de renseignement
      <span className="bui-visually-hidden"> sur {name}</span>
    </Link>
  </p>
)
