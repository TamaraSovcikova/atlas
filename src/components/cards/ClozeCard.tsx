import { useEffect, useRef, useState } from 'react'
import type { SessionCard } from '../../lib/session'
import type { RecallRating } from '../../lib/fsrs'
import { Brief } from '../Brief'
import { RatingRow } from '../RatingRow'

interface Props {
  card: SessionCard
  onRated: (rating: RecallRating) => void
}

const BLANK_MARKER = '____'

export function ClozeCard({ card, onRated }: Props) {
  const [typed, setTyped] = useState('')
  const [revealed, setRevealed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTyped('')
    setRevealed(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [card.cardKey])

  const prompt = card.question.prompt
  const answer = card.question.expectedAnswer
  const userCorrect = !revealed
    ? null
    : typed.trim().toLowerCase() === answer.trim().toLowerCase()

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (revealed) return
    setRevealed(true)
  }

  function renderPrompt() {
    const idx = prompt.indexOf(BLANK_MARKER)
    if (idx === -1) {
      return <p className="text-lg leading-relaxed text-ink">{prompt}</p>
    }
    const before = prompt.slice(0, idx)
    const after = prompt.slice(idx + BLANK_MARKER.length)
    return (
      <p className="text-lg leading-relaxed text-ink">
        <span>{before}</span>
        {revealed ? (
          <span
            className={`mx-1 rounded px-1.5 py-0.5 font-medium ${
              userCorrect ? 'bg-accent/30 text-accent-soft' : 'bg-red-500/15 text-red-300'
            }`}
          >
            {answer}
          </span>
        ) : (
          <input
            ref={inputRef}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            type="text"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="mx-1 inline-block w-28 rounded border-b-2 border-accent/40 bg-transparent px-1 py-0.5 text-center text-ink focus:border-accent focus:outline-none"
          />
        )}
        <span>{after}</span>
      </p>
    )
  }

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
      <form onSubmit={handleSubmit} className="space-y-5">
        {renderPrompt()}
        {!revealed && (
          <div className="flex items-center justify-between gap-3 text-xs text-ink-softer">
            <span>Type the missing word. Skip and reveal if it does not come.</span>
            <button
              type="submit"
              className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-soft"
            >
              Reveal
            </button>
          </div>
        )}
      </form>
      {revealed && (
        <>
          {typed.trim().length > 0 && !userCorrect && (
            <p className="text-xs text-ink-softer">
              You said <span className="text-ink-soft">"{typed.trim()}"</span>. Close enough? Use
              your judgement on the rating.
            </p>
          )}
          <RatingRow onRate={onRated} />
        </>
      )}
    </article>
  )
}
