import { useEffect, useMemo, useState } from 'react'
import type { SessionCard } from '../lib/session'
import type { RecallRating } from '../lib/fsrs'
import { buildMcqDistractors } from '../lib/session'
import { ConnectionPanel } from './ConnectionPanel'

type Phase = 'prompt' | 'revealed' | 'mcq'

interface Props {
  card: SessionCard
  onRated: (rating: RecallRating) => void
}

const RATINGS: { value: RecallRating; label: string; sub: string }[] = [
  { value: 'again', label: 'Again', sub: 'Did not recall' },
  { value: 'hard', label: 'Hard', sub: 'Recalled with effort' },
  { value: 'good', label: 'Good', sub: 'Recalled' },
  { value: 'easy', label: 'Easy', sub: 'Recalled with no effort' },
]

export function RecallCard({ card, onRated }: Props) {
  const initialPhase: Phase = card.useMcq ? 'mcq' : 'prompt'
  const [phase, setPhase] = useState<Phase>(initialPhase)
  const [typed, setTyped] = useState('')
  const [mcqChoice, setMcqChoice] = useState<string | null>(null)
  const [mcqOptions, setMcqOptions] = useState<string[]>([])

  useEffect(() => {
    setPhase(card.useMcq ? 'mcq' : 'prompt')
    setTyped('')
    setMcqChoice(null)
    if (card.useMcq) {
      buildMcqDistractors(card.concept.id, card.concept.domain, 3).then((distractors) => {
        const merged = shuffle([...distractors, card.concept.name])
        setMcqOptions(merged)
      })
    }
  }, [card.cardKey, card.useMcq, card.concept.id, card.concept.domain, card.concept.name])

  const isNewIntro = card.isNew && phase === 'prompt'

  const intro = useMemo(() => {
    if (!isNewIntro) return null
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-ink-soft">
        <span className="text-accent">New today.</span> Read the brief below, then try the question.
      </div>
    )
  }, [isNewIntro])

  if (phase === 'mcq') {
    return (
      <article className="space-y-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-ink-softer">
            {card.concept.domain.replace('_', ' ')} - quick check
          </p>
          <h2 className="mt-2 font-serif text-2xl">Which concept matches this brief?</h2>
        </header>
        <p className="text-ink-soft">{card.concept.summary}</p>
        <ul className="space-y-2">
          {mcqOptions.map((opt) => {
            const isCorrect = opt === card.concept.name
            const isPicked = mcqChoice === opt
            const showReveal = mcqChoice !== null
            const tone = showReveal
              ? isCorrect
                ? 'border-accent/60 bg-accent/10 text-ink'
                : isPicked
                  ? 'border-red-500/40 bg-red-500/10 text-ink-soft'
                  : 'border-bg-softer/40 bg-bg-soft text-ink-softer'
              : 'border-bg-softer/40 bg-bg-soft text-ink hover:border-accent/50'
            return (
              <li key={opt}>
                <button
                  type="button"
                  disabled={mcqChoice !== null}
                  onClick={() => setMcqChoice(opt)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${tone}`}
                >
                  {opt}
                </button>
              </li>
            )
          })}
        </ul>
        {mcqChoice !== null && (
          <div className="space-y-4">
            <p className="text-sm text-ink-softer">
              {mcqChoice === card.concept.name
                ? 'Nice. The cards will move back to typed answers next time.'
                : `Not yet. The correct one is "${card.concept.name}". You will see this again soon.`}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {RATINGS.map((r) => (
                <RatingButton key={r.value} {...r} onClick={() => onRated(r.value)} />
              ))}
            </div>
          </div>
        )}
        <ConnectionPanel conceptId={card.concept.id} />
      </article>
    )
  }

  return (
    <article className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wide text-ink-softer">
          {card.concept.domain.replace('_', ' ')}
        </p>
        <h2 className="mt-2 font-serif text-2xl">{card.concept.name}</h2>
      </header>
      {intro}
      {card.isNew && <p className="text-ink-soft">{card.concept.summary}</p>}
      <div className="space-y-3">
        <p className="font-medium text-ink">{card.question.prompt}</p>
        <textarea
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          disabled={phase === 'revealed'}
          rows={3}
          placeholder="Type your answer. Effort is the point. Getting it wrong is fine."
          className="w-full resize-none rounded-xl border border-bg-softer/40 bg-bg-soft px-4 py-3 text-ink placeholder:text-ink-softer/60 focus:border-accent focus:outline-none disabled:opacity-60"
        />
      </div>
      {phase === 'prompt' && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setPhase('revealed')}
            className="rounded-xl bg-accent px-5 py-2 text-sm font-medium text-bg hover:bg-accent-soft"
          >
            Show answer
          </button>
        </div>
      )}
      {phase === 'revealed' && (
        <div className="space-y-4">
          <section className="rounded-xl border border-accent/30 bg-accent/5 p-4">
            <p className="text-xs uppercase tracking-wide text-accent">Answer</p>
            <p className="mt-2 text-ink">{card.question.expectedAnswer}</p>
          </section>
          {card.concept.wikipediaUrl && (
            <p className="text-xs text-ink-softer">
              Source:{' '}
              <a
                href={card.concept.wikipediaUrl}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-ink-softer/40 hover:text-ink"
              >
                Wikipedia
              </a>
            </p>
          )}
          <p className="text-sm text-ink-soft">
            How did you do? The struggle to remember is the learning happening. Pick what is true,
            not what feels generous.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {RATINGS.map((r) => (
              <RatingButton key={r.value} {...r} onClick={() => onRated(r.value)} />
            ))}
          </div>
        </div>
      )}
      <ConnectionPanel conceptId={card.concept.id} />
    </article>
  )
}

function RatingButton({
  label,
  sub,
  onClick,
}: {
  value: RecallRating
  label: string
  sub: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-start rounded-xl border border-bg-softer/40 bg-bg-soft px-3 py-2 text-left transition-colors hover:border-accent/60 hover:bg-accent/5"
    >
      <span className="text-sm font-medium text-ink">{label}</span>
      <span className="text-[11px] text-ink-softer">{sub}</span>
    </button>
  )
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}
