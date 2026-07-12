import {
  db,
  type Concept,
  type Domain,
  type RelationType,
  type Review,
  type SwipeDirection,
} from '../db/schema'
import { connectionsFor } from './connections'
import { unlockedTiersFor } from './session'
import {
  WITHIN_BIAS,
  buildComplexityMap,
  complexityCeiling,
  computeAnchorsMet,
  conceptComplexity,
} from './gating'
import type { KnowledgeLevel, Prefs } from './settings'

/**
 * The infinite-feed recommender. Calm-personalized: swipe gestures nudge
 * per-topic interest weights, but the Spine (FSRS due reviews + pathway order)
 * always wins, a hard exploration floor keeps new topics surfacing, and weights
 * are never zeroed so discovery never collapses into a filter bubble.
 *
 * Pure functions (interestScore / applySwipeToWeights / pickDiscovery /
 * assembleBatch) carry the logic and are unit-tested without a DB. The DB
 * wrappers (loadInterest / nextFeedBatch / recordSwipe) just gather pools and
 * delegate.
 */

// ── Feed items ─────────────────────────────────────────────────────────────

export type FeedItem =
  | { kind: 'review'; key: string; concept: Concept }
  | { kind: 'concept'; key: string; concept: Concept; threadName: string | null }
  | { kind: 'connection'; key: string; from: Concept; to: Concept; relation: RelationType }

/** The primary concept an item is "about" (used for topic + deep-dive). */
export function primaryConcept(item: FeedItem): Concept {
  return item.kind === 'connection' ? item.from : item.concept
}

// ── Interest model ───────────────────────────────────────────────────────────

export interface InterestWeights {
  domains: Partial<Record<Domain, number>>
  eras: Record<string, number>
  threads: Record<string, number>
  updatedAt: number
}

export const WEIGHT_FLOOR = 0.25 // never zero -> discovery never stops
export const WEIGHT_CAP = 3.0
export const BOOST_FACTOR = 1.35 // swipe left: more / deeper
export const DECAY_FACTOR = 0.6 // swipe right: less of this
export const DWELL_SHORT_MS = 2500
export const DWELL_LONG_MS = 8000
export const DWELL_BORED_FACTOR = 0.92
export const DWELL_KEEN_FACTOR = 1.05
export const EXPLORE_EPSILON = 0.25 // share of discovery slots forced off-interest
export const REVIEW_CADENCE = 2 // a due review at most every (CADENCE+1) items

export function emptyWeights(now = Date.now()): InterestWeights {
  return { domains: {}, eras: {}, threads: {}, updatedAt: now }
}

function clampWeight(w: number): number {
  return Math.min(WEIGHT_CAP, Math.max(WEIGHT_FLOOR, w))
}

function readW(map: Record<string, number> | Partial<Record<string, number>>, key: string): number {
  const v = (map as Record<string, number>)[key]
  return v ?? 1
}

function mean(values: number[]): number {
  if (values.length === 0) return 1
  return values.reduce((a, b) => a + b, 0) / values.length
}

/** Multiplicative blend of a concept's domain / era / thread weights. */
export function interestScore(c: Concept, w: InterestWeights): number {
  const wd = readW(w.domains, c.domain)
  const we = mean(c.eras.map((e) => readW(w.eras, e)))
  const wt = mean(c.threads.map((t) => readW(w.threads, t)))
  return wd * we * wt
}

export interface Topic {
  domain: Domain | null
  eras: string[]
  threads: string[]
}

export function topicOf(item: FeedItem): Topic {
  const c = primaryConcept(item)
  return { domain: c.domain, eras: c.eras, threads: c.threads }
}

/**
 * Update interest weights from one swipe. Left/right move domain + eras +
 * threads; an up-swipe is a gentle dwell-based nudge on the domain only.
 */
