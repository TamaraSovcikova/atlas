import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/schema'

interface Props {
  onStartSession: () => void
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function HomeView({ onStartSession }: Props) {
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
  const newAvailable = useLiveQuery(
    () => db.concepts.filter((c) => c.firstSeenAt === null).count(),
    [],
    0,
  )

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-bg-softer/40 bg-bg-soft p-8">
        <h2 className="font-serif text-2xl">Today</h2>
        <p className="mt-2 text-ink-soft">
          {dueNow > 0
            ? `${dueNow} card${dueNow === 1 ? '' : 's'} due to review`
            : 'Nothing due yet'}
          {newAvailable > 0 && (
            <>
              <span className="text-ink-softer">, plus</span> {newAvailable} new concept
              {newAvailable === 1 ? '' : 's'} ready when you are
            </>
          )}
          .
        </p>
        <button
          type="button"
          onClick={onStartSession}
          className="mt-6 rounded-xl bg-accent px-6 py-3 text-base font-medium text-bg hover:bg-accent-soft"
        >
          Start today's session
        </button>
        <p className="mt-3 text-xs text-ink-softer">Aiming for about ten minutes.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="In your graph" value={conceptCount ?? 0} />
        <Stat label="Met so far" value={learnedCount ?? 0} />
        <Stat label="Due now" value={dueNow ?? 0} />
        <Stat label="Due tomorrow" value={dueTomorrow ?? 0} />
      </div>

      <p className="text-xs text-ink-softer">
        Forgetting is normal and expected. The cards that feel hardest are the ones the system is
        working on for you.
      </p>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-bg-softer/30 bg-bg-soft/70 p-3">
      <p className="text-2xl font-medium text-ink">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-ink-softer">{label}</p>
    </div>
  )
}
