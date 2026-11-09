'use client'

import { useDictionary } from '@/shared/i18n'

// Chemin direct : l'index des vues d'erreur exporte aussi la page introuvable, composant serveur.
import { ServerErrorView } from '@/views/errors/ServerErrorView'

export default function Error({ error }: { error: Error & { digest?: string } }) {
  const t = useDictionary()
  return (
    <>
      <title>{t.errors.serverTitle}</title>
      <meta name="robots" content="noindex" />
      <ServerErrorView error={error} />
    </>
  )
}
