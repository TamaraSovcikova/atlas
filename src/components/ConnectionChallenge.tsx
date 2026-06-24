import { useCallback, useEffect, useState } from 'react'
import { db } from '../db/schema'
import type { Concept } from '../db/schema'

/**
 * Connection Challenge (Wave 5). Uses real graph edges from the user's met
 * concepts. Two game modes alternate:
 *
 * 1. "Which of these IS connected to [A]?" — the user picks the one that has
 *    a real edge to A from among 4 options (3 distractors from met concepts).
 * 2. "Which of these is NOT connected to [A]?" — similar but inverted.
 *
 * Only uses concepts the user has already met (firstSeenAt !== null) and edges
 * that exist in the DB between them, so it is always grounded in reality.
 */

interface Question {
  anchor: Concept
  correct: Concept
  distractors: Concept[]
  relation: string
  mode: 'is-connected' | 'not-connected'
}

interface Props {
  onClose: () => void
}

const RELATION_LABEL: Record<string, string> = {
  caused: 'caused by',
  influenced_by: 'influenced',
  contemporary_of: 'was contemporary with',
  located_in: 'is located in',
  part_of: 'is part of',
  opposed: 'was opposed to',
  successor_of: 'was succeeded by',
  belief_in: 'embraced belief in',
  student_of: 'was a student of',
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

export function ConnectionChallenge({ onClose }: Props) {
  const [question, setQuestion] = useState<Question | null>(null)
  const [options, setOptions] = useState<Concept[]>([])
  const [chosen, setChosen] = useState<string | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)

  const buildQuestion = useCallback(async () => {
    setChosen(null)
    setLoading(true)

    const metConcepts = await db.concepts.filter((c) => c.firstSeenAt !== null).toArray()
    if (metConcepts.length < 4) {
      setNoData(true)
      setLoading(false)
      return
    }

    const edges = await db.edges.toArray()
    const metIds = new Set(metConcepts.map((c) => c.id))

    // Find edges between met concepts only
    const validEdges = edges.filter((e) => metIds.has(e.fromId) && metIds.has(e.toId))
    if (validEdges.length === 0) {
      setNoData(true)
      setLoading(false)
      return
    }

    const edge = validEdges[Math.floor(Math.random() * validEdges.length)]!
    const anchor = metConcepts.find((c) => c.id === edge.fromId)!
    const correct = metConcepts.find((c) => c.id === edge.toId)!
    const distractors = shuffle(
      metConcepts.filter((c) => c.id !== anchor.id && c.id !== correct.id),
    ).slice(0, 3)

    const mode: Question['mode'] = Math.random() > 0.5 ? 'is-connected' : 'not-connected'
    const rel = RELATION_LABEL[edge.relation] ?? edge.relation

    const q: Question = { anchor, correct, distractors, relation: rel, mode }
    setQuestion(q)

    // For 'is-connected': options are [correct, ...distractors] shuffled
    // For 'not-connected': user finds the one that is NOT connected, so correct
    // is actually the distractor (one concept that has no edge to anchor among met)
    setOptions(shuffle([correct, ...distractors]))
    setLoading(false)
  }, [])

  useEffect(() => {
    buildQuestion()
  }, [buildQuestion])

  function isCorrectChoice(conceptId: string): boolean {
    if (!question) return false
    return question.mode === 'is-connected'
      ? conceptId === question.correct.id
      : conceptId !== question.correct.id
  }

  async function onChoose(conceptId: string) {
    if (chosen) return
    setChosen(conceptId)
    const correct = isCorrectChoice(conceptId)
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
  }

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <Header onClose={onClose} score={score} />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-ink-softer">Building challenge…</p>
        </div>
      </div>
    )
  }

  if (noData) {
    return (
      <div className="flex h-full flex-col">
        <Header onClose={onClose} score={score} />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="font-serif text-xl text-ink">Not enough concepts yet</p>
          <p className="text-sm text-ink-soft">
            Meet at least 4 connected concepts in your daily sessions, then come back for challenges.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-on-accent"
          >
            Got it
          </button>
        </div>
      </div>
    )
  }

  const q = question!
  const questionText =
    q.mode === 'is-connected'
      ? `Which of these was ${q.relation}:`
      : `Which of these was NOT ${q.relation}:`

  return (
    <div className="flex h-full flex-col">
      <Header onClose={onClose} score={score} />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Anchor concept */}
        <div className="rounded-2xl border border-accent/20 bg-accent/[0.05] p-5">
          <p className="text-[11px] font-medium uppercase tracking-widest text-accent/70">
            Connection challenge
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">{q.anchor.name}</h2>
          <p className="mt-1 text-[11px] text-ink-softer capitalize">{q.anchor.domain.replace('_', ' ')}</p>
        </div>

        {/* Question */}
        <p className="mt-6 text-center text-sm font-medium text-ink">{questionText}</p>

        {/* Options */}
        <div className="mt-4 space-y-2">
          {options.map((opt) => {
            const isChosen = chosen === opt.id
            const correct = chosen ? isCorrectChoice(opt.id) : null
            const isWrong = isChosen && !correct

            let cls =
              'w-full rounded-2xl border p-4 text-left transition-colors '
            if (!chosen) {
              cls += 'border-ink/[0.08] bg-bg-soft hover:border-accent/40'
            } else if (correct) {
              cls += 'border-green-500/40 bg-green-50/30 dark:bg-green-900/10'
            } else if (isWrong) {
              cls += 'border-red-400/40 bg-red-50/20 dark:bg-red-900/10'
            } else {
              cls += 'border-ink/[0.05] bg-bg-soft/50 opacity-60'
            }

            return (
              <button key={opt.id} type="button" onClick={() => onChoose(opt.id)} className={cls}>
                <p className="text-sm font-medium text-ink">{opt.name}</p>
                <p className="mt-0.5 text-[11px] capitalize text-ink-softer">
                  {opt.domain.replace('_', ' ')}
                </p>
                {chosen && correct && (
                  <p className="mt-1 text-[11px] text-green-600 dark:text-green-400">
                    ✓ Correct
                    {isChosen ? ` — ${q.anchor.name} ${q.relation} ${opt.name}` : ''}
                  </p>
                )}
                {isWrong && (
                  <p className="mt-1 text-[11px] text-red-500">✗ Not quite</p>
                )}
              </button>
            )
          })}
        </div>

        {/* Explanation after answer */}
        {chosen && (
          <div className="mt-6 space-y-3">
            <div className="rounded-xl bg-bg-soft px-4 py-3 text-xs leading-relaxed text-ink-soft">
              {q.mode === 'is-connected'
                ? `${q.anchor.name} ${q.relation} ${q.correct.name}.`
                : `${q.correct.name} was the one connected to ${q.anchor.name} — it ${q.relation} ${q.anchor.name}.`}
            </div>
            <button
              type="button"
              onClick={buildQuestion}
              className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-on-accent transition-opacity active:opacity-80"
            >
              Next challenge →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Header({
  onClose,
  score,
}: {
  onClose: () => void
  score: { correct: number; total: number }
}) {
  return (
    <div className="flex flex-none items-center justify-between px-5 py-4">
      <button
        type="button"
        onClick={onClose}
        className="rounded-full p-1.5 text-ink-softer hover:text-ink"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <p className="font-serif text-base text-ink">Graph challenge</p>
      {score.total > 0 ? (
        <span className="text-sm tabular-nums text-accent">
          {score.correct}/{score.total}
        </span>
      ) : (
        <div className="w-8" />
      )}
    </div>
  )
}
