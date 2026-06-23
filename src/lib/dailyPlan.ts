import { db, type Domain, type RecallQuestion, type SessionShape } from '../db/schema'
import type { RecallRating } from './fsrs'
import { dayIndex } from './progress'
import {
  buildDailySession,
  buildEraSession,
  buildDomainSession,
  buildThreadSession,
  buildSpacedSession,
  buildMistakesSession,
  type SessionItem,
  type SessionPlan,
  type SortBucket,
} from './session'
import type { Prefs } from './settings'

/** Non-daily sessions expire after 8 hours of inactivity. */
const SESSION_TTL_MS = 8 * 60 * 60 * 1000

/**
 * The daily session, persisted. Previously "today" was rebuilt on every entry
 * and its position lived only in React state, so it regenerated each time and
 * could not be resumed. Here the composed plan is serialised into a settings
 * row keyed by the local day: re-entering the same day resumes the exact same
 * cards at the exact same cursor; a new day (or a completed plan) builds afresh.
 */

const PLAN_KEY = 'dailyPlan'

type StoredItem =
  | {
      kind: 'recall'
      cardKey: string
      conceptId: string
      isNew: boolean
      isFallback: boolean
      question: RecallQuestion
    }
  | { kind: 'order'; cardKey: string; conceptIds: string[] }
  | {
      kind: 'sort'
      cardKey: string
      buckets: SortBucket[]
      entries: { conceptId: string; bucketId: string }[]
    }

interface StoredPlan {
  day: number
  items: StoredItem[]
  newCount: number
  reviewCount: number
  cursor: number
  ratings: RecallRating[]
  startedAt: number
  updatedAt: number
  completed: boolean
}

export interface DailyPlanState {
  plan: SessionPlan
  cursor: number
  ratings: RecallRating[]
  startedAt: number
  restored: boolean
}

function serialiseItem(item: SessionItem): StoredItem {
  if (item.kind === 'recall') {
    return {
      kind: 'recall',
      cardKey: item.cardKey,
      conceptId: item.concept.id,
      isNew: item.isNew,
      isFallback: item.isFallback,
      question: item.question,
    }
  }
  if (item.kind === 'order') {
    return {
      kind: 'order',
      cardKey: item.cardKey,
      conceptIds: item.entries.map((e) => e.concept.id),
    }
  }
  return {
    kind: 'sort',
    cardKey: item.cardKey,
    buckets: item.buckets,
    entries: item.entries.map((e) => ({ conceptId: e.concept.id, bucketId: e.bucketId })),
  }
}

/** Rebuild live SessionItems from stored refs. Drops items whose data vanished. */
async function rehydrateItems(stored: StoredItem[]): Promise<SessionItem[]> {
  const out: SessionItem[] = []
  for (const s of stored) {
    if (s.kind === 'recall') {
      const concept = await db.concepts.get(s.conceptId)
      if (!concept || !concept.lessonId) continue
      const lesson = await db.lessons.get(concept.lessonId)
      const review = await db.reviews.where('conceptId').equals(s.conceptId).first()
      if (!lesson || !review) continue
      out.push({
        kind: 'recall',
        cardKey: s.cardKey,
        concept,
        lesson,
        question: s.question,
        review,
        isNew: s.isNew,
        isFallback: s.isFallback,
      })
    } else if (s.kind === 'order') {
      const entries = []
      for (const id of s.conceptIds) {
        const concept = await db.concepts.get(id)
        const review = await db.reviews.where('conceptId').equals(id).first()
        if (concept && review) entries.push({ concept, review })
      }
      if (entries.length >= 3) out.push({ kind: 'order', cardKey: s.cardKey, entries })
    } else {
      const entries = []
      for (const e of s.entries) {
        const concept = await db.concepts.get(e.conceptId)
        const review = await db.reviews.where('conceptId').equals(e.conceptId).first()
        if (concept && review) entries.push({ concept, review, bucketId: e.bucketId })
      }
      if (entries.length >= 3) out.push({ kind: 'sort', cardKey: s.cardKey, buckets: s.buckets, entries })
    }
  }
  return out
}

async function readStored(): Promise<StoredPlan | null> {
  const row = await db.settings.get(PLAN_KEY)
  return (row?.value as StoredPlan | undefined) ?? null
}

async function writeStored(plan: StoredPlan): Promise<void> {
  await db.settings.put({ key: PLAN_KEY, value: plan })
}

function toSessionPlan(items: SessionItem[], newCount: number, reviewCount: number): SessionPlan {
  return { items, newCount, reviewCount, shape: 'daily', eraId: null, domain: null, threadId: null }
}

/**
 * Resume today's in-progress plan, or compose and persist a new one. A plan is
 * resumable only if it is for the current local day, not completed, and still
 * has cards left after rehydration.
 */
export async function resumeOrBuildDaily(prefs: Prefs, now = Date.now()): Promise<DailyPlanState> {
  const today = dayIndex(now)
  const stored = await readStored()

  if (stored && stored.day === today && !stored.completed) {
    const items = await rehydrateItems(stored.items)
    if (items.length > 0 && stored.cursor < items.length) {
      return {
        plan: toSessionPlan(items, stored.newCount, stored.reviewCount),
        cursor: stored.cursor,
        ratings: stored.ratings,
        startedAt: stored.startedAt,
        restored: stored.cursor > 0,
      }
    }
  }

  const fresh = await buildDailySession(prefs, now)
  const startedAt = now
  await writeStored({
    day: today,
    items: fresh.items.map(serialiseItem),
    newCount: fresh.newCount,
    reviewCount: fresh.reviewCount,
    cursor: 0,
    ratings: [],
    startedAt,
    updatedAt: startedAt,
    completed: false,
  })
  return { plan: fresh, cursor: 0, ratings: [], startedAt, restored: false }
}

