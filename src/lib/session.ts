import {
  db,
  type Concept,
  type Domain,
  type Lesson,
  type RecallQuestion,
  type Review,
  type SessionShape,
} from '../db/schema'
import { shouldShowMcqFallback } from './fsrs'
import { resolvePolicy, type Policy, type Prefs } from './settings'
import { masteryOf, masterySpread, type MasteryLevel } from './mastery'

export interface RecallItem {
  kind: 'recall'
  cardKey: string
  concept: Concept
  lesson: Lesson
  question: RecallQuestion
  review: Review
  isNew: boolean
  isFallback: boolean
}

export interface OrderEntry {
  concept: Concept
  review: Review
}

export interface OrderItem {
  kind: 'order'
  cardKey: string
  entries: OrderEntry[]
}

export interface SortBucket {
  id: string
  label: string
}

export interface SortEntry {
  concept: Concept
  review: Review
  bucketId: string
}

export interface SortItem {
  kind: 'sort'
  cardKey: string
  buckets: SortBucket[]
  entries: SortEntry[]
}

export type SessionItem = RecallItem | OrderItem | SortItem

export interface SessionPlan {
  items: SessionItem[]
  newCount: number
  reviewCount: number
  shape: SessionShape
  eraId: string | null
  domain: Domain | null
  threadId: string | null
}

export const DEFAULT_NEW_PER_DOMAIN = 1
export const DEFAULT_MAX_CARDS = 20

const DOMAINS: Domain[] = [
  'history',
  'geography',
  'politics',
  'religions',
  'culture',
  'science',
  'modern_world',
]

export const DOMAIN_LABEL: Record<Domain, string> = {
  history: 'History',
  geography: 'Geography',
  politics: 'Politics',
  religions: 'Religions',
  culture: 'Culture',
  science: 'Science',
  modern_world: 'Modern world',
}

export function interleave(cards: RecallItem[]): RecallItem[] {
  if (cards.length <= 1) return cards
  const buckets = new Map<Domain, RecallItem[]>()
  for (const c of cards) {
    const list = buckets.get(c.concept.domain) ?? []
    list.push(c)
    buckets.set(c.concept.domain, list)
  }
  const out: RecallItem[] = []
  let lastDomain: Domain | null = null
  while (out.length < cards.length) {
    let picked: RecallItem | null = null
    for (const domain of DOMAINS) {
      if (domain === lastDomain) continue
      const list = buckets.get(domain)
      if (list && list.length > 0) {
        picked = list.shift()!
        break
      }
    }
    if (!picked) {
      for (const list of buckets.values()) {
        if (list.length > 0) {
          picked = list.shift()!
          break
        }
      }
    }
    if (!picked) break
    out.push(picked)
    lastDomain = picked.concept.domain
  }
  return out
}

function hashString(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0
  }
  return h
}

function isNumeric(s: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(s.trim())
}

export async function buildMcqDistractors(
  conceptId: string,
  domain: Domain,
  count = 3,
): Promise<string[]> {
  const candidates = await db.concepts
    .where('domain')
    .equals(domain)
    .filter((c) => c.id !== conceptId)
    .toArray()
  let pool = candidates
  if (pool.length < count) {
    const extra = await db.concepts.filter((c) => c.id !== conceptId && c.domain !== domain).toArray()
    pool = [...pool, ...extra]
  }
  const shuffled = pool
    .map((c) => ({ c, k: hashString(c.id + ':' + conceptId) }))
    .sort((a, b) => a.k - b.k)
    .map(({ c }) => c.name)
  return shuffled.slice(0, count)
}

