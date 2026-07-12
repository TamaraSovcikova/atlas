import { useCallback, useEffect, useRef, useState } from 'react'
import type { Concept } from '../db/schema'
import {
  freshFeedState,
  loadCeilingAck,
  loadInterest,
  nextFeedBatch,
  primaryConcept,
  recordSwipe,
  saveCeilingAck,
  type FeedItem,
  type FeedState,
} from '../lib/feed'
import { connectionsFor } from '../lib/connections'
import { deepenConcept } from '../lib/community'
import { recordRating, recordFeedCard } from '../lib/grade'
import { useSettings } from '../store/useSettings'
import { FeedCard, type SwipeInterest } from './FeedCard'

const INITIAL_BATCH = 6
const PAGE_BATCH = 5
const RATE_STEPS = [0.75, 1.0, 1.25, 1.5, 2.0]

interface Props {
  onOpenConcept: (concept: Concept, threadName: string | null) => void
  onOpenDashboard: () => void
}

export function FeedView({ onOpenConcept, onOpenDashboard }: Props) {
  const prefs = useSettings((s) => s.prefs)
  const updatePrefs = useSettings((s) => s.update)
  const [items, setItems] = useState<FeedItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [exhausted, setExhausted] = useState(false)
  // Name of the topic currently being deepened via AI (for a subtle indicator).
  const [deepening, setDeepening] = useState<string | null>(null)
  const deepenedKeys = useRef<Set<string>>(new Set())
  // Knowledge-level gate pill (§4b): "Foundations first" while a 'new'-level
  // user's gate is at stage 1; a one-shot "Deeper waters" moment when it rises.
  const [gatePill, setGatePill] = useState<'foundations' | 'unlocked' | null>(null)

  const updateGatePill = useCallback(async (stage: 1 | 2 | 3 | null) => {
    if (stage === null) {
      setGatePill(null)
      return
    }
    const ack = await loadCeilingAck()
    if (stage > ack) {
      // One-shot: acknowledge immediately so the moment shows for this batch
      // only, then fades on the next batch load.
      setGatePill('unlocked')
      await saveCeilingAck(stage)
    } else if (stage === 1) {
      setGatePill('foundations')
    } else {
      setGatePill(null)
    }
  }, [])

  const stateRef = useRef<FeedState | null>(null)
  const loadingRef = useRef(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemEls = useRef<(HTMLElement | null)[]>([])
  const dwellStartRef = useRef<number>(Date.now())
  const currentIndexRef = useRef(0)
  const swipedKeys = useRef<Set<string>>(new Set())
  // Tracks new concept cards that have been graded via "Got it" (or auto-seeded on scroll-past),
  // so handleCurrentChange doesn't double-seed when the card was already explicitly graded.
  const gradedKeys = useRef<Set<string>>(new Set())
  const pullStartY = useRef<number | null>(null)

  // ── Loading ────────────────────────────────────────────────────────────────
  const appendMore = useCallback(async () => {
    if (loadingRef.current || exhausted || !stateRef.current) return
    loadingRef.current = true
    // Read prefs from the store directly so a Settings level change applies to
    // the very next batch without re-creating callbacks / re-initing the feed.
    const res = await nextFeedBatch(
      stateRef.current,
      PAGE_BATCH,
      undefined,
      undefined,
      useSettings.getState().prefs,
    )
    stateRef.current = res.state
    if (res.items.length === 0) setExhausted(true)
    else setItems((prev) => [...prev, ...res.items])
    void updateGatePill(res.gateStage)
    loadingRef.current = false
  }, [exhausted, updateGatePill])

  useEffect(() => {
    let cancelled = false
    async function init() {
      const weights = await loadInterest()
      const state = freshFeedState(weights)
      const res = await nextFeedBatch(
        state,
        INITIAL_BATCH,
        undefined,
        undefined,
        useSettings.getState().prefs,
      )
      if (cancelled) return
      stateRef.current = res.state
      setItems(res.items)
      if (res.items.length === 0) setExhausted(true)
      void updateGatePill(res.gateStage)
      dwellStartRef.current = Date.now()
    }
    init()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Current-item tracking (dwell + implicit up-swipe + infinite append) ──────
  useEffect(() => {
    const root = containerRef.current
    if (!root || items.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.6) continue
          const idx = Number((entry.target as HTMLElement).dataset.index)
          if (Number.isNaN(idx) || idx === currentIndexRef.current) continue
          handleCurrentChange(idx)
        }
      },
      { root, threshold: [0.6] },
    )
    for (const el of itemEls.current) if (el) observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length])

  // Seed one new-concept card into FSRS (firstSeenAt + a 'good' schedule) so it
  // counts as "covered" and never reappears as New. Idempotent via gradedKeys.
  const seedConcept = useCallback((item: FeedItem | undefined, now = Date.now()) => {
    if (!item || item.kind !== 'concept' || gradedKeys.current.has(item.key)) return
    gradedKeys.current.add(item.key)
    recordRating(item.concept.id, 'good', now).catch(() => {})
    recordFeedCard('good', true, now).catch(() => {})
  }, [])

  function handleCurrentChange(idx: number) {
    const prevIdx = currentIndexRef.current
    const now = Date.now()
    const dwell = now - dwellStartRef.current
    dwellStartRef.current = now

    const prev = items[prevIdx]

    // Seed EVERY new concept card at or above where we now are — anything the
    // user has scrolled past counts as covered. Seeding only the immediately
    // previous card missed fast flicks (intermediate cards never hit the 0.6
    // intersection threshold), which is why covered concepts kept coming back
    // as "New". gradedKeys makes this idempotent.
    for (let i = 0; i < idx && i < items.length; i++) seedConcept(items[i], now)

    // Implicit dwell signal for the item we just left (discovery cards only —
    // reviews are graded, not interest-rated).
    if (prev && prev.kind !== 'review' && !swipedKeys.current.has(prev.key) && stateRef.current) {
      recordSwipe(prev, 'up', dwell, stateRef.current).then((s) => {
        stateRef.current = s
      })
    }

    currentIndexRef.current = idx
    setCurrentIndex(idx)
    if (idx >= items.length - 2) appendMore()
  }

  // The card you're on when you background/close the app never "leaves the
  // viewport", so seed the current card on tab-hide and on unmount — otherwise
  // the last concept you read each session is lost and shows as New next time.
  useEffect(() => {
    function seedCurrent() {
      seedConcept(items[currentIndexRef.current])
    }
    function onVisibility() {
      if (document.visibilityState === 'hidden') seedCurrent()
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', seedCurrent)
    return () => {
      seedCurrent()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', seedCurrent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  // ── Advance / interest ───────────────────────────────────────────────────────
  const advanceTo = useCallback((j: number) => {
    const el = itemEls.current[j]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // Deepen-on-demand: when the user asks for "more" on a topic that has little
  // unseen linked content left, generate deeper related cards via AI, wire them
  // into the graph, and surface them next. Best-effort + online-only; at most one
  // attempt per concept per session.
  const maybeDeepen = useCallback(async (item: FeedItem) => {
    const concept = primaryConcept(item)
    if (deepenedKeys.current.has(concept.id)) return
    const hits = await connectionsFor(concept.id, 6)
    const unseen = hits.filter((h) => h.concept.firstSeenAt === null)
    if (unseen.length >= 3) return // plenty to explore already — don't spend an AI call
    deepenedKeys.current.add(concept.id)
    setDeepening(concept.name)
    const ids = await deepenConcept(concept.id)
    setDeepening(null)
    if (!ids.length || !stateRef.current) return
    // Seed the deep-queue with the new concepts, then pull a batch so they appear.
    const shown = stateRef.current.shownConceptIds
    const fresh = ids.filter((id) => !shown.has(id))
    stateRef.current = {
      ...stateRef.current,
      deepQueue: [...fresh, ...stateRef.current.deepQueue.filter((d) => !fresh.includes(d))].slice(0, 16),
    }
    const res = await nextFeedBatch(
      stateRef.current,
      PAGE_BATCH,
      undefined,
      undefined,
      useSettings.getState().prefs,
    )
    stateRef.current = res.state
    if (res.items.length) {
      setExhausted(false)
      setItems((prev) => [...prev, ...res.items])
    }
    void updateGatePill(res.gateStage)
  }, [updateGatePill])

  const handleInterest = useCallback(
    (index: number, item: FeedItem, direction: SwipeInterest) => {
      swipedKeys.current.add(item.key)
      const dwell = Date.now() - dwellStartRef.current
      if (stateRef.current) {
        recordSwipe(item, direction, dwell, stateRef.current).then((s) => {
          stateRef.current = s
        })
      }
      // "More" (left) is the deepen signal.
      if (direction === 'left') void maybeDeepen(item)
      advanceTo(index + 1)
    },
    [advanceTo, maybeDeepen],
  )

  // ── Pull-down-at-top → Dashboard ─────────────────────────────────────────────
  function onTouchStart(e: React.TouchEvent) {
    const root = containerRef.current
    pullStartY.current = root && root.scrollTop <= 0 ? e.touches[0]!.clientY : null
  }
  function onTouchMove(e: React.TouchEvent) {
    const root = containerRef.current
    if (pullStartY.current === null || !root || root.scrollTop > 0) return
    if (e.touches[0]!.clientY - pullStartY.current > 100) {
      pullStartY.current = null
      onOpenDashboard()
    }
  }

  return (
    <div className="relative h-full">
      {/* Top bar: dashboard affordance + listen toggle */}
      <div className="absolute left-0 right-0 top-2 z-10 flex items-center justify-between px-3">
        <button
          type="button"
          onClick={() => updatePrefs({ listenMode: !prefs.listenMode })}
          className={`rounded-full border border-ink/[0.08] bg-bg/80 p-1.5 backdrop-blur-sm transition-colors ${
            prefs.listenMode ? 'text-accent' : 'text-ink-softer hover:text-ink'
          }`}
          aria-label={prefs.listenMode ? 'Turn off listen mode' : 'Turn on listen mode'}
        >
          {prefs.listenMode ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>

        {/* Reading-speed chip — appears beside the listen toggle when it's on,
            so the speed control lives where listen mode is actually used. */}
        {prefs.listenMode && (
          <button
            type="button"
            onClick={() => {
              const cur = prefs.speechRate ?? 1.0
              const i = RATE_STEPS.findIndex((r) => Math.abs(r - cur) < 0.01)
              const next = RATE_STEPS[(i + 1) % RATE_STEPS.length]!
              updatePrefs({ speechRate: next })
            }}
            className="rounded-full border border-ink/[0.08] bg-bg/80 px-2.5 py-1 text-[11px] tabular-nums text-accent backdrop-blur-sm transition-colors hover:text-ink"
            aria-label="Change reading speed"
          >
            {(prefs.speechRate ?? 1.0).toFixed(2).replace(/0$/, '')}×
          </button>
        )}

        <button
          type="button"
          onClick={onOpenDashboard}
          className="flex items-center gap-1 rounded-full border border-ink/[0.08] bg-bg/80 px-3 py-1 text-[11px] text-ink-softer backdrop-blur-sm transition-colors hover:text-ink"
          aria-label="Open dashboard"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
          Today
        </button>

        {/* Spacer to keep Today centred */}
        <div className="w-8" />
      </div>

      {/* Knowledge-level gate pill — "you are on foundations" while the gate is
          at stage 1, and a one-shot "deeper waters" moment when it rises. */}
      {gatePill && (
        <div className="pointer-events-none absolute left-1/2 top-12 z-10 -translate-x-1/2">
          <div className="rounded-full border border-accent/20 bg-bg/90 px-3.5 py-1.5 text-[11px] text-accent shadow-card backdrop-blur-sm">
            {gatePill === 'foundations'
              ? 'Foundations first'
              : 'Deeper waters unlocked - your map grows.'}
          </div>
        </div>
      )}

      {/* Deepen-on-demand indicator — the graph is growing toward what you asked for */}
      {deepening && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border border-accent/20 bg-bg/90 px-3.5 py-1.5 text-[11px] text-accent shadow-card backdrop-blur-sm">
            <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Digging deeper into {deepening}…
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        className="h-full snap-y snap-mandatory overflow-y-scroll overscroll-y-contain scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((item, i) => (
          <section
            key={item.key}
            data-index={i}
            ref={(el) => {
              itemEls.current[i] = el
            }}
            className="flex min-h-full snap-start items-stretch"
          >
            <FeedCard
              item={item}
              active={i === currentIndex}
              onInterest={(dir) => handleInterest(i, item, dir)}
              onGraded={() => {
                gradedKeys.current.add(item.key)
                if (i >= items.length - 2) appendMore()
              }}
              onAdvance={() => advanceTo(i + 1)}
              onOpenConcept={onOpenConcept}
            />
          </section>
        ))}

        {exhausted && (
          <section className="flex min-h-full snap-start items-center justify-center px-6">
            <div className="text-center">
              <p className="font-serif text-xl text-ink">You're all caught up</p>
              <p className="mt-2 text-sm text-ink-soft">
                Nothing more is due and the Spine is paused for now. Come back later, or open
                your dashboard.
              </p>
              <button
                type="button"
                onClick={onOpenDashboard}
                className="mt-5 rounded-xl border border-ink/[0.08] bg-bg-soft px-4 py-2 text-sm text-ink-soft hover:border-accent/30 hover:text-ink"
              >
                Open dashboard
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
