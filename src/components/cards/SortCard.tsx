import { useEffect, useMemo, useState } from 'react'
import type { SortItem } from '../../lib/session'
import type { RecallRating } from '../../lib/fsrs'
import { Button } from '../ui/Button'

interface Props {
  item: SortItem
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

export function SortCard({ item, onAnswered, onDone }: Props) {
  const entries = item.entries
  const shuffled = useMemo(() => shuffle(entries), [item.cardKey])
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setAssignments({})
    setSelected(null)
    setRevealed(false)
  }, [item.cardKey])

  const unassigned = shuffled.filter((e) => !(e.concept.id in assignments))

  function assign(bucketId: string) {
    if (revealed || !selected) return
    const next = { ...assignments, [selected]: bucketId }
    setSelected(null)
    setAssignments(next)
    if (Object.keys(next).length === entries.length) {
      setRevealed(true)
      onAnswered(entries[0]!.concept.id)
    }
  }

  function correctFor(conceptId: string): boolean {
    const e = entries.find((x) => x.concept.id === conceptId)!
    return assignments[conceptId] === e.bucketId
  }

  const correctCount = revealed ? entries.filter((e) => correctFor(e.concept.id)).length : 0

  return (
    <article className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-wider text-accent">Sort</p>
        <h2 className="mt-1 font-serif text-xl text-ink">Put each one in the right group</h2>
      </header>

      {unassigned.length > 0 && !revealed && (
        <div className="flex flex-wrap gap-2">
          {unassigned.map((e) => (
            <button
              key={e.concept.id}
              type="button"
              onClick={() => setSelected(e.concept.id)}
              className={`rounded-full border px-4 py-2 text-sm transition-all active:scale-95 ${
                selected === e.concept.id
                  ? 'border-accent bg-accent/15 text-ink shadow-glow'
                  : 'border-white/10 bg-bg-raised text-ink hover:border-accent/50'
              }`}
            >
              {e.concept.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {item.buckets.map((bucket) => {
          const inBucket = entries.filter((e) => assignments[e.concept.id] === bucket.id)
          return (
            <button
              key={bucket.id}
              type="button"
              disabled={revealed || !selected}
              onClick={() => assign(bucket.id)}
              className={`rounded-2xl border p-4 text-left transition-colors ${
                selected && !revealed
                  ? 'border-accent/50 bg-accent/5 hover:border-accent'
                  : 'border-white/10 bg-bg-soft/60'
              } disabled:cursor-default`}
            >
              <p className="text-sm font-medium text-ink">{bucket.label}</p>
              <ul className="mt-2 space-y-1">
                {inBucket.map((e) => {
                  const ok = revealed && correctFor(e.concept.id)
                  const bad = revealed && !correctFor(e.concept.id)
                  return (
                    <li
                      key={e.concept.id}
                      className={`rounded-lg px-2 py-1 text-xs ${
                        ok
                          ? 'bg-accent/15 text-accent'
                          : bad
                            ? 'bg-bad/10 text-bad'
                            : 'bg-bg-raised text-ink-soft'
                      }`}
                    >
                      {e.concept.name}
                      {bad && (
                        <span className="text-ink-softer">
                          {' '}
                          - belongs in {item.buckets.find((b) => b.id === e.bucketId)?.label}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </button>
          )
        })}
      </div>

      {!revealed && selected && (
        <p className="text-xs text-accent">Now tap the group it belongs to.</p>
      )}

      {revealed && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-ink-soft">
            {correctCount === entries.length
              ? 'All sorted correctly.'
              : `${correctCount} of ${entries.length} right.`}
          </p>
          <Button
            onClick={() =>
              onDone(
                entries.map((e) => ({
                  conceptId: e.concept.id,
                  rating: (correctFor(e.concept.id) ? 'good' : 'again') as RecallRating,
                })),
              )
            }
          >
            Next
          </Button>
        </div>
      )}
    </article>
  )
}