async function synthChipDistractors(concept: Concept, answer: string, count = 3): Promise<string[]> {
  if (isNumeric(answer)) {
    const base = parseInt(answer, 10)
    const deltas = [-3, 5, -11, 14, -7]
    const out: string[] = []
    for (const d of deltas) {
      const v = String(base + d)
      if (v !== answer && !out.includes(v)) out.push(v)
      if (out.length >= count) break
    }
    return out
  }
  const lessons = await db.lessons.toArray()
  const sameDomainIds = new Set(
    (await db.concepts.where('domain').equals(concept.domain).toArray()).map((c) => c.id),
  )
  const words: string[] = []
  const ordered = [...lessons].sort((a, b) => {
    const aw = sameDomainIds.has(a.conceptId) ? 0 : 1
    const bw = sameDomainIds.has(b.conceptId) ? 0 : 1
    return aw - bw
  })
  for (const lesson of ordered) {
    for (const q of lesson.recallQuestions) {
      if (q.format !== 'cloze') continue
      const a = q.expectedAnswer
      if (isNumeric(a)) continue
      if (a.toLowerCase() === answer.toLowerCase()) continue
      if (!words.some((w) => w.toLowerCase() === a.toLowerCase())) words.push(a)
    }
  }
  return words.slice(0, count)
}

function findByFormat(qs: RecallQuestion[], fmt: RecallQuestion['format']): RecallQuestion | undefined {
  return qs.find((q) => q.format === fmt)
}

/**
 * Pick the format for a card. Variety is driven by the card's POSITION in the
 * session (rotationIndex), not by review maturity, so a brand-new user still
 * sees a mix of chips, contrast, and map from the very first session. The mix
 * is deterministic per session so it does not reshuffle on re-render.
 */
async function chooseQuestion(
  policy: Policy,
  isNew: boolean,
  review: Review,
  lesson: Lesson,
  concept: Concept,
  rotationIndex: number,
): Promise<{ question: RecallQuestion; isFallback: boolean }> {
  const qs = lesson.recallQuestions
  const clozeQ = findByFormat(qs, 'cloze') ?? qs[0]!
  const contrastQ = findByFormat(qs, 'contrast')
  const freeQ = findByFormat(qs, 'free')

  // Repeatedly-failed fallback: drop to a tap-the-answer contrast card.
  if (shouldShowMcqFallback(review) && policy.contrast) {
    if (contrastQ) return { question: contrastQ, isFallback: true }
    const distractors = await buildMcqDistractors(concept.id, concept.domain, 3)
    return {
      question: {
        format: 'contrast',
        prompt: 'Which concept matches the brief above?',
        expectedAnswer: concept.name,
        distractors,
      },
      isFallback: true,
    }
  }

  // A brand-new concept always opens with its brief. In serious mode that means
  // typed free-recall. Otherwise alternate chips and contrast (both show the
  // brief) so even an all-new first session is not wall-to-wall fill-in-blank.
  if (isNew) {
    if (policy.newConceptFormat === 'free' && freeQ) {
      return { question: freeQ, isFallback: false }
    }
    if (policy.contrast && contrastQ && rotationIndex % 2 === 1) {
      return { question: contrastQ, isFallback: false }
    }
    return { question: await toClozeChips(clozeQ, concept, policy), isFallback: false }
  }

  // For review cards, rotate through the available formats by session position.
  // Build the menu of what THIS concept can offer, then pick by index so the
  // session as a whole is varied even when every card is freshly seen.
  const canMap = policy.games.map && concept.lat !== null && concept.lng !== null
  const canContrast = policy.contrast && !!contrastQ
  const menu: Array<'chips' | 'contrast' | 'map'> = ['chips']
  if (canContrast) menu.push('contrast')
  if (canMap) menu.push('map')

  const choice = menu[rotationIndex % menu.length]!
  if (choice === 'contrast' && contrastQ) {
    return { question: contrastQ, isFallback: false }
  }
  if (choice === 'map') {
    return {
      question: {
        format: 'map',
        prompt: `Where is ${concept.name}?`,
        expectedAnswer: concept.name,
      },
      isFallback: false,
    }
  }
  return { question: await toClozeChips(clozeQ, concept, policy), isFallback: false }
}

async function toClozeChips(
  clozeQ: RecallQuestion,
  concept: Concept,
  policy: Policy,
): Promise<RecallQuestion> {
  if (!policy.clozeChips) {
    return { ...clozeQ, format: 'cloze' }
  }
  const chips = clozeQ.chipDistractors ?? (await synthChipDistractors(concept, clozeQ.expectedAnswer, 3))
  return { ...clozeQ, format: 'cloze_chips', chipDistractors: chips }
}

