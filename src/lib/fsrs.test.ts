import { describe, expect, it } from 'vitest'
import { applyRating, newReview, shouldShowMcqFallback } from './fsrs'
import type { Review } from '../db/schema'

const seed = (id: number, now: number): Review => ({ ...newReview('tesla', now), id })

describe('fsrs wrapper', () => {
  const now = 1_700_000_000_000

  it('creates an initial review for a new concept', () => {
    const review = newReview('tesla', now)
    expect(review.conceptId).toBe('tesla')
    expect(review.reps).toBe(0)
    expect(review.lapses).toBe(0)
    expect(review.failureStreak).toBe(0)
    expect(review.lastReviewedAt).toBeNull()
  })

  it('advances the review on a good rating', () => {
    const review = seed(1, now)
    const next = applyRating(review, 'good', now)
    expect(next.reps).toBeGreaterThan(0)
    expect(next.dueAt).toBeGreaterThan(now)
    expect(next.lastReviewedAt).toBe(now)
    expect(next.failureStreak).toBe(0)
  })

  it('increments failure streak on again', () => {
    const review = seed(1, now)
    const next = applyRating(review, 'again', now)
    expect(next.failureStreak).toBe(1)
    const next2 = applyRating(next, 'again', now + 1000)
    expect(next2.failureStreak).toBe(2)
    const next3 = applyRating(next2, 'again', now + 2000)
    expect(next3.failureStreak).toBe(3)
    expect(shouldShowMcqFallback(next3)).toBe(true)
  })

  it('resets failure streak on a passing rating', () => {
    let review: Review = seed(1, now)
    review = applyRating(review, 'again', now)
    review = applyRating(review, 'again', now + 1000)
    expect(review.failureStreak).toBe(2)
    review = applyRating(review, 'good', now + 2000)
    expect(review.failureStreak).toBe(0)
    expect(shouldShowMcqFallback(review)).toBe(false)
  })
})
