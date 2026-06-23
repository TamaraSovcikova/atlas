import { useEffect, useMemo, useState } from 'react'
import { summariseThreads, type ThreadSummary } from '../lib/session'
import { M } from './ui/motion'

interface Props {
  onStartThread: (threadId: string) => void
}

type NodeState = 'complete' | 'current' | 'available' | 'locked'

function stateOf(t: ThreadSummary, isCurrentThread: boolean, unitLocked: boolean): NodeState {
  if (t.total > 0 && t.met === t.total) return 'complete'
  if (unitLocked) return 'locked'
  if (isCurrentThread) return 'current'
  if (t.met > 0) return 'current'
  return 'available'
}

interface UnitGroup {
  name: string
  threads: ThreadSummary[]
  /** 0–1 fraction of threads that are complete */
  completeFraction: number
}

function groupByUnit(threads: ThreadSummary[]): UnitGroup[] {
  const order: string[] = []
  const map = new Map<string, ThreadSummary[]>()
  for (const t of threads) {
    const u = t.unit ?? 'Other'
    if (!map.has(u)) { map.set(u, []); order.push(u) }
    map.get(u)!.push(t)
  }
  return order.map((name) => {
    const ts = map.get(name)!
    const done = ts.filter((t) => t.total > 0 && t.met === t.total).length
    return { name, threads: ts, completeFraction: ts.length ? done / ts.length : 0 }
  })
}

