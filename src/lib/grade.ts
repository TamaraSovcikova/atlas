import { db } from '../db/schema'
import { applyRating, type RecallRating } from './fsrs'
import { dayIndex } from './progress'

/**
 * Apply a recall rating to a concept's FSRS review and write it back to Dexie.
 * Also marks the concept as seen (firstSeenAt) and touched (lastReviewedAt).
 *
 * Extracted from SessionView so both the structured session and the infinite
 * feed grade cards through one code path.
 */
export async function recordRating(
  conceptId: string,
  rating: RecallRating,
  now = Date.now(),
): Promise<void> {
  const review = await db.reviews.where('conceptId').equals(conceptId).first()
  if (!review) return
  const next = applyRating(review, rating, now)
  await db.reviews.update(review.id!, {
    dueAt: next.dueAt,
    stability: next.stability,
    difficulty: next.difficulty,
    elapsedDays: next.elapsedDays,
    scheduledDays: next.scheduledDays,
    reps: next.reps,
    lapses: next.lapses,
    state: next.state,
    lastReviewedAt: next.lastReviewedAt,
    failureStreak: next.failureStreak,
  })
  const concept = await db.concepts.get(conceptId)
  if (concept) {
    await db.concepts.update(conceptId, {
      lastReviewedAt: now,
      firstSeenAt: concept.firstSeenAt ?? now,
    })
  }
}

// ── Today-session accumulator ──────────────────────────────────────────────
//
// The structured SessionView writes one `sessions` row on completion, which is
// what `progressSnapshot` rolls up into the streak. The infinite feed has no
// "completion" -- it grades cards continuously -- so we keep ONE rolling
// `sessions` row per local day that the feed updates as the user reviews. The
// streak and the dashboard's "today" count both keep working unchanged because
// `dayStats` simply sums newCount+reviewCount across every session that day.

const FEED_SESSION_KEY = 'feed:todaySession'

interface FeedSessionRef {
  day: number
  sessionId: number
  answered: number
  correct: number
  newCount: number
  reviewCount: number
  startedAt: number
}

/**
 * Record one card graded inside the feed against today's rolling session row,
 * creating it on the first card of a new local day. `isNew` distinguishes a
 * first-time concept (counts toward newCount) from a review.
 */
export async function recordFeedCard(
  rating: RecallRating,
  isNew: boolean,
  now = Date.now(),
): Promise<void> {
  const today = dayIndex(now)
  const row = await db.settings.get(FEED_SESSION_KEY)
  let ref = row?.value as FeedSessionRef | undefined
  const correctInc = rating !== 'again' ? 1 : 0

  if (!ref || ref.day !== today) {
    const newCount = isNew ? 1 : 0
    const reviewCount = isNew ? 0 : 1
    const sessionId = (await db.sessions.add({
      startedAt: now,
      durationMs: 0,
      newCount,
      reviewCount,
      accuracy: correctInc,
      shape: 'daily',
      eraId: null,
      domain: null,
      threadId: null,
    })) as number
    ref = {
      day: today,
      sessionId,
      answered: 1,
      correct: correctInc,
      newCount,
      reviewCount,
      startedAt: now,
    }
  } else {
    ref.answered += 1
    ref.correct += correctInc
    if (isNew) ref.newCount += 1
    else ref.reviewCount += 1
    await db.sessions.update(ref.sessionId, {
      newCount: ref.newCount,
      reviewCount: ref.reviewCount,
      accuracy: ref.answered ? ref.correct / ref.answered : null,
      durationMs: now - ref.startedAt,
    })
  }
  await db.settings.put({ key: FEED_SESSION_KEY, value: ref })
}
