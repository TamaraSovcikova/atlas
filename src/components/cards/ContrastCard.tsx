import { useEffect, useMemo, useState } from 'react'
import type { SessionCard } from '../../lib/session'
import type { RecallRating } from '../../lib/fsrs'
import { Brief } from '../Brief'
import { RatingRow } from '../RatingRow'

interface Props {
  card: SessionCard
  onRated: (rating: RecallRating) => void
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

export function ContrastCard({ card, onRated }: Props) {
  const correct = card.question.expectedAnswer
  const distractors = card.question.distractors ?? []
  const options = useMemo(() => shuffle([correct, ...distractors]), [card.cardKey, correct, distractors])
  const [picked, setPicked] = useState<string | null>(null)

  useEffect(() => {
    setPicked(null)
  }, [card.cardKey])

  const showBrief = card.isFallback || card.isNew

  return (
    <article className="space-y-6">
      <header className="flex items-baseline justify-between gap-3">
        <p className="text-[11px] uppercase tracking-wider text-ink-softer">
          {card.concept.domain.replace('_', ' ')}
        </p>
        {card.isFallback ? (
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
            pick
          </span>
        ) : card.isNew ? (
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
            new
          </span>
        ) : null}
      </header>
      {showBrief && <Brief concept={card.concept} variant="intro" />}
      <p className="text-lg text-ink">{card.question.prompt}</p>
      <ul className="space-y-2">
        {options.map((opt) => {
          const isCorrect = opt === correct
          const isPicked = picked === opt
          const reveal = picked !== null
          const tone = reveal
            ? isCorrect
              ? 'border-accent/60 bg-accent/10 text-ink'
              : isPicked
                ? 'border-red-500/40 bg-red-500/10 text-ink-soft'
                : 'border-bg-softer/40 bg-bg-soft text-ink-softer'
            : 'border-bg-softer/40 bg-bg-soft text-ink hover:border-accent/50 hover:bg-accent/5'
          return (
            <li key={opt}>
              <button
                type="button"
                onClick={() => setPicked(opt)}
                disabled={picked !== null}
                className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${tone}`}
              >
                {opt}
              </button>
            </li>
          )
        })}
      </ul>
      {picked !== null && (
        <>
          <p className="text-sm text-ink-soft">
            {picked === correct
              ? 'Yes. The right answer was '
              : 'Not yet. The right answer was '}
            <span className="text-accent">{correct}</span>.
          </p>
          <RatingRow onRate={onRated} />
        </>
      )}
    </article>
  )
}
