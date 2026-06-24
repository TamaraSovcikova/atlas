import { useEffect, useRef, useState } from 'react'
import type { RecallItem } from '../../lib/session'
import type { RecallRating } from '../../lib/fsrs'
import { Brief } from '../Brief'

interface Props {
  item: RecallItem
  onAnswered: (conceptId: string) => void
  onRevealed: (rating: RecallRating | null) => void
  onConceptClick: (conceptId: string) => void
}

const BLANK = '____'

export function ClozeCard({ item, onAnswered, onRevealed, onConceptClick }: Props) {
  const { concept, question } = item
  const [typed, setTyped] = useState('')
  const [revealed, setRevealed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTyped('')
    setRevealed(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [item.cardKey])

  const answer = question.expectedAnswer
  const userCorrect = revealed && typed.trim().toLowerCase() === answer.trim().toLowerCase()

  function reveal() {
    if (revealed) return
    setRevealed(true)
    onAnswered(concept.id)
    // null = let user self-grade via swipe (typed input is imprecise for exact match)
    onRevealed(null)
  }

  function renderPrompt() {
    const idx = question.prompt.indexOf(BLANK)
    if (idx === -1) return <p className="text-lg leading-relaxed text-ink">{question.prompt}</p>
    const before = question.prompt.slice(0, idx)
    const after = question.prompt.slice(idx + BLANK.length)
    return (
      <p className="text-lg leading-relaxed text-ink">
        {before}
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
        {after}
      </p>
    )
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
      {item.isNew && <Brief concept={concept} variant="intro" onConceptClick={onConceptClick} />}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          reveal()
        }}
        className="space-y-5"
      >
        {renderPrompt()}
        {!revealed && (
          <div className="flex items-center justify-between gap-3 text-xs text-ink-softer">
            <span>Type the missing word, or reveal it.</span>
            <button
              type="submit"
              className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:bg-accent-soft"
            >
              Reveal
            </button>
          </div>
        )}
      </form>
      {revealed && typed.trim().length > 0 && !userCorrect && (
        <p className="text-xs text-ink-softer">
          You said <span className="text-ink-soft">"{typed.trim()}"</span>.
        </p>
      )}
    </article>
  )
}
