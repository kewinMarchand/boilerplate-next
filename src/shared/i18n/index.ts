export type { Dictionary } from './dictionaries/dictionary'
export type { LanguageAlternate, LocaleContext } from './locale'
export {
  alternatesByKey,
  dictionaryFor,
  FALLBACK_LOCALE,
  internalPath,
  languageLinks,
  languageName,
  localizePath,
  MONOLINGUAL,
  samePathInEveryLocale,
} from './locale'
export {
  LocaleProvider,
  useDictionary,
  useLocale,
  useLocalizePath,
  usePagePathname,
} from './LocaleProvider'
