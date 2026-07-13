import React, { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Review, type Era, type Session } from '../db/schema'
import { dayStats, dayIndex, metDays, progressSnapshot } from '../lib/progress'
import { shareCard } from '../lib/share'
import { masteryOf, masterySpread, MASTERY_META, MASTERY_ORDER } from '../lib/mastery'
import { useSettings } from '../store/useSettings'
import { summariseEras, type EraSummary } from '../lib/session'

const WEEKS = 14

export function StatsView() {
  const [sharing, setSharing] = useState(false)
  const prefs = useSettings((s) => s.prefs)
  const sessions = useLiveQuery(() => db.sessions.toArray(), [], [] as Session[])
  const concepts = useLiveQuery(() => db.concepts.toArray(), [], [])
  const reviews = useLiveQuery(() => db.reviews.toArray(), [], [] as Review[])
  const eras = useLiveQuery(() => db.eras.orderBy('displayOrder').toArray(), [], [] as Era[])
  const eraSummaries = useLiveQuery(() => summariseEras(), [concepts, reviews], new Map<string, EraSummary>())

  const snapshot = useMemo(
    () => progressSnapshot(sessions, prefs.dailyGoalCards, prefs.streakFreezes),
    [sessions, prefs.dailyGoalCards, prefs.streakFreezes],
  )

  const stats = useMemo(() => dayStats(sessions), [sessions])
  const met = useMemo(() => metDays(stats, prefs.dailyGoalCards), [stats, prefs.dailyGoalCards])

  // Due forecast: scheduled reviews for already-met concepts over the next 14 days.
  const FORECAST_DAYS = 14
  const forecast = useMemo(() => {
    const today = dayIndex(Date.now())
    const metIds = new Set(concepts.filter((c) => c.firstSeenAt !== null).map((c) => c.id))
    const buckets = new Array(FORECAST_DAYS).fill(0)
    let overdue = 0
    for (const r of reviews) {
      if (!metIds.has(r.conceptId)) continue
      const d = dayIndex(r.dueAt)
      if (d <= today) overdue++
      else if (d - today < FORECAST_DAYS) buckets[d - today]++
    }
    const peak = Math.max(1, overdue, ...buckets)
    return { overdue, buckets, peak }
  }, [reviews, concepts])

  const spread = useMemo(() => {
    const byConcept = new Map(reviews.map((r) => [r.conceptId, r]))
    const levels = concepts.map((c) => masteryOf(byConcept.get(c.id), c.firstSeenAt !== null))
    return masterySpread(levels)
  }, [concepts, reviews])

  const totalMinutes = useMemo(
    () => Math.round(sessions.reduce((acc, s) => acc + (s.durationMs ?? 0), 0) / 60000),
    [sessions],
  )

  const recentAccuracy = useMemo(() => {
    const withAcc = sessions.filter((s) => s.accuracy != null).slice(-20)
    return withAcc.map((s) => s.accuracy as number)
  }, [sessions])

  const avgAccuracy =
    recentAccuracy.length > 0
      ? Math.round((recentAccuracy.reduce((a, b) => a + b, 0) / recentAccuracy.length) * 100)
      : null

  // Heatmap grid: WEEKS columns x 7 rows, most recent week on the right.
  const today = dayIndex(Date.now())
  const grid: { day: number; cards: number; met: boolean }[][] = []
  for (let col = 0; col < WEEKS; col++) {
    const week: { day: number; cards: number; met: boolean }[] = []
    for (let row = 0; row < 7; row++) {
      const day = today - ((WEEKS - 1 - col) * 7 + (6 - row))
      week.push({ day, cards: stats.get(day)?.cards ?? 0, met: met.has(day) })
    }
    grid.push(week)
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-ink">Your progress</h2>
        <button
          type="button"
          disabled={sharing}
          onClick={async () => {
            setSharing(true)
            try { await shareCard() } finally { setSharing(false) }
          }}
          className="flex items-center gap-1.5 rounded-full border border-ink/[0.08] bg-bg-soft px-3 py-1.5 text-[11px] text-ink-softer transition-opacity hover:text-ink disabled:opacity-50"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          {sharing ? 'Generating…' : 'Share'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <BigStat icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2v6M12 22v-6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M22 12h-6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/></svg>} value={snapshot.streak} label="day streak" />
        <BigStat icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>} value={snapshot.bestStreak} label="best streak" />
        <BigStat icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>} value={snapshot.totalCards} label="cards seen" />
        <BigStat icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} value={totalMinutes} label="minutes" />
      </div>

      {/* Streak heatmap */}
      <div className="surface p-5">
        <div className="flex items-baseline justify-between">
          <h3 className="font-serif text-lg text-ink">Last {WEEKS} weeks</h3>
          <span className="text-[11px] text-ink-softer">
            goal {prefs.dailyGoalCards} cards/day
          </span>
        </div>
        <div className="mt-4 flex gap-1 overflow-x-auto">
          {grid.map((week, ci) => (
            <div key={ci} className="flex flex-col gap-1">
              {week.map((cell) => {
                const future = cell.day > today
                // Graduated fill: empty is a clear light cell; activity scales the
                // accent toward full at the daily goal, so a glance reads the streak.
                const goal = Math.max(1, prefs.dailyGoalCards)
                const frac = cell.cards <= 0 ? 0 : Math.min(1, cell.cards / goal)
                const bg = future
                  ? 'transparent'
                  : cell.cards <= 0
                    ? 'rgb(var(--ink) / 0.08)'
                    : cell.met
                      ? 'rgb(var(--accent) / 0.95)'
                      : `rgb(var(--accent) / ${(0.4 + frac * 0.45).toFixed(2)})`
                return (
                  <div
                    key={cell.day}
                    title={future ? '' : `${cell.cards} cards`}
                    className="h-3.5 w-3.5 rounded-[3px]"
                    style={{ backgroundColor: bg }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Due forecast */}
      <div className="surface p-5">
        <div className="flex items-baseline justify-between">
          <h3 className="font-serif text-lg text-ink">Coming due</h3>
          {forecast.overdue > 0 && (
            <span className="text-sm text-accent">{forecast.overdue} due now</span>
          )}
        </div>
        {forecast.buckets.every((b) => b === 0) && forecast.overdue === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">
            Nothing scheduled yet. As you learn, reviews will start landing here.
          </p>
        ) : (
          <>
            <div className="mt-4 flex h-24 items-end gap-1">
              {forecast.buckets.map((count, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t bg-accent/70"
                      style={{ height: `${count === 0 ? 0 : Math.max(6, (count / forecast.peak) * 100)}%` }}
                      title={`${count} due`}
                    />
                  </div>
                  <span className="text-[9px] tabular-nums text-ink-softer">
                    {i === 0 ? 'today' : i % 2 === 0 ? `+${i}` : ''}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-ink-softer">
              Reviews scheduled over the next {FORECAST_DAYS} days. Keeping up with the daily session keeps this even.
            </p>
          </>
        )}
      </div>

      {/* Retention */}
      <div className="surface p-5">
        <div className="flex items-baseline justify-between">
          <h3 className="font-serif text-lg text-ink">Recall accuracy</h3>
          {avgAccuracy != null && (
            <span className="text-sm text-accent">{avgAccuracy}% recent average</span>
          )}
        </div>
        {recentAccuracy.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">Finish a session to start tracking accuracy.</p>
        ) : (
          <div className="mt-4 flex h-20 items-end gap-1">
            {recentAccuracy.map((a, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-accent/70"
                style={{ height: `${Math.max(4, a * 100)}%` }}
                title={`${Math.round(a * 100)}%`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mastery breakdown */}
      <div className="surface p-5">
        <h3 className="font-serif text-lg text-ink">Mastery</h3>
        <p className="mt-1 text-[11px] text-ink-softer">
          {Math.round(spread.fraction * 100)}% across {spread.total} concepts
        </p>
        <ul className="mt-4 space-y-2">
          {[...MASTERY_ORDER].reverse().map((level) => {
            const count = spread.counts[level]
            const pct = spread.total === 0 ? 0 : (count / spread.total) * 100
            return (
              <li key={level} className="flex items-center gap-3">
                <span className="w-20 text-xs text-ink-soft">{MASTERY_META[level].label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-softer">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{
                      width: `${pct}%`,
                      opacity: 0.3 + MASTERY_META[level].brightness * 0.7,
                    }}
                  />
                </div>
                <span className="w-8 text-right text-xs tabular-nums text-ink-softer">{count}</span>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Era mastery */}
      {eras.length > 0 && (() => {
        const eraRows = eras
          .map((era) => ({ era, s: eraSummaries.get(era.id) }))
          .filter((r) => r.s && r.s.total > 0)
        if (eraRows.length === 0) return null
        return (
          <div className="surface p-5">
            <h3 className="font-serif text-lg text-ink">Eras you know</h3>
            <p className="mt-1 text-[11px] text-ink-softer">
              How much of each historical period you have met
            </p>
            <ul className="mt-4 space-y-3">
              {eraRows.map(({ era, s }) => {
                const pct = s!.total === 0 ? 0 : Math.round((s!.met / s!.total) * 100)
                return (
                  <li key={era.id}>
                    <div className="flex items-baseline justify-between gap-2 text-xs">
                      <span className="truncate text-ink-soft">{era.name}</span>
                      <span className="shrink-0 tabular-nums text-ink-softer">
                        {s!.met}/{s!.total}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bg-softer">
                      <div
                        className="h-full rounded-full bg-accent/70 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })()}
    </section>
  )
}

function BigStat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-ink/[0.08] bg-bg-soft/70 px-2 py-4">
      <span className="text-ink-soft">{icon}</span>
      <span className="text-2xl font-semibold tabular-nums text-ink">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-ink-softer">{label}</span>
    </div>
  )
}
