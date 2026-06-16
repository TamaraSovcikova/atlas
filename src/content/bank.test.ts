import { describe, expect, it } from 'vitest'
import { BANK_CONCEPTS, BANK_ERAS, BANK_THREADS, validateBank } from './index'

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

  it('every thread member resolves to a real concept', () => {
    const ids = new Set(BANK_CONCEPTS.map((c) => c.id))
    for (const t of BANK_THREADS) {
      expect(t.members.length, `thread "${t.id}" is empty`).toBeGreaterThan(0)
      for (const m of t.members) {
        expect(ids.has(m.concept), `thread "${t.id}" -> unknown concept "${m.concept}"`).toBe(true)
      }
    }
  })

  it('every thread has at least one tier-1 anchor (a skeleton)', () => {
    for (const t of BANK_THREADS) {
      const anchors = t.members.filter((m) => (m.tier ?? 1) === 1)
      expect(anchors.length, `thread "${t.id}" has no tier-1 anchors`).toBeGreaterThan(0)
    }
  })
})
