import { SITE_THEME_PATH } from './siteTheme'

import type { SiteIdentity } from '../domain/siteIdentity'

interface SiteThemeStylesheetProps {
  theme: SiteIdentity.Theme | null
}

/**
 * Feuille servie par le site lui-même (`'self'` dans la CSP) plutôt qu'un bloc `<style>` : la CSP est
 * figée au build et les pages sont régénérées sans nonce, une empreinte de couleurs saisies dans
 * l'admin ne peut donc pas y figurer.
 */
export const SiteThemeStylesheet = ({ theme }: SiteThemeStylesheetProps) =>
  theme && <link rel="stylesheet" href={SITE_THEME_PATH} />
