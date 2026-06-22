import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Review } from '../db/schema'
import { dayStats, dayIndex, metDays, progressSnapshot } from '../lib/progress'
import { masteryOf, masterySpread, MASTERY_META, MASTERY_ORDER } from '../lib/mastery'
import { useSettings } from '../store/useSettings'

const WEEKS = 14

export function StatsView() {
  const prefs = useSettings((s) => s.prefs)
  const sessions = useLiveQuery(() => db.sessions.toArray(), [], [])
  const concepts = useLiveQuery(() => db.concepts.toArray(), [], [])
  const reviews = useLiveQuery(() => db.reviews.toArray(), [], [] as Review[])

  const snapshot = useMemo(
    () => progressSnapshot(sessions, prefs.dailyGoalCards, prefs.streakFreezes),
    [sessions, prefs.dailyGoalCards, prefs.streakFreezes],
  )

  const stats = useMemo(() => dayStats(sessions), [sessions])
  const met = useMemo(() => metDays(stats, prefs.dailyGoalCards), [stats, prefs.dailyGoalCards])

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
      <div>
        <h2 className="font-serif text-2xl text-ink">Your progress</h2>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <BigStat glyph="🔥" value={snapshot.streak} label="day streak" />
        <BigStat glyph="🏅" value={snapshot.bestStreak} label="best streak" />
        <BigStat glyph="🗂️" value={snapshot.totalCards} label="cards seen" />
        <BigStat glyph="⏱️" value={totalMinutes} label="minutes" />
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
                const intensity = cell.met ? 1 : cell.cards > 0 ? 0.45 : 0
                return (
                  <div
                    key={cell.day}
                    title={future ? '' : `${cell.cards} cards`}
                    className="h-3.5 w-3.5 rounded-[3px]"
                    style={{
                      backgroundColor: future
                        ? 'transparent'
                        : intensity === 0
                          ? 'rgba(255,255,255,0.05)'
                          : `rgba(251,191,36,${0.25 + intensity * 0.6})`,
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
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
    </section>
  )
}

function BigStat({ glyph, value, label }: { glyph: string; value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/[0.06] bg-bg-soft/50 px-2 py-4">
      <span className="text-xl leading-none">{glyph}</span>
      <span className="text-2xl font-semibold tabular-nums text-ink">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-ink-softer">{label}</span>
    </div>
  )
}
