import { describe, it, expect } from 'vitest'
import { masteryOf, masterySpread, masteryProgress } from './mastery'
import type { Review } from '../db/schema'

function review(stability: number): Review {
  return {
    conceptId: 'c',
    dueAt: 0,
    stability,
    difficulty: 5,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 1,
    lapses: 0,
    state: 2,
    lastReviewedAt: 0,
    failureStreak: 0,
    createdAt: 0,
  }
}

describe('masteryOf', () => {
  it('is new when unseen or without a review', () => {
    expect(masteryOf(review(50), false)).toBe('new')
    expect(masteryOf(undefined, true)).toBe('new')
  })
  it('maps stability bands', () => {
    expect(masteryOf(review(0.5), true)).toBe('seen')
    expect(masteryOf(review(3), true)).toBe('learning')
    expect(masteryOf(review(14), true)).toBe('familiar')
    expect(masteryOf(review(40), true)).toBe('known')
    expect(masteryOf(review(90), true)).toBe('mastered')
  })
  it('is monotonic in stability', () => {
    expect(masteryProgress(masteryOf(review(0.5), true))).toBeLessThan(
      masteryProgress(masteryOf(review(90), true)),
    )
  })
})

describe('masterySpread', () => {
  it('counts levels and computes a fraction', () => {
    const spread = masterySpread(['new', 'mastered', 'mastered'])
    expect(spread.total).toBe(3)
    expect(spread.counts.mastered).toBe(2)
    expect(spread.counts.new).toBe(1)
    expect(spread.fraction).toBeCloseTo((0 + 1 + 1) / 3)
  })
  it('is zero for an empty set', () => {
    expect(masterySpread([]).fraction).toBe(0)
  })
})
