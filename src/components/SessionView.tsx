import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  buildDomainSession,
  buildEraSession,
  buildSpacedSession,
  buildThreadSession,
  type SessionItem,
  type SessionPlan,
} from '../lib/session'
import { applyRating, type RecallRating } from '../lib/fsrs'
import { db, type Domain, type Era } from '../db/schema'
import { useSettings } from '../store/useSettings'
import { RecallCard } from './RecallCard'
import { OrderCard } from './cards/OrderCard'
import { SortCard } from './cards/SortCard'
import { SwipeRatingZone } from './SwipeRatingZone'
import { ConceptRabbitHole } from './ConceptRabbitHole'
import { Button } from './ui/Button'
import { ConstellationPreview } from './ConstellationPreview'
import { M, AnimatePresence, cardVariants, ease } from './ui/motion'

interface Props {
  shape: 'era' | 'domain' | 'spaced' | 'thread'
  eraId: string | null
  domain: Domain | null
  threadId: string | null
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

export function SessionView({ shape, eraId, domain, threadId, onFinished, onCancel }: Props) {
  const prefs = useSettings((s) => s.prefs)
  const [plan, setPlan] = useState<SessionPlan | null>(null)
  const [era, setEra] = useState<Era | null>(null)
  const [threadName, setThreadName] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [startedAt] = useState(() => Date.now())
  const [ratings, setRatings] = useState<RecallRating[]>([])
  const [done, setDone] = useState(false)
  const [activeConcept, setActiveConcept] = useState<string | null>(null)
  const [pulseKey, setPulseKey] = useState(0)
  const [revealedRating, setRevealedRating] = useState<RecallRating | null | undefined>(undefined)
  const [rabbitHoleId, setRabbitHoleId] = useState<string | null>(null)

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
      } else if (shape === 'thread' && threadId) {
        p = await buildThreadSession(threadId, prefs)
        const t = await db.threads.get(threadId)
        if (!cancelled && t) setThreadName(t.name)
      } else {
        p = await buildSpacedSession(prefs)
      }
      if (cancelled) return
      setPlan(p)
      if (p.items.length === 0) setDone(true)
      else {
        setActiveConcept(primaryConceptId(p.items[0]!))
      }
    }
    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shape, eraId, domain, threadId])

  // Reset swipe zone state when the card changes
  useEffect(() => {
    setRevealedRating(undefined)
  }, [index])

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
          threadId: plan.threadId,
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

  const handleRevealed = useCallback((rating: RecallRating | null) => {
    setRevealedRating(rating)
  }, [])

  const handleRate = useCallback(
    async (rating: RecallRating) => {
      if (!current || current.kind !== 'recall') return
      await handleDone([{ conceptId: current.concept.id, rating }])
    },
    [current, handleDone],
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
      <M.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ease}
        className="surface p-8"
      >
        <div className="text-3xl">{accuracy !== null && accuracy >= 0.8 ? '🌟' : '✨'}</div>
        <h2 className="mt-2 font-serif text-2xl">Session complete</h2>
        <p className="mt-3 text-ink-soft">
          {plan.items.length === 0
            ? 'Nothing due in this slice, and no new concepts queued. Try another shape or come back tomorrow.'
            : `${ratings.length} answer${ratings.length === 1 ? '' : 's'}. ${
                accuracy !== null ? `${Math.round(accuracy * 100)}% recalled.` : ''
              } The ones you missed will come back sooner.`}
        </p>
        <Button onClick={onFinished} className="mt-6">
          Back to home
        </Button>
      </M.section>
    )
  }

  if (!current) return <p className="text-ink-softer">Session ended.</p>

  const progress = (index + (pulseKey > 0 ? 1 : 0)) / plan.items.length
  const isRecallCard = current.kind === 'recall'
  const swipeVisible = isRecallCard && revealedRating !== undefined

  return (
    <>
      <div className="space-y-4">
        {/* Constellation strip */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-bg-soft shadow-card">
          <ConstellationPreview focusConceptId={activeConcept} pulseKey={pulseKey} height={160} />
        </div>

        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="text-ink-softer">
            {shape === 'era' && era && <span className="text-ink-soft">{era.name}</span>}
            {shape === 'domain' && domain && (
              <span className="text-ink-soft capitalize">{domain.replace('_', ' ')}</span>
            )}
            {shape === 'thread' && threadName && (
              <span className="text-ink-soft">{threadName}</span>
            )}
            {shape === 'spaced' && <span className="text-ink-soft">Just due</span>}
            <span className="ml-3">
              {index + 1} of {plan.items.length}
            </span>
          </div>
          <button type="button" onClick={onCancel} className="text-ink-softer hover:text-ink">
            End session
          </button>
        </div>

        <div className="h-1 overflow-hidden rounded-full bg-bg-softer">
          <M.div
            className="h-full rounded-full bg-accent-grad"
            animate={{ width: `${Math.round(progress * 100)}%` }}
            transition={ease}
          />
        </div>

        <AnimatePresence mode="wait">
          <M.div
            key={current.cardKey}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={ease}
            className="surface overflow-hidden"
          >
            {/* Scrollable card content */}
            <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(55svh)' }}>
              {isRecallCard && (
                <RecallCard
                  item={current}
                  onAnswered={handleAnswered}
                  onRevealed={handleRevealed}
                  onConceptClick={setRabbitHoleId}
                />
              )}
              {current.kind === 'order' && (
                <OrderCard item={current} onAnswered={handleAnswered} onDone={handleDone} />
              )}
              {current.kind === 'sort' && (
                <SortCard item={current} onAnswered={handleAnswered} onDone={handleDone} />
              )}
            </div>

            {/* Swipe zone appears after reveal, outside the scroll area */}
            {swipeVisible && (
              <div className="border-t border-white/[0.06] px-6 pb-6 pt-4">
                <SwipeRatingZone onRate={handleRate} suggestedRating={revealedRating} />
              </div>
            )}
          </M.div>
        </AnimatePresence>
      </div>

      <ConceptRabbitHole rootConceptId={rabbitHoleId} onClose={() => setRabbitHoleId(null)} />
    </>
  )
}
