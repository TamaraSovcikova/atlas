import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  buildDomainSession,
  buildEraSession,
  buildSpacedSession,
  type SessionItem,
  type SessionPlan,
} from '../lib/session'
import { applyRating, type RecallRating } from '../lib/fsrs'
import { db, type Domain, type Era } from '../db/schema'
import { useSettings } from '../store/useSettings'
import { RecallCard } from './RecallCard'
import { OrderCard } from './cards/OrderCard'
import { SortCard } from './cards/SortCard'
import { Constellation } from './Constellation'

interface Props {
  shape: 'era' | 'domain' | 'spaced'
  eraId: string | null
  domain: Domain | null
  onFinished: () => void
  onCancel: () => void
}

function primaryConceptId(item: SessionItem): string {
  if (item.kind === 'recall') return item.concept.id
  return item.entries[0]!.concept.id
}

async function recordRating(conceptId: string, rating: RecallRating, now: number) {
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

export function SessionView({ shape, eraId, domain, onFinished, onCancel }: Props) {
  const prefs = useSettings((s) => s.prefs)
  const [plan, setPlan] = useState<SessionPlan | null>(null)
  const [era, setEra] = useState<Era | null>(null)
  const [index, setIndex] = useState(0)
  const [startedAt] = useState(() => Date.now())
  const [ratings, setRatings] = useState<RecallRating[]>([])
  const [done, setDone] = useState(false)
  const [activeConcept, setActiveConcept] = useState<string | null>(null)
  const [pulseKey, setPulseKey] = useState(0)
  const [showExplore, setShowExplore] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      let p: SessionPlan
      if (shape === 'era' && eraId) {
        p = await buildEraSession(eraId, prefs)
        const e = await db.eras.get(eraId)
        if (!cancelled && e) setEra(e)
      } else if (shape === 'domain' && domain) {
        p = await buildDomainSession(domain, prefs)
      } else {
        p = await buildSpacedSession(prefs)
      }
      if (cancelled) return
      setPlan(p)
      if (p.items.length === 0) setDone(true)
      else setActiveConcept(primaryConceptId(p.items[0]!))
    }
    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shape, eraId, domain])

  const current: SessionItem | null = useMemo(() => {
    if (!plan) return null
    return plan.items[index] ?? null
  }, [plan, index])

  const handleAnswered = useCallback((conceptId: string) => {
    setActiveConcept(conceptId)
    setPulseKey((k) => k + 1)
  }, [])

  const handleDone = useCallback(
    async (results: { conceptId: string; rating: RecallRating }[]) => {
      if (!plan) return
      const now = Date.now()
      for (const r of results) {
        await recordRating(r.conceptId, r.rating, now)
      }
      setRatings((prev) => [...prev, ...results.map((r) => r.rating)])
      const nextIndex = index + 1
      if (nextIndex >= plan.items.length) {
        await db.sessions.add({
          startedAt,
          durationMs: now - startedAt,
          newCount: plan.newCount,
          reviewCount: plan.reviewCount,
          accuracy: null,
          shape: plan.shape,
          eraId: plan.eraId,
          domain: plan.domain,
        })
        setDone(true)
      } else {
        setIndex(nextIndex)
        setActiveConcept(primaryConceptId(plan.items[nextIndex]!))
        setPulseKey(0)
      }
    },
    [plan, index, startedAt],
  )

  if (!plan) {
    return <p className="text-ink-softer">Building today's session...</p>
  }

  if (done || plan.items.length === 0) {
    const accuracy =
      ratings.length === 0
        ? null
        : ratings.filter((r) => r !== 'again').length / ratings.length
    return (
      <section className="rounded-2xl border border-bg-softer/40 bg-bg-soft p-8">
        <h2 className="font-serif text-xl">Session complete</h2>
        <p className="mt-3 text-ink-soft">
          {plan.items.length === 0
            ? 'Nothing due in this slice, and no new concepts queued. Try another shape or come back tomorrow.'
            : `${ratings.length} answer${ratings.length === 1 ? '' : 's'}. ${
                accuracy !== null ? `${Math.round(accuracy * 100)}% recalled.` : ''
              } The ones you missed will come back sooner.`}
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

  if (!current) return <p className="text-ink-softer">Session ended.</p>

  if (showExplore) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg">Your constellation</h2>
          <button
            type="button"
            onClick={() => setShowExplore(false)}
            className="text-sm text-ink-softer hover:text-ink"
          >
            Back to session
          </button>
        </div>
        <div className="rounded-2xl border border-bg-softer/40 bg-bg-soft/40">
          <Constellation conceptId={activeConcept} pulseKey={0} mode="explore" height={460} />
        </div>
        <p className="text-xs text-ink-softer">
          Bright stars are concepts you have met. Dim ones are waiting. Pinch or scroll to explore.
        </p>
      </div>
    )
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
            {index + 1} of {plan.items.length}
          </span>
        </div>
        <button type="button" onClick={onCancel} className="text-ink-softer hover:text-ink">
          End session
        </button>
      </div>

      <div>
        {current.kind === 'recall' && (
          <RecallCard key={current.cardKey} item={current} onAnswered={handleAnswered} onDone={handleDone} />
        )}
        {current.kind === 'order' && (
          <OrderCard key={current.cardKey} item={current} onAnswered={handleAnswered} onDone={handleDone} />
        )}
        {current.kind === 'sort' && (
          <SortCard key={current.cardKey} item={current} onAnswered={handleAnswered} onDone={handleDone} />
        )}
      </div>

      {prefs.showConstellationReveal && (
        <div className="rounded-2xl border border-bg-softer/40 bg-bg-soft/30 p-4">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-wider text-ink-softer">
              {pulseKey > 0 ? 'Connections lighting up' : 'How this connects'}
            </p>
            <button
              type="button"
              onClick={() => setShowExplore(true)}
              className="text-[11px] text-ink-softer underline decoration-ink-softer/40 hover:text-ink"
            >
              explore
            </button>
          </div>
          <Constellation conceptId={activeConcept} pulseKey={pulseKey} mode="focus" height={220} />
        </div>
      )}
    </div>
  )
}
