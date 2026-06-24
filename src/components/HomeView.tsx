import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Review, type Concept } from '../db/schema'
import { summariseThreads, getNextPathwayConcept } from '../lib/session'
import { masteryOf, masterySpread, MASTERY_META, MASTERY_ORDER } from '../lib/mastery'
import { progressSnapshot } from '../lib/progress'
import { getDailyStatus, type DailyStatus } from '../lib/dailyPlan'
import { useSettings } from '../store/useSettings'
import type { Tab } from './BottomNav'
import { Button } from './ui/Button'
import { ConstellationPreview } from './ConstellationPreview'
import { generateDidYouKnow } from '../lib/ai'

const MS_PER_DAY = 24 * 60 * 60 * 1000

function firstSentence(text: string): string {
  const idx = text.indexOf('. ')
  return idx > 0 ? text.slice(0, idx + 1) : text
}

interface Props {
  onStartDaily: () => void
  onStartPractice: () => void
  onOpenConstellation: () => void
  onNavigate: (tab: Tab) => void
  onOpenStoryBrief: (concept: Concept, threadName: string) => void
}

export function HomeView({ onStartDaily, onStartPractice, onOpenConstellation, onNavigate, onOpenStoryBrief }: Props) {
  const prefs = useSettings((s) => s.prefs)
  const updatePrefs = useSettings((s) => s.update)

  const conceptCount = useLiveQuery(() => db.concepts.count(), [], 0)
  const learnedCount = useLiveQuery(
    () => db.concepts.filter((c) => c.firstSeenAt !== null).count(),
    [],
    0,
  )
  const dueNow = useLiveQuery(() => db.reviews.where('dueAt').belowOrEqual(Date.now()).count(), [], 0)
  const dueTomorrow = useLiveQuery(
    () =>
      db.reviews
        .where('dueAt')
        .between(Date.now(), Date.now() + MS_PER_DAY)
        .count(),
    [],
    0,
  )

  const concepts = useLiveQuery(() => db.concepts.toArray(), [], [])
  const reviews = useLiveQuery(() => db.reviews.toArray(), [], [] as Review[])
  const sessions = useLiveQuery(() => db.sessions.toArray(), [], [])

  const reviewByConcept = useMemo(() => {
    const m = new Map<string, Review>()
    for (const r of reviews) m.set(r.conceptId, r)
    return m
  }, [reviews])

  const spread = useMemo(() => {
    const levels = concepts.map((c) => masteryOf(reviewByConcept.get(c.id), c.firstSeenAt !== null))
    return masterySpread(levels)
  }, [concepts, reviewByConcept])

  const snapshot = useMemo(
    () => progressSnapshot(sessions, prefs.dailyGoalCards, prefs.streakFreezes),
    [sessions, prefs.dailyGoalCards, prefs.streakFreezes],
  )

  const [threadSummaries, setThreadSummaries] = useState<Awaited<ReturnType<typeof summariseThreads>>>([])
  const [dailyStatus, setDailyStatus] = useState<DailyStatus | null>(null)
  const [nextConcept, setNextConcept] = useState<{ concept: Concept; threadName: string } | null>(null)
  const [dyk, setDyk] = useState<{ text: string; loaded: boolean } | null>(null)

  useEffect(() => {
    summariseThreads().then(setThreadSummaries)
    getDailyStatus().then(setDailyStatus)
    getNextPathwayConcept().then(setNextConcept)
  }, [conceptCount, learnedCount, dueNow])

  // Generate an AI did-you-know once we know two met concepts (lazy, online-only)
  useEffect(() => {
    if (dyk) return // already loaded or tried
    const metConcepts = concepts.filter((c) => c.firstSeenAt !== null)
    if (metConcepts.length < 2) return
    // Pick two random met concepts
    const a = metConcepts[Math.floor(Math.random() * metConcepts.length)]!
    const b = metConcepts[Math.floor(Math.random() * metConcepts.length)]!
    if (a.id === b.id) return
    setDyk({ text: '', loaded: false })
    generateDidYouKnow(a.name, a.summary, b.name, b.summary).then((res) => {
      if (res.ok) setDyk({ text: res.reply, loaded: true })
      else setDyk(null) // quietly fail (offline or cap reached)
    })
  }, [concepts.length > 1]) // eslint-disable-line react-hooks/exhaustive-deps

  const masteredCount = spread.counts.mastered + spread.counts.known

  return (
    <section className="space-y-5">
      {/* Progress header — streak, goal ring, bright stars */}
      <div className="grid grid-cols-3 gap-2">
        <StatChip
          label="day streak"
          value={snapshot.streak}
          glyph="🔥"
          onClick={() => onNavigate('you')}
          accent={snapshot.streak > 0}
        />
        <GoalChip
          fraction={snapshot.goalFraction}
          done={snapshot.todayCards}
          goal={snapshot.goalCards}
          onClick={() => onNavigate('you')}
        />
        <StatChip
          label="bright stars"
          value={masteredCount}
          glyph="✦"
          onClick={() => onNavigate('you')}
          accent={masteredCount > 0}
        />
      </div>

      {/* Constellation — the hero */}
      <button
        type="button"
        onClick={onOpenConstellation}
        className="group w-full overflow-hidden rounded-2xl border border-ink/[0.08] bg-bg-soft shadow-card transition-all hover:border-accent/30 active:scale-[0.995]"
      >
        <ConstellationPreview height={220} />
        <div className="flex items-center justify-between px-5 pb-3 pt-1">
          <p className="text-xs text-ink-softer">
            <span className="font-medium text-ink-soft">{learnedCount ?? 0}</span> of{' '}
            {conceptCount ?? 0} stars lit
          </p>
          <span className="text-[10px] uppercase tracking-widest text-ink-softer opacity-0 transition-opacity group-hover:opacity-100">
            Explore graph
          </span>
        </div>
      </button>

      {/* The one daily action */}
      <div className="surface p-6">
        {dailyStatus?.state === 'done' ? (
          <>
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-xl text-ink">Done for today</h2>
              <span className="text-xs text-ink-softer">
                <span className="tabular-nums text-ink-soft">{dueTomorrow ?? 0}</span> due tomorrow
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {dailyStatus.doneSummary
                ? `You learned ${dailyStatus.doneSummary.newCount} new ${
                    dailyStatus.doneSummary.newCount === 1 ? 'concept' : 'concepts'
                  } and reviewed ${dailyStatus.doneSummary.reviewCount}. Come back tomorrow to keep the thread going.`
                : 'Come back tomorrow to keep the thread going.'}
            </p>
            <button
              type="button"
              onClick={onStartPractice}
              className="mt-5 w-full rounded-xl border border-ink/[0.08] bg-bg-softer py-2.5 text-sm text-ink-soft transition-colors hover:border-accent/30 hover:text-ink"
            >
              Practice more reviews
            </button>
          </>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-xl text-ink">Today's session</h2>
              <span className="text-xs text-ink-softer">
                <span className="tabular-nums text-ink-soft">{dueNow ?? 0}</span> due ·{' '}
                <span className="tabular-nums text-ink-soft">{dueTomorrow ?? 0}</span> tomorrow
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {dailyStatus?.state === 'in-progress' && dailyStatus.resume
                ? `You're ${dailyStatus.resume.done} of ${dailyStatus.resume.total} through. Pick up where you left off.`
                : "Due reviews plus a few new concepts from your pathway — one composed pass, then you're done for the day."}
            </p>
            <Button onClick={onStartDaily} className="mt-5 w-full">
              {dailyStatus?.state === 'in-progress' && dailyStatus.resume
                ? `Continue — ${dailyStatus.resume.remaining} left`
                : 'Begin today'}
            </Button>
            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] text-ink-softer">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
                Listen mode
              </span>
              <button
                type="button"
                onClick={() => updatePrefs({ listenMode: !prefs.listenMode })}
                className={`rounded-full px-3 py-0.5 text-[11px] border transition-colors ${
                  prefs.listenMode
                    ? 'border-accent/50 bg-accent/10 text-accent'
                    : 'border-ink/[0.10] text-ink-softer hover:border-accent/30 hover:text-ink-soft'
                }`}
              >
                {prefs.listenMode ? 'On' : 'Off'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Story preview card — next concept waiting in the pathway */}
      {nextConcept && dailyStatus?.state !== 'done' && (
        <button
          type="button"
          onClick={() => onOpenStoryBrief(nextConcept.concept, nextConcept.threadName)}
          className="group w-full rounded-2xl border border-ink/[0.08] bg-bg-soft p-5 text-left shadow-card transition-all hover:border-accent/30 active:scale-[0.99]"
        >
          <p className="text-[10px] font-medium uppercase tracking-widest text-ink-softer">
            Coming up · {nextConcept.threadName}
          </p>
          <h3 className="mt-2 font-serif text-xl text-ink">{nextConcept.concept.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">
            {firstSentence(nextConcept.concept.summary)}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-accent">
            <span className="text-sm font-medium">Read the story brief</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </button>
      )}

      {/* Pathway strip */}
      {threadSummaries.length > 0 && (() => {
        const current = threadSummaries.find((t) => !(t.total > 0 && t.met === t.total))
        const completed = threadSummaries.filter((t) => t.total > 0 && t.met === t.total).length
        return (
          <button
            type="button"
            onClick={() => onNavigate('atlas')}
            className="group flex w-full items-center gap-4 rounded-2xl border border-ink/[0.08] bg-bg-soft/70 p-4 text-left transition-all hover:border-accent/40 active:scale-[0.99]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
                <path d="M12 7v3M12 14v3" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] uppercase tracking-wide text-ink-softer">
                Your pathway · {completed}/{threadSummaries.length} stories
              </span>
              <span className="block truncate text-sm font-medium text-ink">
                {current ? current.name : 'All stories complete'}
              </span>
            </span>
            <span className="text-ink-softer transition-transform group-hover:translate-x-0.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </button>
        )
      })()}

      {/* Mastery spread bar */}
      {spread.total > 0 && (
        <div className="space-y-2">
          <div className="flex h-2 overflow-hidden rounded-full bg-bg-softer">
            {MASTERY_ORDER.map((level) => {
              const count = spread.counts[level]
              if (count === 0 || level === 'new') return null
              return (
                <div
                  key={level}
                  style={{
                    width: `${(count / spread.total) * 100}%`,
                    opacity: 0.25 + MASTERY_META[level].brightness * 0.75,
                  }}
                  className="h-full bg-accent"
                  title={`${count} ${MASTERY_META[level].label}`}
                />
              )
            })}
          </div>
          <p className="text-[11px] text-ink-softer">
            {Math.round(spread.fraction * 100)}% mastery across {spread.total} concepts
          </p>
        </div>
      )}

      {/* AI did-you-know (Wave 4) — online-only, quiet fallback */}
      {dyk?.loaded && dyk.text && (
        <div className="rounded-2xl border border-accent/[0.15] bg-accent/[0.04] p-5">
          <p className="text-[10px] font-medium uppercase tracking-widest text-accent/70">
            Did you know · AI
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{dyk.text}</p>
          <button
            type="button"
            onClick={() => setDyk(null)}
            className="mt-3 text-[10px] text-ink-softer hover:text-ink-soft"
          >
            dismiss
          </button>
        </div>
      )}

      <p className="text-xs leading-relaxed text-ink-softer">
        Forgetting is normal and expected. The cards that feel hardest are the ones the scheduler is working on for you.
      </p>
    </section>
  )
}

function StatChip({
  label,
  value,
  glyph,
  accent,
  onClick,
}: {
  label: string
  value: number
  glyph: string
  accent?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 rounded-2xl border border-ink/[0.08] bg-bg-soft/70 px-2 py-3 transition-colors hover:border-accent/30"
    >
      <span className="text-lg leading-none">{glyph}</span>
      <span className={`text-xl font-semibold tabular-nums ${accent ? 'text-accent' : 'text-ink'}`}>
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-ink-softer">{label}</span>
    </button>
  )
}

function GoalChip({
  fraction,
  done,
  goal,
  onClick,
}: {
  fraction: number
  done: number
  goal: number
  onClick: () => void
}) {
  const r = 16
  const c = 2 * Math.PI * r
  const met = done >= goal
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 rounded-2xl border border-ink/[0.08] bg-bg-soft/70 px-2 py-3 transition-colors hover:border-accent/30"
    >
      <svg width="40" height="40" viewBox="0 0 40 40" className="-mb-0.5">
        <circle cx="20" cy="20" r={r} fill="none" className="stroke-ink/[0.12]" strokeWidth="4" />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke={met ? '#4ade80' : '#28486B'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - fraction)}
          transform="rotate(-90 20 20)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <text x="20" y="24" textAnchor="middle" className="fill-ink text-[10px] font-semibold">
          {met ? '✓' : done}
        </text>
      </svg>
      <span className="text-[10px] uppercase tracking-wide text-ink-softer">
        {met ? 'goal met' : `${done}/${goal} today`}
      </span>
    </button>
  )
}
