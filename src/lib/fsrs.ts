import { fsrs, generatorParameters, Rating, State, createEmptyCard, type Card, type Grade } from 'ts-fsrs'
import type { Review } from '../db/schema'

const params = generatorParameters({
  enable_fuzz: true,
  enable_short_term: true,
})

const scheduler = fsrs(params)

export type RecallRating = 'again' | 'hard' | 'good' | 'easy'

const ratingMap: Record<RecallRating, Grade> = {
  again: Rating.Again as Grade,
  hard: Rating.Hard as Grade,
  good: Rating.Good as Grade,
  easy: Rating.Easy as Grade,
}

export function newReview(conceptId: string, now = Date.now()): Omit<Review, 'id'> {
  const card = createEmptyCard(new Date(now))
  return {
    conceptId,
    dueAt: card.due.getTime(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    lastReviewedAt: null,
    failureStreak: 0,
    createdAt: now,
  }
}

function reviewToCard(review: Review): Card {
  return {
    due: new Date(review.dueAt),
    stability: review.stability,
    difficulty: review.difficulty,
    elapsed_days: review.elapsedDays,
    scheduled_days: review.scheduledDays,
    reps: review.reps,
    lapses: review.lapses,
    state: review.state as State,
    last_review: review.lastReviewedAt ? new Date(review.lastReviewedAt) : undefined,
  }
}

export function applyRating(review: Review, rating: RecallRating, now = Date.now()): Review {
  const card = reviewToCard(review)
  const result = scheduler.next(card, new Date(now), ratingMap[rating])
  const next = result.card
  const failed = rating === 'again'
  return {
    ...review,
    dueAt: next.due.getTime(),
    stability: next.stability,
    difficulty: next.difficulty,
    elapsedDays: next.elapsed_days,
    scheduledDays: next.scheduled_days,
    reps: next.reps,
    lapses: next.lapses,
    state: next.state,
    lastReviewedAt: now,
    failureStreak: failed ? review.failureStreak + 1 : 0,
  }
}

export function shouldShowMcqFallback(review: Review): boolean {
  return review.failureStreak >= 3
}
