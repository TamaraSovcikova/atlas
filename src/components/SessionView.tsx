import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  buildDomainSession,
  buildEraSession,
  buildSpacedSession,
  type SessionCard,
  type SessionPlan,
} from '../lib/session'
import { applyRating, type RecallRating } from '../lib/fsrs'
import { db, type Domain, type Era } from '../db/schema'
import { RecallCard } from './RecallCard'
import { Constellation } from './Constellation'

interface Props {
  shape: 'era' | 'domain' | 'spaced'
  eraId: string | null
  domain: Domain | null
  onFinished: () => void
  onCancel: () => void
}

interface SessionResult {
  ratings: { conceptId: string; rating: RecallRating }[]
  startedAt: number
}

export function SessionView({ shape, eraId, domain, onFinished, onCancel }: Props) {
  const [plan, setPlan] = useState<SessionPlan | null>(null)
  const [era, setEra] = useState<Era | null>(null)
  const [index, setIndex] = useState(0)
  const [result, setResult] = useState<SessionResult>({ ratings: [], startedAt: Date.now() })
  const [done, setDone] = useState(false)
  const [lastRated, setLastRated] = useState<{ conceptId: string; rating: RecallRating } | null>(
    null,
  )

  useEffect(() => {
    let cancelled = false
    async function load() {
      let p: SessionPlan
      if (shape === 'era' && eraId) {
        p = await buildEraSession(eraId)
        const e = await db.eras.get(eraId)
        if (!cancelled && e) setEra(e)
      } else if (shape === 'domain' && domain) {
        p = await buildDomainSession(domain)
      } else {
        p = await buildSpacedSession()
      }
      if (cancelled) return
      setPlan(p)
      if (p.cards.length === 0) setDone(true)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [shape, eraId, domain])

  const current: SessionCard | null = useMemo(() => {
    if (!plan) return null
    return plan.cards[index] ?? null
  }, [plan, index])

  const handleRated = useCallback(
    async (rating: RecallRating) => {
      if (!current || !plan) return
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
      setLastRated({ conceptId: current.concept.id, rating })
      const nextIndex = index + 1
      if (nextIndex >= plan.cards.length) {
        await persistSession(
          result.startedAt,
          plan.cards.length,
          plan.newCount,
          plan.shape,
          plan.eraId,
          plan.domain,
        )
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
            ? 'Nothing due in this slice, and no new concepts queued. Try another shape or come back tomorrow.'
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
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="text-ink-softer">
          {shape === 'era' && era && <span className="text-ink-soft">{era.name}</span>}
          {shape === 'domain' && domain && (
            <span className="text-ink-soft capitalize">{domain.replace('_', ' ')}</span>
          )}
          {shape === 'spaced' && <span className="text-ink-soft">Just-due</span>}
          <span className="ml-3 text-ink-softer">
            Card {index + 1} of {plan.cards.length}
          </span>
        </div>
        <button type="button" onClick={onCancel} className="text-ink-softer hover:text-ink">
          End session
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_220px]">
        <div>
          <RecallCard key={current.cardKey} card={current} onRated={handleRated} />
          {lastRated && lastRated.conceptId !== current.concept.id && (
            <p className="mt-4 text-xs text-ink-softer">
              Last: {lastRated.rating === 'again' ? 'will come back soon' : 'looking good'}
            </p>
          )}
        </div>
        <aside className="lg:sticky lg:top-10 lg:self-start">
          <Constellation
            conceptId={current.concept.id}
            conceptName={current.concept.name}
            highlightId={null}
          />
        </aside>
      </div>
    </div>
  )
}

async function persistSession(
  startedAt: number,
  total: number,
  newCount: number,
  shape: SessionPlan['shape'],
  eraId: string | null,
  domain: Domain | null,
): Promise<void> {
  await db.sessions.add({
    startedAt,
    durationMs: Date.now() - startedAt,
    newCount,
    reviewCount: total - newCount,
    accuracy: null,
    shape,
    eraId,
    domain,
  })
}
