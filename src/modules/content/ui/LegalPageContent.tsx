import { notFound } from 'next/navigation'

import { Alert, Stack, Text } from '@kewinmarchand/boilerplates-ui/react'

import { getDictionary, getLocale } from '@/shared/i18n/server'
import { RichHtml } from '@/shared/ui/kit'

import { findLegalPage } from '../infrastructure/legalPageRepository'
import styles from './LegalPageContent.module.css'

import type { LegalPage } from '../domain/legalPage'

interface LegalPageContentProps {
  slug: LegalPage.Slug
  /** Titre affiché si l'API ne répond pas. */
  fallbackTitle: string
}

/**
 * Titre et sections d'une page légale administrée. Le HTML vient de l'API, qui échappe le HTML saisi
 * dans l'admin et retire les liens dangereux : il est injecté tel quel.
 */
export const LegalPageContent = async ({ slug, fallbackTitle }: LegalPageContentProps) => {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()])
  const page = await findLegalPage(slug, locale).catch((error: unknown) => {
    console.error(error)
    return undefined
  })

  if (page === null) notFound()

  if (page === undefined) {
    return (
      <>
        <h1 className={`bui-text bui-text--h1 ${styles.title}`}>{fallbackTitle}</h1>
        <div data-testid="legal-error">
          <Alert variant="error" prefix={t.ui.alert.error}>
            {t.legal.loadError}
          </Alert>
        </div>
      </>
    )
  }

  return (
    <>
      <h1 className={`bui-text bui-text--h1 ${styles.title}`}>{page.title}</h1>
      {page.introduction && <RichHtml html={page.introduction} />}
      {page.sections.map((section) => (
        <Stack
          as="section"
          gap="3"
          className={styles.section}
          key={section.title}
          data-testid="legal-section"
        >
          <Text variant="h2">{section.title}</Text>
          <RichHtml html={section.html} />
        </Stack>
      ))}
    </>
  )
}
