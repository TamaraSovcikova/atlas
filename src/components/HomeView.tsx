import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Domain, type Era } from '../db/schema'
import {
  summariseDomains,
  summariseEras,
  summariseThreads,
  type DomainSummary,
  type EraSummary,
  type ThreadSummary,
} from '../lib/session'
import { Button } from './ui/Button'
import { ConstellationPreview } from './ConstellationPreview'

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
  onOpenConstellation: () => void
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function HomeView({
  onStartEra,
  onStartDomain,
  onStartThread,
  onStartSpaced,
  onOpenConstellation,
}: Props) {
  const [shape, setShape] = useState<Shape>('thread')

  const eras = useLiveQuery(() => db.eras.orderBy('displayOrder').toArray(), [], [] as Era[])
  const conceptCount = useLiveQuery(() => db.concepts.count(), [], 0)
  const learnedCount = useLiveQuery(
    () => db.concepts.filter((c) => c.firstSeenAt !== null).count(),
    [],
    0,
  )
  const dueNow = useLiveQuery(
    () => db.reviews.where('dueAt').belowOrEqual(Date.now()).count(),
    [],
    0,
  )
  const dueTomorrow = useLiveQuery(
    () =>
      db.reviews
        .where('dueAt')
        .between(Date.now(), Date.now() + MS_PER_DAY)
        .count(),
    [],
    0,
  )

  const [eraSummaries, setEraSummaries] = useState<Map<string, EraSummary>>(new Map())
  const [domainSummaries, setDomainSummaries] = useState<Map<Domain, DomainSummary>>(new Map())
  const [threadSummaries, setThreadSummaries] = useState<ThreadSummary[]>([])

  useEffect(() => {
    summariseEras().then(setEraSummaries)
    summariseDomains().then(setDomainSummaries)
    summariseThreads().then(setThreadSummaries)
  }, [conceptCount, learnedCount, dueNow])

  return (
    <section className="space-y-7">
      {/* Constellation -- the hero, always visible */}
      <button
        type="button"
        onClick={onOpenConstellation}
        className="group w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-bg-soft shadow-card transition-all hover:border-accent/30 active:scale-[0.995]"
      >
        <ConstellationPreview height={280} />
        <div className="flex items-center justify-between px-5 pb-4 pt-1">
          <p className="text-xs text-ink-softer">
            <span className="font-medium text-ink-soft">{learnedCount ?? 0}</span> of{' '}
            {conceptCount ?? 0} stars lit
          </p>
          <span className="text-[10px] uppercase tracking-widest text-ink-softer opacity-0 transition-opacity group-hover:opacity-100">
            Explore
          </span>
        </div>
      </button>

      {/* Session start */}
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-xl text-ink">Today</h2>
        <span className="text-xs text-ink-softer">
          <span className="tabular-nums text-ink-soft">{dueNow ?? 0}</span> due ·{' '}
          <span className="tabular-nums text-ink-soft">{dueTomorrow ?? 0}</span> tomorrow
        </span>
      </div>

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
            Whatever the spaced-repetition scheduler thinks is due, in one interleaved pass. No new
            material. Use this when you are behind and want to keep what you already have.
          </p>
          <Button onClick={onStartSpaced} disabled={(dueNow ?? 0) === 0} className="mt-5">
            {(dueNow ?? 0) > 0 ? `Start ${dueNow} due` : 'Nothing due right now'}
          </Button>
        </div>
      )}

      <p className="text-xs leading-relaxed text-ink-softer">
        Forgetting is normal and expected. The cards that feel hardest are the ones the scheduler is
        working on for you.
      </p>
    </section>
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
