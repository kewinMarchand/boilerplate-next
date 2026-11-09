import { dictionarySections, DOCUMENT_SECTIONS } from './dictionaries'
import { en } from './dictionaries/en'
import { fr } from './dictionaries/fr'
import { alternatesByKey, internalPath, languageLinks, localizePath } from './locale'

const keysOf = (value: object, prefix = ''): string[] =>
  Object.entries(value).flatMap(([key, child]) =>
    typeof child === 'object' && child !== null
      ? keysOf(child, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  )

describe('dictionnaires', () => {
  it('ont les mêmes clés en français et en anglais', () => {
    expect(keysOf(en).sort()).toEqual(keysOf(fr).sort())
  })

  it('ne donnent au navigateur que les sections demandées', () => {
    expect(dictionarySections(en, ['cart', 'ui'])).toEqual({ cart: en.cart, ui: en.ui })
    expect(Object.keys(dictionarySections(fr, DOCUMENT_SECTIONS))).not.toContain('catalog')
  })
})

describe('localizePath', () => {
  it('ne préfixe pas la langue par défaut, préfixe les autres', () => {
    expect(localizePath('/catalogue', 'fr', 'fr')).toBe('/catalogue')
    expect(localizePath('/catalogue?page=2', 'en', 'fr')).toBe('/en/catalogue?page=2')
    expect(localizePath('/', 'en', 'fr')).toBe('/en')
  })

  it('laisse les ancres et les adresses externes', () => {
    expect(localizePath('#main', 'en', 'fr')).toBe('#main')
    expect(localizePath('https://exemple.fr/', 'en', 'fr')).toBe('https://exemple.fr/')
  })
})

describe('internalPath', () => {
  it('passe la langue par défaut et les préfixes inconnus sous la langue par défaut', () => {
    expect(internalPath('/produit/monstera', ['fr', 'en'])).toBe('/fr/produit/monstera')
    expect(internalPath('/en/produit/swiss', ['fr', 'en'])).toBe('/en/produit/swiss')
    expect(internalPath('/en/produit/swiss', ['fr'])).toBe('/fr/en/produit/swiss')
    expect(internalPath('/fr/contact', ['fr', 'en'])).toBe('/fr/fr/contact')
  })
})

describe('languageLinks', () => {
  const locale = { locale: 'en', defaultLocale: 'fr', locales: ['fr', 'en'] }

  it('mène à l’équivalent, sinon à l’accueil de la langue', () => {
    expect(languageLinks(locale, [{ locale: 'fr', path: '/produit/monstera' }])).toEqual([
      { locale: 'fr', href: '/produit/monstera' },
      { locale: 'en', href: '/en' },
    ])
  })
})

describe('alternatesByKey', () => {
  it('associe les chemins des langues par identifiant, dans l’ordre de la première', () => {
    expect(
      alternatesByKey([
        { locale: 'fr', entries: [{ key: '1', path: '/produit/monstera' }] },
        { locale: 'en', entries: [{ key: '1', path: '/produit/swiss' }] },
      ]),
    ).toEqual([
      [
        { locale: 'fr', path: '/produit/monstera' },
        { locale: 'en', path: '/produit/swiss' },
      ],
    ])
  })
})
