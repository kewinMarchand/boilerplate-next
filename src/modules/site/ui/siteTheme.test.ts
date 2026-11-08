import { themeStylesheet } from './siteTheme'

import type { SiteIdentity } from '../domain/siteIdentity'

const tokens = (primary: string): SiteIdentity.ThemeTokens => ({
  primary,
  'primary-dark': '#000001',
  'on-primary': '#000002',
  'primary-surface-subtle': '#000003',
  'primary-surface': '#000004',
  'primary-surface-strong': '#000005',
  secondary: '#000006',
  'secondary-dark': '#000007',
  'on-secondary': '#000008',
  'secondary-surface-subtle': '#000009',
  'secondary-surface': '#00000a',
  'secondary-surface-strong': '#00000b',
})

describe('themeStylesheet', () => {
  const css = themeStylesheet({ light: tokens('#c2410c'), dark: tokens('#f8a77f') })
  const [light, dark, auto] = css.split('\n')

  it('redéfinit les douze jetons en clair, hors mode renforcé', () => {
    expect(light).toMatch(/^:root:not\(\[data-a11y-mode="enhanced"\]\)\{/)
    expect(light?.match(/--bui-color-/g)).toHaveLength(12)
    expect(light).toContain('--bui-color-primary:#c2410c;')
    expect(light).toContain('--bui-color-secondary-surface-strong:#00000b;')
  })

  it('pose le sombre forcé et le sombre du système, jamais en mode renforcé', () => {
    expect(
      dark?.startsWith(':root[data-color-scheme="dark"]:not([data-a11y-mode="enhanced"]){'),
    ).toBe(true)
    expect(dark).toContain('--bui-color-primary:#f8a77f;')
    expect(auto).toMatch(
      /^@media \(prefers-color-scheme: dark\)\{:root\[data-color-scheme="auto"\]:not\(\[data-a11y-mode="enhanced"\]\)\{.*--bui-color-primary:#f8a77f;/,
    )
  })
})
