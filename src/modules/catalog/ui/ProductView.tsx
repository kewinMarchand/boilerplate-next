import { notFound } from 'next/navigation'
import { Fragment } from 'react'

import { Alert, Badge } from '@kewinmarchand/boilerplates-ui/react'

import { format, localizePath } from '@/shared/i18n'
import { getDictionary } from '@/shared/i18n/server'
import { JsonLd, productJsonLd } from '@/shared/seo'
import { largestWebp, Link, Picture } from '@/shared/ui/kit'
import { buildBreadcrumb, PageContainer } from '@/shared/ui/layout'

import { loadProduct } from '../application/products'
import { productHref } from '../domain/catalog'
import { CATALOG_ROOT_PATH, categoryTrail } from '../domain/categoryPath'
import { formatPrice } from '../domain/price'
import { ProductGallery } from './ProductGallery'
import styles from './ProductView.module.css'
import { SimilarProducts } from './SimilarProducts'

import type { Catalog } from '../domain/catalog'
import type { LocaleContext } from '@/shared/i18n'
import type { ReactNode } from 'react'

const IMAGE_SIZES = '(min-width: 1440px) 680px, (min-width: 768px) 50vw, calc(100vw - 32px)'

interface ProductViewProps {
  slug: string
  /** Vente en ligne coupée : ni prix ni `offers` dans le JSON-LD. */
  salesEnabled: boolean
  /** Bouton d'achat (module panier) ou lien de demande de renseignement, fourni par la couche de routage. */
  purchase?: (product: Catalog.ProductDetail) => ReactNode
  locale: LocaleContext
}

/** Fiche d'un produit, lue dans l'API : image, prix, description, caractéristiques et chemin de sa catégorie. */
export const ProductView = async ({ slug, salesEnabled, purchase, locale }: ProductViewProps) => {
  const [product, t] = await Promise.all([
    loadProduct(slug, locale.locale).catch((error: unknown) => {
      console.error(error)
      return undefined
    }),
    getDictionary(),
  ])

  if (product === null) notFound()

  if (product === undefined) {
    return (
      <PageContainer
        breadcrumb={buildBreadcrumb(t.nav, CATALOG_ROOT_PATH, [
          { label: t.product.fallbackTitle, href: productHref(slug) },
        ])}
      >
        <h1 className="bui-text bui-text--h1">{t.product.fallbackTitle}</h1>
        <div data-testid="product-error">
          <Alert variant="error">{t.product.loadError}</Alert>
        </div>
      </PageContainer>
    )
  }

  const path = productHref(product.slug)
  const category = product.categoryPath.at(-1)

  return (
    <PageContainer
      breadcrumb={buildBreadcrumb(t.nav, CATALOG_ROOT_PATH, [
        ...categoryTrail(product.categoryPath),
        { label: product.name, href: path },
      ])}
    >
      <article className={styles.product} data-testid="product-page">
        {product.gallery.length > 0 ? (
          <ProductGallery
            images={product.image ? [product.image, ...product.gallery] : product.gallery}
            sizes={IMAGE_SIZES}
          />
        ) : (
          product.image && (
            <Picture
              image={product.image}
              sizes={IMAGE_SIZES}
              isPriority
              style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8 }}
            />
          )
        )}
        <div>
          <h1 className={`bui-text bui-text--h1 ${styles.title}`} data-testid="product-title">
            {product.name}
          </h1>
          {salesEnabled && (
            <p className={`bui-text bui-text--lead ${styles.price}`} data-testid="product-price">
              {formatPrice(product.price, t.language.tag)}
            </p>
          )}
          {product.description.length > 0 && (
            <div data-testid="product-description">
              {product.description.map((paragraph) => (
                <p key={paragraph} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}
          <dl className={styles.features}>
            <dt>{t.product.exposure}</dt>
            <dd>{t.catalog.exposures[product.exposure]}</dd>
            <dt>{t.product.size}</dt>
            <dd>{product.size}</dd>
            <dt>{t.product.availability}</dt>
            <dd>{product.inStock ? t.product.inStock : <Badge>{t.product.outOfStock}</Badge>}</dd>
          </dl>
          {product.attributes.length > 0 && (
            <dl className={styles.features} data-testid="product-attributes">
              {product.attributes.map((attribute) => (
                <Fragment key={attribute.code}>
                  <dt>{attribute.label}</dt>
                  <dd>
                    {attribute.unit ? `${attribute.value} ${attribute.unit}` : attribute.value}
                  </dd>
                </Fragment>
              ))}
            </dl>
          )}
          {purchase?.(product)}
          {category && (
            <p>
              <Link href={category.href} className="bui-link">
                {format(t.product.otherProducts, { category: category.name })}
              </Link>
            </p>
          )}
        </div>
      </article>
      <div className={styles.similar}>
        <SimilarProducts
          categorySlug={product.categorySlug}
          productSlug={product.slug}
          showPrices={salesEnabled}
          locale={locale.locale}
        />
      </div>
      <JsonLd
        data={productJsonLd({
          name: product.name,
          description: product.description.join(' '),
          path: localizePath(path, locale.locale, locale.defaultLocale),
          sku: product.slug,
          category: category?.name,
          image: product.image ? largestWebp(product.image) : undefined,
          price: salesEnabled ? (product.price / 100).toFixed(2) : undefined,
          inStock: product.inStock,
        })}
      />
    </PageContainer>
  )
}
