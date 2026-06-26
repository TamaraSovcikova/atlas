import { useEffect, useState } from 'react'
import { useMotionValue, useTransform } from 'motion/react'
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
  /** Move to the next feed item (after a grade). */
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
      {/* touch-action: pan-y tells the browser to own vertical scroll but
          hand horizontal touch to JS — required inside a scroll-snap container */}
      <M.div
        style={{ x, touchAction: 'pan-y' }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
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
  onOpenConcept,
}: FeedCardProps & { item: Extract<FeedItem, { kind: 'connection' }> }) {
  const yearDiff =
    item.from.approxYear !== null && item.to.approxYear !== null
      ? Math.abs(item.to.approxYear - item.from.approxYear)
      : null
  return (
    <CardFrame label="A connection in your constellation">
      <InterestSwipe onCommit={onInterest}>
        <div>
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
        </div>
      </InterestSwipe>
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

  // Navigate to any concept by id — not just the current one
  async function openConceptById(id: string) {
    if (id === concept.id) { onOpenConcept(concept, null); return }
    const c = await db.concepts.get(id)
    if (c) onOpenConcept(c, null)
  }

  // Build the recall item lazily when we enter the recall phase.
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
      <CardFrame label={isNew ? 'New · tap to read the story' : 'From your map'}>
        <InterestSwipe onCommit={onInterest}>
          <BriefBody
            concept={concept}
            onConceptClick={openConceptById}
            onOpenSelf={() => onOpenConcept(concept, null)}
          />
        </InterestSwipe>
        <div className="mt-5">
          <Button onClick={() => setPhase('recall')} className="w-full">
            Recall it
          </Button>
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
        {/* Swipe-up cue */}
        <div className="mt-5 flex justify-center">
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
      {/* Title tap opens the full story brief */}
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