export function PathwayView({ onStartThread }: Props) {
  const [threads, setThreads] = useState<ThreadSummary[]>([])

  useEffect(() => {
    summariseThreads().then(setThreads)
  }, [])

  const units = useMemo(() => groupByUnit(threads), [threads])

  // Overall pathway progress
  const totalThreads = threads.length
  const doneThreads = threads.filter((t) => t.total > 0 && t.met === t.total).length
  const overallPct = totalThreads ? Math.round((doneThreads / totalThreads) * 100) : 0

  // Which thread is "current" (first not-yet-complete)
  const currentThreadId = threads.find((t) => !(t.total > 0 && t.met === t.total))?.threadId

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-ink">Your pathway</h2>
        <p className="mt-1 text-sm text-ink-softer">
          A guided climb through the knowledge. Finish each story to unlock the next.
        </p>
      </div>

      {/* Overall progress */}
      {totalThreads > 0 && (
        <div className="surface p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-ink">{overallPct}% complete</span>
            <span className="text-xs text-ink-softer">{doneThreads} of {totalThreads} stories</span>
          </div>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-bg-softer">
            <div
              className="h-full rounded-full bg-good transition-all duration-700"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
      )}

      {/* All-complete terminal state */}
      {totalThreads > 0 && doneThreads === totalThreads && (
        <div className="surface border-good/20 bg-good/[0.04] p-4">
          <p className="text-sm font-medium text-ink">You have walked the whole pathway.</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-softer">
            From here it is about keeping it. Your daily session will keep surfacing
            reviews as concepts come due, and mastery climbs on its own. Nothing more to unlock.
          </p>
        </div>
      )}

      {/* Units */}
      <ol className="space-y-8">
        {units.map((unit, unitIdx) => {
          // A unit is locked if the previous unit isn't at least 50% complete
          const prevUnit = units[unitIdx - 1]
          const unitLocked = prevUnit ? prevUnit.completeFraction < 0.5 : false

          return (
            <li key={unit.name}>
              {/* Unit header */}
              <div className="mb-3 flex items-center gap-3">
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  unit.completeFraction === 1
                    ? 'bg-good/20 text-good'
                    : unitLocked
                      ? 'bg-bg-softer text-ink-softer'
                      : 'bg-accent/15 text-accent'
                }`}>
                  {unit.completeFraction === 1 ? '✓' : unitIdx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-sm font-semibold ${unitLocked ? 'text-ink-softer' : 'text-ink'}`}>
                    {unit.name}
                  </span>
                  {unitLocked && (
                    <span className="ml-2 text-[10px] uppercase tracking-wide text-ink-softer">locked</span>
                  )}
                </div>
                {/* Unit mini progress */}
                {!unitLocked && unit.completeFraction > 0 && unit.completeFraction < 1 && (
                  <span className="text-[10px] text-ink-softer">
                    {Math.round(unit.completeFraction * unit.threads.length)}/{unit.threads.length}
                  </span>
                )}
              </div>

              {/* Why this unit is locked */}
              {unitLocked && prevUnit && (
                <p className="mb-3 -mt-1 pl-9 text-[11px] text-ink-softer">
                  Finish half of {prevUnit.name} to unlock this unit.
                </p>
              )}

              {/* Threads in this unit */}
              <ol className="relative space-y-2 pl-9">
                {/* Spine line */}
                <div
                  className="absolute left-3 top-3 w-0.5 rounded-full"
                  style={{
                    bottom: 12,
                    background: unit.completeFraction === 1
                      ? 'linear-gradient(rgba(74,222,128,0.4), rgba(74,222,128,0.1))'
                      : 'rgba(255,255,255,0.07)',
                  }}
                />

                {unit.threads.map((t, tIdx) => {
                  const isCurrentThread = t.threadId === currentThreadId
                  const state = stateOf(t, isCurrentThread, unitLocked)
                  const pct = t.total === 0 ? 0 : t.met / t.total
                  const masteryPct = Math.round(t.masteryFraction * 100)
                  const startable = (state === 'current' || state === 'available') && t.total > 0

                  const r = 8
                  const c = 2 * Math.PI * r
                  const ringColor =
                    state === 'complete' ? '#4ade80' :
                    state === 'current' ? '#fbbf24' :
                    'rgba(255,255,255,0.15)'

                  return (
                    <li key={t.threadId} className="relative flex gap-3">
                      {/* Mini ring on spine */}
                      <M.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 22, delay: tIdx * 0.06 }}
                        className="absolute -left-6 top-4 z-10"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20">
                          <circle cx="10" cy="10" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
                          <circle
                            cx="10" cy="10" r={r}
                            fill="none" stroke={ringColor} strokeWidth="2"
                            strokeLinecap="round" strokeDasharray={c}
                            strokeDashoffset={c * (1 - pct)}
                            transform="rotate(-90 10 10)"
                            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                          />
                          {state === 'complete' && (
                            <text x="10" y="14" textAnchor="middle" style={{ fill: '#4ade80', fontSize: 9 }}>✓</text>
                          )}
                        </svg>
                      </M.div>

                      {/* Card */}
                      <button
                        type="button"
                        disabled={!startable}
                        onClick={() => onStartThread(t.threadId)}
                        className={`flex-1 rounded-2xl border p-4 text-left transition-all active:scale-[0.99] disabled:cursor-default ${
                          state === 'current'
                            ? 'border-accent/50 bg-accent/[0.06] shadow-glow'
                            : state === 'locked'
                              ? 'border-white/[0.04] bg-bg-soft/20 opacity-50'
                              : state === 'complete'
                                ? 'border-good/20 bg-good/[0.04] hover:border-good/40'
                                : 'border-white/[0.07] bg-bg-soft/50 hover:border-accent/40'
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className={`font-serif text-base ${state === 'locked' ? 'text-ink-softer' : 'text-ink'}`}>
                            {t.name}
                          </h3>
                          {state === 'current' && (
                            <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[9px] uppercase tracking-wider text-accent">
                              you are here
                            </span>
                          )}
                          {state === 'complete' && (
                            <span className="shrink-0 text-[10px] uppercase tracking-wider text-good">done</span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-ink-softer line-clamp-2">{t.description}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-ink-softer">
                          <span>{t.met}/{t.total} met</span>
                          <span>{masteryPct}% mastery</span>
                          {t.due > 0 && (
                            <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-accent">{t.due} due</span>
                          )}
                          {t.newAvailable > 0 && state !== 'locked' && (
                            <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-accent">{t.newAvailable} new</span>
                          )}
                        </div>
                        {startable && (
                          <span className="mt-2 inline-block text-xs font-medium text-accent">
                            {t.met > 0 ? 'Continue →' : 'Begin →'}
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ol>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
