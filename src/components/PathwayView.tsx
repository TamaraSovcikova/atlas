import { useEffect, useState } from 'react'
import { summariseThreads, type ThreadSummary } from '../lib/session'
import { M } from './ui/motion'

interface Props {
  onStartThread: (threadId: string) => void
}

type NodeState = 'complete' | 'current' | 'available' | 'upcoming'

function stateOf(t: ThreadSummary, isCurrent: boolean): NodeState {
  if (t.total > 0 && t.met === t.total) return 'complete'
  if (isCurrent) return 'current'
  if (t.met > 0) return 'current'
  return 'available'
}

export function PathwayView({ onStartThread }: Props) {
  const [threads, setThreads] = useState<ThreadSummary[]>([])

  useEffect(() => {
    summariseThreads().then(setThreads)
  }, [])

  // The "current" thread is the first one not yet complete: where the user is.
  const currentIdx = threads.findIndex((t) => !(t.total > 0 && t.met === t.total))

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-ink">Your pathway</h2>
        <p className="mt-1 text-sm text-ink-softer">
          A guided climb through the stories. Finish one, the next opens up.
        </p>
      </div>

      <ol className="relative space-y-3">
        {threads.map((t, i) => {
          const state = stateOf(t, i === currentIdx)
          const upcoming = i > currentIdx && currentIdx !== -1
          const node: NodeState = upcoming ? 'upcoming' : state
          const last = i === threads.length - 1
          return (
            <PathNode
              key={t.threadId}
              summary={t}
              state={node}
              last={last}
              index={i}
              onStart={() => onStartThread(t.threadId)}
            />
          )
        })}
      </ol>
    </section>
  )
}

function PathNode({
  summary,
  state,
  last,
  index,
  onStart,
}: {
  summary: ThreadSummary
  state: NodeState
  last: boolean
  index: number
  onStart: () => void
}) {
  const pct = summary.total === 0 ? 0 : summary.met / summary.total
  const masteryPct = Math.round(summary.masteryFraction * 100)
  const startable = state === 'current' || state === 'available'

  const ring =
    state === 'complete'
      ? '#4ade80'
      : state === 'current'
        ? '#fbbf24'
        : 'rgba(255,255,255,0.18)'
  const r = 18
  const c = 2 * Math.PI * r

  return (
    <li className="relative flex gap-4">
      {/* Spine rail + node */}
      <div className="relative flex flex-col items-center">
        <M.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22, delay: index * 0.05 }}
          className="relative z-10"
        >
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <circle
              cx="24"
              cy="24"
              r={r}
              fill="none"
              stroke={ring}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - pct)}
              transform="rotate(-90 24 24)"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
            {state === 'complete' ? (
              <text x="24" y="29" textAnchor="middle" className="fill-good text-[15px]">
                ✓
              </text>
            ) : (
              <text
                x="24"
                y="29"
                textAnchor="middle"
                className={state === 'upcoming' ? 'fill-ink-softer text-[13px]' : 'fill-ink text-[13px]'}
              >
                {index + 1}
              </text>
            )}
          </svg>
        </M.div>
        {!last && (
          <div
            className="w-0.5 flex-1"
            style={{
              minHeight: 24,
              background:
                state === 'complete'
                  ? 'linear-gradient(rgba(74,222,128,0.5), rgba(255,255,255,0.1))'
                  : 'rgba(255,255,255,0.08)',
            }}
          />
        )}
      </div>

      {/* Card */}
      <button
        type="button"
        disabled={!startable || summary.total === 0}
        onClick={onStart}
        className={`mb-1 flex-1 rounded-2xl border p-5 text-left transition-all active:scale-[0.99] disabled:cursor-default ${
          state === 'current'
            ? 'border-accent/50 bg-accent/[0.06] shadow-glow'
            : state === 'upcoming'
              ? 'border-white/[0.05] bg-bg-soft/30 opacity-70'
              : 'border-white/[0.07] bg-bg-soft/50 hover:border-accent/40'
        }`}
      >
        <div className="flex items-baseline justify-between gap-3">
          <h3 className={`font-serif text-lg ${state === 'upcoming' ? 'text-ink-soft' : 'text-ink'}`}>
            {summary.name}
          </h3>
          {state === 'current' && (
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
              you are here
            </span>
          )}
          {state === 'complete' && (
            <span className="text-[10px] uppercase tracking-wider text-good">done</span>
          )}
        </div>
        <p className="mt-1 text-sm text-ink-soft">{summary.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-ink-softer">
          <span className="tabular-nums">
            {summary.met}/{summary.total} met
          </span>
          <span className="tabular-nums">{masteryPct}% mastery</span>
          {summary.due > 0 && (
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">{summary.due} due</span>
          )}
          {summary.newAvailable > 0 && state !== 'upcoming' && (
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">
              {summary.newAvailable} new
            </span>
          )}
          {summary.lockedNew > 0 && (
            <span className="rounded-full bg-bg-softer/40 px-2 py-0.5">{summary.lockedNew} locked</span>
          )}
        </div>
        {startable && summary.total > 0 && (
          <span className="mt-3 inline-block text-sm font-medium text-accent">
            {summary.met > 0 ? 'Continue →' : 'Begin →'}
          </span>
        )}
      </button>
    </li>
  )
}
