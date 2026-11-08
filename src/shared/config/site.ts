export interface PublisherConfig {
  legalName: string
  email: string
}

export interface AccessibilityAuditConfig {
  auditDate: string | null
  complianceRate: number | null
  auditor: string | null
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  locale: string
  publisher: PublisherConfig
  accessibility: AccessibilityAuditConfig
  /** Repli de l'identité du site quand l'API ne répond pas. */
  salesEnabled: boolean
}

export const SITE: SiteConfig = {
  name: 'Boilerplate Next',
  description:
    'Boilerplate Next.js App Router avec boilerplates-ui, TanStack Query, react-hook-form et zod, outillé pour la QA et les tests end-to-end.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  locale: 'fr_FR',
  publisher: {
    legalName: 'Exemple SAS (société fictive)',
    email: 'contact@example.com',
  },
  accessibility: { auditDate: null, complianceRate: null, auditor: null },
  salesEnabled: true,
}
