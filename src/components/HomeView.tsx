import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Domain, type Era } from '../db/schema'
import {
  summariseDomains,
  summariseEras,
  type DomainSummary,
  type EraSummary,
} from '../lib/session'

const DOMAIN_LABEL: Record<Domain, string> = {
  history: 'History',
  geography: 'Geography',
  politics: 'Politics',
  religions: 'Religions',
  culture: 'Culture',
  science: 'Science',
  modern_world: 'Modern world spine',
}

type Shape = 'era' | 'domain' | 'spaced'

interface Props {
  onStartEra: (eraId: string) => void
  onStartDomain: (domain: Domain) => void
  onStartSpaced: () => void
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function HomeView({ onStartEra, onStartDomain, onStartSpaced }: Props) {
  const [shape, setShape] = useState<Shape>('era')

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

  useEffect(() => {
    summariseEras().then(setEraSummaries)
    summariseDomains().then(setDomainSummaries)
  }, [conceptCount, learnedCount, dueNow])

  return (
    <section className="space-y-8">
      <header>
        <h2 className="font-serif text-2xl">Today</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Pick a shape for today's ten minutes. Era is the default. Eras let you see how the
          politics, art, and science of one period fit together.
        </p>
      </header>

      <nav className="grid grid-cols-3 gap-2">
        <ShapeTab label="Era Lens" sub="A window in time" active={shape === 'era'} onClick={() => setShape('era')} />
        <ShapeTab label="Domain" sub="One subject deep" active={shape === 'domain'} onClick={() => setShape('domain')} />
        <ShapeTab label="Spaced Mix" sub="Just what's due" active={shape === 'spaced'} onClick={() => setShape('spaced')} />
      </nav>

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
                  className="group w-full rounded-2xl border border-bg-softer/40 bg-bg-soft/60 p-5 text-left transition-colors hover:border-accent/60 hover:bg-accent/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-bg-softer/40 disabled:hover:bg-bg-soft/60"
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
                  className="w-full rounded-2xl border border-bg-softer/40 bg-bg-soft/60 p-4 text-left transition-colors hover:border-accent/60 hover:bg-accent/5 disabled:opacity-40"
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
        <div className="rounded-2xl border border-bg-softer/40 bg-bg-soft/60 p-6">
          <h3 className="font-serif text-lg text-ink">Just the reviews</h3>
          <p className="mt-2 text-sm text-ink-soft">
            Whatever the spaced-repetition scheduler thinks is due, in one interleaved pass. No new
            material. Use this when you are behind and want to keep what you already have.
          </p>
          <button
            type="button"
            onClick={onStartSpaced}
            disabled={(dueNow ?? 0) === 0}
            className="mt-5 rounded-xl bg-accent px-5 py-2 text-sm font-medium text-bg hover:bg-accent-soft disabled:opacity-40"
          >
            {(dueNow ?? 0) > 0 ? `Start ${dueNow} due` : 'Nothing due right now'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="In your graph" value={conceptCount ?? 0} />
        <Stat label="Met so far" value={learnedCount ?? 0} />
        <Stat label="Due now" value={dueNow ?? 0} />
        <Stat label="Due tomorrow" value={dueTomorrow ?? 0} />
      </div>

      <p className="text-xs leading-relaxed text-ink-softer">
        Forgetting is normal and expected. The cards that feel hardest are the ones the scheduler
        is working on for you.
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
      className={`rounded-2xl border px-3 py-3 text-center transition-colors ${
        active
          ? 'border-accent/70 bg-accent/10'
          : 'border-bg-softer/40 bg-bg-soft/40 hover:border-accent/40'
      }`}
    >
      <span className={`block text-sm font-medium ${active ? 'text-accent' : 'text-ink'}`}>
        {label}
      </span>
      <span className="block text-[10px] uppercase tracking-wide text-ink-softer">{sub}</span>
    </button>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-bg-softer/30 bg-bg-soft/70 p-3">
      <p className="text-2xl font-medium text-ink">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-ink-softer">{label}</p>
    </div>
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
