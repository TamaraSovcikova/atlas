import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { progressSnapshot } from '../lib/progress'
import {
  type SessionItem,
  type SessionPlan,
} from '../lib/session'
import {
  resumeOrBuildDaily,
  saveDailyProgress,
  completeDaily,
  resumeOrBuildSession,
  saveSessionProgress,
  completeSession,
} from '../lib/dailyPlan'
import { buildCollectionSession } from '../lib/session'
import { type RecallRating } from '../lib/fsrs'
import { recordRating } from '../lib/grade'
import { getSyncToken, pushToCloud } from '../lib/sync'
import { db, type Domain, type Era } from '../db/schema'
import { useSettings } from '../store/useSettings'
import { RecallCard } from './RecallCard'
import { OrderCard } from './cards/OrderCard'
import { SortCard } from './cards/SortCard'
import { SwipeRatingZone } from './SwipeRatingZone'
import { ConceptRabbitHole } from './ConceptRabbitHole'
import { Button } from './ui/Button'
import { ConstellationPreview } from './ConstellationPreview'
import { M, AnimatePresence, cardVariants, cardTransition, ease, type SwipeDir } from './ui/motion'
import { explainMyAnswer } from '../lib/ai'

interface Props {
  shape: 'era' | 'domain' | 'spaced' | 'thread' | 'daily' | 'mistakes' | 'collection'
  eraId: string | null
  domain: Domain | null
  threadId: string | null
  collectionId?: string | null
  onFinished: () => void
  onCancel: () => void
}

interface UndoSnapshot {
  index: number
  ratings: RecallRating[]
  conceptId: string
  prevReview: Record<string, unknown>
}

function primaryConceptId(item: SessionItem): string {
  if (item.kind === 'recall') return item.concept.id
  return item.entries[0]!.concept.id
}

function sessionId(
  shape: string,
  eraId: string | null,
  domain: Domain | null,
  threadId: string | null,
): string | null {
  if (shape === 'era') return eraId
  if (shape === 'domain') return domain
  if (shape === 'thread') return threadId
  return null
}

