import { useCallback, useEffect, useRef, useState } from 'react'
import type { Concept } from '../db/schema'
import {
  freshFeedState,
  loadInterest,
  nextFeedBatch,
  recordSwipe,
  type FeedItem,
  type FeedState,
} from '../lib/feed'
import { FeedCard, type SwipeInterest } from './FeedCard'

const INITIAL_BATCH = 6
const PAGE_BATCH = 5

interface Props {
  onOpenConcept: (concept: Concept, threadName: string | null) => void
  onOpenDashboard: () => void
}

export function FeedView({ onOpenConcept, onOpenDashboard }: Props) {
  const [items, setItems] = useState<FeedItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [exhausted, setExhausted] = useState(false)

  const stateRef = useRef<FeedState | null>(null)
  const loadingRef = useRef(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemEls = useRef<(HTMLElement | null)[]>([])
  const dwellStartRef = useRef<number>(Date.now())
  const currentIndexRef = useRef(0)
  const swipedKeys = useRef<Set<string>>(new Set())
  const pullStartY = useRef<number | null>(null)

  // ── Loading ────────────────────────────────────────────────────────────────
  const appendMore = useCallback(async () => {
    if (loadingRef.current || exhausted || !stateRef.current) return
    loadingRef.current = true
    const res = await nextFeedBatch(stateRef.current, PAGE_BATCH)
    stateRef.current = res.state
    if (res.items.length === 0) setExhausted(true)
    else setItems((prev) => [...prev, ...res.items])
    loadingRef.current = false
  }, [exhausted])

  useEffect(() => {
    let cancelled = false
    async function init() {
      const weights = await loadInterest()
      const state = freshFeedState(weights)
      const res = await nextFeedBatch(state, INITIAL_BATCH)
      if (cancelled) return
      stateRef.current = res.state
      setItems(res.items)
      if (res.items.length === 0) setExhausted(true)
      dwellStartRef.current = Date.now()
    }
    init()
    return () => {
      cancelled = true
    }
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

  function handleCurrentChange(idx: number) {
    const prevIdx = currentIndexRef.current
    const now = Date.now()
    const dwell = now - dwellStartRef.current
    dwellStartRef.current = now

    // Implicit dwell signal for the item we just left (discovery cards only —
    // reviews are graded, not interest-rated).
    const prev = items[prevIdx]
    if (prev && prev.kind !== 'review' && !swipedKeys.current.has(prev.key) && stateRef.current) {
      recordSwipe(prev, 'up', dwell, stateRef.current).then((s) => {
        stateRef.current = s
      })
    }

    currentIndexRef.current = idx
    setCurrentIndex(idx)
    if (idx >= items.length - 2) appendMore()
  }

  // ── Advance / interest ───────────────────────────────────────────────────────
  const advanceTo = useCallback((j: number) => {
    const el = itemEls.current[j]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleInterest = useCallback(
    (index: number, item: FeedItem, direction: SwipeInterest) => {
      swipedKeys.current.add(item.key)
      const dwell = Date.now() - dwellStartRef.current
      if (stateRef.current) {
        recordSwipe(item, direction, dwell, stateRef.current).then((s) => {
          stateRef.current = s
        })
      }
      advanceTo(index + 1)
    },
    [advanceTo],
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
      {/* Dashboard affordance (also the click target for non-touch) */}
      <button
        type="button"
        onClick={onOpenDashboard}
        className="absolute left-1/2 top-2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-ink/[0.08] bg-bg/80 px-3 py-1 text-[11px] text-ink-softer backdrop-blur-sm transition-colors hover:text-ink"
        aria-label="Open dashboard"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 9 6 6 6-6" />
        </svg>
        Today
      </button>

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
