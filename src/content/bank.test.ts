import { describe, expect, it } from 'vitest'
import { BANK_CONCEPTS, BANK_ERAS, validateBank } from './index'

describe('content bank integrity', () => {
  it('has no structural issues (edges resolve, eras valid, questions well-formed)', () => {
    const issues = validateBank()
    if (issues.length > 0) {
      // Surface them readably in the failure output.
      throw new Error('Bank issues:\n' + issues.map((i) => `  ${i.conceptId}: ${i.problem}`).join('\n'))
    }
    expect(issues).toHaveLength(0)
  })

  it('covers every era with at least one concept', () => {
    const used = new Set(BANK_CONCEPTS.flatMap((c) => c.eras))
    for (const era of BANK_ERAS) {
      expect(used.has(era.id), `era "${era.id}" has no concepts`).toBe(true)
    }
  })

  it('has a healthy concept count', () => {
    expect(BANK_CONCEPTS.length).toBeGreaterThanOrEqual(70)
  })
})
