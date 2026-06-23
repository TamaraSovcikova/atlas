import { describe, expect, it } from 'vitest'
import { interleave, computeUnlockedTiers, TIER_REPS_GATE, type RecallItem } from './session'
import type { Concept, Lesson, Review } from '../db/schema'
import { newReview } from './fsrs'

function makeCard(id: string, domain: Concept['domain']): RecallItem {
  const concept: Concept = {
    id,
    name: id,
    domain,
    lessonId: `${id}--lesson`,
    summary: '',
    wikipediaUrl: null,
    approxYear: null,
    eras: [],
    threads: [],
    lat: null,
    lng: null,
    firstSeenAt: null,
    lastReviewedAt: null,
    createdAt: 0,
  }
  const lesson: Lesson = {
    id: `${id}--lesson`,
    conceptId: id,
    title: id,
    body: '',
    recallQuestions: [{ format: 'cloze', prompt: 'q ____', expectedAnswer: 'a' }],
    sourceUrls: [],
    lastVerifiedAt: null,
    createdAt: 0,
  }
  const review: Review = { ...newReview(id, 0), id: 1 }
  return {
    kind: 'recall',
    cardKey: id,
    concept,
    lesson,
    question: lesson.recallQuestions[0]!,
    review,
    isNew: true,
    isFallback: false,
  }
}

describe('interleave', () => {
  it('avoids back-to-back cards from the same domain when possible', () => {
    const cards = [
      makeCard('h1', 'history'),
      makeCard('h2', 'history'),
      makeCard('g1', 'geography'),
      makeCard('g2', 'geography'),
      makeCard('p1', 'politics'),
    ]
    const out = interleave(cards)
    expect(out).toHaveLength(5)
    let sameDomainStreaks = 0
    for (let i = 1; i < out.length; i++) {
      if (out[i]!.concept.domain === out[i - 1]!.concept.domain) {
        sameDomainStreaks++
      }
    }
    expect(sameDomainStreaks).toBeLessThanOrEqual(1)
  })

  it('returns the same single card untouched', () => {
    const cards = [makeCard('h1', 'history')]
    expect(interleave(cards)).toEqual(cards)
  })

  it('does not lose cards when the same domain dominates', () => {
    const cards = [
      makeCard('h1', 'history'),
      makeCard('h2', 'history'),
      makeCard('h3', 'history'),
      makeCard('g1', 'geography'),
    ]
    const out = interleave(cards)
    expect(out).toHaveLength(4)
    expect(out.map((c) => c.concept.id).sort()).toEqual(['g1', 'h1', 'h2', 'h3'])
  })
})

describe('computeUnlockedTiers', () => {
  const members = [
    { conceptId: 'a1', tier: 1 },
    { conceptId: 'a2', tier: 1 },
    { conceptId: 'b1', tier: 2 },
  ]

  function concept(id: string, seen: boolean): Concept {
    return {
      id, name: id, domain: 'history', lessonId: null, summary: '',
      wikipediaUrl: null, approxYear: null, eras: [], threads: [],
      lat: null, lng: null, firstSeenAt: seen ? 1 : null,
      lastReviewedAt: null, createdAt: 0,
    }
  }
  function review(id: string, reps: number): Review {
    return { ...newReview(id, 0), id: 1, reps }
  }

  it('always unlocks tier 1', () => {
    const unlocked = computeUnlockedTiers(members, new Map(), new Map())
    expect(unlocked.has(1)).toBe(true)
    expect(unlocked.has(2)).toBe(false)
  })

  it('keeps tier 2 locked while a tier-1 concept is unseen', () => {
    const concepts = new Map([['a1', concept('a1', true)], ['a2', concept('a2', false)]])
    const reviews = new Map([['a1', review('a1', TIER_REPS_GATE)], ['a2', review('a2', 0)]])
    expect(computeUnlockedTiers(members, concepts, reviews).has(2)).toBe(false)
  })

  it('keeps tier 2 locked while a tier-1 concept is under the reps gate', () => {
    const concepts = new Map([['a1', concept('a1', true)], ['a2', concept('a2', true)]])
    const reviews = new Map([['a1', review('a1', TIER_REPS_GATE)], ['a2', review('a2', TIER_REPS_GATE - 1)]])
    expect(computeUnlockedTiers(members, concepts, reviews).has(2)).toBe(false)
  })

  it('unlocks tier 2 once every tier-1 concept is seen and at the reps gate', () => {
    const concepts = new Map([['a1', concept('a1', true)], ['a2', concept('a2', true)]])
    const reviews = new Map([['a1', review('a1', TIER_REPS_GATE)], ['a2', review('a2', TIER_REPS_GATE)]])
    expect(computeUnlockedTiers(members, concepts, reviews).has(2)).toBe(true)
  })
})
