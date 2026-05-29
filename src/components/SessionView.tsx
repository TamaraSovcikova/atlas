import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildSession, type SessionCard, type SessionPlan } from '../lib/session'
import { applyRating, type RecallRating } from '../lib/fsrs'
import { db } from '../db/schema'
import { RecallCard } from './RecallCard'

interface Props {
  onFinished: () => void
  onCancel: () => void
}

interface SessionResult {
  ratings: { conceptId: string; rating: RecallRating }[]
  startedAt: number
}

export function SessionView({ onFinished, onCancel }: Props) {
  const [plan, setPlan] = useState<SessionPlan | null>(null)
  const [index, setIndex] = useState(0)
  const [result, setResult] = useState<SessionResult>({ ratings: [], startedAt: Date.now() })
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    buildSession().then((p) => {
      if (cancelled) return
      setPlan(p)
      if (p.cards.length === 0) {
        setDone(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const current: SessionCard | null = useMemo(() => {
    if (!plan) return null
    return plan.cards[index] ?? null
  }, [plan, index])

  const handleRated = useCallback(
    async (rating: RecallRating) => {
      if (!current) return
      const now = Date.now()
      const nextReview = applyRating(current.review, rating, now)
      await db.reviews.update(current.review.id!, {
        dueAt: nextReview.dueAt,
        stability: nextReview.stability,
        difficulty: nextReview.difficulty,
        elapsedDays: nextReview.elapsedDays,
        scheduledDays: nextReview.scheduledDays,
        reps: nextReview.reps,
        lapses: nextReview.lapses,
        state: nextReview.state,
        lastReviewedAt: nextReview.lastReviewedAt,
        failureStreak: nextReview.failureStreak,
      })
      await db.concepts.update(current.concept.id, {
        lastReviewedAt: now,
        firstSeenAt: current.concept.firstSeenAt ?? now,
      })
      setResult((r) => ({
        ...r,
        ratings: [...r.ratings, { conceptId: current.concept.id, rating }],
      }))
      const nextIndex = index + 1
      if (!plan || nextIndex >= plan.cards.length) {
        await persistSession(result.startedAt, plan?.cards.length ?? 0, plan?.newCount ?? 0)
        setDone(true)
      } else {
        setIndex(nextIndex)
      }
    },
    [current, index, plan, result.startedAt],
  )

  if (!plan) {
    return <p className="text-ink-softer">Building today's session...</p>
  }

  if (done || plan.cards.length === 0) {
    const ratings = result.ratings
    const accuracy =
      ratings.length === 0
        ? null
        : ratings.filter((r) => r.rating !== 'again').length / ratings.length
    return (
      <section className="rounded-2xl border border-bg-softer/40 bg-bg-soft p-8">
        <h2 className="font-serif text-xl">Session complete</h2>
        <p className="mt-3 text-ink-soft">
          {plan.cards.length === 0
            ? 'Nothing due, and no new concepts to introduce right now. Come back tomorrow; the queue will refill itself.'
            : `${ratings.length} card${ratings.length === 1 ? '' : 's'} reviewed. ${
                accuracy !== null ? `${Math.round(accuracy * 100)}% recalled.` : ''
              } The cards you missed will come back sooner.`}
        </p>
        <button
          type="button"
          onClick={onFinished}
          className="mt-6 rounded-xl bg-accent px-5 py-2 text-sm font-medium text-bg hover:bg-accent-soft"
        >
          Back to home
        </button>
      </section>
    )
  }

  if (!current) {
    return <p className="text-ink-softer">Session ended.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs text-ink-softer">
        <span>
          Card {index + 1} of {plan.cards.length}
        </span>
        <button type="button" onClick={onCancel} className="hover:text-ink">
          End session
        </button>
      </div>
      <RecallCard key={current.cardKey} card={current} onRated={handleRated} />
    </div>
  )
}

async function persistSession(startedAt: number, total: number, newCount: number): Promise<void> {
  await db.sessions.add({
    startedAt,
    durationMs: Date.now() - startedAt,
    newCount,
    reviewCount: total - newCount,
    accuracy: null,
  })
}