export function applySwipeToWeights(
  w: InterestWeights,
  topic: Topic,
  direction: SwipeDirection,
  dwellMs: number,
  now = Date.now(),
): InterestWeights {
  const next: InterestWeights = {
    domains: { ...w.domains },
    eras: { ...w.eras },
    threads: { ...w.threads },
    updatedAt: now,
  }

  let factor = 1
  if (direction === 'left') factor = BOOST_FACTOR
  else if (direction === 'right') factor = DECAY_FACTOR
  else if (dwellMs < DWELL_SHORT_MS) factor = DWELL_BORED_FACTOR
  else if (dwellMs > DWELL_LONG_MS) factor = DWELL_KEEN_FACTOR

  if (factor === 1) return next

  if (topic.domain) {
    next.domains[topic.domain] = clampWeight(readW(next.domains, topic.domain) * factor)
  }
  // Explicit left/right also moves the finer era/thread axes; the implicit
  // up-swipe stays a coarse domain-only signal so it can't overfit.
  if (direction !== 'up') {
    for (const e of topic.eras) next.eras[e] = clampWeight(readW(next.eras, e) * factor)
    for (const t of topic.threads) next.threads[t] = clampWeight(readW(next.threads, t) * factor)
  }
  return next
}

// ── Discovery selection (explore vs exploit + diversity) ─────────────────────

export type Rng = () => number

/**
 * Choose one discovery concept. Diversity first (avoid repeating the previous
 * domain), then with probability EXPLORE_EPSILON force an off-interest pick
 * (a neutral/suppressed domain) so new topics keep arriving; otherwise sample
 * proportional to interestScore.
 */
export function pickDiscovery(
  candidates: Concept[],
  w: InterestWeights,
  recentDomains: Domain[],
  rng: Rng,
): Concept | null {
  if (candidates.length === 0) return null

  const last = recentDomains[recentDomains.length - 1]
  let pool = candidates.filter((c) => c.domain !== last)
  if (pool.length === 0) pool = candidates

  // Explore: uniform over neutral/suppressed-domain candidates (weight <= 1).
  if (rng() < EXPLORE_EPSILON) {
    const low = pool.filter((c) => readW(w.domains, c.domain) <= 1)
    const ex = low.length > 0 ? low : pool
    return ex[Math.floor(rng() * ex.length)] ?? null
  }

  // Exploit: weighted-by-interestScore sample.
  const scored = pool.map((c) => ({ c, s: Math.max(1e-6, interestScore(c, w)) }))
  const total = scored.reduce((a, b) => a + b.s, 0)
  let r = rng() * total
  for (const x of scored) {
    r -= x.s
    if (r <= 0) return x.c
  }
  return scored[scored.length - 1]!.c
}

// ── Batch assembly (pure) ────────────────────────────────────────────────────

export interface FeedPools {
  /** Met (firstSeenAt!=null) concepts whose review is due, ordered by urgency. */
  dueReviews: Concept[]
  /** Eligible unseen concepts in pathway/Spine order (then chronological). */
  spine: Concept[]
  /** Connection candidates among met concepts. */
  connections: { from: Concept; to: Concept; relation: RelationType }[]
  /** Lookup for resolving deep-queue ids. */
  conceptById: Map<string, Concept>
  /**
   * Knowledge-level soft gate (§4b). Present ONLY when a finite complexity
   * ceiling applies ('new' level, ceiling 1-2). When absent, takeDiscovery
   * MUST run today's exact codepath — including its rng call sequence — so
   * 'some'/'confident'/legacy behaviour stays bit-identical.
   */
  gate?: { ceiling: number; complexityById: Map<string, number> }
}

export interface FeedState {
  weights: InterestWeights
  shownConceptIds: Set<string>
  shownConnKeys: Set<string>
  recentDomains: Domain[]
  /** Concept ids to surface next (from swipe-left "go deeper"). */
  deepQueue: string[]
  /** Items emitted since the last review, for cadence. */
  sinceReview: number
}

