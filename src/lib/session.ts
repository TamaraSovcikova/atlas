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

export interface SessionCard {
  cardKey: string
  concept: Concept
  lesson: Lesson
  question: RecallQuestion
  review: Review
  isNew: boolean
  isFallback: boolean
}

export interface SessionPlan {
  cards: SessionCard[]
  newCount: number
  reviewCount: number
  shape: SessionShape
  eraId: string | null
  domain: Domain | null
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

export function interleave(cards: SessionCard[]): SessionCard[] {
  if (cards.length <= 1) return cards
  const buckets = new Map<Domain, SessionCard[]>()
  for (const c of cards) {
    const list = buckets.get(c.concept.domain) ?? []
    list.push(c)
    buckets.set(c.concept.domain, list)
  }
  const out: SessionCard[] = []
  let lastDomain: Domain | null = null
  while (out.length < cards.length) {
    let picked: SessionCard | null = null
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
  const shuffled = candidates
    .map((c) => ({ c, k: hashString(c.id + ':' + conceptId) }))
    .sort((a, b) => a.k - b.k)
    .map(({ c }) => c.name)
  return shuffled.slice(0, count)
}

function findCloze(qs: RecallQuestion[]): RecallQuestion | undefined {
  return qs.find((q) => q.format === 'cloze')
}
function findContrast(qs: RecallQuestion[]): RecallQuestion | undefined {
  return qs.find((q) => q.format === 'contrast')
}
function findFree(qs: RecallQuestion[]): RecallQuestion | undefined {
  return qs.find((q) => q.format === 'free')
}

async function pickQuestion(
  lesson: Lesson,
  review: Review,
  isNew: boolean,
  concept: Concept,
): Promise<{ question: RecallQuestion; isFallback: boolean }> {
  const fallback = shouldShowMcqFallback(review)
  const qs = lesson.recallQuestions

  if (fallback) {
    const authored = findContrast(qs)
    if (authored) return { question: authored, isFallback: true }
    const distractors = await buildMcqDistractors(concept.id, concept.domain, 3)
    return {
      question: {
        format: 'contrast',
        prompt: 'Which of these matches the brief above?',
        expectedAnswer: concept.name,
        distractors,
      },
      isFallback: true,
    }
  }

  if (isNew) {
    return { question: findCloze(qs) ?? findFree(qs) ?? qs[0]!, isFallback: false }
  }

  const everyFifth = (review.reps + 1) % 5 === 0
  if (everyFifth) {
    const contrastQ = findContrast(qs)
    if (contrastQ) return { question: contrastQ, isFallback: false }
  }

  return { question: findCloze(qs) ?? findContrast(qs) ?? findFree(qs) ?? qs[0]!, isFallback: false }
}

async function makeCard(
  concept: Concept,
  review: Review,
  isNew: boolean,
  cardKeyPrefix: string,
): Promise<SessionCard | null> {
  if (!concept.lessonId) return null
  const lesson = await db.lessons.get(concept.lessonId)
  if (!lesson || lesson.recallQuestions.length === 0) return null
  const { question, isFallback } = await pickQuestion(lesson, review, isNew, concept)
  return {
    cardKey: `${cardKeyPrefix}:${concept.id}`,
    concept,
    lesson,
    question,
    review,
    isNew,
    isFallback,
  }
}

export interface BuildOptions {
  newPerDomain?: number
  maxCards?: number
  maxNew?: number
}

export async function buildEraSession(
  eraId: string,
  now = Date.now(),
  options: BuildOptions = {},
): Promise<SessionPlan> {
  const newPerDomain = options.newPerDomain ?? DEFAULT_NEW_PER_DOMAIN
  const maxCards = options.maxCards ?? DEFAULT_MAX_CARDS

  const eraConcepts = await db.concepts.where('eras').equals(eraId).toArray()
  const eraIds = new Set(eraConcepts.map((c) => c.id))

  const cards: SessionCard[] = []

  const dueReviews = await db.reviews.where('dueAt').belowOrEqual(now).toArray()
  for (const review of dueReviews) {
    if (!eraIds.has(review.conceptId)) continue
    const concept = eraConcepts.find((c) => c.id === review.conceptId)
    if (!concept) continue
    const isNew = concept.firstSeenAt === null
    const card = await makeCard(concept, review, isNew, 'review')
    if (card) cards.push(card)
  }

  const perDomain: Record<string, number> = {}
  for (const concept of eraConcepts) {
    if (concept.firstSeenAt !== null) continue
    perDomain[concept.domain] = (perDomain[concept.domain] ?? 0) + 1
    if (perDomain[concept.domain]! > newPerDomain) continue
    if (cards.some((c) => c.concept.id === concept.id)) continue
    const review = await db.reviews.where('conceptId').equals(concept.id).first()
    if (!review) continue
    const card = await makeCard(concept, review, true, 'new')
    if (card) cards.push(card)
  }

  const interleaved = interleave(cards).slice(0, maxCards)
  const newCount = interleaved.filter((c) => c.isNew).length
  return {
    cards: interleaved,
    newCount,
    reviewCount: interleaved.length - newCount,
    shape: 'era',
    eraId,
    domain: null,
  }
}

export async function buildDomainSession(
  domain: Domain,
  now = Date.now(),
  options: BuildOptions = {},
): Promise<SessionPlan> {
  const maxCards = options.maxCards ?? DEFAULT_MAX_CARDS
  const maxNew = options.maxNew ?? 3

  const concepts = await db.concepts.where('domain').equals(domain).toArray()
  const cards: SessionCard[] = []

  const dueReviews = await db.reviews.where('dueAt').belowOrEqual(now).toArray()
  for (const review of dueReviews) {
    const concept = concepts.find((c) => c.id === review.conceptId)
    if (!concept) continue
    const isNew = concept.firstSeenAt === null
    const card = await makeCard(concept, review, isNew, 'review')
    if (card) cards.push(card)
  }

  let added = 0
  const sortedByYear = [...concepts].sort(
    (a, b) => (a.approxYear ?? Infinity) - (b.approxYear ?? Infinity),
  )
  for (const concept of sortedByYear) {
    if (added >= maxNew) break
    if (concept.firstSeenAt !== null) continue
    if (cards.some((c) => c.concept.id === concept.id)) continue
    const review = await db.reviews.where('conceptId').equals(concept.id).first()
    if (!review) continue
    const card = await makeCard(concept, review, true, 'new')
    if (card) {
      cards.push(card)
      added++
    }
  }

  cards.sort((a, b) => (a.concept.approxYear ?? Infinity) - (b.concept.approxYear ?? Infinity))

  const limited = cards.slice(0, maxCards)
  const newCount = limited.filter((c) => c.isNew).length
  return {
    cards: limited,
    newCount,
    reviewCount: limited.length - newCount,
    shape: 'domain',
    eraId: null,
    domain,
  }
}

export async function buildSpacedSession(
  now = Date.now(),
  options: BuildOptions = {},
): Promise<SessionPlan> {
  const maxCards = options.maxCards ?? DEFAULT_MAX_CARDS

  const cards: SessionCard[] = []
  const dueReviews = await db.reviews.where('dueAt').belowOrEqual(now).toArray()
  for (const review of dueReviews) {
    const concept = await db.concepts.get(review.conceptId)
    if (!concept) continue
    const isNew = concept.firstSeenAt === null
    const card = await makeCard(concept, review, isNew, 'review')
    if (card) cards.push(card)
  }
  const interleaved = interleave(cards).slice(0, maxCards)
  const newCount = interleaved.filter((c) => c.isNew).length
  return {
    cards: interleaved,
    newCount,
    reviewCount: interleaved.length - newCount,
    shape: 'spaced',
    eraId: null,
    domain: null,
  }
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
      if (concept.firstSeenAt !== null) s.met++
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
    if (concept.firstSeenAt !== null) s.met++
    const review = reviewByConcept.get(concept.id)
    if (review && review.dueAt <= now) s.due++
  }
  return summaries
}
