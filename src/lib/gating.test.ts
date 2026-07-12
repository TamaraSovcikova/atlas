import { describe, expect, it } from 'vitest'
import type { Concept, Review } from '../db/schema'
import { newReview } from './fsrs'
import {
  ANCHORS_FOR_CEILING_2,
  ANCHORS_FOR_CEILING_3,
  TIER_REPS_GATE,
  UNTIERED_COMPLEXITY,
  buildComplexityMap,
  complexityCeiling,
  computeAnchorsMet,
  conceptComplexity,
  orderByCeiling,
} from './gating'
import { THREADS } from '../content/threads'

function makeConcept(id: string, seen: boolean): Concept {
  return {
    id,
    name: id,
    domain: 'history',
    lessonId: `${id}--lesson`,
    summary: '',
    wikipediaUrl: null,
    approxYear: null,
    eras: [],
    threads: [],
    lat: null,
    lng: null,
    firstSeenAt: seen ? 1 : null,
    lastReviewedAt: null,
    createdAt: 0,
  }
}

function makeReview(conceptId: string, reps: number): Review {
  return { ...newReview(conceptId, 0), id: 1, reps }
}

const thread = (members: { conceptId: string; tier: number }[]) => ({ members })

describe('buildComplexityMap / conceptComplexity', () => {
  it('takes the lowest tier across memberships and defaults untiered to 2', () => {
    const map = buildComplexityMap([
      thread([
        { conceptId: 'a', tier: 3 },
        { conceptId: 'b', tier: 2 },
      ]),
      thread([{ conceptId: 'a', tier: 1 }]),
    ])
    expect(conceptComplexity('a', map)).toBe(1) // min(3, 1)
    expect(conceptComplexity('b', map)).toBe(2)
    expect(conceptComplexity('nowhere', map)).toBe(UNTIERED_COMPLEXITY)
  })
})

describe('computeAnchorsMet', () => {
  const threads = [
    thread([
      { conceptId: 'a1', tier: 1 },
      { conceptId: 'deep', tier: 3 },
    ]),
    // a1 again at tier 3 elsewhere — must still count exactly once, as an anchor.
    thread([
      { conceptId: 'a1', tier: 3 },
      { conceptId: 'a2', tier: 1 },
    ]),
  ]

  it('counts a cross-thread concept once, by its min tier', () => {
    const concepts = new Map([
      ['a1', makeConcept('a1', true)],
      ['a2', makeConcept('a2', true)],
      ['deep', makeConcept('deep', true)],
    ])
    const reviews = new Map([
      ['a1', makeReview('a1', TIER_REPS_GATE)],
      ['a2', makeReview('a2', TIER_REPS_GATE)],
      ['deep', makeReview('deep', TIER_REPS_GATE)], // tier 3 — never an anchor
    ])
    expect(computeAnchorsMet(threads, concepts, reviews)).toBe(2)
  })

  it('requires both met and reps >= TIER_REPS_GATE', () => {
    const concepts = new Map([
      ['a1', makeConcept('a1', true)],
      ['a2', makeConcept('a2', false)], // never seen
    ])
    const reviews = new Map([
      ['a1', makeReview('a1', TIER_REPS_GATE - 1)], // under-repped
      ['a2', makeReview('a2', TIER_REPS_GATE)],
    ])
    expect(computeAnchorsMet(threads, concepts, reviews)).toBe(0)
  })
})

describe('complexityCeiling', () => {
  it("is Infinity for 'some' and 'confident' regardless of progress", () => {
    expect(complexityCeiling('some', 0)).toBe(Infinity)
    expect(complexityCeiling('confident', 0)).toBe(Infinity)
    expect(complexityCeiling('some', 999)).toBe(Infinity)
  })

  it("progresses 1 → 2 → open for 'new' at the anchor boundaries", () => {
    expect(complexityCeiling('new', 0)).toBe(1)
    expect(complexityCeiling('new', ANCHORS_FOR_CEILING_2 - 1)).toBe(1)
    expect(complexityCeiling('new', ANCHORS_FOR_CEILING_2)).toBe(2)
    expect(complexityCeiling('new', ANCHORS_FOR_CEILING_3 - 1)).toBe(2)
    expect(complexityCeiling('new', ANCHORS_FOR_CEILING_3)).toBe(Infinity)
  })

  it('clamps garbage progress input', () => {
    expect(complexityCeiling('new', -5)).toBe(1)
    expect(complexityCeiling('new', NaN)).toBe(1)
  })
})

describe('orderByCeiling', () => {
  const map = new Map([
    ['a2', 2],
    ['b1', 1],
    ['c3', 3],
    ['d1', 1],
  ])
  const items = [{ id: 'a2' }, { id: 'b1' }, { id: 'c3' }, { id: 'd1' }, { id: 'untiered' }]

  it('is a stable partition: within-ceiling first, original order preserved', () => {
    // Spill semantics (eng F3): thread B's tier-1 outranks thread A's tier-2
    // even though A came first in pathway order.
    expect(orderByCeiling(items, map, 1).map((x) => x.id)).toEqual([
      'b1',
      'd1',
      'a2',
      'c3',
      'untiered',
    ])
    expect(orderByCeiling(items, map, 2).map((x) => x.id)).toEqual([
      'a2',
      'b1',
      'd1',
      'untiered',
      'c3',
    ])
  })

  it('is the identity when the ceiling is not finite (ungated regression proof)', () => {
    expect(orderByCeiling(items, map, Infinity)).toBe(items)
  })
})

describe('seed corpus', () => {
  it(`has at least ${ANCHORS_FOR_CEILING_3} distinct tier-1 anchors so the ceiling can fully open`, () => {
    const minTier = new Map<string, number>()
    for (const t of THREADS) {
      for (const m of t.members) {
        const tier = m.tier ?? 1
        const cur = minTier.get(m.concept)
        if (cur === undefined || tier < cur) minTier.set(m.concept, tier)
      }
    }
    const anchors = [...minTier.values()].filter((t) => t === 1).length
    expect(anchors).toBeGreaterThanOrEqual(ANCHORS_FOR_CEILING_3)
  })
})