async function makeRecallItem(
  concept: Concept,
  review: Review,
  isNew: boolean,
  policy: Policy,
  prefix: string,
  rotationIndex: number,
): Promise<RecallItem | null> {
  if (!concept.lessonId) return null
  const lesson = await db.lessons.get(concept.lessonId)
  if (!lesson || lesson.recallQuestions.length === 0) return null
  const { question, isFallback } = await chooseQuestion(
    policy,
    isNew,
    review,
    lesson,
    concept,
    rotationIndex,
  )
  return {
    kind: 'recall',
    cardKey: `${prefix}:${concept.id}`,
    concept,
    lesson,
    question,
    review,
    isNew,
    isFallback,
  }
}

function injectGames(recall: RecallItem[], policy: Policy): SessionItem[] {
  let items: SessionItem[] = interleave(recall)
  // Games draw from the whole session pool, new concepts included. Order and
  // sort cards reveal the correct answer with feedback, so they teach even a
  // first-seen concept, and this guarantees variety from session one.
  const poolItems = recall

  if (policy.games.order) {
    const seenYears = new Set<number>()
    const datable: RecallItem[] = []
    for (const r of poolItems) {
      if (r.concept.approxYear === null) continue
      if (seenYears.has(r.concept.approxYear)) continue
      seenYears.add(r.concept.approxYear)
      datable.push(r)
    }
    if (datable.length >= 3) {
      const chosen = datable.slice(0, 4)
      const chosenIds = new Set(chosen.map((c) => c.concept.id))
      items = items.filter((it) => it.kind !== 'recall' || !chosenIds.has(it.concept.id))
      const orderItem: OrderItem = {
        kind: 'order',
        cardKey: `order:${chosen.map((c) => c.concept.id).join('-')}`,
        entries: chosen.map((c) => ({ concept: c.concept, review: c.review })),
      }
      items.splice(Math.min(2, items.length), 0, orderItem)
    }
  }

  if (policy.games.sort) {
    const remaining = items.filter(
      (it): it is RecallItem => it.kind === 'recall',
    )
    const byDomain = new Map<Domain, RecallItem[]>()
    for (const r of remaining) {
      const list = byDomain.get(r.concept.domain) ?? []
      list.push(r)
      byDomain.set(r.concept.domain, list)
    }
    const domainsWithItems = [...byDomain.keys()]
    if (domainsWithItems.length >= 2) {
      const pickDomains = domainsWithItems.slice(0, 3)
      const entries: SortEntry[] = []
      // one from each picked domain, then top up from the first
      for (const d of pickDomains) {
        const first = byDomain.get(d)![0]!
        entries.push({ concept: first.concept, review: first.review, bucketId: d })
      }
      const firstDomainList = byDomain.get(pickDomains[0]!)!
      if (firstDomainList.length > 1 && entries.length < 4) {
        const second = firstDomainList[1]!
        entries.push({ concept: second.concept, review: second.review, bucketId: pickDomains[0]! })
      }
      if (entries.length >= 3) {
        const ids = new Set(entries.map((e) => e.concept.id))
        items = items.filter((it) => it.kind !== 'recall' || !ids.has(it.concept.id))
        const buckets: SortBucket[] = pickDomains.map((d) => ({ id: d, label: DOMAIN_LABEL[d] }))
        items.push({ kind: 'sort', cardKey: `sort:${[...ids].join('-')}`, buckets, entries })
      }
    }
  }

  return items
}

function countPlan(
  items: SessionItem[],
  shape: SessionShape,
  eraId: string | null,
  domain: Domain | null,
  threadId: string | null = null,
): SessionPlan {
  let newCount = 0
  let reviewCount = 0
  for (const it of items) {
    if (it.kind === 'recall') {
      if (it.isNew) newCount++
      else reviewCount++
    } else if (it.kind === 'order') {
      reviewCount += it.entries.length
    } else {
      reviewCount += it.entries.length
    }
  }
  return { items, newCount, reviewCount, shape, eraId, domain, threadId }
}

export interface BuildOptions {
  newPerDomain?: number
  maxCards?: number
  maxNew?: number
}

