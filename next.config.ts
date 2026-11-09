import { CSP_HEADER, siteCsp } from './src/shared/security'

import type { NextConfig } from 'next'

// CSP en mode Report-Only, figée au build comme NEXT_PUBLIC_* : rien n'est bloqué, chaque écart est signalé à /api/csp-report
const csp = siteCsp({
  apiUrl: process.env.API_URL || 'http://localhost:8090',
  matomoUrl: process.env.NEXT_PUBLIC_MATOMO_URL || undefined,
  glitchtipDsn: process.env.NEXT_PUBLIC_GLITCHTIP_DSN || undefined,
})

const nextConfig: NextConfig = {
  ...(process.env.NEXT_OUTPUT === 'standalone' && { output: 'standalone' }),
  poweredByHeader: false,
  // Le layout racine est sous [lang] : une adresse sans route sert src/app/global-not-found.tsx (page complète, pré-rendue).
  experimental: { globalNotFound: true },
  transpilePackages: ['@kewinmarchand/boilerplates-ui'],
  // Origine de l'API pour le navigateur, figée au build. Le serveur relit API_URL à l'exécution.
  // Scénario de l'API fixé pour tout le build (tests e2e bilingues), vide sinon.
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL || 'http://localhost:8090',
    NEXT_PUBLIC_API_SCENARIO: process.env.API_SCENARIO ?? '',
  },
  // Build séparé pour les tests d'observabilité, qui fixent les variables publiques au build.
  ...(process.env.NEXT_DIST_DIR && { distDir: process.env.NEXT_DIST_DIR }),
  headers: async () => [{ source: '/:path*', headers: [{ key: CSP_HEADER, value: csp }] }],
}

export default nextConfig
