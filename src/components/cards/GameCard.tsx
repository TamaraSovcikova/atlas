import { useMemo, useState } from 'react'
import type {
  GameItem,
  PairData,
  OddData,
  DropData,
  EraGuessData,
  MythData,
} from '../../lib/session'
import { fmtYearLabel } from '../../lib/session'
import type { RecallRating } from '../../lib/fsrs'
import { Button } from '../ui/Button'

interface Props {
  item: GameItem
  onAnswered: (conceptId: string) => void
  onDone: (results: { conceptId: string; rating: RecallRating }[]) => void
}

// ── Shared scaffolding ───────────────────────────────────────────────────────

function GameHeader({ label, title }: { label: string; title: string }) {
  return (
    <header>
      <p className="text-[11px] uppercase tracking-wider text-accent">{label}</p>
      <h2 className="mt-1 font-serif text-xl text-ink">{title}</h2>
    </header>
  )
}

function shuffle<T>(arr: T[], seed: string): T[] {
  let h = 5381
  for (let i = 0; i < seed.length; i++) h = ((h << 5) + h + seed.charCodeAt(i)) | 0
  return arr
    .map((x, i) => ({ x, k: (h ^ (i * 2654435761)) >>> 0 }))
    .sort((a, b) => a.k - b.k)
    .map((o) => o.x)
}

export function GameCard({ item, onAnswered, onDone }: Props) {
  switch (item.variant) {
    case 'pair':
      return <PairGame item={item} data={item.data as PairData} onDone={onDone} onAnswered={onAnswered} />
    case 'odd':
      return <OddGame item={item} data={item.data as OddData} onDone={onDone} onAnswered={onAnswered} />
    case 'drop':
      return <DropGame item={item} data={item.data as DropData} onDone={onDone} onAnswered={onAnswered} />
    case 'era':
      return <EraGame item={item} data={item.data as EraGuessData} onDone={onDone} onAnswered={onAnswered} />
    case 'myth':
      return <MythGame item={item} data={item.data as MythData} onDone={onDone} onAnswered={onAnswered} />
  }
}

// ── Connect the Pair ─────────────────────────────────────────────────────────