export async function buildEraSession(
  eraId: string,
  prefs: Prefs,
  now = Date.now(),
  options: BuildOptions = {},
): Promise<SessionPlan> {
  const policy = resolvePolicy(prefs)
  const newPerDomain = options.newPerDomain ?? DEFAULT_NEW_PER_DOMAIN
  const maxCards = options.maxCards ?? DEFAULT_MAX_CARDS

  const eraConcepts = await db.concepts.where('eras').equals(eraId).toArray()
  const eraIds = new Set(eraConcepts.map((c) => c.id))
  const recall: RecallItem[] = []

  let rot = 0
  const dueReviews = await db.reviews.where('dueAt').belowOrEqual(now).toArray()
  for (const review of dueReviews) {
    if (!eraIds.has(review.conceptId)) continue
    const concept = eraConcepts.find((c) => c.id === review.conceptId)
    if (!concept) continue
    const isNew = concept.firstSeenAt === null
    const item = await makeRecallItem(concept, review, isNew, policy, 'review', rot++)
    if (item) recall.push(item)
  }

  const perDomain: Record<string, number> = {}
  for (const concept of eraConcepts) {
    if (concept.firstSeenAt !== null) continue
    perDomain[concept.domain] = (perDomain[concept.domain] ?? 0) + 1
    if (perDomain[concept.domain]! > newPerDomain) continue
    if (recall.some((c) => c.concept.id === concept.id)) continue
    const review = await db.reviews.where('conceptId').equals(concept.id).first()
    if (!review) continue
    const item = await makeRecallItem(concept, review, true, policy, 'new', rot++)
    if (item) recall.push(item)
  }

  const limited = recall.slice(0, maxCards)
  const items = injectGames(limited, policy)
  return countPlan(items, 'era', eraId, null)
}

export async function buildDomainSession(
  domain: Domain,
  prefs: Prefs,
  now = Date.now(),
  options: BuildOptions = {},
): Promise<SessionPlan> {
  const policy = resolvePolicy(prefs)
  const maxCards = options.maxCards ?? DEFAULT_MAX_CARDS
  const maxNew = options.maxNew ?? 3

  const concepts = await db.concepts.where('domain').equals(domain).toArray()
  const recall: RecallItem[] = []

  let rot = 0
  const dueReviews = await db.reviews.where('dueAt').belowOrEqual(now).toArray()
  for (const review of dueReviews) {
    const concept = concepts.find((c) => c.id === review.conceptId)
    if (!concept) continue
    const item = await makeRecallItem(concept, review, concept.firstSeenAt === null, policy, 'review', rot++)
    if (item) recall.push(item)
  }

  let added = 0
  const sortedByYear = [...concepts].sort(
    (a, b) => (a.approxYear ?? Infinity) - (b.approxYear ?? Infinity),
  )
  for (const concept of sortedByYear) {
    if (added >= maxNew) break
    if (concept.firstSeenAt !== null) continue
    if (recall.some((c) => c.concept.id === concept.id)) continue
    const review = await db.reviews.where('conceptId').equals(concept.id).first()
    if (!review) continue
    const item = await makeRecallItem(concept, review, true, policy, 'new', rot++)
    if (item) {
      recall.push(item)
      added++
    }
  }

  // Domain Deep-Dive stays chronological rather than interleaved.
  recall.sort((a, b) => (a.concept.approxYear ?? Infinity) - (b.concept.approxYear ?? Infinity))
  const limited = recall.slice(0, maxCards)
  // Order game fits a single-domain chronological session especially well.
  const items = injectGames(limited, { ...policy, games: { ...policy.games, sort: false } })
  return countPlan(items, 'domain', null, domain)
}

export async function buildSpacedSession(
  prefs: Prefs,
  now = Date.now(),
  options: BuildOptions = {},
): Promise<SessionPlan> {
  const policy = resolvePolicy(prefs)
  const maxCards = options.maxCards ?? DEFAULT_MAX_CARDS
  const recall: RecallItem[] = []
  let rot = 0
  const dueReviews = await db.reviews.where('dueAt').belowOrEqual(now).toArray()
  for (const review of dueReviews) {
    const concept = await db.concepts.get(review.conceptId)
    if (!concept) continue
    const isNew = concept.firstSeenAt === null
    const item = await makeRecallItem(concept, review, isNew, policy, 'review', rot++)
    if (item) recall.push(item)
  }
  const limited = recall.slice(0, maxCards)
  const items = injectGames(limited, policy)
  return countPlan(items, 'spaced', null, null)
}

