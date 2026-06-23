import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Concept, type Domain, type Era } from '../db/schema'
import {
  summariseDomains,
  summariseEras,
  summariseThreads,
  type DomainSummary,
  type EraSummary,
  type ThreadSummary,
} from '../lib/session'
import { getSessionResume, type DailyResume } from '../lib/dailyPlan'
import { useSettings } from '../store/useSettings'
import { Button } from './ui/Button'
import { ConceptRabbitHole } from './ConceptRabbitHole'

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
  onStartEra: (eraId: string) => void
  onStartDomain: (domain: Domain) => void
  onStartThread: (threadId: string) => void
  onStartSpaced: () => void
  onStartMistakes: () => void
}

export function BrowseView({ onStartEra, onStartDomain, onStartThread, onStartSpaced, onStartMistakes }: Props) {
  const prefs = useSettings((s) => s.prefs)
  const [shape, setShape] = useState<Shape>('thread')
  const [query, setQuery] = useState('')
  const [conceptResults, setConceptResults] = useState<Concept[]>([])
  const [rabbitHoleId, setRabbitHoleId] = useState<string | null>(null)

  const eras = useLiveQuery(() => db.eras.orderBy('displayOrder').toArray(), [], [] as Era[])
  const dueNow = useLiveQuery(() => db.reviews.where('dueAt').belowOrEqual(Date.now()).count(), [], 0)
  const leechCount = useLiveQuery(
    () => db.reviews.filter((r) => r.failureStreak >= 1).count(),
    [],
    0,
  )
  const conceptCount = useLiveQuery(() => db.concepts.count(), [], 0)
  const learnedCount = useLiveQuery(
    () => db.concepts.filter((c) => c.firstSeenAt !== null).count(),
    [],
    0,
  )

  const [eraSummaries, setEraSummaries] = useState<Map<string, EraSummary>>(new Map())
  const [domainSummaries, setDomainSummaries] = useState<Map<Domain, DomainSummary>>(new Map())
  const [threadSummaries, setThreadSummaries] = useState<ThreadSummary[]>([])
  const [threadResume, setThreadResume] = useState<Map<string, DailyResume>>(new Map())

  useEffect(() => {
    summariseEras().then(setEraSummaries)
    summariseDomains().then(setDomainSummaries)
    summariseThreads().then(async (threads) => {
      setThreadSummaries(threads)
      const resumeMap = new Map<string, DailyResume>()
      await Promise.all(
        threads.map(async (t) => {
          const r = await getSessionResume('thread', t.threadId)
          if (r) resumeMap.set(t.threadId, r)
        }),
      )
      setThreadResume(resumeMap)
    })
  }, [conceptCount, learnedCount, dueNow, prefs])

  const q = query.trim().toLowerCase()

  // Concept search — fires when query is at least 2 chars
  useEffect(() => {
    if (q.length < 2) {
      setConceptResults([])
      return
    }
    db.concepts
      .filter((c) => c.name.toLowerCase().includes(q) || c.summary?.toLowerCase().includes(q))
      .limit(12)
      .toArray()
      .then(setConceptResults)
  }, [q])

  const filteredThreads = useMemo(
    () => (q ? threadSummaries.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) : threadSummaries),
    [threadSummaries, q],
  )

  const filteredEras = useMemo(
    () => (q ? (eras ?? []).filter((e) => e.name.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q)) : (eras ?? [])),
    [eras, q],
  )

  const filteredDomains = useMemo(
    () =>
      (Object.keys(DOMAIN_LABEL) as Domain[]).filter(
        (d) => !q || DOMAIN_LABEL[d].toLowerCase().includes(q),
      ),
    [q],
  )

  return (
    <section className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl text-ink">Browse</h2>
        <p className="mt-1 text-sm text-ink-softer">Explore by story, era, or subject. Start a focused session on any slice.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-softer"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stories, eras, concepts…"
          className="w-full rounded-2xl border border-white/[0.08] bg-bg-soft py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-softer focus:border-accent/40 focus:outline-none"
        />
      </div>

      {/* Concept results — shown when query is long enough */}
      {q.length >= 2 && conceptResults.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-wider text-ink-softer">Concepts</p>
          <ul className="flex flex-wrap gap-2">
            {conceptResults.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setRabbitHoleId(c.id)}
                  className="rounded-full border border-white/[0.07] bg-bg-soft/60 px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-accent/40 hover:text-ink active:scale-[0.97]"
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Shape tabs */}
      <nav className="grid grid-cols-4 gap-1.5">
        <ShapeTab label="Story" active={shape === 'thread'} onClick={() => setShape('thread')} />
        <ShapeTab label="Era" active={shape === 'era'} onClick={() => setShape('era')} />
        <ShapeTab label="Domain" active={shape === 'domain'} onClick={() => setShape('domain')} />
        <ShapeTab label="Due" active={shape === 'spaced'} onClick={() => setShape('spaced')} />
      </nav>

      {/* Lists */}
      {shape === 'thread' && (
        <ul className="space-y-2">
          {filteredThreads.length === 0 && (
            <li className="surface p-5 text-sm text-ink-soft">
              {q ? 'No stories match.' : 'No stories yet.'}
            </li>
          )}
          {filteredThreads.map((t) => {
            const empty = t.total === 0
            const resume = threadResume.get(t.threadId)
            return (
              <li key={t.threadId}>
                <button
                  type="button"
                  disabled={empty}
                  onClick={() => onStartThread(t.threadId)}
                  className="surface group w-full p-5 text-left transition-all hover:border-accent/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg text-ink">{t.name}</h3>
                    {resume && (
                      <span className="shrink-0 rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">
                        {resume.remaining} left
                      </span>
                    )}
                  </div>
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
          {filteredEras.length === 0 && (
            <li className="surface p-5 text-sm text-ink-soft">
              {q ? 'No eras match.' : 'No eras yet.'}
            </li>
          )}
          {filteredEras.map((era) => {
            const summary = eraSummaries.get(era.id) ?? { eraId: era.id, due: 0, newAvailable: 0, met: 0, total: 0 }
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
          {filteredDomains.length === 0 && (
            <li className="surface p-4 text-sm text-ink-soft">No domains match.</li>
          )}
          {filteredDomains.map((domain) => {
            const summary = domainSummaries.get(domain) ?? { domain, due: 0, newAvailable: 0, met: 0, total: 0 }
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
        <div className="space-y-3">
          <div className="surface p-6">
            <h3 className="font-serif text-lg text-ink">Just the reviews</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Whatever the spaced-repetition scheduler says is due, interleaved in one pass. No new
              material — use this when you want to keep what you already have.
            </p>
            <Button onClick={onStartSpaced} disabled={(dueNow ?? 0) === 0} className="mt-5">
              {(dueNow ?? 0) > 0 ? `Start — ${dueNow} due` : 'Nothing due right now'}
            </Button>
          </div>

          {(leechCount ?? 0) > 0 && (
            <div className="surface p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg text-ink">Struggling concepts</h3>
                  <p className="mt-1.5 text-sm text-ink-soft">
                    {leechCount} concept{leechCount === 1 ? '' : 's'} with recent failures. A focused pass to break the pattern.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-red-500/15 px-2.5 py-0.5 text-[11px] font-medium text-red-400">
                  {leechCount}
                </span>
              </div>
              <Button onClick={onStartMistakes} className="mt-5">
                Review struggling concepts
              </Button>
            </div>
          )}
        </div>
      )}

      <ConceptRabbitHole rootConceptId={rabbitHoleId} onClose={() => setRabbitHoleId(null)} />
    </section>
  )
}

function ShapeTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border py-2 text-center text-sm transition-all active:scale-[0.98] ${
        active
          ? 'border-accent/50 bg-accent/10 font-medium text-accent shadow-glow'
          : 'border-white/[0.07] bg-bg-soft/40 text-ink-soft hover:border-accent/30'
      }`}
    >
      {label}
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
  return `${s} – ${e}`
}
