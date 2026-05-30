import { describe, expect, it } from 'vitest'
import { DEFAULT_PREFS, resolvePolicy } from './settings'

describe('resolvePolicy', () => {
  it('default (balanced + minimiseTyping) is tap-first', () => {
    const p = resolvePolicy(DEFAULT_PREFS)
    expect(p.clozeChips).toBe(true)
    expect(p.newConceptFormat).toBe('cloze_chips')
  })

  it('playful is always tap-only', () => {
    const p = resolvePolicy({ ...DEFAULT_PREFS, intensity: 'playful', minimiseTyping: false })
    expect(p.clozeChips).toBe(true)
    expect(p.newConceptFormat).toBe('cloze_chips')
  })

  it('serious without minimiseTyping uses typed recall', () => {
    const p = resolvePolicy({ ...DEFAULT_PREFS, intensity: 'serious', minimiseTyping: false })
    expect(p.clozeChips).toBe(false)
    expect(p.newConceptFormat).toBe('free')
  })

  it('minimiseTyping overrides serious', () => {
    const p = resolvePolicy({ ...DEFAULT_PREFS, intensity: 'serious', minimiseTyping: true })
    expect(p.clozeChips).toBe(true)
    expect(p.newConceptFormat).toBe('cloze_chips')
  })

  it('game toggles flow through to policy', () => {
    const p = resolvePolicy({ ...DEFAULT_PREFS, enableMap: false, enableOrder: false })
    expect(p.games.map).toBe(false)
    expect(p.games.order).toBe(false)
    expect(p.games.sort).toBe(true)
  })
})
