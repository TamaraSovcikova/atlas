import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Collection } from '../db/schema'
import { summariseThreads } from '../lib/session'
import { progressSnapshot } from '../lib/progress'
import { useSettings } from '../store/useSettings'
import type { Tab } from './BottomNav'
import { Button } from './ui/Button'

interface Props {
  onStartFocus: () => void
  onStartPractice: () => void
  onNavigate: (tab: Tab) => void
  onClose: () => void
}

/**
 * The pull-down surface behind the feed: today's progress, the opt-in focus
 * session, the pathway, and collections. The feed is where you learn day to
 * day; this is the quiet "where am I" overview.
 */
export function Dashboard({ onStartFocus, onStartPractice, onNavigate, onClose }: Props) {
  const prefs = useSettings((s) => s.prefs)
  const sessions = useLiveQuery(() => db.sessions.toArray(), [], [])
  const collections = useLiveQuery(
    () => db.collections.orderBy('createdAt').toArray(),
    [],
    [] as Collection[],
  )
  const dueNow = useLiveQuery(async () => {
    const metIds = new Set(
      (await db.concepts.filter((c) => c.firstSeenAt !== null).toArray()).map((c) => c.id),
    )
    const allDue = await db.reviews.where('dueAt').belowOrEqual(Date.now()).toArray()
    return allDue.filter((r) => metIds.has(r.conceptId)).length
  }, [], 0)

  const [threadSummaries, setThreadSummaries] = useState<
    Awaited<ReturnType<typeof summariseThreads>>
  >([])
  useEffect(() => {
    summariseThreads().then(setThreadSummaries)
  }, [sessions])

  const snap = progressSnapshot(sessions, prefs.dailyGoalCards, prefs.streakFreezes)
  const currentThread = threadSummaries.find((t) => !(t.total > 0 && t.met === t.total))
  const completedThreads = threadSummaries.filter((t) => t.total > 0 && t.met === t.total).length

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl px-5 py-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-ink">Today</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to feed"
            className="flex items-center gap-1 rounded-full border border-ink/[0.08] bg-bg-soft px-3 py-1.5 text-xs text-ink-softer hover:border-accent/30 hover:text-ink"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m18 15-6-6-6 6" />
            </svg>
            Feed
          </button>
        </div>

        <section className="space-y-4">
          {/* Progress card */}
          <div className="surface p-6">
            <div className="flex items-baseline justify-between">
              <h3 className="font-serif text-xl text-ink">
                {snap.goalMet ? 'Goal met' : 'Keep going'}
              </h3>
              {snap.streak > 0 && (
                <span className="flex items-center gap-1 text-sm text-accent">
                  <span>🔥</span>
                  <span className="tabular-nums">{snap.streak}</span>
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              <span className="tabular-nums text-ink">{snap.todayCards}</span> of{' '}
              <span className="tabular-nums">{snap.goalCards}</span> cards today
              {dueNow ? (
                <>
                  {' · '}
                  <span className="tabular-nums text-ink">{dueNow}</span> due now
                </>
              ) : null}
            </p>
            {/* Goal bar */}
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bg-softer">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${Math.round(snap.goalFraction * 100)}%` }}
              />
            </div>
            <div className="mt-4 flex gap-3">
              <Button onClick={onStartFocus} className="flex-1">
                Focus session
              </Button>
              <button
                type="button"
                onClick={onStartPractice}
                className="rounded-xl border border-ink/[0.08] bg-bg-softer px-4 py-2.5 text-sm text-ink-soft transition-colors hover:border-accent/30 hover:text-ink"
              >
                Practice
              </button>
            </div>
          </div>

          {/* Pathway */}
          {threadSummaries.length > 0 && (
            <button
              type="button"
              onClick={() => {
                onNavigate('atlas')
                onClose()
              }}
              className="group flex w-full items-center gap-4 rounded-2xl border border-ink/[0.08] bg-bg-soft/70 p-4 text-left transition-all hover:border-accent/40 active:scale-[0.99]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
                  <path d="M12 7v3M12 14v3" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] uppercase tracking-wide text-ink-softer">
                  Your pathway · {completedThreads}/{threadSummaries.length} stories
                </span>
                <span className="block truncate text-sm font-medium text-ink">
                  {currentThread ? currentThread.name : 'All stories complete'}
                </span>
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-ink-softer transition-transform group-hover:translate-x-0.5">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          )}

          {/* Collections */}
          {collections.length > 0 && (
            <button
              type="button"
              onClick={() => {
                onNavigate('atlas')
                onClose()
              }}
              className="group w-full rounded-2xl border border-ink/[0.08] bg-bg-soft/70 p-4 text-left transition-all hover:border-accent/30 active:scale-[0.99]"
            >
              <p className="text-[10px] font-medium uppercase tracking-widest text-ink-softer">
                Your collections
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {collections.slice(0, 4).map((col) => (
                  <span
                    key={col.id}
                    className="rounded-full border border-ink/[0.08] bg-bg-softer/60 px-3 py-1 text-[12px] text-ink-soft"
                  >
                    {col.name}
                  </span>
                ))}
                {collections.length > 4 && (
                  <span className="rounded-full border border-ink/[0.08] bg-bg-softer/60 px-3 py-1 text-[12px] text-ink-softer">
                    +{collections.length - 4} more
                  </span>
                )}
              </div>
            </button>
          )}

          <p className="pb-2 text-xs leading-relaxed text-ink-softer">
            Forgetting is normal. The cards that feel hardest are the ones the scheduler is
            working on for you.
          </p>
        </section>
      </div>
    </div>
  )
}