/**
 * The Spine: one composed daily session, so "Begin today" never makes the user
 * choose a shape. Due reviews across the whole graph come first, then a small
 * number of new concepts drawn from the narrative threads in pathway order
 * (tier-gated, skeleton before detail), falling back to chronological new
 * concepts if the threads have nothing unlocked. The result is interleaved by
 * domain and games are injected, exactly like the other shapes.
 */
export async function buildDailySession(
  prefs: Prefs,
  now = Date.now(),
  options: BuildOptions = {},
): Promise<SessionPlan> {
  const policy = resolvePolicy(prefs)
  const maxCards = options.maxCards ?? DEFAULT_MAX_CARDS
  const maxNew = options.maxNew ?? 4

  const allConcepts = await db.concepts.toArray()
  const conceptById = new Map(allConcepts.map((c) => [c.id, c]))
  const allReviews = await db.reviews.toArray()
  const reviewByConcept = new Map(allReviews.map((r) => [r.conceptId, r]))

  const recall: RecallItem[] = []
  const usedIds = new Set<string>()
  let rot = 0

  // 1. Due reviews across everything (already-seen concepts only).
  const due = allReviews
    .filter((r) => r.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt)
  for (const review of due) {
    const concept = conceptById.get(review.conceptId)
    if (!concept || concept.firstSeenAt === null) continue
    if (usedIds.has(concept.id)) continue
    const item = await makeRecallItem(concept, review, false, policy, 'review', rot++)
    if (item) {
      recall.push(item)
      usedIds.add(concept.id)
    }
  }

  // 2. New concepts from threads in pathway (displayOrder), tier-gated.
  const threads = await db.threads.orderBy('displayOrder').toArray()
  const newItems: RecallItem[] = []
  for (const thread of threads) {
    if (newItems.length >= maxNew) break
    const unlocked = computeUnlockedTiers(thread.members, conceptById, reviewByConcept)
    const tierByConcept = new Map(thread.members.map((m) => [m.conceptId, m.tier]))
    const fresh = thread.members
      .map((m) => conceptById.get(m.conceptId))
      .filter(
        (c): c is Concept =>
          !!c &&
          c.firstSeenAt === null &&
          !usedIds.has(c.id) &&
          unlocked.has(tierByConcept.get(c.id) ?? 1),
      )
      .sort((a, b) => {
        const ta = tierByConcept.get(a.id) ?? 1
        const tb = tierByConcept.get(b.id) ?? 1
        if (ta !== tb) return ta - tb
        return (a.approxYear ?? Infinity) - (b.approxYear ?? Infinity)
      })
    for (const concept of fresh) {
      if (newItems.length >= maxNew) break
      const review = reviewByConcept.get(concept.id)
      if (!review) continue
      const item = await makeRecallItem(concept, review, true, policy, 'new', rot++)
      if (item) {
        newItems.push(item)
        usedIds.add(concept.id)
      }
    }
  }

  // 3. Fallback: chronological new from anywhere, if threads gave too few.
  if (newItems.length < maxNew) {
    const chrono = allConcepts
      .filter((c) => c.firstSeenAt === null && !usedIds.has(c.id))
      .sort((a, b) => (a.approxYear ?? Infinity) - (b.approxYear ?? Infinity))
    for (const concept of chrono) {
      if (newItems.length >= maxNew) break
      const review = reviewByConcept.get(concept.id)
      if (!review) continue
      const item = await makeRecallItem(concept, review, true, policy, 'new', rot++)
      if (item) {
        newItems.push(item)
        usedIds.add(concept.id)
      }
    }
  }

  const combined = [...recall, ...newItems].slice(0, maxCards)
  const items = injectGames(combined, policy)
  return countPlan(items, 'daily', null, null)
}

/**
 * Walk a narrative thread. Due reviews from the thread come first; new concepts
 * are introduced tier-ascending then chronologically, so the skeleton (tier-1
 * anchors) is taught before the detail (tiers 2-3) that fills in between them.
 * The whole session is ordered chronologically -- a thread is a timeline.
 */