function PairGame({ item, data, onDone, onAnswered }: Props & { data: PairData }) {
  const rights = useMemo(() => shuffle(data.pairs.map((p) => p.rightId), item.cardKey), [item.cardKey])
  const rightName = useMemo(
    () => new Map(data.pairs.map((p) => [p.rightId, p.rightName])),
    [item.cardKey],
  )
  const correctRightFor = useMemo(
    () => new Map(data.pairs.map((p) => [p.leftId, p.rightId])),
    [item.cardKey],
  )
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState(false)

  const usedRights = new Set(Object.values(matches))
  const allMatched = Object.keys(matches).length === data.pairs.length

  function tapLeft(id: string) {
    if (revealed) return
    setSelectedLeft((cur) => (cur === id ? null : id))
  }
  function tapRight(rid: string) {
    if (revealed || !selectedLeft) return
    setMatches((cur) => {
      const next = { ...cur }
      // Clear any existing owner of this right, then assign.
      for (const k of Object.keys(next)) if (next[k] === rid) delete next[k]
      next[selectedLeft] = rid
      return next
    })
    setSelectedLeft(null)
  }
  function check() {
    setRevealed(true)
    onAnswered(data.pairs[0]!.leftId)
  }
  function finish() {
    const results: { conceptId: string; rating: RecallRating }[] = []
    for (const p of data.pairs) {
      const ok = matches[p.leftId] === p.rightId
      const rating: RecallRating = ok ? 'good' : 'again'
      results.push({ conceptId: p.leftId, rating }, { conceptId: p.rightId, rating })
    }
    onDone(results)
  }

  return (
    <article className="space-y-6">
      <GameHeader label="Connect" title="Match each one to its partner" />
      <div className="grid grid-cols-2 gap-3">
        <ul className="space-y-2">
          {data.pairs.map((p) => {
            const chosen = matches[p.leftId]
            const ok = revealed && chosen === p.rightId
            const wrong = revealed && chosen !== p.rightId
            return (
              <li key={p.leftId}>
                <button
                  type="button"
                  onClick={() => tapLeft(p.leftId)}
                  className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                    ok
                      ? 'border-good/40 bg-good/5 text-ink'
                      : wrong
                        ? 'border-bad/40 bg-bad/5 text-ink'
                        : selectedLeft === p.leftId
                          ? 'border-accent bg-accent/10 text-ink'
                          : 'border-ink/[0.10] bg-bg-soft text-ink'
                  }`}
                >
                  <span className="block font-medium">{p.leftName}</span>
                  {chosen && (
                    <span className={`mt-0.5 block text-[11px] ${wrong ? 'text-bad/80' : 'text-ink-softer'}`}>
                      {p.relation} → {rightName.get(chosen)}
                      {wrong && <span className="text-bad/80"> · should be {p.rightName}</span>}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
        <ul className="space-y-2">
          {rights.map((rid) => {
            const taken = usedRights.has(rid)
            return (
              <li key={rid}>
                <button
                  type="button"
                  disabled={revealed}
                  onClick={() => tapRight(rid)}
                  className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                    taken ? 'border-ink/[0.06] bg-bg-softer text-ink-softer' : 'border-ink/[0.10] bg-bg-soft text-ink'
                  } ${selectedLeft && !revealed ? 'hover:border-accent/50' : ''}`}
                >
                  {rightName.get(rid)}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      {!revealed ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-ink-softer">
            {selectedLeft ? 'Now tap its partner on the right' : 'Tap one on the left, then its partner'}
          </p>
          <Button onClick={check} disabled={!allMatched}>Check</Button>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button onClick={finish}>Next</Button>
        </div>
      )}
      <p className="sr-only">{correctRightFor.size} pairs</p>
    </article>
  )
}

// ── Odd One Out ──────────────────────────────────────────────────────────────

function OddGame({ data, onDone, onAnswered }: Props & { data: OddData }) {
  const [picked, setPicked] = useState<number | null>(null)
  const revealed = picked !== null

  function tap(i: number) {
    if (revealed) return
    setPicked(i)
    onAnswered(data.options[i]!.id)
  }
  function finish() {
    const correct = picked === data.oddIndex
    onDone(data.options.map((o) => ({ conceptId: o.id, rating: (correct ? 'good' : 'again') as RecallRating })))
  }

  return (
    <article className="space-y-6">
      <GameHeader label="Odd one out" title="Three of these belong together. Which doesn't?" />
      <ul className="space-y-2">
        {data.options.map((o, i) => {
          const isOdd = i === data.oddIndex
          const isPicked = i === picked
          const cls = !revealed
            ? 'border-ink/[0.10] bg-bg-soft hover:border-accent/40'
            : isOdd
              ? 'border-good/50 bg-good/5'
              : isPicked
                ? 'border-bad/40 bg-bad/5'
                : 'border-ink/[0.06] bg-bg-softer opacity-70'
          return (
            <li key={o.id}>
              <button
                type="button"
                disabled={revealed}
                onClick={() => tap(i)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm text-ink transition-colors ${cls}`}
              >
                <span>{o.name}</span>
                {revealed && isOdd && <span className="text-[11px] font-medium text-good">the odd one</span>}
              </button>
            </li>
          )
        })}
      </ul>
      {revealed && (
        <>
          <p className="text-sm text-ink-soft">
            {picked === data.oddIndex ? 'Right — ' : 'Not quite. '}
            The other three {data.bond}.
          </p>
          <div className="flex justify-end">
            <Button onClick={finish}>Next</Button>
          </div>
        </>
      )}
    </article>
  )
}

// ── Timeline Drop ────────────────────────────────────────────────────────────

function DropGame({ data, onDone, onAnswered }: Props & { data: DropData }) {
  const anchors = data.anchors // already sorted ascending by year
  const correctSlot = anchors.filter((a) => a.year < data.target.year).length
  const [picked, setPicked] = useState<number | null>(null)
  const revealed = picked !== null

  function place(slot: number) {
    if (revealed) return
    setPicked(slot)
    onAnswered(data.target.id)
  }
  function finish() {
    const targetOk = picked === correctSlot
    onDone([
      { conceptId: data.target.id, rating: (targetOk ? 'good' : 'again') as RecallRating },
      ...anchors.map((a) => ({ conceptId: a.id, rating: 'good' as RecallRating })),
    ])
  }

  // Render slots interleaved with anchors: slot 0, anchor 0, slot 1, anchor 1, …
  const rows: React.ReactNode[] = []
  for (let s = 0; s <= anchors.length; s++) {
    const isCorrect = revealed && s === correctSlot
    const isPicked = revealed && s === picked
    rows.push(
      revealed ? (
        <div
          key={`slot-${s}`}
          className={`rounded-lg px-3 py-2 text-center text-sm ${
            isCorrect
              ? 'bg-good/10 font-medium text-good'
              : isPicked
                ? 'bg-bad/10 text-bad'
                : 'text-transparent'
          }`}
        >
          {isCorrect ? `${data.target.name} · ${fmtYearLabel(data.target.year)}` : isPicked ? `${data.target.name} (you)` : '·'}
        </div>
      ) : (
        <button
          key={`slot-${s}`}
          type="button"
          onClick={() => place(s)}
          className="w-full rounded-lg border border-dashed border-accent/30 py-2 text-center text-xs text-accent/70 transition-colors hover:border-accent hover:bg-accent/5"
        >
          drop {data.target.name} here
        </button>
      ),
    )
    if (s < anchors.length) {
      const a = anchors[s]!
      rows.push(
        <div key={a.id} className="flex items-center justify-between rounded-xl border border-ink/[0.10] bg-bg-soft px-4 py-3">
          <span className="text-sm text-ink">{a.name}</span>
          <span className="text-sm font-medium text-ink-soft">{fmtYearLabel(a.year)}</span>
        </div>,
      )
    }
  }

  return (
    <article className="space-y-6">
      <GameHeader label="Timeline" title={`Where does ${data.target.name} belong?`} />
      <div className="space-y-2">{rows}</div>
      {revealed ? (
        <>
          <p className="text-sm text-ink-soft">
            {picked === correctSlot ? 'Spot on.' : `${data.target.name} is ${fmtYearLabel(data.target.year)}.`}
          </p>
          <div className="flex justify-end">
            <Button onClick={finish}>Next</Button>
          </div>
        </>
      ) : (
        <p className="text-xs text-ink-softer">Tap the gap where it fits in time. Earliest at the top.</p>
      )}
    </article>
  )
}

// ── Guess the Era ────────────────────────────────────────────────────────────

function EraGame({ data, onDone, onAnswered }: Props & { data: EraGuessData }) {
  const [shown, setShown] = useState(1) // clues revealed so far
  const [picked, setPicked] = useState<string | null>(null)
  const revealed = picked !== null

  function pick(eraId: string) {
    if (revealed) return
    setPicked(eraId)
    onAnswered(data.clueConceptIds[0]!)
  }
  function finish() {
    const correct = picked === data.answerEraId
    onDone(data.clueConceptIds.map((id) => ({ conceptId: id, rating: (correct ? 'good' : 'again') as RecallRating })))
  }

  return (
    <article className="space-y-6">
      <GameHeader label="Guess the era" title="Which era do these belong to?" />
      <ul className="space-y-2">
        {data.clues.slice(0, shown).map((c, i) => (
          <li key={c} className="flex items-center gap-2 rounded-xl border border-ink/[0.10] bg-bg-soft px-4 py-3 text-sm text-ink">
            <span className="text-accent">{i + 1}.</span> {c}
          </li>
        ))}
      </ul>
      {!revealed && shown < data.clues.length && (
        <button
          type="button"
          onClick={() => setShown((s) => s + 1)}
          className="text-xs text-accent hover:underline"
        >
          Reveal another clue ({data.clues.length - shown} left)
        </button>
      )}
      <div className="grid grid-cols-2 gap-2">
        {data.options.map((o) => {
          const isAnswer = o.id === data.answerEraId
          const isPicked = o.id === picked
          const cls = !revealed
            ? 'border-ink/[0.10] bg-bg-soft hover:border-accent/40'
            : isAnswer
              ? 'border-good/50 bg-good/5 text-good'
              : isPicked
                ? 'border-bad/40 bg-bad/5 text-bad'
                : 'border-ink/[0.06] bg-bg-softer opacity-70'
          return (
            <button
              key={o.id}
              type="button"
              disabled={revealed}
              onClick={() => pick(o.id)}
              className={`rounded-xl border px-3 py-2.5 text-sm text-ink transition-colors ${cls}`}
            >
              {o.name}
            </button>
          )
        })}
      </div>
      {revealed && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-ink-soft">
            {picked === data.answerEraId ? `Right, with ${shown} clue${shown > 1 ? 's' : ''}.` : 'Not this time.'}
          </p>
          <Button onClick={finish}>Next</Button>
        </div>
      )}
    </article>
  )
}

// ── Two Truths & a Myth ──────────────────────────────────────────────────────

function MythGame({ data, onDone, onAnswered }: Props & { data: MythData }) {
  const [picked, setPicked] = useState<number | null>(null)
  const revealed = picked !== null

  function tap(i: number) {
    if (revealed) return
    setPicked(i)
    onAnswered(data.conceptId)
  }
  function finish() {
    const correct = picked === data.mythIndex
    onDone([{ conceptId: data.conceptId, rating: (correct ? 'good' : 'again') as RecallRating }])
  }

  return (
    <article className="space-y-6">
      <GameHeader label="Two truths & a myth" title={`Which of these about ${data.conceptName} is false?`} />
      <ul className="space-y-2">
        {data.statements.map((s, i) => {
          const isMyth = i === data.mythIndex
          const isPicked = i === picked
          const cls = !revealed
            ? 'border-ink/[0.10] bg-bg-soft hover:border-accent/40'
            : isMyth
              ? 'border-bad/50 bg-bad/5'
              : isPicked
                ? 'border-bad/40 bg-bad/5'
                : 'border-good/40 bg-good/5'
          return (
            <li key={i}>
              <button
                type="button"
                disabled={revealed}
                onClick={() => tap(i)}
                className={`flex w-full items-start justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm text-ink transition-colors ${cls}`}
              >
                <span>{s}</span>
                {revealed && (
                  <span className={`shrink-0 text-[11px] font-medium ${isMyth ? 'text-bad' : 'text-good'}`}>
                    {isMyth ? 'myth' : 'true'}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
      {revealed && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-ink-soft">
            {picked === data.mythIndex ? 'Correct — that one is made up.' : 'That one was actually true.'}
          </p>
          <Button onClick={finish}>Next</Button>
        </div>
      )}
    </article>
  )
}
