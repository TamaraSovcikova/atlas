import { useEffect, useState } from 'react'
import type { RecallItem } from '../../lib/session'
import type { RecallRating } from '../../lib/fsrs'
import { Brief } from '../Brief'
import { RatingRow } from '../RatingRow'

interface Props {
  item: RecallItem
  onAnswered: (conceptId: string) => void
  onDone: (ratings: { conceptId: string; rating: RecallRating }[]) => void
}

export function FreeCard({ item, onAnswered, onDone }: Props) {
  const { concept, question } = item
  const [typed, setTyped] = useState('')
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setTyped('')
    setRevealed(false)
  }, [item.cardKey])

  function reveal() {
    setRevealed(true)
    onAnswered(concept.id)
  }

  return (
    <article className="space-y-6">
      <header className="flex items-baseline justify-between gap-3">
        <p className="text-[11px] uppercase tracking-wider text-ink-softer">
          {concept.domain.replace('_', ' ')}
        </p>
        {item.isNew && (
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
            new
          </span>
        )}
      </header>
      {item.isNew && <Brief concept={concept} variant="intro" />}
      <p className="text-lg leading-relaxed text-ink">{question.prompt}</p>
      <textarea
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        disabled={revealed}
        rows={3}
        placeholder="Try it. Skip and reveal if nothing comes."
        className="w-full resize-none rounded-xl border border-bg-softer/40 bg-bg-soft px-4 py-3 text-ink placeholder:text-ink-softer/60 focus:border-accent focus:outline-none disabled:opacity-60"
      />
      {!revealed && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={reveal}
            className="rounded-xl bg-accent px-5 py-2 text-sm font-medium text-bg hover:bg-accent-soft"
          >
            Reveal
          </button>
        </div>
      )}
      {revealed && (
        <>
          <section className="rounded-xl border border-accent/30 bg-accent/5 p-4">
            <p className="text-[11px] uppercase tracking-wider text-accent">Answer</p>
            <p className="mt-2 text-ink">{question.expectedAnswer}</p>
          </section>
          <RatingRow onRate={(rating) => onDone([{ conceptId: concept.id, rating }])} />
        </>
      )}
    </article>
  )
}