export function SessionView({ shape, eraId, domain, threadId, collectionId, onFinished, onCancel }: Props) {
  const prefs = useSettings((s) => s.prefs)
  const [plan, setPlan] = useState<SessionPlan | null>(null)
  const [era, setEra] = useState<Era | null>(null)
  const [threadName, setThreadName] = useState<string | null>(null)
  const [collectionName, setCollectionName] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const [ratings, setRatings] = useState<RecallRating[]>([])
  const ratingsRef = useRef<RecallRating[]>([])
  const [done, setDone] = useState(false)
  const [activeConcept, setActiveConcept] = useState<string | null>(null)
  const [pulseKey, setPulseKey] = useState(0)
  const [revealedRating, setRevealedRating] = useState<RecallRating | null | undefined>(undefined)
  const [rabbitHoleId, setRabbitHoleId] = useState<string | null>(null)
  const [swipeDir, setSwipeDir] = useState<SwipeDir>(null)
  const [undoSnapshot, setUndoSnapshot] = useState<UndoSnapshot | null>(null)
  // Explain-my-answer state (Wave 4)
  const [explainText, setExplainText] = useState<string | null>(null)
  const [explainLoading, setExplainLoading] = useState(false)
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const allSessions = useLiveQuery(() => db.sessions.toArray(), [], [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      let p: SessionPlan
      if (shape === 'daily') {
        // Resume today's persisted plan if one is in progress, else build + store.
        const state = await resumeOrBuildDaily(prefs)
        if (cancelled) return
        p = state.plan
        ratingsRef.current = state.ratings
        setRatings(state.ratings)
        setStartedAt(state.startedAt)
        setIndex(Math.min(state.cursor, Math.max(0, p.items.length - 1)))
        setPlan(p)
        if (p.items.length === 0) setDone(true)
        else setActiveConcept(primaryConceptId(p.items[Math.min(state.cursor, p.items.length - 1)]!))
        return
      } else if (shape === 'era' && eraId) {
        const state = await resumeOrBuildSession('era', eraId, prefs)
        if (cancelled) return
        p = state.plan
        const e = await db.eras.get(eraId)
        if (!cancelled && e) setEra(e)
        ratingsRef.current = state.ratings
        setRatings(state.ratings)
        setStartedAt(state.startedAt)
        setIndex(Math.min(state.cursor, Math.max(0, p.items.length - 1)))
        setPlan(p)
        if (p.items.length === 0) setDone(true)
        else setActiveConcept(primaryConceptId(p.items[Math.min(state.cursor, p.items.length - 1)]!))
        return
      } else if (shape === 'domain' && domain) {
        const state = await resumeOrBuildSession('domain', domain, prefs)
        if (cancelled) return
        p = state.plan
        ratingsRef.current = state.ratings
        setRatings(state.ratings)
        setStartedAt(state.startedAt)
        setIndex(Math.min(state.cursor, Math.max(0, p.items.length - 1)))
        setPlan(p)
        if (p.items.length === 0) setDone(true)
        else setActiveConcept(primaryConceptId(p.items[Math.min(state.cursor, p.items.length - 1)]!))
        return
      } else if (shape === 'thread' && threadId) {
        const state = await resumeOrBuildSession('thread', threadId, prefs)
        if (cancelled) return
        p = state.plan
        const t = await db.threads.get(threadId)
        if (!cancelled && t) setThreadName(t.name)
        ratingsRef.current = state.ratings
        setRatings(state.ratings)
        setStartedAt(state.startedAt)
        setIndex(Math.min(state.cursor, Math.max(0, p.items.length - 1)))
        setPlan(p)
        if (p.items.length === 0) setDone(true)
        else setActiveConcept(primaryConceptId(p.items[Math.min(state.cursor, p.items.length - 1)]!))
        return
      } else if (shape === 'mistakes') {
        const state = await resumeOrBuildSession('mistakes', null, prefs)
        if (cancelled) return
        p = state.plan
        ratingsRef.current = state.ratings
        setRatings(state.ratings)
        setStartedAt(state.startedAt)
        setIndex(Math.min(state.cursor, Math.max(0, p.items.length - 1)))
        setPlan(p)
        if (p.items.length === 0) setDone(true)
        else setActiveConcept(primaryConceptId(p.items[Math.min(state.cursor, p.items.length - 1)]!))
        return
      } else if (shape === 'collection' && collectionId) {
        p = await buildCollectionSession(collectionId, prefs)
        if (cancelled) return
        const col = await db.collections.get(collectionId)
        if (!cancelled && col) setCollectionName(col.name)
        setPlan(p)
        if (p.items.length === 0) setDone(true)
        else setActiveConcept(primaryConceptId(p.items[0]!))
        return
      } else {
        const state = await resumeOrBuildSession('spaced', null, prefs)
        if (cancelled) return
        p = state.plan
        ratingsRef.current = state.ratings
        setRatings(state.ratings)
        setStartedAt(state.startedAt)
        setIndex(Math.min(state.cursor, Math.max(0, p.items.length - 1)))
        setPlan(p)
        if (p.items.length === 0) setDone(true)
        else setActiveConcept(primaryConceptId(p.items[Math.min(state.cursor, p.items.length - 1)]!))
        return
      }
    }
    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shape, eraId, domain, threadId, collectionId])

  // Reset swipe zone and explain state when the card changes
  useEffect(() => {
    setRevealedRating(undefined)
    setExplainText(null)
    setExplainLoading(false)
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
      // Snapshot for undo — only for single-card recall (not games with multiple results)
      let newSnapshot: UndoSnapshot | null = null
      if (results.length === 1) {
        const prevReview = await db.reviews.where('conceptId').equals(results[0]!.conceptId).first()
        if (prevReview) {
          newSnapshot = {
            index,
            ratings: [...ratingsRef.current],
            conceptId: results[0]!.conceptId,
            prevReview: { ...prevReview } as Record<string, unknown>,
          }
        }
      }
      for (const r of results) {
        await recordRating(r.conceptId, r.rating, now)
      }
      const newRatings = results.map((r) => r.rating)
      ratingsRef.current = [...ratingsRef.current, ...newRatings]
      setRatings(ratingsRef.current)
      const nextIndex = index + 1
      if (nextIndex >= plan.items.length) {
        // True first-try retention: share of answers that were not 'again'.
        const all = ratingsRef.current
        const accuracy = all.length
          ? all.filter((r) => r !== 'again').length / all.length
          : null
        await db.sessions.add({
          startedAt,
          durationMs: now - startedAt,
          newCount: plan.newCount,
          reviewCount: plan.reviewCount,
          accuracy,
          shape: plan.shape,
          eraId: plan.eraId,
          domain: plan.domain,
          threadId: plan.threadId,
        })
        if (shape === 'daily') await completeDaily()
        else await completeSession(shape, sessionId(shape, eraId, domain, threadId))
        // Auto-push to the cloud, but only if the user already has sync set up.
        // getSyncToken (not ensureSyncToken) so we never create a token here.
        getSyncToken().then((t) => {
          if (t) pushToCloud()
        })
        setDone(true)
      } else {
        if (shape === 'daily') await saveDailyProgress(nextIndex, ratingsRef.current)
        else await saveSessionProgress(shape, sessionId(shape, eraId, domain, threadId), nextIndex, ratingsRef.current)
        setIndex(nextIndex)
        setActiveConcept(primaryConceptId(plan.items[nextIndex]!))
        setPulseKey(0)
        // Show undo for 8 seconds then clear
        if (newSnapshot) {
          if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
          setUndoSnapshot(newSnapshot)
          undoTimerRef.current = setTimeout(() => setUndoSnapshot(null), 8000)
        } else {
          setUndoSnapshot(null)
        }
      }
    },
    [plan, index, startedAt, shape],
  )

  const handleUndo = useCallback(async () => {
    if (!undoSnapshot || !plan) return
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    setUndoSnapshot(null)
    // Restore the DB review to its pre-rating state
    const { conceptId, prevReview, index: prevIndex, ratings: prevRatings } = undoSnapshot
    const review = await db.reviews.where('conceptId').equals(conceptId).first()
    if (review) {
      await db.reviews.update(review.id!, prevReview as Parameters<typeof db.reviews.update>[1])
    }
    ratingsRef.current = prevRatings
    setRatings(prevRatings)
    setIndex(prevIndex)
    setActiveConcept(primaryConceptId(plan.items[prevIndex]!))
    setPulseKey(0)
    if (shape === 'daily') await saveDailyProgress(prevIndex, prevRatings)
    else await saveSessionProgress(shape, sessionId(shape, eraId, domain, threadId), prevIndex, prevRatings)
  }, [undoSnapshot, plan, shape, eraId, domain, threadId])

  const handleRevealed = useCallback((rating: RecallRating | null) => {
    setRevealedRating(rating)
  }, [])

  const handleRate = useCallback(
    async (rating: RecallRating) => {
      if (!current || current.kind !== 'recall') return
      setSwipeDir(rating === 'again' ? 'left' : 'right')
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
    const great = accuracy !== null && accuracy >= 0.8
    const pct = accuracy !== null ? Math.round(accuracy * 100) : null
    const snap = progressSnapshot(allSessions, prefs.dailyGoalCards, prefs.streakFreezes)
    return (
      <M.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ease}
        className="surface p-8"
      >
        <M.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.05 }}
          className="text-4xl"
        >
          {plan.items.length === 0 ? '☁️' : great ? '🌟' : '✨'}
        </M.div>
        <M.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...ease, delay: 0.12 }}
          className="mt-3 font-serif text-2xl"
        >
          {plan.items.length === 0 ? 'Nothing due' : 'Session complete'}
        </M.h2>
        {plan.items.length === 0 ? (
          <M.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...ease, delay: 0.18 }}
            className="mt-3 text-ink-soft"
          >
            Nothing is due right now, and no new concepts are unlocked yet. Come back tomorrow, or revisit a story from your pathway.
          </M.p>
        ) : (
          <M.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...ease, delay: 0.18 }}
            className="mt-4 flex gap-6"
          >
            <div>
              <p className="text-3xl font-serif font-semibold text-ink">{ratings.length}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-wider text-ink-softer">cards</p>
            </div>
            {pct !== null && (
              <div>
                <p className={`text-3xl font-serif font-semibold ${great ? 'text-good' : 'text-ink'}`}>{pct}%</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wider text-ink-softer">recalled</p>
              </div>
            )}
          </M.div>
        )}
        {plan.items.length > 0 && snap.streak > 0 && (
          <M.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.32 }}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5"
          >
            <span className="text-base">🔥</span>
            <span className="text-sm font-medium text-accent">
              {snap.streak} day streak
            </span>
            {snap.goalMet && (
              <span className="text-[11px] text-ink-soft">· today's goal met</span>
            )}
          </M.div>
        )}
        <M.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...ease, delay: 0.4 }}
        >
          <Button onClick={onFinished} className="mt-8">
            Back to home
          </Button>
        </M.div>
      </M.section>
    )
  }

  if (!current) return <p className="text-ink-softer">Session ended.</p>

  const isRecallCard = current.kind === 'recall'
  const swipeVisible = isRecallCard && revealedRating !== undefined

  return (
    <>
      <div className="space-y-4">
        {/* Constellation strip */}
        <div className="overflow-hidden rounded-2xl border border-ink/[0.08] bg-bg-soft shadow-card">
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
            {shape === 'mistakes' && <span className="text-ink-soft">Struggling concepts</span>}
            {shape === 'daily' && <span className="text-ink-soft">Today</span>}
            {shape === 'collection' && collectionName && (
              <span className="text-ink-soft">{collectionName}</span>
            )}
            <span className="ml-3">
              {index + 1} of {plan.items.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {undoSnapshot && (
              <button
                type="button"
                onClick={handleUndo}
                className="flex items-center gap-1 rounded-full border border-ink/[0.10] bg-bg-soft px-2.5 py-1 text-ink-soft hover:border-accent/40 hover:text-ink"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 14 4 9l5-5" />
                  <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
                </svg>
                Undo
              </button>
            )}
            <button type="button" onClick={onCancel} className="text-ink-softer hover:text-ink">
              End session
            </button>
          </div>
        </div>

        {/* Segmented progress dots */}
        <div className="flex gap-1">
          {plan.items.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i < index
                  ? 'bg-accent'
                  : i === index
                    ? 'bg-accent/40'
                    : 'bg-bg-softer'
              }`}
            />
          ))}
        </div>

        {/* Ghost card stack for depth */}
        <div className="relative">
          <div className="absolute inset-x-4 -top-2.5 bottom-0 rounded-2xl border border-ink/[0.05] bg-bg-softer/40" />
          <div className="absolute inset-x-2 -top-1.5 bottom-0 rounded-2xl border border-ink/[0.07] bg-bg-softer/60" />

        <AnimatePresence mode="wait" custom={swipeDir}>
          <M.div
            key={current.cardKey}
            custom={swipeDir}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={cardTransition}
            className="relative surface overflow-hidden"
          >
            {/* Leech indicator */}
            {isRecallCard && current.review.failureStreak >= 3 && (
              <div className="flex items-center gap-1.5 border-b border-ink/[0.07] px-6 py-2">
                <span className="text-[10px]">⚠</span>
                <span className="text-[10px] uppercase tracking-wider text-ink-softer">This one keeps slipping</span>
              </div>
            )}
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
              <div className="border-t border-ink/[0.07] px-6 pb-6 pt-4">
                <SwipeRatingZone onRate={handleRate} suggestedRating={revealedRating} />
                {/* Explain-my-answer (Wave 4): show after a wrong answer */}
                {revealedRating === 'again' && current?.kind === 'recall' && (
                  <div className="mt-3">
                    {!explainText && (
                      <button
                        type="button"
                        disabled={explainLoading}
                        onClick={async () => {
                          if (!current || current.kind !== 'recall') return
                          setExplainLoading(true)
                          const res = await explainMyAnswer(
                            current.concept.name,
                            current.question.prompt,
                            '(unsure)',
                            current.question.expectedAnswer,
                          )
                          setExplainLoading(false)
                          setExplainText(res.ok ? res.reply : res.error)
                        }}
                        className="w-full rounded-xl border border-ink/[0.08] bg-bg-soft py-2 text-xs text-ink-softer transition-colors hover:border-accent/30 hover:text-ink-soft disabled:opacity-50"
                      >
                        {explainLoading ? 'Thinking…' : 'Explain this'}
                      </button>
                    )}
                    {explainText && (
                      <p className="rounded-xl border border-ink/[0.07] bg-bg-soft px-4 py-3 text-xs leading-relaxed text-ink-soft">
                        {explainText}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </M.div>
        </AnimatePresence>
        </div>{/* end ghost stack wrapper */}
      </div>

      <ConceptRabbitHole rootConceptId={rabbitHoleId} onClose={() => setRabbitHoleId(null)} />
    </>
  )
}
