import { useEffect, useState } from 'react'
import type { SessionCard } from '../../lib/session'
import type { RecallRating } from '../../lib/fsrs'
import { Brief } from '../Brief'
import { RatingRow } from '../RatingRow'

interface Props {
  card: SessionCard
  onRated: (rating: RecallRating) => void
}

export function FreeCard({ card, onRated }: Props) {
  const [typed, setTyped] = useState('')
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setTyped('')
    setRevealed(false)
  }, [card.cardKey])

  return (
    <article className="space-y-6">
      <header className="flex items-baseline justify-between gap-3">
        <p className="text-[11px] uppercase tracking-wider text-ink-softer">
          {card.concept.domain.replace('_', ' ')}
        </p>
        {card.isNew && (
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
            new
          </span>
        )}
      </header>
      {card.isNew && <Brief concept={card.concept} variant="intro" />}
      <p className="text-lg leading-relaxed text-ink">{card.question.prompt}</p>
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
            onClick={() => setRevealed(true)}
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
            <p className="mt-2 text-ink">{card.question.expectedAnswer}</p>
          </section>
          <RatingRow onRate={onRated} />
        </>
      )}
    </article>
  )
}
