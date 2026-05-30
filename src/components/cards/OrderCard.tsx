import { useEffect, useMemo, useState } from 'react'
import type { OrderItem } from '../../lib/session'
import type { RecallRating } from '../../lib/fsrs'

interface Props {
  item: OrderItem
  onAnswered: (conceptId: string) => void
  onDone: (ratings: { conceptId: string; rating: RecallRating }[]) => void
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

function fmtYear(y: number | null): string {
  if (y === null) return ''
  return y < 0 ? `${-y} BCE` : `${y}`
}

export function OrderCard({ item, onAnswered, onDone }: Props) {
  const entries = item.entries
  const shuffled = useMemo(() => shuffle(entries), [item.cardKey])
  const [placed, setPlaced] = useState<string[]>([])
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setPlaced([])
    setRevealed(false)
  }, [item.cardKey])

  const correctOrder = useMemo(
    () =>
      [...entries]
        .sort((a, b) => (a.concept.approxYear ?? 0) - (b.concept.approxYear ?? 0))
        .map((e) => e.concept.id),
    [item.cardKey],
  )

  function place(conceptId: string) {
    if (revealed) return
    const next = [...placed, conceptId]
    setPlaced(next)
    if (next.length === entries.length) {
      setRevealed(true)
      onAnswered(entries[0]!.concept.id)
    }
  }

  function ratingFor(conceptId: string): RecallRating {
    const placedIdx = placed.indexOf(conceptId)
    const correctIdx = correctOrder.indexOf(conceptId)
    return placedIdx === correctIdx ? 'good' : 'again'
  }

  const remaining = shuffled.filter((e) => !placed.includes(e.concept.id))
  const correctCount = revealed
    ? placed.filter((id, i) => correctOrder[i] === id).length
    : 0

  return (
    <article className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-wider text-accent">Timeline</p>
        <h2 className="mt-1 font-serif text-xl text-ink">Tap these from earliest to latest</h2>
      </header>

      {!revealed && (
        <>
          <ol className="space-y-2">
            {placed.map((id, i) => {
              const e = entries.find((x) => x.concept.id === id)!
              return (
                <li
                  key={id}
                  className="flex items-center gap-3 rounded-xl border border-accent/40 bg-accent/5 px-4 py-3"
                >
                  <span className="text-sm text-accent">{i + 1}</span>
                  <span className="text-ink">{e.concept.name}</span>
                </li>
              )
            })}
          </ol>
          <div className="flex flex-wrap gap-2">
            {remaining.map((e) => (
              <button
                key={e.concept.id}
                type="button"
                onClick={() => place(e.concept.id)}
                className="rounded-xl border border-bg-softer/40 bg-bg-soft px-4 py-2 text-sm text-ink transition-colors hover:border-accent/60 hover:bg-accent/5"
              >
                {e.concept.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-ink-softer">Tap the one you think came first, then the next, and so on.</p>
        </>
      )}

      {revealed && (
        <>
          <p className="text-sm text-ink-soft">
            {correctCount === entries.length
              ? 'Perfect order.'
              : `${correctCount} of ${entries.length} in the right place. Here is the timeline:`}
          </p>
          <ol className="space-y-2">
            {correctOrder.map((id, i) => {
              const e = entries.find((x) => x.concept.id === id)!
              const userIdx = placed.indexOf(id)
              const right = userIdx === i
              return (
                <li
                  key={id}
                  className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                    right ? 'border-accent/40 bg-accent/5' : 'border-red-500/30 bg-red-500/5'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-sm text-ink-softer">{i + 1}</span>
                    <span className="text-ink">{e.concept.name}</span>
                  </span>
                  <span className="text-xs text-ink-softer">{fmtYear(e.concept.approxYear)}</span>
                </li>
              )
            })}
          </ol>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                onDone(entries.map((e) => ({ conceptId: e.concept.id, rating: ratingFor(e.concept.id) })))
              }
              className="rounded-xl bg-accent px-5 py-2 text-sm font-medium text-bg hover:bg-accent-soft"
            >
              Next
            </button>
          </div>
        </>
      )}
    </article>
  )
}
