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

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}
const listItem = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 380, damping: 28 } },
}

export function ContrastCard({ item, onAnswered, onRevealed, onConceptClick }: Props) {
  const { concept, question } = item
  const correct = question.expectedAnswer
  const distractors = question.distractors ?? []
  const options = useMemo(
    () => shuffle([correct, ...distractors]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item.cardKey, correct, distractors],
  )
  const [picked, setPicked] = useState<string | null>(null)

  useEffect(() => setPicked(null), [item.cardKey])

  // A synthesized card's stimulus is the summary ALONE — its expected answer is
  // the concept name, so the teaching brief (which prints the name) would give
  // the answer away and auto-grade every card 'good'.
  const showBrief = item.isSynth || item.isFallback || item.isNew
  const briefVariant = item.isSynth ? 'stimulus' : 'intro'
  const gotIt = picked === correct

  function pick(opt: string) {
    if (picked !== null) return
    const isCorrect = opt === correct
    setPicked(opt)
    onAnswered(concept.id)
    onRevealed(isCorrect ? 'good' : 'again')
  }

  return (
    <article className="space-y-6">
      <header className="flex items-baseline justify-between gap-3">
        <p className="text-[11px] uppercase tracking-wider text-ink-softer">
          {concept.domain.replace('_', ' ')}
        </p>
        {item.isFallback || item.isSynth ? (
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
            {item.isSynth ? 'name it' : 'pick'}
          </span>
        ) : item.isNew ? (
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
            new
          </span>
        ) : null}
      </header>
      {showBrief && (
        <Brief concept={concept} variant={briefVariant} onConceptClick={onConceptClick} />
      )}
      <p className="text-lg text-ink">{question.prompt}</p>
      <M.ul
        key={item.cardKey}
        variants={listContainer}
        initial="hidden"
        animate="show"
        className="space-y-2"
      >
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
          const anim =
            reveal && isPicked
              ? isCorrect
                ? 'animate-pop'
                : 'animate-shake'
              : ''
          return (
            <M.li key={opt} variants={listItem}>
              <button
                type="button"
                onClick={() => pick(opt)}
                disabled={picked !== null}
                className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${tone} ${anim}`}
              >
                <span className="flex items-center justify-between gap-2">
                  {opt}
                  {reveal && isCorrect && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 text-accent animate-bloom">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </span>
              </button>
            </M.li>
          )
        })}
      </M.ul>
      <AnimatePresence>
        {picked !== null && (
          <M.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-sm text-ink-soft"
          >
            {gotIt ? 'Yes. ' : 'Not yet. '}
            <span className="text-accent">{correct}</span>.
          </M.p>
        )}
      </AnimatePresence>
    </article>
  )
}
