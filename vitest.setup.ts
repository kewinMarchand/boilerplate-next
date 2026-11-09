import { dictionaryFor } from '@/shared/i18n/dictionaries'

import '@testing-library/jest-dom/vitest'

// Langue de la page (segment [lang]) : hors du rendu de Next, les composants serveur la lisent en français.
vi.mock('next/root-params', () => ({ lang: async () => 'fr' }))

// Hors du layout racine, les composants client lisent le dictionnaire français.
vi.mock('@/shared/i18n/LocaleProvider', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useDictionary: () => dictionaryFor('fr'),
}))