/** Persist progress mid-session so a quit-and-return lands on the same card. */
export async function saveDailyProgress(cursor: number, ratings: RecallRating[]): Promise<void> {
  const stored = await readStored()
  if (!stored) return
  stored.cursor = cursor
  stored.ratings = ratings
  stored.updatedAt = Date.now()
  await writeStored(stored)
}

export async function completeDaily(): Promise<void> {
  const stored = await readStored()
  if (!stored) return
  stored.completed = true
  stored.updatedAt = Date.now()
  await writeStored(stored)
}

export interface DailyResume {
  remaining: number
  total: number
  done: number
}

/** For Home: how far through today's plan the user is, or null if none active. */
export async function getDailyResume(now = Date.now()): Promise<DailyResume | null> {
  const stored = await readStored()
  if (!stored || stored.day !== dayIndex(now) || stored.completed) return null
  const total = stored.items.length
  const done = Math.min(stored.cursor, total)
  if (done <= 0 || done >= total) return null
  return { remaining: total - done, total, done }
}

// ── Generic non-daily session persistence ─────────────────────────────────

/**
 * Derive a stable settings key for any non-daily session shape so each
 * (shape, id) combination lives in its own slot independent of the daily plan.
 */
function sessionKey(shape: SessionShape, id: string | null): string {
  return `session:${shape}:${id ?? ''}`
}

async function readSession(key: string): Promise<StoredPlan | null> {
  const row = await db.settings.get(key)
  return (row?.value as StoredPlan | undefined) ?? null
}

async function writeSession(key: string, plan: StoredPlan): Promise<void> {
  await db.settings.put({ key, value: plan })
}

function toAnySessionPlan(
  items: SessionItem[],
  newCount: number,
  reviewCount: number,
  shape: SessionShape,
  eraId: string | null,
  domain: Domain | null,
  threadId: string | null,
): SessionPlan {
  return { items, newCount, reviewCount, shape, eraId, domain, threadId }
}

export interface SessionState extends DailyPlanState {
  /** True when the session was rehydrated from a previous run. */
  restored: boolean
}

/**
 * Resume an in-progress session for the given shape/id, or build and persist
 * a new one. Non-daily sessions expire after SESSION_TTL_MS of inactivity.
 */
export async function resumeOrBuildSession(
  shape: Exclude<SessionShape, 'daily'>,
  id: string | null,
  prefs: Prefs,
  now = Date.now(),
): Promise<DailyPlanState> {
  const key = sessionKey(shape, id)
  const stored = await readSession(key)
  const notExpired = stored && now - stored.updatedAt < SESSION_TTL_MS

  if (stored && notExpired && !stored.completed) {
    const items = await rehydrateItems(stored.items)
    if (items.length > 0 && stored.cursor < items.length) {
      const plan = toAnySessionPlan(
        items, stored.newCount, stored.reviewCount,
        shape,
        shape === 'era' ? id : null,
        shape === 'domain' ? (id as Domain) : null,
        shape === 'thread' ? id : null,
      )
      return { plan, cursor: stored.cursor, ratings: stored.ratings, startedAt: stored.startedAt, restored: stored.cursor > 0 }
    }
  }

  // Build fresh
  let fresh: SessionPlan
  if (shape === 'mistakes') {
    // Leeches change with every review — always rebuild, never resume
    fresh = await buildMistakesSession(prefs)
    return { plan: fresh, cursor: 0, ratings: [], startedAt: now, restored: false }
  }
  if (shape === 'era' && id) fresh = await buildEraSession(id, prefs)
  else if (shape === 'domain' && id) fresh = await buildDomainSession(id as Domain, prefs)
  else if (shape === 'thread' && id) fresh = await buildThreadSession(id, prefs)
  else fresh = await buildSpacedSession(prefs)

  const startedAt = now
  await writeSession(key, {
    day: 0,
    items: fresh.items.map(serialiseItem),
    newCount: fresh.newCount,
    reviewCount: fresh.reviewCount,
    cursor: 0,
    ratings: [],
    startedAt,
    updatedAt: startedAt,
    completed: false,
  })
  return { plan: fresh, cursor: 0, ratings: [], startedAt, restored: false }
}

/** Persist cursor/ratings for a non-daily session mid-run. */
export async function saveSessionProgress(
  shape: Exclude<SessionShape, 'daily'>,
  id: string | null,
  cursor: number,
  ratings: RecallRating[],
): Promise<void> {
  const key = sessionKey(shape, id)
  const stored = await readSession(key)
  if (!stored) return
  stored.cursor = cursor
  stored.ratings = ratings
  stored.updatedAt = Date.now()
  await writeSession(key, stored)
}

/** Mark a non-daily session complete so it won't be offered for resume. */
export async function completeSession(
  shape: Exclude<SessionShape, 'daily'>,
  id: string | null,
): Promise<void> {
  const key = sessionKey(shape, id)
  const stored = await readSession(key)
  if (!stored) return
  stored.completed = true
  stored.updatedAt = Date.now()
  await writeSession(key, stored)
}

/** Check if there is an in-progress (not expired, not completed) non-daily session. */
export async function getSessionResume(
  shape: Exclude<SessionShape, 'daily'>,
  id: string | null,
  now = Date.now(),
): Promise<DailyResume | null> {
  const key = sessionKey(shape, id)
  const stored = await readSession(key)
  if (!stored || stored.completed) return null
  if (now - stored.updatedAt >= SESSION_TTL_MS) return null
  const total = stored.items.length
  const done = Math.min(stored.cursor, total)
  if (done <= 0 || done >= total) return null
  return { remaining: total - done, total, done }
}
