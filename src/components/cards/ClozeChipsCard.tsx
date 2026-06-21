import { useEffect, useMemo, useState } from 'react'
import type { RecallItem } from '../../lib/session'
import type { RecallRating } from '../../lib/fsrs'
import { Brief } from '../Brief'
import { M, AnimatePresence } from '../ui/motion'

interface Props {
  item: RecallItem
  onAnswered: (conceptId: string) => void
  onRevealed: (rating: RecallRating | null) => void
  onConceptClick: (conceptId: string) => void
}

const BLANK = '____'

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

const chipContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
}
const chipItem = {
  hidden: { opacity: 0, y: 10, scale: 0.88 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 420, damping: 26 } },
}

export function ClozeChipsCard({ item, onAnswered, onRevealed, onConceptClick }: Props) {
  const { concept, question } = item
  const answer = question.expectedAnswer
  const chips = useMemo(
    () => shuffle([answer, ...(question.chipDistractors ?? [])]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item.cardKey, answer, question.chipDistractors],
  )
  const [picked, setPicked] = useState<string | null>(null)

  useEffect(() => setPicked(null), [item.cardKey])

  const correct = picked !== null && picked.toLowerCase() === answer.toLowerCase()

  function pick(chip: string) {
    if (picked !== null) return
    const isCorrect = chip.toLowerCase() === answer.toLowerCase()
    setPicked(chip)
    onAnswered(concept.id)
    onRevealed(isCorrect ? 'good' : 'again')
  }

  function renderPrompt() {
    const idx = question.prompt.indexOf(BLANK)
    if (idx === -1) return <p className="text-lg leading-relaxed text-ink">{question.prompt}</p>
    const before = question.prompt.slice(0, idx)
    const after = question.prompt.slice(idx + BLANK.length)
    return (
      <p className="text-lg leading-relaxed text-ink">
        {before}
        <M.span
          animate={
            picked === null
              ? {}
              : correct
                ? { scale: [1, 1.12, 1], backgroundColor: ['rgba(251,191,36,0.12)', 'rgba(251,191,36,0.3)', 'rgba(251,191,36,0.18)'] }
                : { x: [0, -7, 7, -4, 4, 0] }
          }
          transition={{ duration: 0.35 }}
          className={`mx-1 inline-block min-w-16 rounded px-2 py-0.5 text-center font-medium ${
            picked === null
              ? 'bg-bg-softer/50 text-ink-softer'
              : correct
                ? 'bg-accent/20 text-accent-soft'
                : 'bg-red-500/15 text-red-300'
          }`}
        >
          {picked ?? '?'}
        </M.span>
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
      {renderPrompt()}
      <M.div
        key={item.cardKey}
        variants={chipContainer}
        initial="hidden"
        animate="show"
        className="flex flex-wrap gap-2"
      >
        {chips.map((chip) => {
          const isAnswer = chip.toLowerCase() === answer.toLowerCase()
          const isPicked = picked === chip
          const reveal = picked !== null
          const tone = reveal
            ? isAnswer
              ? 'border-accent/60 bg-accent/15 text-ink'
              : isPicked
                ? 'border-red-500/40 bg-red-500/10 text-ink-soft'
                : 'border-bg-softer/30 bg-bg-soft/60 text-ink-softer/60'
            : 'border-bg-softer/40 bg-bg-soft text-ink hover:border-accent/60 hover:bg-accent/5'
          const anim =
            reveal && isPicked
              ? isAnswer
                ? 'animate-pop'
                : 'animate-shake'
              : ''
          return (
            <M.button
              key={chip}
              variants={chipItem}
              type="button"
              disabled={picked !== null}
              onClick={() => pick(chip)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${tone} ${anim}`}
            >
              {chip}
            </M.button>
          )
        })}
      </M.div>
      <AnimatePresence>
        {picked !== null && (
          <M.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-sm text-ink-soft"
          >
            {correct ? 'Yes.' : `Not yet. It is ${answer}.`}{' '}
            {!correct && <span className="text-ink-softer">You will see this again soon.</span>}
          </M.p>
        )}
      </AnimatePresence>
    </article>
  )
}