export function freshFeedState(weights: InterestWeights): FeedState {
  return {
    weights,
    shownConceptIds: new Set(),
    shownConnKeys: new Set(),
    recentDomains: [],
    deepQueue: [],
    sinceReview: REVIEW_CADENCE, // allow an early review if a backlog exists
  }
}

function connKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`
}

function pushDomain(state: FeedState, d: Domain) {
  state.recentDomains.push(d)
  if (state.recentDomains.length > 4) state.recentDomains.shift()
}

/**
 * Build the next `count` feed items from the pools, mutating a copy of state.
 * Reviews flow in at a fixed cadence whenever a backlog exists (the Spine is
 * non-negotiable); the discovery slots honour the deep-queue, then explore /
 * exploit. Returns the items plus the advanced state.
 */
export function assembleBatch(
  pools: FeedPools,
  state: FeedState,
  count: number,
  rng: Rng,
): { items: FeedItem[]; state: FeedState } {
  const next: FeedState = {
    weights: state.weights,
    shownConceptIds: new Set(state.shownConceptIds),
    shownConnKeys: new Set(state.shownConnKeys),
    recentDomains: [...state.recentDomains],
    deepQueue: [...state.deepQueue],
    sinceReview: state.sinceReview,
  }

  const dueQueue = pools.dueReviews.filter((c) => !next.shownConceptIds.has(c.id))
  const items: FeedItem[] = []

  for (let i = 0; i < count; i++) {
    const reviewsLeft = dueQueue.findIndex((c) => !next.shownConceptIds.has(c.id)) !== -1
    const wantReview = reviewsLeft && next.sinceReview >= REVIEW_CADENCE

    let item: FeedItem | null = null

    if (wantReview) {
      item = takeReview(dueQueue, next)
      if (item) next.sinceReview = 0
    }

    if (!item) {
      item = takeDiscovery(pools, next, rng)
      if (item) next.sinceReview += 1
    }

    // Last resort: if discovery is exhausted but reviews remain, emit one.
    if (!item && reviewsLeft) {
      item = takeReview(dueQueue, next)
      if (item) next.sinceReview = 0
    }

    if (!item) break
    items.push(item)
  }

  return { items, state: next }
}

function takeReview(dueQueue: Concept[], state: FeedState): FeedItem | null {
  while (dueQueue.length > 0) {
    const c = dueQueue.shift()!
    if (state.shownConceptIds.has(c.id)) continue
    state.shownConceptIds.add(c.id)
    pushDomain(state, c.domain)
    return { kind: 'review', key: `review:${c.id}`, concept: c }
  }
  return null
}

function takeDiscovery(pools: FeedPools, state: FeedState, rng: Rng): FeedItem | null {
  // 1. Deep-queue (swipe-left response) — surface a boosted neighbour next.
  while (state.deepQueue.length > 0) {
    const id = state.deepQueue.shift()!
    if (state.shownConceptIds.has(id)) continue
    const c = pools.conceptById.get(id)
    if (!c) continue
    state.shownConceptIds.add(c.id)
    pushDomain(state, c.domain)
    return { kind: 'concept', key: `concept:${c.id}`, concept: c, threadName: null }
  }

  // 2. New concept from the Spine, reranked by interest + exploration.
  //
  //    Knowledge-level soft gate (§4b): when a finite ceiling applies, an
  //    80/20 coin restricts the candidate pool to within-ceiling concepts
  //    most of the time — foundations dominate, deep cards stay possible.
  //
  //      spinePool ──gate?──▶ within = cx(id) ≤ ceiling
  //         │                   │ non-empty & rng() < WITHIN_BIAS → within
  //         │                   └ else (spill / 20%)              → full pool
  //         └─ no gate: full pool, NO coin drawn — the ungated rng call
  //            sequence must stay byte-identical to the pre-gate app.
  //
  let spinePool = pools.spine.filter((c) => !state.shownConceptIds.has(c.id))
  const gate = pools.gate
  if (gate && Number.isFinite(gate.ceiling)) {
    const within = spinePool.filter(
      (c) => conceptComplexity(c.id, gate.complexityById) <= gate.ceiling,
    )
    if (within.length > 0 && rng() < WITHIN_BIAS) spinePool = within
  }
  const picked = pickDiscovery(spinePool, state.weights, state.recentDomains, rng)
  if (picked) {
    state.shownConceptIds.add(picked.id)
    pushDomain(state, picked.domain)
    return { kind: 'concept', key: `concept:${picked.id}`, concept: picked, threadName: null }
  }

  // 3. Fall back to a connection card (keeps the feed alive once unseen
  //    concepts are exhausted; connections may recycle).
  for (const conn of pools.connections) {
    const k = connKey(conn.from.id, conn.to.id)
    if (state.shownConnKeys.has(k)) continue
    state.shownConnKeys.add(k)
    pushDomain(state, conn.from.domain)
    return { kind: 'connection', key: `conn:${k}`, from: conn.from, to: conn.to, relation: conn.relation }
  }

  return null
}

// ── DB layer ─────────────────────────────────────────────────────────────────

const INTEREST_KEY = 'feed:interest:v1'

export async function loadInterest(): Promise<InterestWeights> {
  const row = await db.settings.get(INTEREST_KEY)
  return (row?.value as InterestWeights | undefined) ?? emptyWeights()
}

async function saveInterest(w: InterestWeights): Promise<void> {
  await db.settings.put({ key: INTEREST_KEY, value: w })
}

/**
 * Build the ordered discovery pool: unseen concepts whose tier is unlocked,
 * in pathway order, then any remaining unseen chronologically as a safety
 * net. Pure (no DB) so the 'some'-identity proof covers pool construction,
 * not just batch assembly.
 */
export function buildSpinePool(
  threads: { members: { conceptId: string; tier: number }[] }[],
  allConcepts: Concept[],
  conceptById: Map<string, Concept>,
  reviewByConcept: Map<string, Review>,
  level: KnowledgeLevel = 'some',
): Concept[] {
  const spine: Concept[] = []
  const inSpine = new Set<string>()
  for (const thread of threads) {
    const unlocked = unlockedTiersFor(level, thread.members, conceptById, reviewByConcept)
    const tierByConcept = new Map(thread.members.map((m) => [m.conceptId, m.tier]))
    const ordered = thread.members
      .map((m) => conceptById.get(m.conceptId))
      .filter(
        (c): c is Concept =>
          !!c && c.firstSeenAt === null && !inSpine.has(c.id) && unlocked.has(tierByConcept.get(c.id) ?? 1),
      )
    for (const c of ordered) {
      inSpine.add(c.id)
      spine.push(c)
    }
  }
  const chrono = allConcepts
    .filter((c) => c.firstSeenAt === null && !inSpine.has(c.id))
    .sort((a, b) => (a.approxYear ?? Infinity) - (b.approxYear ?? Infinity))
  for (const c of chrono) spine.push(c)
  return spine
}

/** Gather the live pools, then assemble. Threads/tiers mirror the daily Spine. */
export async function gatherPools(now = Date.now(), prefs?: Prefs): Promise<FeedPools> {
  const allConcepts = await db.concepts.toArray()
  const conceptById = new Map(allConcepts.map((c) => [c.id, c]))
  const allReviews = await db.reviews.toArray()
  const reviewByConcept = new Map<string, Review>(allReviews.map((r) => [r.conceptId, r]))

  // Due reviews: met concepts only, soonest-due first.
  const dueReviews = allReviews
    .filter((r) => r.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt)
    .map((r) => conceptById.get(r.conceptId))
    .filter((c): c is Concept => !!c && c.firstSeenAt !== null)

  const threads = await db.threads.orderBy('displayOrder').toArray()
  const level = prefs?.knowledgeLevel ?? 'some'
  const spine = buildSpinePool(threads, allConcepts, conceptById, reviewByConcept, level)

  // Knowledge-level soft gate (§4b): attach only when a finite ceiling
  // applies, so the ungated assembly path stays bit-identical.
  let gate: FeedPools['gate']
  if (level === 'new') {
    const ceiling = complexityCeiling(
      'new',
      computeAnchorsMet(threads, conceptById, reviewByConcept),
    )
    if (Number.isFinite(ceiling)) {
      gate = { ceiling, complexityById: buildComplexityMap(threads) }
    }
  }

  // Connections among met concepts.
  const metIds = new Set(allConcepts.filter((c) => c.firstSeenAt !== null).map((c) => c.id))
  const edges = await db.edges.toArray()
  const connections: FeedPools['connections'] = []
  const seenConn = new Set<string>()
  for (const e of edges) {
    if (!metIds.has(e.fromId) || !metIds.has(e.toId)) continue
    const k = connKey(e.fromId, e.toId)
    if (seenConn.has(k)) continue
    const from = conceptById.get(e.fromId)
    const to = conceptById.get(e.toId)
    if (!from || !to) continue
    seenConn.add(k)
    connections.push({ from, to, relation: e.relation })
  }

  const pools: FeedPools = { dueReviews, spine, connections, conceptById }
  if (gate) pools.gate = gate
  return pools
}

/**
 * Produce the next batch of feed items, advancing state in place. When prefs
 * are provided the knowledge-level gate applies; `gateStage` reports the
 * user-facing stage (1 foundations · 2 mid · 3 open) for 'new'-level users,
 * null otherwise — FeedView uses it for the gate pill + unlock moment.
 */
export async function nextFeedBatch(
  state: FeedState,
  count: number,
  rng: Rng = Math.random,
  now = Date.now(),
  prefs?: Prefs,
): Promise<{ items: FeedItem[]; state: FeedState; gateStage: 1 | 2 | 3 | null }> {
  const pools = await gatherPools(now, prefs)
  const batch = assembleBatch(pools, state, count, rng)
  let stage: 1 | 2 | 3 | null = null
  if (prefs?.knowledgeLevel === 'new') {
    if (pools.gate) {
      stage = pools.gate.ceiling === 1 ? 1 : 2
    } else {
      stage = 3
    }
  }
  return { ...batch, gateStage: stage }
}

// ── Gate pill acknowledgment (one-shot "deeper waters" moment) ──────────────

const CEILING_ACK_KEY = 'gate:ceilingAck'

/** Highest gate stage the user has been shown an unlock moment for (default 1). */
export async function loadCeilingAck(): Promise<number> {
  const row = await db.settings.get(CEILING_ACK_KEY)
  const v = row?.value
  return typeof v === 'number' && v >= 1 ? v : 1
}

export async function saveCeilingAck(stage: number): Promise<void> {
  await db.settings.put({ key: CEILING_ACK_KEY, value: stage })
}

/**
 * Record a swipe: update + persist interest weights, log the event, and on a
 * left-swipe queue the item's graph neighbours so "go deeper" is immediate.
 * Returns the advanced state.
 */
export async function recordSwipe(
  item: FeedItem,
  direction: SwipeDirection,
  dwellMs: number,
  state: FeedState,
  now = Date.now(),
): Promise<FeedState> {
  const topic = topicOf(item)
  const weights = applySwipeToWeights(state.weights, topic, direction, dwellMs, now)
  await saveInterest(weights)
  await db.feedEvents.add({
    itemKey: item.key,
    topicDomain: topic.domain,
    direction,
    dwellMs,
    at: now,
  })

  let deepQueue = state.deepQueue
  if (direction === 'left') {
    const hits = await connectionsFor(primaryConcept(item).id, 4)
    const ids = hits.map((h) => h.concept.id)
    deepQueue = [...ids, ...deepQueue.filter((d) => !ids.includes(d))].slice(0, 12)
  }

  return { ...state, weights, deepQueue }
}
