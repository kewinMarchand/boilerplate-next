import styles from './RichHtml.module.css'

interface RichHtmlProps {
  /** HTML venu de l'API, qui échappe le HTML saisi dans l'admin et retire les liens dangereux. */
  html: string
  'data-testid'?: string
}

/** HTML sans classe venu de l'API (pages légales, articles), stylé avec le texte et les liens de boilerplates-ui. */
export const RichHtml = ({ html, 'data-testid': testId }: RichHtmlProps) => (
  <div className={styles.html} data-testid={testId} dangerouslySetInnerHTML={{ __html: html }} />
)
