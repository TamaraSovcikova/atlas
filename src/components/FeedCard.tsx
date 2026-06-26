import { useEffect, useRef, useState } from 'react'
import { useMotionValue, useTransform } from 'motion/react'
import type { Concept, RelationType } from '../db/schema'
import type { FeedItem } from '../lib/feed'
import type { RecallItem } from '../lib/session'
import { buildRecallItemFor } from '../lib/session'
import type { RecallRating } from '../lib/fsrs'
import { recordRating, recordFeedCard } from '../lib/grade'
import { useSettings } from '../store/useSettings'
import { RecallCard } from './RecallCard'
import { SwipeRatingZone } from './SwipeRatingZone'
import { Button } from './ui/Button'
import { M } from './ui/motion'

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
  /** Move to the next feed item (after a grade or a "skip"). */
  onAdvance: () => void
  /** Open the deeper story brief / rabbit hole for a concept. */
  onOpenConcept: (concept: Concept, threadName: string | null) => void
}

export function FeedCard(props: FeedCardProps) {
  const { item } = props
  if (item.kind === 'connection') return <ConnectionCard {...props} item={item} />
  return <LearningCard {...props} item={item} />
}

// ── Interest-swipe wrapper (horizontal drag → more/less) ─────────────────────

const INTEREST_THRESHOLD = 90

function InterestSwipe({
  onCommit,
  children,
}: {
  onCommit: (direction: SwipeInterest) => void
  children: React.ReactNode
}) {
  const x = useMotionValue(0)
  const moreOpacity = useTransform(x, [-INTEREST_THRESHOLD, -20], [1, 0])
  const lessOpacity = useTransform(x, [20, INTEREST_THRESHOLD], [0, 1])
  const dragDist = useRef(0)

  return (
    <div className="relative">
      {/* Affordance labels revealed as the card is dragged */}
      <M.div
        style={{ opacity: moreOpacity }}
        className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-accent"
      >
        More of this ←
      </M.div>
      <M.div
        style={{ opacity: lessOpacity }}
        className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-medium text-ink-softer"
      >
        → Less like this
      </M.div>
      <M.div
        style={{ x }}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
        onDragStart={() => {
          dragDist.current = 0
        }}
        onDrag={(_, info) => {
          dragDist.current = Math.abs(info.offset.x)
        }}
        onDragEnd={(_, info) => {
          if (info.offset.x <= -INTEREST_THRESHOLD) onCommit('left')
          else if (info.offset.x >= INTEREST_THRESHOLD) onCommit('right')
        }}
      >
        {children}
      </M.div>
    </div>
  )
}

// ── Connection card (reading + interest swipe) ───────────────────────────────

function ConnectionCard({
  item,
  onInterest,
  onAdvance,
  onOpenConcept,
}: FeedCardProps & { item: Extract<FeedItem, { kind: 'connection' }> }) {
  const yearDiff =
    item.from.approxYear !== null && item.to.approxYear !== null
      ? Math.abs(item.to.approxYear - item.from.approxYear)
      : null
  return (
    <CardFrame label="A connection in your constellation">
      <InterestSwipe onCommit={onInterest}>
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
      </InterestSwipe>
      <SkipHint onAdvance={onAdvance} />
    </CardFrame>
  )
}

// ── Learning card (concept brief → inline recall → grade) ────────────────────

type Phase = 'brief' | 'recall'

function LearningCard({
  item,
  onInterest,
  onGraded,
  onAdvance,
  onOpenConcept,
}: FeedCardProps & { item: Extract<FeedItem, { kind: 'concept' | 'review' }> }) {
  const prefs = useSettings((s) => s.prefs)
  const concept = item.concept
  const isNew = item.kind === 'concept'
  const [phase, setPhase] = useState<Phase>(isNew ? 'brief' : 'recall')
  const [recall, setRecall] = useState<RecallItem | null>(null)
  const [revealed, setRevealed] = useState<RecallRating | null | undefined>(undefined)
  const [grading, setGrading] = useState(false)

  // Build the recall item lazily when we enter the recall phase.
  useEffect(() => {
    if (phase !== 'recall' || recall) return
    let cancelled = false
    buildRecallItemFor(concept.id, prefs).then((it) => {
      if (!cancelled) setRecall(it)
    })
    return () => {
      cancelled = true
    }
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
      <CardFrame label={isNew ? 'New · tap to read the story' : 'From your map'}>
        <InterestSwipe onCommit={onInterest}>
          <button
            type="button"
            onClick={() => onOpenConcept(concept, null)}
            className="block w-full text-left"
          >
            <BriefBody concept={concept} />
          </button>
        </InterestSwipe>
        <div className="mt-5 flex items-center gap-3">
          <Button onClick={() => setPhase('recall')} className="flex-1">
            Recall it
          </Button>
          <button
            type="button"
            onClick={onAdvance}
            className="rounded-xl px-4 py-2.5 text-sm text-ink-softer transition-colors hover:text-ink-soft"
          >
            Skip
          </button>
        </div>
      </CardFrame>
    )
  }

  // recall phase
  return (
    <CardFrame label={isNew ? 'Lock it in' : 'Ready to review'} domainDot={concept.domain}>
      {!recall ? (
        <p className="text-ink-softer">Preparing…</p>
      ) : (
        <>
          <RecallCard
            item={recall}
            onAnswered={() => {}}
            onRevealed={(r) => setRevealed(r)}
            onConceptClick={(id) => {
              if (id === concept.id) onOpenConcept(concept, null)
            }}
          />
          {revealed !== undefined && (
            <div className="mt-4 border-t border-ink/[0.07] pt-4">
              <SwipeRatingZone onRate={handleRate} suggestedRating={revealed} />
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
  children,
}: {
  label: string
  domainDot?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-full w-full flex-col justify-center px-5 py-10">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-4 flex items-center gap-2">
          {domainDot && (
            <span className={`h-2 w-2 rounded-full ${DOMAIN_DOT[domainDot] ?? 'bg-accent/40'}`} />
          )}
          <p className="text-[10px] font-medium uppercase tracking-widest text-ink-softer">{label}</p>
        </div>
        <div className="surface p-6">{children}</div>
      </div>
    </div>
  )
}

function BriefBody({ concept }: { concept: Concept }) {
  return (
    <>
      <h3 className="font-serif text-2xl text-ink">{concept.name}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{concept.summary}</p>
      {concept.wikipediaUrl && (
        <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-accent/70">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.09 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm-1.5 14.5v-9l6.5 4.5-6.5 4.5z" />
          </svg>
          Read more
        </span>
      )}
    </>
  )
}

function SkipHint({ onAdvance }: { onAdvance: () => void }) {
  return (
    <button
      type="button"
      onClick={onAdvance}
      className="mt-6 flex w-full items-center justify-center gap-1.5 text-xs text-ink-softer transition-colors hover:text-ink-soft"
    >
      <span>Swipe up for next</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  )
}
