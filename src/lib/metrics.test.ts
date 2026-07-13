import { describe, expect, it } from 'vitest'
import type { DayMetric } from '../db/schema'
import { dayKey, mergeMetric } from './metrics'

describe('dayKey', () => {
  it('formats a local YYYY-MM-DD key', () => {
    // Noon UTC on a fixed date — avoids any local-midnight boundary flake.
    const k = dayKey(Date.UTC(2026, 6, 13, 12, 0, 0)) // month is 0-based → July
    expect(k).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(k.startsWith('2026-07-1')).toBe(true)
  })
})

describe('mergeMetric', () => {
  const day = '2026-07-13'

  it('seeds a zeroed row when none exists and applies the patch', () => {
    const m = mergeMetric(undefined, day, { opens: 1, feedCards: 3, level: 'new' })
    expect(m).toEqual({
      day,
      level: 'new',
      opens: 1,
      feedCards: 3,
      gate1: 0,
      gate2: 0,
      gate3: 0,
      generated: 0,
      deepened: 0,
    })
  })

  it('adds numeric fields and overwrites level only when provided', () => {
    const base: DayMetric = {
      day,
      level: 'new',
      opens: 2,
      feedCards: 10,
      gate1: 4,
      gate2: 1,
      gate3: 0,
      generated: 1,
      deepened: 0,
    }
    const m = mergeMetric(base, day, { feedCards: 5, gate2: 2, deepened: 1 })
    expect(m.feedCards).toBe(15)
    expect(m.gate2).toBe(3)
    expect(m.deepened).toBe(1)
    expect(m.opens).toBe(2) // untouched
    expect(m.level).toBe('new') // no level in patch → kept

    const m2 = mergeMetric(m, day, { level: 'confident' })
    expect(m2.level).toBe('confident')
    expect(m2.feedCards).toBe(15) // additive-zero patch leaves counts intact
  })

  it('never mutates the existing row', () => {
    const base: DayMetric = {
      day, level: 'some', opens: 1, feedCards: 1, gate1: 0, gate2: 0, gate3: 0, generated: 0, deepened: 0,
    }
    const snapshot = { ...base }
    mergeMetric(base, day, { opens: 5 })
    expect(base).toEqual(snapshot)
  })
})
