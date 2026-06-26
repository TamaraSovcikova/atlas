import { describe, expect, it } from 'vitest'
import type { Concept, Domain } from '../db/schema'
import {
  applySwipeToWeights,
  assembleBatch,
  emptyWeights,
  freshFeedState,
  interestScore,
  pickDiscovery,
  primaryConcept,
  WEIGHT_CAP,
  WEIGHT_FLOOR,
  type FeedPools,
  type InterestWeights,
} from './feed'

function makeConcept(id: string, domain: Domain, opts: Partial<Concept> = {}): Concept {
  return {
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
    ...opts,
  }
}

/** Deterministic PRNG so exploration/diversity tests are reproducible. */
function mulberry32(seed: number): () => number {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function emptyPools(over: Partial<FeedPools> = {}): FeedPools {
  return {
    dueReviews: [],
    spine: [],
    connections: [],
    conceptById: new Map(),
    ...over,
  }
}

const topicOfDomain = (d: Domain) => ({ domain: d, eras: [] as string[], threads: [] as string[] })

describe('applySwipeToWeights', () => {
  it('boosts on swipe-left and decays on swipe-right', () => {
    const w = emptyWeights(0)
    const left = applySwipeToWeights(w, topicOfDomain('history'), 'left', 0, 1)
    const right = applySwipeToWeights(w, topicOfDomain('history'), 'right', 0, 1)
    expect(left.domains.history!).toBeGreaterThan(1)
    expect(right.domains.history!).toBeLessThan(1)
  })

  it('never drops a topic to zero (floor) however many right-swipes', () => {
    let w = emptyWeights(0)
    for (let i = 0; i < 50; i++) {
      w = applySwipeToWeights(w, topicOfDomain('science'), 'right', 0, i)
    }
    expect(w.domains.science!).toBe(WEIGHT_FLOOR)
    expect(w.domains.science!).toBeGreaterThan(0)
  })

  it('caps a topic however many left-swipes', () => {
    let w = emptyWeights(0)
    for (let i = 0; i < 50; i++) {
      w = applySwipeToWeights(w, topicOfDomain('culture'), 'left', 0, i)
    }
    expect(w.domains.culture!).toBe(WEIGHT_CAP)
  })

  it('left/right move era + thread axes; up moves domain only', () => {
    const topic = { domain: 'history' as Domain, eras: ['e1'], threads: ['t1'] }
    const left = applySwipeToWeights(emptyWeights(0), topic, 'left', 0, 1)
    expect(left.eras.e1!).toBeGreaterThan(1)
    expect(left.threads.t1!).toBeGreaterThan(1)

    const up = applySwipeToWeights(emptyWeights(0), topic, 'up', 100, 1) // short dwell
    expect(up.domains.history!).toBeLessThan(1)
    expect(up.eras.e1).toBeUndefined()
    expect(up.threads.t1).toBeUndefined()
  })
})

describe('interestScore', () => {
  it('rises with domain weight', () => {
    const c = makeConcept('a', 'history')
    const low = interestScore(c, emptyWeights(0))
    const high = interestScore(c, { ...emptyWeights(0), domains: { history: 2 } })
    expect(high).toBeGreaterThan(low)
  })
})

describe('pickDiscovery — exploration floor', () => {
  it('keeps surfacing a suppressed topic (~epsilon share), never zero', () => {
    const w: InterestWeights = {
      ...emptyWeights(0),
      domains: { history: WEIGHT_CAP, science: WEIGHT_FLOOR },
    }
    const candidates = [
      ...Array.from({ length: 5 }, (_, i) => makeConcept(`h${i}`, 'history')),
      ...Array.from({ length: 5 }, (_, i) => makeConcept(`s${i}`, 'science')),
    ]
    const rng = mulberry32(42)
    let science = 0
    const N = 2000
    for (let i = 0; i < N; i++) {
      const pick = pickDiscovery(candidates, w, [], rng)!
      if (pick.domain === 'science') science++
    }
    const frac = science / N
    // Heavily suppressed, yet exploration guarantees it never collapses to ~0
    // and the epsilon floor keeps it well represented.
    expect(frac).toBeGreaterThan(0.15)
    expect(frac).toBeLessThan(0.45)
  })
})

describe('assembleBatch', () => {
  it('always works due reviews in at a cadence when a backlog exists', () => {
    const pools = emptyPools({
      dueReviews: Array.from({ length: 6 }, (_, i) => makeConcept(`r${i}`, 'history', { firstSeenAt: 1 })),
      spine: Array.from({ length: 12 }, (_, i) =>
        makeConcept(`n${i}`, (['science', 'culture', 'geography'] as Domain[])[i % 3]!),
      ),
    })
    const { items } = assembleBatch(pools, freshFeedState(emptyWeights(0)), 9, mulberry32(1))
    const reviews = items.filter((it) => it.kind === 'review')
    expect(items).toHaveLength(9)
    expect(reviews.length).toBeGreaterThanOrEqual(3)
  })

  it('avoids back-to-back items from the same domain', () => {
    const domains: Domain[] = ['history', 'science', 'culture', 'geography', 'politics']
    const pools = emptyPools({
      spine: Array.from({ length: 15 }, (_, i) => makeConcept(`n${i}`, domains[i % domains.length]!)),
    })
    const { items } = assembleBatch(pools, freshFeedState(emptyWeights(0)), 10, mulberry32(7))
    let streaks = 0
    for (let i = 1; i < items.length; i++) {
      if (primaryConcept(items[i]!).domain === primaryConcept(items[i - 1]!).domain) streaks++
    }
    expect(streaks).toBe(0)
  })

  it('surfaces a deep-queue concept first (swipe-left "go deeper")', () => {
    const deep = makeConcept('deep-x', 'religions')
    const pools = emptyPools({
      spine: [makeConcept('other', 'history')],
      conceptById: new Map([[deep.id, deep]]),
    })
    const state = { ...freshFeedState(emptyWeights(0)), deepQueue: ['deep-x'] }
    const { items } = assembleBatch(pools, state, 1, mulberry32(3))
    expect(items[0]!.kind).toBe('concept')
    expect(primaryConcept(items[0]!).id).toBe('deep-x')
  })

  it('does not repeat a concept across a batch', () => {
    const pools = emptyPools({
      spine: Array.from({ length: 6 }, (_, i) => makeConcept(`n${i}`, (['a', 'b'] as unknown as Domain[])[i % 2]!)),
    })
    const { items } = assembleBatch(pools, freshFeedState(emptyWeights(0)), 6, mulberry32(9))
    const ids = items.map((it) => primaryConcept(it).id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
