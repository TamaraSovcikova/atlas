import { db, type Concept, type Domain, type Lesson, type RecallQuestion, type Review } from '../db/schema'
import { shouldShowMcqFallback } from './fsrs'

export interface SessionCard {
  cardKey: string
  concept: Concept
  lesson: Lesson
  question: RecallQuestion
  review: Review
  isNew: boolean
  useMcq: boolean
}

export interface SessionPlan {
  cards: SessionCard[]
  newCount: number
  reviewCount: number
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

function pickFirstQuestion(lesson: Lesson | undefined): RecallQuestion | null {
  if (!lesson) return null
  return lesson.recallQuestions[0] ?? null
}

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

export async function buildSession(
  now = Date.now(),
  options: { newPerDomain?: number; maxCards?: number } = {},
): Promise<SessionPlan> {
  const newPerDomain = options.newPerDomain ?? DEFAULT_NEW_PER_DOMAIN
  const maxCards = options.maxCards ?? DEFAULT_MAX_CARDS

  const dueReviews = await db.reviews.where('dueAt').belowOrEqual(now).toArray()
  const dueWithMeta: SessionCard[] = []
  for (const review of dueReviews) {
    const concept = await db.concepts.get(review.conceptId)
    if (!concept || !concept.lessonId) continue
    const lesson = await db.lessons.get(concept.lessonId)
    const question = pickFirstQuestion(lesson)
    if (!lesson || !question) continue
    dueWithMeta.push({
      cardKey: `review:${review.id}`,
      concept,
      lesson,
      question,
      review,
      isNew: concept.firstSeenAt === null,
      useMcq: shouldShowMcqFallback(review),
    })
  }

  const newCards: SessionCard[] = []
  for (const domain of DOMAINS) {
    const candidates = await db.concepts
      .where('domain')
      .equals(domain)
      .filter((c) => c.firstSeenAt === null)
      .limit(newPerDomain)
      .toArray()
    for (const concept of candidates) {
      if (!concept.lessonId) continue
      const lesson = await db.lessons.get(concept.lessonId)
      const question = pickFirstQuestion(lesson)
      if (!lesson || !question) continue
      const review = await db.reviews.where('conceptId').equals(concept.id).first()
      if (!review) continue
      newCards.push({
        cardKey: `new:${concept.id}`,
        concept,
        lesson,
        question,
        review,
        isNew: true,
        useMcq: false,
      })
    }
  }

  const interleaved = interleave([...newCards, ...dueWithMeta]).slice(0, maxCards)
  const newCount = interleaved.filter((c) => c.isNew).length
  const reviewCount = interleaved.length - newCount

  return { cards: interleaved, newCount, reviewCount }
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

function hashString(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0
  }
  return h
}
