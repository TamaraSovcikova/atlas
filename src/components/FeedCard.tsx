import { useEffect, useRef, useState } from 'react'
import type { Concept, RelationType } from '../db/schema'
import { db } from '../db/schema'
import type { FeedItem } from '../lib/feed'
import type { RecallItem } from '../lib/session'
import { buildRecallItemFor } from '../lib/session'
import type { RecallRating } from '../lib/fsrs'
import { recordRating, recordFeedCard } from '../lib/grade'
import { useSettings } from '../store/useSettings'
import { RecallCard } from './RecallCard'
import { LinkedText } from './LinkedText'
import { Button } from './ui/Button'

const RELATION_PHRASE: Record<RelationType, string> = {
  caused: 'directly caused',
  influenced_by: 'heavily influenced',
  contemporary_of: 'was a contemporary of',
  located_in: 'was located in',
  part_of: 'was part of',
  opposed: 'actively opposed',
  successor_of: 'succeeded',
  belief_in: 'was rooted in belief in',
  student_of: 'was a student of',
}

const DOMAIN_DOT: Record<string, string> = {
  history: 'bg-[#9C5B43]',
  geography: 'bg-[#5E7A63]',
  science: 'bg-[#4A6175]',
  culture: 'bg-[#6E4A6B]',
  religions: 'bg-[#9A7B3F]',
  politics: 'bg-[#8A4A4A]',
  modern_world: 'bg-[#3F6E6A]',
}

export type SwipeInterest = 'left' | 'right'

interface FeedCardProps {
  item: FeedItem
  active: boolean
  /** Discovery-card horizontal interest gesture (left = more/deeper, right = less). */
  onInterest: (direction: SwipeInterest) => void
  /** A learning card was graded — pass rating + whether it was a first-seen concept. */
  onGraded: (rating: RecallRating, isNew: boolean) => void
  /** Move to the next feed item (after a grade). */
  onAdvance: () => void
  /** Open the deeper story brief / rabbit hole for a concept (optional deep dive). */
  onOpenConcept: (concept: Concept, threadName: string | null) => void
}

export function FeedCard(props: FeedCardProps) {
  const { item } = props
  if (item.kind === 'connection') return <ConnectionCard {...props} item={item} />
  return <LearningCard {...props} item={item} />
}

// ── Interest-swipe wrapper — native non-passive touch listeners ──────────────
// touch-action / pointer-capture proved unreliable on iOS Safari inside a
// snap-y scroll container: the browser starts the vertical scroll before JS can
// claim the gesture. The only bulletproof fix is a NON-PASSIVE touchmove
// listener that calls preventDefault() the moment horizontal intent is detected,
// which physically stops the scroll container. React's synthetic touch handlers
// are passive (can't preventDefault), so we attach them natively via a ref.

const INTEREST_THRESHOLD = 80
const DIR_LOCK_PX = 8

