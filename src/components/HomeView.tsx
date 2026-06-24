import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Concept, type Collection, type RelationType } from '../db/schema'
import { summariseThreads, getNextPathwayConcept } from '../lib/session'
import { getDailyStatus, type DailyStatus } from '../lib/dailyPlan'
import { useSettings } from '../store/useSettings'
import type { Tab } from './BottomNav'
import { Button } from './ui/Button'
import { generateDidYouKnow } from '../lib/ai'

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

export function HomeView({
  onStartDaily,
  onStartPractice,
  onOpenConstellation,
  onNavigate,
  onOpenStoryBrief,
}: Props) {
  const prefs = useSettings((s) => s.prefs)
  const updatePrefs = useSettings((s) => s.update)

  const dueNow = useLiveQuery(() => db.reviews.where('dueAt').belowOrEqual(Date.now()).count(), [], 0)
  const dueTomorrow = useLiveQuery(
    () => db.reviews.where('dueAt').between(Date.now(), Date.now() + 86400000).count(),
    [],
    0,
  )
  const learnedCount = useLiveQuery(
    () => db.concepts.filter((c) => c.firstSeenAt !== null).count(),
    [],
    0,
  )
  const collections = useLiveQuery(
    () => db.collections.orderBy('createdAt').toArray(),
    [],
    [] as Collection[],
  )

  const [dailyStatus, setDailyStatus] = useState<DailyStatus | null>(null)
  const [nextConcept, setNextConcept] = useState<{ concept: Concept; threadName: string } | null>(null)
  const [threadSummaries, setThreadSummaries] = useState<Awaited<ReturnType<typeof summariseThreads>>>([])
  const [dueConcepts, setDueConcepts] = useState<Concept[]>([])
  const [connectionCard, setConnectionCard] = useState<{
    from: Concept; to: Concept; relation: RelationType; yearDiff: number | null
  } | null>(null)
  const [dyk, setDyk] = useState<{ text: string } | null>(null)

  useEffect(() => {
    getDailyStatus().then(setDailyStatus)
    getNextPathwayConcept().then(setNextConcept)
    summariseThreads().then(setThreadSummaries)
  }, [learnedCount, dueNow])

  // Inline review teasers — up to 3 due met concepts
  useEffect(() => {
    async function load() {
      const dueReviews = await db.reviews.where('dueAt').belowOrEqual(Date.now()).toArray()
      const results: Concept[] = []
      for (const r of dueReviews.slice(0, 8)) {
        if (results.length >= 3) break
        const c = await db.concepts.get(r.conceptId)
        if (c?.firstSeenAt !== null && c) results.push(c)
      }
      setDueConcepts(results)
    }
    load()
  }, [dueNow])

  // Connection card — one real graph edge between met concepts
  useEffect(() => {
    async function load() {
      const metConcepts = await db.concepts.filter((c) => c.firstSeenAt !== null).toArray()
      if (metConcepts.length < 2) return
      const metIds = new Set(metConcepts.map((c) => c.id))
      const edges = await db.edges.toArray()
      const valid = edges.filter((e) => metIds.has(e.fromId) && metIds.has(e.toId))
      if (valid.length === 0) return
      const edge = valid[Math.floor(Math.random() * valid.length)]!
      const from = metConcepts.find((c) => c.id === edge.fromId)!
      const to = metConcepts.find((c) => c.id === edge.toId)!
      const yearDiff =
        from.approxYear !== null && to.approxYear !== null
          ? Math.abs(to.approxYear - from.approxYear)
          : null
      setConnectionCard({ from, to, relation: edge.relation, yearDiff })
    }
    load()
  }, [learnedCount])

  // AI DYK — online-only, quiet fallback
  useEffect(() => {
    async function load() {
      const metConcepts = await db.concepts.filter((c) => c.firstSeenAt !== null).toArray()
      if (metConcepts.length < 2) return
      const a = metConcepts[Math.floor(Math.random() * metConcepts.length)]!
      const b = metConcepts[Math.floor(Math.random() * metConcepts.length)]!
      if (a.id === b.id) return
      const res = await generateDidYouKnow(a.name, a.summary, b.name, b.summary)
      if (res.ok) setDyk({ text: res.reply })
    }
    if (learnedCount > 1) load()
  }, [learnedCount > 1]) // eslint-disable-line react-hooks/exhaustive-deps

  const isDone = dailyStatus?.state === 'done'
  const inProgress = dailyStatus?.state === 'in-progress'
  const currentThread = threadSummaries.find((t) => !(t.total > 0 && t.met === t.total))
  const completedThreads = threadSummaries.filter((t) => t.total > 0 && t.met === t.total).length

  return (
    <section className="space-y-4">

      {/* ── Today card (pinned) ── */}
      <div className="surface p-6">
        {isDone ? (
          <>
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-xl text-ink">Done for today</h2>
              <span className="text-xs text-ink-softer">
                <span className="tabular-nums text-ink-soft">{dueTomorrow ?? 0}</span> due tomorrow
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {dailyStatus?.doneSummary
                ? `You learned ${dailyStatus.doneSummary.newCount} new ${
                    dailyStatus.doneSummary.newCount === 1 ? 'concept' : 'concepts'
                  } and reviewed ${dailyStatus.doneSummary.reviewCount}. Come back tomorrow.`
                : 'Come back tomorrow to keep the thread going.'}
            </p>
            <button
              type="button"
              onClick={onStartPractice}
              className="mt-4 w-full rounded-xl border border-ink/[0.08] bg-bg-softer py-2.5 text-sm text-ink-soft transition-colors hover:border-accent/30 hover:text-ink"
            >
              Practice more reviews
            </button>
          </>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-xl text-ink">
                {inProgress && dailyStatus?.resume ? 'Continue today' : "Today's session"}
              </h2>
              <span className="text-xs text-ink-softer">
                <span className="tabular-nums text-ink-soft">{dueNow ?? 0}</span> due now
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {inProgress && dailyStatus?.resume
                ? `${dailyStatus.resume.done} of ${dailyStatus.resume.total} done — pick up where you left off.`
                : 'Due reviews plus a few new concepts from your pathway.'}
            </p>
            <Button onClick={onStartDaily} className="mt-4 w-full">
              {inProgress && dailyStatus?.resume
                ? `Continue — ${dailyStatus.resume.remaining} left`
                : 'Begin today'}
            </Button>

            {/* Listen mode toggle */}
            <div className="mt-3 flex items-center justify-between border-t border-ink/[0.06] pt-3">
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
                className={`rounded-full border px-3 py-0.5 text-[11px] transition-colors ${
                  prefs.listenMode
                    ? 'border-accent/50 bg-accent/10 text-accent'
                    : 'border-ink/[0.10] text-ink-softer hover:border-accent/30'
                }`}
              >
                {prefs.listenMode ? 'On' : 'Off'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Inline review teasers ── */}
      {dueConcepts.length > 0 && !isDone && (
        <div className="space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-widest text-ink-softer px-1">
            Ready to review
          </p>
          {dueConcepts.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={onStartDaily}
              className="group flex w-full items-center gap-3 rounded-2xl border border-ink/[0.07] bg-bg-soft/70 px-4 py-3 text-left transition-all hover:border-accent/30 active:scale-[0.99]"
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${DOMAIN_DOT[c.domain] ?? 'bg-accent/40'}`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink">{c.name}</span>
                <span className="text-[11px] capitalize text-ink-softer">{c.domain.replace('_', ' ')}</span>
              </span>
              <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                due
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ── Story brief preview card ── */}
      {nextConcept && (
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

      {/* ── Connection card ── */}
      {connectionCard && (
        <div className="rounded-2xl border border-ink/[0.07] bg-bg-soft/60 p-5">
          <p className="text-[10px] font-medium uppercase tracking-widest text-ink-softer">
            In your constellation
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink">
            <span className="font-semibold text-accent">{connectionCard.from.name}</span>
            {' '}
            <span className="text-ink-soft">{RELATION_PHRASE[connectionCard.relation]}</span>
            {' '}
            <span className="font-semibold text-accent">{connectionCard.to.name}</span>
            {connectionCard.yearDiff && connectionCard.yearDiff > 5 ? (
              <span className="text-ink-softer"> — {connectionCard.yearDiff} years apart</span>
            ) : null}
          </p>
          <button
            type="button"
            onClick={onOpenConstellation}
            className="mt-3 text-[11px] text-accent/70 hover:text-accent"
          >
            Explore your graph →
          </button>
        </div>
      )}

      {/* ── AI did-you-know ── */}
      {dyk && (
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

      {/* ── Pathway nudge ── */}
      {threadSummaries.length > 0 && (
        <button
          type="button"
          onClick={() => onNavigate('atlas')}
          className="group flex w-full items-center gap-4 rounded-2xl border border-ink/[0.08] bg-bg-soft/70 p-4 text-left transition-all hover:border-accent/40 active:scale-[0.99]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
              <path d="M12 7v3M12 14v3" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] uppercase tracking-wide text-ink-softer">
              Your pathway · {completedThreads}/{threadSummaries.length} stories
            </span>
            <span className="block truncate text-sm font-medium text-ink">
              {currentThread ? currentThread.name : 'All stories complete'}
            </span>
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-ink-softer transition-transform group-hover:translate-x-0.5">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      )}

      {/* ── Collections (if any) ── */}
      {collections.length > 0 && (
        <button
          type="button"
          onClick={() => onNavigate('atlas')}
          className="group w-full rounded-2xl border border-ink/[0.08] bg-bg-soft/70 p-4 text-left transition-all hover:border-accent/30 active:scale-[0.99]"
        >
          <p className="text-[10px] font-medium uppercase tracking-widest text-ink-softer">
            Your collections
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {collections.slice(0, 4).map((col) => (
              <span
                key={col.id}
                className="rounded-full border border-ink/[0.08] bg-bg-softer/60 px-3 py-1 text-[12px] text-ink-soft"
              >
                {col.name}
              </span>
            ))}
            {collections.length > 4 && (
              <span className="rounded-full border border-ink/[0.08] bg-bg-softer/60 px-3 py-1 text-[12px] text-ink-softer">
                +{collections.length - 4} more
              </span>
            )}
          </div>
        </button>
      )}

      {/* ── Footer blurb ── */}
      <p className="pb-2 text-xs leading-relaxed text-ink-softer">
        Forgetting is normal. The cards that feel hardest are the ones the scheduler is working on for you.
      </p>
    </section>
  )
}
