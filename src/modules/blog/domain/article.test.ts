import { formatDuration, sectionParam } from './article'

describe('formatDuration', () => {
  it('écrit les secondes sous une minute, les minutes arrondies ensuite', () => {
    expect(formatDuration(4)).toBe('4 s')
    expect(formatDuration(59)).toBe('59 s')
    expect(formatDuration(60)).toBe('1 min')
    expect(formatDuration(26 * 60 + 20)).toBe('26 min')
  })

  it('passe aux heures à partir de 60 minutes', () => {
    expect(formatDuration(3600)).toBe('1 h 00 min')
    expect(formatDuration(3900)).toBe('1 h 05 min')
  })
})

describe('sectionParam', () => {
  it('garde une valeur unique et non vide', () => {
    expect(sectionParam('conseils')).toBe('conseils')
    expect(sectionParam('')).toBeUndefined()
    expect(sectionParam(['conseils', 'actualites'])).toBeUndefined()
    expect(sectionParam(undefined)).toBeUndefined()
  })
})
