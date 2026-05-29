import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/schema'

export function DailySession() {
  const conceptCount = useLiveQuery(() => db.concepts.count(), [], 0)
  const dueNow = useLiveQuery(
    () => db.reviews.where('dueAt').belowOrEqual(Date.now()).count(),
    [],
    0,
  )

  if (conceptCount === 0) {
    return (
      <section className="rounded-2xl border border-bg-softer/40 bg-bg-soft p-8">
        <h2 className="font-serif text-xl">Welcome to Atlas</h2>
        <p className="mt-3 text-ink-soft">
          No concepts seeded yet. The 15-minute calibration onboarding will be the first thing
          you do here. After that, every day will start with a short list of due reviews and
          one new concept per domain, interleaved.
        </p>
        <p className="mt-4 text-sm text-ink-softer">
          The patient-tutor voice and the layered free-recall protocol will live in this view.
          For now this shell exists to confirm the data layer (Dexie) and the scheduler
          (FSRS-6) are wired correctly.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-bg-softer/40 bg-bg-soft p-8">
      <h2 className="font-serif text-xl">Today</h2>
      <p className="mt-3 text-ink-soft">
        {dueNow} {dueNow === 1 ? 'card' : 'cards'} due. {conceptCount} concept
        {conceptCount === 1 ? '' : 's'} in your graph.
      </p>
    </section>
  )
}
