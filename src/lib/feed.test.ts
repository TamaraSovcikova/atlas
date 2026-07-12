import { describe, expect, it } from 'vitest'
import type { Concept, Domain } from '../db/schema'
import {
  applySwipeToWeights,
  assembleBatch,
  buildSpinePool,
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

// ── Knowledge-level soft gate (§4b) ──────────────────────────────────────────

describe('knowledge-level soft gate', () => {
  const DOMAINS: Domain[] = ['history', 'science', 'culture', 'geography', 'politics']
  const mixedSpine = (n: number, prefix = 'n') =>
    Array.from({ length: n }, (_, i) => makeConcept(`${prefix}${i}`, DOMAINS[i % DOMAINS.length]!))

  /** Run `batches` sequential batches on ONE rng stream, chaining state. */
  function runChained(pools: FeedPools, seed: number, batches = 3, perBatch = 3) {
    const rng = mulberry32(seed)
    let state = freshFeedState(emptyWeights(0))
    const keys: string[] = []
    for (let b = 0; b < batches; b++) {
      const res = assembleBatch(pools, state, perBatch, rng)
      state = res.state
      keys.push(...res.items.map((it) => it.key))
    }
    return { keys, state }
  }

  it("REGRESSION ('some' bit-identity): absent gate and non-finite gate produce " +
     'identical items AND state across chained batches, many seeds', () => {
    const spine = mixedSpine(12)
    const ungated = emptyPools({ spine })
    const infiniteGate = emptyPools({
      spine,
      gate: { ceiling: Infinity, complexityById: new Map() },
    })
    for (let seed = 0; seed < 20; seed++) {
      const a = runChained(ungated, seed)
      const b = runChained(infiniteGate, seed)
      // Identical picks in identical order ⇒ the coin was never drawn on the
      // ungated path (an unconditional rng() would shift every later pick).
      expect(b.keys).toEqual(a.keys)
      expect([...b.state.shownConceptIds].sort()).toEqual([...a.state.shownConceptIds].sort())
      expect(b.state.recentDomains).toEqual(a.state.recentDomains)
    }
  })

  it('gated picks consume exactly one extra rng draw per discovery pick', () => {
    const spine = mixedSpine(12)
    const complexityById = new Map(spine.map((c) => [c.id, 1]))
    const count = (pools: FeedPools) => {
      let draws = 0
      const rng = mulberry32(5)
      const counting = () => {
        draws++
        return rng()
      }
      assembleBatch(pools, freshFeedState(emptyWeights(0)), 4, counting)
      return draws
    }
    const base = count(emptyPools({ spine }))
    const gated = count(emptyPools({ spine, gate: { ceiling: 1, complexityById } }))
    expect(gated).toBe(base + 4) // one coin per pick, everything within-ceiling
  })

  it('foundations dominate ~WITHIN_BIAS of picks but deep cards still arrive', () => {
    // 5 within-ceiling + 5 beyond, equal weights. Expected within share is
    // ≈ 0.8 + 0.2·(within share of the full pool) ≈ 0.9.
    const within = mixedSpine(5, 'w')
    const beyond = mixedSpine(5, 'd')
    const complexityById = new Map<string, number>([
      ...within.map((c): [string, number] => [c.id, 1]),
      ...beyond.map((c): [string, number] => [c.id, 3]),
    ])
    const pools = emptyPools({
      spine: [...within, ...beyond],
      gate: { ceiling: 1, complexityById },
    })
    const rng = mulberry32(1234)
    let withinCount = 0
    const N = 2000
    for (let i = 0; i < N; i++) {
      const { items } = assembleBatch(pools, freshFeedState(emptyWeights(0)), 1, rng)
      if (items[0]!.key.includes(':w')) withinCount++
    }
    const frac = withinCount / N
    expect(frac).toBeGreaterThan(0.8)
    expect(frac).toBeLessThan(0.97)
    expect(N - withinCount).toBeGreaterThan(0) // never a hard filter
  })

  it('spills to the full pool when nothing within-ceiling remains (fresh-install path)', () => {
    const spine = mixedSpine(6)
    const complexityById = new Map(spine.map((c) => [c.id, 3]))
    const pools = emptyPools({ spine, gate: { ceiling: 1, complexityById } })
    const { items } = assembleBatch(pools, freshFeedState(emptyWeights(0)), 3, mulberry32(2))
    expect(items).toHaveLength(3) // a dead feed is worse than a deep card
  })

  it('no duplicates when the gate flips between batches (level flap)', () => {
    const spine = mixedSpine(10)
    const complexityById = new Map(spine.map((c, i) => [c.id, i % 2 === 0 ? 1 : 3]))
    const rng = mulberry32(77)
    const gated = emptyPools({ spine, gate: { ceiling: 1, complexityById } })
    const first = assembleBatch(gated, freshFeedState(emptyWeights(0)), 4, rng)
    const second = assembleBatch(emptyPools({ spine }), first.state, 4, rng)
    const keys = [...first.items, ...second.items].map((it) => it.key)
    expect(new Set(keys).size).toBe(keys.length)
  })
})

describe('buildSpinePool', () => {
  const thread = {
    members: [
      { conceptId: 'deep', tier: 2 },
      { conceptId: 'anchor', tier: 1 },
    ],
  }
  const anchor = makeConcept('anchor', 'history')
  const deep = makeConcept('deep', 'science', { approxYear: 100 })
  const conceptById = new Map([
    ['anchor', anchor],
    ['deep', deep],
  ])

  it("'some': locked tiers enter via the chrono net (order: unlocked first)", () => {
    const pool = buildSpinePool([thread], [anchor, deep], conceptById, new Map(), 'some')
    expect(pool.map((c) => c.id)).toEqual(['anchor', 'deep'])
  })

  it("default level is 'some' (identity)", () => {
    const explicit = buildSpinePool([thread], [anchor, deep], conceptById, new Map(), 'some')
    const implicit = buildSpinePool([thread], [anchor, deep], conceptById, new Map())
    expect(implicit).toEqual(explicit)
  })

  it("'confident' serves the thread's own order — tier 2 may lead", () => {
    const pool = buildSpinePool([thread], [anchor, deep], conceptById, new Map(), 'confident')
    expect(pool.map((c) => c.id)).toEqual(['deep', 'anchor'])
  })
})