function InterestSwipe({
  onCommit,
  children,
}: {
  onCommit: (direction: SwipeInterest) => void
  children: React.ReactNode
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [dx, setDx] = useState(0)
  const [dragging, setDragging] = useState(false)
  // Keep the live commit callback in a ref so the effect can stay mount-only.
  const commitRef = useRef(onCommit)
  commitRef.current = onCommit

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    let startX = 0
    let startY = 0
    let dir: 'h' | 'v' | null = null
    let active = false
    let lastDx = 0

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length !== 1) return
      const t = e.touches[0]!
      startX = t.clientX
      startY = t.clientY
      dir = null
      active = true
      lastDx = 0
      setDx(0)
    }

    function onTouchMove(e: TouchEvent) {
      if (!active) return
      const t = e.touches[0]!
      const ddx = t.clientX - startX
      const ddy = t.clientY - startY
      if (dir === null) {
        if (Math.abs(ddx) < DIR_LOCK_PX && Math.abs(ddy) < DIR_LOCK_PX) return
        dir = Math.abs(ddx) > Math.abs(ddy) ? 'h' : 'v'
        if (dir === 'h') setDragging(true)
      }
      if (dir === 'h') {
        // Stop the scroll-snap container from scrolling. Requires passive:false.
        if (e.cancelable) e.preventDefault()
        lastDx = ddx
        setDx(ddx)
      }
    }

    function finish() {
      if (dir === 'h') {
        if (lastDx <= -INTEREST_THRESHOLD) commitRef.current('left')
        else if (lastDx >= INTEREST_THRESHOLD) commitRef.current('right')
      }
      active = false
      dir = null
      lastDx = 0
      setDragging(false)
      setDx(0)
    }

    function onTouchEnd() { finish() }
    function onTouchCancel() { finish() }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchCancel, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchCancel)
    }
  }, [])

  // ── Desktop mouse path (no scroll-snap conflict; React handlers are fine) ────
  const mouse = useRef<{ startX: number; dir: 'h' | 'v' | null } | null>(null)
  function onMouseDown(e: React.MouseEvent) {
    mouse.current = { startX: e.clientX, dir: null }
    setDx(0)
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!mouse.current || (e.buttons & 1) === 0) return
    const ddx = e.clientX - mouse.current.startX
    if (Math.abs(ddx) > DIR_LOCK_PX && mouse.current.dir !== 'h') {
      mouse.current.dir = 'h'
      setDragging(true)
    }
    if (mouse.current.dir === 'h') setDx(ddx)
  }
  function endMouse() {
    if (mouse.current?.dir === 'h') {
      if (dx <= -INTEREST_THRESHOLD) onCommit('left')
      else if (dx >= INTEREST_THRESHOLD) onCommit('right')
    }
    mouse.current = null
    setDragging(false)
    setDx(0)
  }

  const clampedDx = Math.max(-INTEREST_THRESHOLD - 30, Math.min(INTEREST_THRESHOLD + 30, dx))
  const dist = Math.min(1, Math.abs(dx) / INTEREST_THRESHOLD)
  const side = dx < -4 ? 'more' : dx > 4 ? 'less' : null
  const past = Math.abs(dx) >= INTEREST_THRESHOLD
  const rot = (clampedDx / INTEREST_THRESHOLD) * 3.5

  return (
    <div
      ref={rootRef}
      className="relative select-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endMouse}
      onMouseLeave={endMouse}
    >
      {/* Directional badge — appears on the side you're dragging toward */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-20 flex items-center pl-3"
        style={{ opacity: side === 'more' ? 0.4 + dist * 0.6 : 0, transition: dragging ? 'none' : 'opacity 0.25s ease' }}
        aria-hidden="true"
      >
        <div
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-card ${past ? 'bg-accent text-on-accent' : 'bg-accent/15 text-accent'}`}
          style={{ transform: `scale(${0.85 + dist * 0.2})` }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="-rotate-90">
            <path d="m6 9 6 6 6-6" />
          </svg>
          More like this
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-20 flex items-center justify-end pr-3"
        style={{ opacity: side === 'less' ? 0.4 + dist * 0.6 : 0, transition: dragging ? 'none' : 'opacity 0.25s ease' }}
        aria-hidden="true"
      >
        <div
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-card ${past ? 'bg-ink/75 text-bg' : 'bg-ink/10 text-ink-softer'}`}
          style={{ transform: `scale(${0.85 + dist * 0.2})` }}
        >
          Less of this
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="rotate-90">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* The whole card moves: translate + slight rotation, springs back on release */}
      <div
        style={{
          transform: `translateX(${clampedDx}px) rotate(${rot}deg)`,
          transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ── Connection card (reading + interest swipe) ───────────────────────────────

function ConnectionCard({
  item,
  active,
  onInterest,
  onOpenConcept,
}: FeedCardProps & { item: Extract<FeedItem, { kind: 'connection' }> }) {
  const prefs = useSettings((s) => s.prefs)

  useEffect(() => {
    if (!active || !prefs.listenMode || !window.speechSynthesis) return
    const phrase = RELATION_PHRASE[item.relation] ?? 'relates to'
    const text = `${item.from.name} ${phrase} ${item.to.name}.`
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = prefs.speechRate ?? 1.0
    window.speechSynthesis.speak(utt)
    return () => { window.speechSynthesis?.cancel() }
  }, [active, prefs.listenMode, prefs.speechRate, item.from.id, item.to.id])

  const yearDiff =
    item.from.approxYear !== null && item.to.approxYear !== null
      ? Math.abs(item.to.approxYear - item.from.approxYear)
      : null
  return (
    <CardFrame label="A connection in your constellation" onInterest={onInterest}>
      <button
        type="button"
        onClick={() => onOpenConcept(item.from, null)}
        className="block w-full text-left"
      >
        <p className="font-serif text-2xl leading-snug text-ink">
          <span className="text-accent">{item.from.name}</span>{' '}
          <span className="text-ink-soft">{RELATION_PHRASE[item.relation]}</span>{' '}
          <span className="text-accent">{item.to.name}</span>
        </p>
        {yearDiff !== null && yearDiff > 5 && (
          <p className="mt-3 text-sm text-ink-softer">{yearDiff} years apart</p>
        )}
      </button>
    </CardFrame>
  )
}

// ── Learning card (concept brief → StoryBrief recall / inline recall → grade) ─

type Phase = 'brief' | 'recall'

function LearningCard({
  item,
  active,
  onInterest,
  onGraded,
  onAdvance,
  onOpenConcept,
}: FeedCardProps & { item: Extract<FeedItem, { kind: 'concept' | 'review' }> }) {
  const prefs = useSettings((s) => s.prefs)
  const concept = item.concept
  const isNew = item.kind === 'concept'
  // Two honest card types (Model A): a NEW concept is a Story card you read
  // once ("Got it" seeds its FSRS schedule); a DUE concept is a Recall card you
  // test inline. Recall never duplicates the story — the summary is the reveal,
  // shown only when the concept comes back due, not right after meeting it.
  const phase: Phase = isNew ? 'brief' : 'recall'
  const [recall, setRecall] = useState<RecallItem | null>(null)
  const [revealed, setRevealed] = useState<RecallRating | null | undefined>(undefined)
  const [grading, setGrading] = useState(false)

  // Listen mode TTS — brief phase only (don't give away recall answers)
  useEffect(() => {
    if (!active || !prefs.listenMode || !window.speechSynthesis || phase !== 'brief') return
    const text = `${concept.name}. ${concept.summary}`
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = prefs.speechRate ?? 1.0
    window.speechSynthesis.speak(utt)
    return () => { window.speechSynthesis?.cancel() }
  }, [active, prefs.listenMode, prefs.speechRate, concept.id, phase])

  async function openConceptById(id: string) {
    if (id === concept.id) { onOpenConcept(concept, null); return }
    const c = await db.concepts.get(id)
    if (c) onOpenConcept(c, null)
  }

  useEffect(() => {
    if (phase !== 'recall' || recall) return
    let cancelled = false
    buildRecallItemFor(concept.id, prefs).then((it) => {
      if (!cancelled) setRecall(it)
    })
    return () => { cancelled = true }
  }, [phase, recall, concept.id, prefs])

  async function handleRate(rating: RecallRating) {
    if (grading) return
    setGrading(true)
    const now = Date.now()
    await recordRating(concept.id, rating, now)
    await recordFeedCard(rating, isNew, now)
    onGraded(rating, isNew)
    onAdvance()
  }

  if (phase === 'brief') {
    return (
      <CardFrame label="New · read it once" onInterest={onInterest}>
        <BriefBody
          concept={concept}
          onConceptClick={openConceptById}
          onOpenSelf={() => onOpenConcept(concept, null)}
        />
        <div className="mt-5">
          <Button onClick={() => handleRate('good')} disabled={grading} className="w-full">
            Got it
          </Button>
          <p className="mt-2 text-center text-[11px] text-ink-softer">
            We'll quietly bring it back to test you when the time is right.
          </p>
        </div>
      </CardFrame>
    )
  }

  // recall phase — due review, tested inline. The summary appears here as the
  // reveal, so it never repeats the story you read when you first met it.
  return (
    <CardFrame label="Due · recall it" domainDot={concept.domain}>
      {!recall ? (
        <p className="text-ink-softer">Preparing…</p>
      ) : (
        <>
          <RecallCard
            item={recall}
            onAnswered={() => {}}
            onRevealed={(r) => setRevealed(r)}
            onConceptClick={openConceptById}
          />
          {revealed !== undefined && (
            <div className="mt-4 border-t border-ink/[0.07] pt-4">
              <button
                type="button"
                disabled={grading}
                onClick={() => handleRate(revealed ?? 'good')}
                className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-medium text-on-accent hover:bg-accent-soft disabled:opacity-60"
              >
                Continue
              </button>
            </div>
          )}
        </>
      )}
    </CardFrame>
  )
}

// ── Shared scaffolding ───────────────────────────────────────────────────────

function CardFrame({
  label,
  domainDot,
  onInterest,
  children,
}: {
  label: string
  domainDot?: string
  /** When provided, the whole card becomes horizontally swipeable for interest. */
  onInterest?: (direction: SwipeInterest) => void
  children: React.ReactNode
}) {
  const surface = <div className="surface p-6">{children}</div>
  return (
    <div className="flex min-h-full w-full flex-col justify-center px-5 py-10">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-4 flex items-center gap-2">
          {domainDot && (
            <span className={`h-2 w-2 rounded-full ${DOMAIN_DOT[domainDot] ?? 'bg-accent/40'}`} />
          )}
          <p className="text-[10px] font-medium uppercase tracking-widest text-ink-softer">{label}</p>
        </div>

        {onInterest ? <InterestSwipe onCommit={onInterest}>{surface}</InterestSwipe> : surface}

        {/* Swipe legend (only on interest cards) */}
        {onInterest && (
          <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-ink-softer/70">
            <span className="flex items-center gap-1 text-accent/70">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Swipe for more
            </span>
            <span className="h-3 w-px bg-ink/15" />
            <span className="flex items-center gap-1">
              Less of it
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </div>
        )}

        {/* Swipe-up cue */}
        <div className="mt-4 flex justify-center">
          <svg
            className="animate-bounce text-ink-softer/40"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function BriefBody({
  concept,
  onConceptClick,
  onOpenSelf,
}: {
  concept: Concept
  onConceptClick: (id: string) => void
  onOpenSelf: () => void
}) {
  const [imgLoaded, setImgLoaded] = useState(false)
  return (
    <div>
      <button type="button" onClick={onOpenSelf} className="block w-full text-left">
        <h3 className="font-serif text-2xl text-ink">{concept.name}</h3>
      </button>
      {concept.imageUrl && (
        <div className="mt-3 overflow-hidden rounded-xl">
          <img
            src={concept.imageUrl}
            alt={concept.name}
            className="h-44 w-full object-cover transition-opacity duration-500"
            style={{ opacity: imgLoaded ? 1 : 0 }}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              const el = e.currentTarget.parentElement
              if (el) el.style.display = 'none'
            }}
          />
        </div>
      )}
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
        <LinkedText text={concept.summary} onConceptClick={onConceptClick} />
      </p>
      {concept.wikipediaUrl && (
        <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-accent/70">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.09 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm-1.5 14.5v-9l6.5 4.5-6.5 4.5z" />
          </svg>
          Read more
        </span>
      )}
    </div>
  )
}
