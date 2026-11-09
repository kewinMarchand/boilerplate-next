import '@testing-library/jest-dom/vitest'

// Langue de la page (segment [lang]) : hors du rendu de Next, les composants serveur la lisent en français.
vi.mock('next/root-params', () => ({ lang: async () => 'fr' }))
