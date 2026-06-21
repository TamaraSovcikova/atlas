import type { Session } from '../db/schema'

/**
 * Streak, daily-goal and history math. Everything here is derived from the
 * `sessions` table the app already writes on completion — no extra state.
 * Streaks are the single strongest retention lever (Duolingo data), so this is
 * load-bearing; freezes keep it humane for a knowledge app where a missed day
 * is normal, not a failure.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Local-day index (days since epoch in the user's timezone). */
export function dayIndex(ts: number): number {
  const d = new Date(ts)
  const local = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
  return Math.floor(local / MS_PER_DAY)
}

export interface DayStat {
  day: number
  cards: number
  sessions: number
  /** Mean accuracy across the day's completed sessions, or null. */
  accuracy: number | null
}

/** Roll sessions into one record per local day. */
export function dayStats(sessions: Session[]): Map<number, DayStat> {
  const map = new Map<number, DayStat>()
  for (const s of sessions) {
    const day = dayIndex(s.startedAt)
    const cards = s.newCount + s.reviewCount
    const existing = map.get(day)
    if (existing) {
      existing.cards += cards
      existing.sessions += 1
      if (s.accuracy != null) {
        existing.accuracy =
          existing.accuracy == null
            ? s.accuracy
            : (existing.accuracy * (existing.sessions - 1) + s.accuracy) / existing.sessions
      }
    } else {
      map.set(day, { day, cards, sessions: 1, accuracy: s.accuracy ?? null })
    }
  }
  return map
}

/** Days (by index) that met the per-day card goal. */
export function metDays(stats: Map<number, DayStat>, goalCards: number): Set<number> {
  const met = new Set<number>()
  for (const [day, stat] of stats) {
    if (stat.cards >= goalCards) met.add(day)
  }
  return met
}

/**
 * Current streak length. Today is "in progress": if today is not yet met we
 * start counting from yesterday rather than breaking. Freezes bridge isolated
 * missed days (each gap day spends one freeze) without counting toward length.
 */
export function computeStreak(met: Set<number>, today: number, freezes = 0): number {
  let streak = 0
  let day = today
  if (!met.has(day)) day -= 1
  let budget = freezes
  while (true) {
    if (met.has(day)) {
      streak++
      day--
    } else if (budget > 0) {
      budget--
      day--
    } else {
      break
    }
  }
  return streak
}

export interface ProgressSnapshot {
  streak: number
  todayCards: number
  goalCards: number
  goalMet: boolean
  /** 0..1 toward today's goal. */
  goalFraction: number
  bestStreak: number
  totalCards: number
}

export function progressSnapshot(
  sessions: Session[],
  goalCards: number,
  freezes = 0,
  now = Date.now(),
): ProgressSnapshot {
  const stats = dayStats(sessions)
  const met = metDays(stats, goalCards)
  const today = dayIndex(now)
  const todayCards = stats.get(today)?.cards ?? 0
  const streak = computeStreak(met, today, freezes)

  // Best streak: longest run of met days anywhere in history (no freezes).
  let best = 0
  const sorted = [...met].sort((a, b) => a - b)
  let run = 0
  let prev: number | null = null
  for (const d of sorted) {
    run = prev !== null && d === prev + 1 ? run + 1 : 1
    if (run > best) best = run
    prev = d
  }

  let totalCards = 0
  for (const stat of stats.values()) totalCards += stat.cards

  return {
    streak,
    todayCards,
    goalCards,
    goalMet: todayCards >= goalCards,
    goalFraction: goalCards === 0 ? 0 : Math.min(1, todayCards / goalCards),
    bestStreak: best,
    totalCards,
  }
}