export async function buildThreadSession(
  threadId: string,
  prefs: Prefs,
  now = Date.now(),
  options: BuildOptions = {},
): Promise<SessionPlan> {
  const policy = resolvePolicy(prefs)
  const maxCards = options.maxCards ?? DEFAULT_MAX_CARDS
  const maxNew = options.maxNew ?? 4

  const thread = await db.threads.get(threadId)
  if (!thread) return countPlan([], 'thread', null, null, threadId)

  const tierByConcept = new Map(thread.members.map((m) => [m.conceptId, m.tier]))
  const memberIds = thread.members.map((m) => m.conceptId)
  const concepts = (await db.concepts.bulkGet(memberIds)).filter(
    (c): c is Concept => c !== undefined,
  )
  const byId = new Map(concepts.map((c) => [c.id, c]))

  // Preload all reviews for thread members so we can gate tier unlocks without
  // extra round-trips. This includes non-due reviews (stability check).
  const allMemberReviews = await db.reviews.where('conceptId').anyOf(memberIds).toArray()
  const allReviewByConcept = new Map(allMemberReviews.map((r) => [r.conceptId, r]))
  const unlockedTiers = computeUnlockedTiers(thread.members, byId, allReviewByConcept)

  const recall: RecallItem[] = []
  let rot = 0

  // Due reviews: no tier gate — keep reviewing concepts already introduced.
  const dueReviews = await db.reviews.where('dueAt').belowOrEqual(now).toArray()
  for (const review of dueReviews) {
    const concept = byId.get(review.conceptId)
    if (!concept || concept.firstSeenAt === null) continue
    const item = await makeRecallItem(concept, review, false, policy, 'review', rot++)
    if (item) recall.push(item)
  }

  // Introduce new concepts: unlocked tiers only, then tier ascending, then chronological.
  const fresh = concepts
    .filter((c) => {
      if (c.firstSeenAt !== null) return false
      if (recall.some((r) => r.concept.id === c.id)) return false
      return unlockedTiers.has(tierByConcept.get(c.id) ?? 1)
    })
    .sort((a, b) => {
      const ta = tierByConcept.get(a.id) ?? 1
      const tb = tierByConcept.get(b.id) ?? 1
      if (ta !== tb) return ta - tb
      return (a.approxYear ?? Infinity) - (b.approxYear ?? Infinity)
    })
  let added = 0
  for (const concept of fresh) {
    if (added >= maxNew) break
    const review = await db.reviews.where('conceptId').equals(concept.id).first()
    if (!review) continue
    const item = await makeRecallItem(concept, review, true, policy, 'new', rot++)
    if (item) {
      recall.push(item)
      added++
    }
  }

  // A thread is a timeline: present chronologically, not interleaved.
  recall.sort((a, b) => (a.concept.approxYear ?? Infinity) - (b.concept.approxYear ?? Infinity))
  const limited = recall.slice(0, maxCards)
  const items = injectGames(limited, { ...policy, games: { ...policy.games, sort: false } })
  return countPlan(items, 'thread', null, null, threadId)
}

/** Minimum FSRS stability (days) a tier must reach before the next tier unlocks. */
export const TIER_STABILITY_GATE = 7.0

/**
 * Compute which tiers are unlocked for a thread given the current concept and
 * review state. Tier 1 is always unlocked; tier N+1 unlocks once all tier-N
 * concepts have been seen AND each has stability >= TIER_STABILITY_GATE.
 * Uses preloaded maps to avoid extra DB round-trips.
 */
function computeUnlockedTiers(
  members: { conceptId: string; tier: number }[],
  conceptById: Map<string, Concept>,
  reviewByConcept: Map<string, Review>,
): Set<number> {
  const maxTier = members.reduce((m, x) => Math.max(m, x.tier), 1)
  const unlocked = new Set<number>([1])

  for (let t = 1; t < maxTier; t++) {
    const tierMembers = members.filter((m) => m.tier === t)
    const allSeen = tierMembers.every((m) => {
      const c = conceptById.get(m.conceptId)
      return c?.firstSeenAt != null
    })
    if (!allSeen) break

    const stabilities = tierMembers.flatMap((m) => {
      const r = reviewByConcept.get(m.conceptId)
      return r ? [r.stability] : []
    })
    if (stabilities.length < tierMembers.length) break

    if (Math.min(...stabilities) >= TIER_STABILITY_GATE) {
      unlocked.add(t + 1)
    } else {
      break
    }
  }

  return unlocked
}

