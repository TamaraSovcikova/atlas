import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Domain, type Era, type Review } from '../db/schema'
import {
  summariseDomains,
  summariseEras,
  summariseThreads,
  type DomainSummary,
  type EraSummary,
  type ThreadSummary,
} from '../lib/session'
import { masteryOf, masterySpread, MASTERY_META, MASTERY_ORDER } from '../lib/mastery'
import { progressSnapshot } from '../lib/progress'
import { getDailyResume, type DailyResume } from '../lib/dailyPlan'
import { useSettings } from '../store/useSettings'
import { Button } from './ui/Button'
import { ConstellationPreview } from './ConstellationPreview'
import { M } from './ui/motion'

const DOMAIN_LABEL: Record<Domain, string> = {
  history: 'History',
  geography: 'Geography',
  politics: 'Politics',
  religions: 'Religions',
  culture: 'Culture',
  science: 'Science',
  modern_world: 'Modern world spine',
}

type Shape = 'thread' | 'era' | 'domain' | 'spaced'

interface Props {
  onStartDaily: () => void
  onStartEra: (eraId: string) => void
  onStartDomain: (domain: Domain) => void
  onStartThread: (threadId: string) => void
  onStartSpaced: () => void
  onOpenConstellation: () => void
  onOpenStats: () => void
  onOpenPathway: () => void
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function HomeView({
  onStartDaily,
  onStartEra,
  onStartDomain,
  onStartThread,
  onStartSpaced,
  onOpenConstellation,
  onOpenStats,
  onOpenPathway,
}: Props) {
  const prefs = useSettings((s) => s.prefs)
  const [shape, setShape] = useState<Shape>('thread')
  const [exploreOpen, setExploreOpen] = useState(false)

  const eras = useLiveQuery(() => db.eras.orderBy('displayOrder').toArray(), [], [] as Era[])
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

  const [eraSummaries, setEraSummaries] = useState<Map<string, EraSummary>>(new Map())
  const [domainSummaries, setDomainSummaries] = useState<Map<Domain, DomainSummary>>(new Map())
  const [threadSummaries, setThreadSummaries] = useState<ThreadSummary[]>([])
  const [dailyResume, setDailyResume] = useState<DailyResume | null>(null)

  useEffect(() => {
    summariseEras().then(setEraSummaries)
    summariseDomains().then(setDomainSummaries)
    summariseThreads().then(setThreadSummaries)
    getDailyResume().then(setDailyResume)
  }, [conceptCount, learnedCount, dueNow])

  const masteredCount = spread.counts.mastered + spread.counts.known

  return (
    <section className="space-y-6">
      {/* Progress header -- streak, today's goal ring, mastery */}
      <div className="grid grid-cols-3 gap-2">
        <StatChip
          label="day streak"
          value={snapshot.streak}
          glyph="🔥"
          onClick={onOpenStats}
          accent={snapshot.streak > 0}
        />
        <GoalChip
          fraction={snapshot.goalFraction}
          done={snapshot.todayCards}
          goal={snapshot.goalCards}
          onClick={onOpenStats}
        />
        <StatChip
          label="bright stars"
          value={masteredCount}
          glyph="✦"
          onClick={onOpenStats}
          accent={masteredCount > 0}
        />
      </div>

      {/* Constellation -- the hero, always visible */}
      <button
        type="button"
        onClick={onOpenConstellation}
        className="group w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-bg-soft shadow-card transition-all hover:border-accent/30 active:scale-[0.995]"
      >
        <ConstellationPreview height={240} />
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
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-xl text-ink">Today's session</h2>
          <span className="text-xs text-ink-softer">
            <span className="tabular-nums text-ink-soft">{dueNow ?? 0}</span> due ·{' '}
            <span className="tabular-nums text-ink-soft">{dueTomorrow ?? 0}</span> tomorrow
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {dailyResume
            ? `You're partway through — ${dailyResume.done} of ${dailyResume.total} done. Pick up where you left off.`
            : "A composed mix: everything the scheduler says is due, then a few new concepts from your pathway. One pass, then you're done for the day."}
        </p>
        <Button onClick={onStartDaily} className="mt-5 w-full">
          {dailyResume ? `Continue today — ${dailyResume.remaining} left` : 'Begin today'}
        </Button>
      </div>

      {/* Pathway strip -- where you are on the guided climb */}
      {(() => {
        const current = threadSummaries.find((t) => !(t.total > 0 && t.met === t.total))
        const completed = threadSummaries.filter((t) => t.total > 0 && t.met === t.total).length
        if (threadSummaries.length === 0) return null
        return (
          <button
            type="button"
            onClick={onOpenPathway}
            className="group flex w-full items-center gap-4 rounded-2xl border border-white/[0.07] bg-bg-soft/50 p-4 text-left transition-all hover:border-accent/40 active:scale-[0.99]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 19h14M7 19V9l5-4 5 4v10" />
                <circle cx="12" cy="11" r="1.5" />
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

      {/* Explore drawer -- the four shapes, for when you want to steer */}
      <div className="rounded-2xl border border-white/[0.06] bg-bg-soft/40">
        <button
          type="button"
          onClick={() => setExploreOpen((o) => !o)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <span>
            <span className="block text-sm font-medium text-ink">Explore another way</span>
            <span className="block text-[11px] text-ink-softer">
              Follow a story, an era, a single subject, or just clear reviews
            </span>
          </span>
          <span
            className={`text-ink-softer transition-transform ${exploreOpen ? 'rotate-180' : ''}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>

        {exploreOpen && (
          <M.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4 px-4 pb-5"
          >
            <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <ShapeTab label="Story" sub="Follow a thread" active={shape === 'thread'} onClick={() => setShape('thread')} />
              <ShapeTab label="Era Lens" sub="A window in time" active={shape === 'era'} onClick={() => setShape('era')} />
              <ShapeTab label="Domain" sub="One subject deep" active={shape === 'domain'} onClick={() => setShape('domain')} />
              <ShapeTab label="Spaced Mix" sub="Just what's due" active={shape === 'spaced'} onClick={() => setShape('spaced')} />
            </nav>

            {shape === 'thread' && (
              <ul className="space-y-2">
                {threadSummaries.length === 0 && (
                  <li className="surface p-5 text-sm text-ink-soft">No threads yet.</li>
                )}
                {threadSummaries.map((t) => {
                  const empty = t.total === 0
                  return (
                    <li key={t.threadId}>
                      <button
                        type="button"
                        disabled={empty}
                        onClick={() => onStartThread(t.threadId)}
                        className="surface group w-full p-5 text-left transition-all hover:border-accent/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <h3 className="font-serif text-lg text-ink">{t.name}</h3>
                        <p className="mt-1 text-sm text-ink-soft">{t.description}</p>
                        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-ink-softer">
                          <Pill label="due" value={t.due} accent={t.due > 0} />
                          <Pill label="new" value={t.newAvailable} accent={t.newAvailable > 0} />
                          {t.lockedNew > 0 && <Pill label="locked" value={t.lockedNew} />}
                          <Pill label="met" value={t.met} />
                          <Pill label="in story" value={t.total} />
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            {shape === 'era' && (
              <ul className="space-y-2">
                {(eras ?? []).map((era) => {
                  const summary = eraSummaries.get(era.id) ?? {
                    eraId: era.id,
                    due: 0,
                    newAvailable: 0,
                    met: 0,
                    total: 0,
                  }
                  const empty = summary.total === 0
                  return (
                    <li key={era.id}>
                      <button
                        type="button"
                        disabled={empty}
                        onClick={() => onStartEra(era.id)}
                        className="surface group w-full p-5 text-left transition-all hover:border-accent/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="font-serif text-lg text-ink">{era.name}</h3>
                          <span className="text-xs text-ink-softer">{yearRange(era)}</span>
                        </div>
                        <p className="mt-1 text-sm text-ink-soft">{era.description}</p>
                        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-ink-softer">
                          <Pill label="due" value={summary.due} accent={summary.due > 0} />
                          <Pill label="new" value={summary.newAvailable} accent={summary.newAvailable > 0} />
                          <Pill label="met" value={summary.met} />
                          <Pill label="in graph" value={summary.total} />
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            {shape === 'domain' && (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(Object.keys(DOMAIN_LABEL) as Domain[]).map((domain) => {
                  const summary = domainSummaries.get(domain) ?? {
                    domain,
                    due: 0,
                    newAvailable: 0,
                    met: 0,
                    total: 0,
                  }
                  const empty = summary.total === 0
                  return (
                    <li key={domain}>
                      <button
                        type="button"
                        disabled={empty}
                        onClick={() => onStartDomain(domain)}
                        className="surface w-full p-4 text-left transition-all hover:border-accent/40 active:scale-[0.99] disabled:opacity-40"
                      >
                        <h3 className="font-serif text-base text-ink">{DOMAIN_LABEL[domain]}</h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-ink-softer">
                          <Pill label="due" value={summary.due} accent={summary.due > 0} />
                          <Pill label="new" value={summary.newAvailable} accent={summary.newAvailable > 0} />
                          <Pill label="met" value={summary.met} />
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            {shape === 'spaced' && (
              <div className="surface p-6">
                <h3 className="font-serif text-lg text-ink">Just the reviews</h3>
                <p className="mt-2 text-sm text-ink-soft">
                  Whatever the spaced-repetition scheduler thinks is due, in one interleaved pass. No
                  new material. Use this when you are behind and want to keep what you already have.
                </p>
                <Button onClick={onStartSpaced} disabled={(dueNow ?? 0) === 0} className="mt-5">
                  {(dueNow ?? 0) > 0 ? `Start ${dueNow} due` : 'Nothing due right now'}
                </Button>
              </div>
            )}
          </M.div>
        )}
      </div>

      <p className="text-xs leading-relaxed text-ink-softer">
        Forgetting is normal and expected. The cards that feel hardest are the ones the scheduler is
        working on for you.
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
      className="flex flex-col items-center gap-0.5 rounded-2xl border border-white/[0.06] bg-bg-soft/50 px-2 py-3 transition-colors hover:border-accent/30"
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
      className="flex flex-col items-center gap-0.5 rounded-2xl border border-white/[0.06] bg-bg-soft/50 px-2 py-3 transition-colors hover:border-accent/30"
    >
      <svg width="40" height="40" viewBox="0 0 40 40" className="-mb-0.5">
        <circle cx="20" cy="20" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke={met ? '#4ade80' : '#fbbf24'}
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

function ShapeTab({
  label,
  sub,
  active,
  onClick,
}: {
  label: string
  sub: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-3 py-3 text-center transition-all active:scale-[0.98] ${
        active
          ? 'border-accent/60 bg-accent/10 shadow-glow'
          : 'border-white/[0.07] bg-bg-soft/40 hover:border-accent/30'
      }`}
    >
      <span className={`block text-sm font-medium ${active ? 'text-accent' : 'text-ink'}`}>
        {label}
      </span>
      <span className="block text-[10px] uppercase tracking-wide text-ink-softer">{sub}</span>
    </button>
  )
}

function Pill({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 ${
        accent ? 'bg-accent/15 text-accent' : 'bg-bg-softer/40 text-ink-softer'
      }`}
    >
      {value} {label}
    </span>
  )
}

function yearRange(era: Era): string {
  const s = era.startYear < 0 ? `${-era.startYear} BCE` : `${era.startYear}`
  const e = era.endYear < 0 ? `${-era.endYear} BCE` : `${era.endYear}`
  return `${s} - ${e}`
}
