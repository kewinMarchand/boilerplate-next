import { getDictionary } from '@/shared/i18n/server'

import styles from './SkipLink.module.css'

export const SkipLink = async () => (
  <a href="#main" className={styles.skip}>
    {(await getDictionary()).layout.skipLink}
  </a>
)