export interface ThreadSummary {
  threadId: string
  name: string
  description: string
  unit?: string
  due: number
  newAvailable: number
  lockedNew: number
  met: number
  total: number
  /** Mean mastery (0..1) across the thread's members. */
  masteryFraction: number
}

export async function summariseThreads(now = Date.now()): Promise<ThreadSummary[]> {
  const threads = await db.threads.orderBy('displayOrder').toArray()
  const reviewByConcept = new Map<string, Review>()
  for (const r of await db.reviews.toArray()) reviewByConcept.set(r.conceptId, r)
  const conceptById = new Map<string, Concept>()
  for (const c of await db.concepts.toArray()) conceptById.set(c.id, c)

  return threads.map((t) => {
    const unlockedTiers = computeUnlockedTiers(t.members, conceptById, reviewByConcept)
    const summary: ThreadSummary = {
      threadId: t.id,
      name: t.name,
      description: t.description,
      unit: t.unit,
      due: 0,
      newAvailable: 0,
      lockedNew: 0,
      met: 0,
      total: 0,
      masteryFraction: 0,
    }
    const levels: MasteryLevel[] = []
    for (const m of t.members) {
      const concept = conceptById.get(m.conceptId)
      if (!concept) continue
      summary.total++
      if (concept.firstSeenAt === null) {
        if (unlockedTiers.has(m.tier)) summary.newAvailable++
        else summary.lockedNew++
      } else {
        summary.met++
      }
      const review = reviewByConcept.get(m.conceptId)
      if (review && review.dueAt <= now && concept.firstSeenAt !== null) summary.due++
      levels.push(masteryOf(review, concept.firstSeenAt !== null))
    }
    summary.masteryFraction = masterySpread(levels).fraction
    return summary
  })
}

export interface EraSummary {
  eraId: string
  due: number
  newAvailable: number
  met: number
  total: number
}

export async function summariseEras(now = Date.now()): Promise<Map<string, EraSummary>> {
  const eras = await db.eras.toArray()
  const summaries = new Map<string, EraSummary>()
  for (const era of eras) {
    summaries.set(era.id, { eraId: era.id, due: 0, newAvailable: 0, met: 0, total: 0 })
  }
  const concepts = await db.concepts.toArray()
  const reviewByConcept = new Map<string, Review>()
  for (const r of await db.reviews.toArray()) reviewByConcept.set(r.conceptId, r)
  for (const concept of concepts) {
    for (const eraId of concept.eras) {
      const s = summaries.get(eraId)
      if (!s) continue
      s.total++
      if (concept.firstSeenAt === null) s.newAvailable++
      else s.met++
      const review = reviewByConcept.get(concept.id)
      if (review && review.dueAt <= now) s.due++
    }
  }
  return summaries
}

export interface DomainSummary {
  domain: Domain
  due: number
  newAvailable: number
  met: number
  total: number
}

export async function summariseDomains(now = Date.now()): Promise<Map<Domain, DomainSummary>> {
  const summaries = new Map<Domain, DomainSummary>()
  for (const d of DOMAINS) {
    summaries.set(d, { domain: d, due: 0, newAvailable: 0, met: 0, total: 0 })
  }
  const concepts = await db.concepts.toArray()
  const reviewByConcept = new Map<string, Review>()
  for (const r of await db.reviews.toArray()) reviewByConcept.set(r.conceptId, r)
  for (const concept of concepts) {
    const s = summaries.get(concept.domain)
    if (!s) continue
    s.total++
    if (concept.firstSeenAt === null) s.newAvailable++
    else s.met++
    const review = reviewByConcept.get(concept.id)
    if (review && review.dueAt <= now) s.due++
  }
  return summaries
}
