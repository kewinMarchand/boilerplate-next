import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

// Route de déclenchement de la 500 : développement, ou build de test avec ENABLE_TEST_ROUTES=1.
export default function ErrorTestPage() {
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_TEST_ROUTES !== '1') notFound()
  throw new Error('Erreur volontaire de la route de test')
}
