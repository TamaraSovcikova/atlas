import { describe, it, expect } from 'vitest'
import {
  dayIndex,
  dayStats,
  metDays,
  computeStreak,
  progressSnapshot,
} from './progress'
import type { Session } from '../db/schema'

function session(startedAt: number, cards: number, accuracy: number | null = null): Session {
  return {
    startedAt,
    durationMs: 60_000,
    newCount: 0,
    reviewCount: cards,
    accuracy,
    shape: 'spaced',
    eraId: null,
    domain: null,
    threadId: null,
  }
}

const DAY = 24 * 60 * 60 * 1000
const noon = (dayOffset: number) => new Date(2026, 5, 21, 12, 0, 0).getTime() + dayOffset * DAY

describe('dayIndex', () => {
  it('groups same-day timestamps together', () => {
    const morning = new Date(2026, 5, 21, 7, 0, 0).getTime()
    const evening = new Date(2026, 5, 21, 23, 30, 0).getTime()
    expect(dayIndex(morning)).toBe(dayIndex(evening))
  })
  it('separates consecutive days', () => {
    expect(dayIndex(noon(1)) - dayIndex(noon(0))).toBe(1)
  })
})

describe('dayStats', () => {
  it('sums cards and counts sessions per day', () => {
    const stats = dayStats([session(noon(0), 5), session(noon(0), 7), session(noon(1), 3)])
    expect(stats.get(dayIndex(noon(0)))!.cards).toBe(12)
    expect(stats.get(dayIndex(noon(0)))!.sessions).toBe(2)
    expect(stats.get(dayIndex(noon(1)))!.cards).toBe(3)
  })
  it('averages accuracy across the day', () => {
    const stats = dayStats([session(noon(0), 5, 1), session(noon(0), 5, 0)])
    expect(stats.get(dayIndex(noon(0)))!.accuracy).toBeCloseTo(0.5)
  })
})

describe('computeStreak', () => {
  it('counts consecutive met days ending today', () => {
    const today = dayIndex(noon(0))
    const met = new Set([today, today - 1, today - 2])
    expect(computeStreak(met, today)).toBe(3)
  })
  it('today not yet met still counts a streak ending yesterday', () => {
    const today = dayIndex(noon(0))
    const met = new Set([today - 1, today - 2])
    expect(computeStreak(met, today)).toBe(2)
  })
  it('breaks on a gap with no freezes', () => {
    const today = dayIndex(noon(0))
    const met = new Set([today, today - 1, today - 3])
    expect(computeStreak(met, today)).toBe(2)
  })
  it('a freeze bridges one missed day', () => {
    const today = dayIndex(noon(0))
    const met = new Set([today, today - 1, today - 3])
    expect(computeStreak(met, today, 1)).toBe(3)
  })
  it('returns 0 when nothing recent', () => {
    const today = dayIndex(noon(0))
    expect(computeStreak(new Set([today - 5]), today)).toBe(0)
  })
})

describe('metDays', () => {
  it('only includes days meeting the goal', () => {
    const stats = dayStats([session(noon(0), 12), session(noon(1), 4)])
    const met = metDays(stats, 10)
    expect(met.has(dayIndex(noon(0)))).toBe(true)
    expect(met.has(dayIndex(noon(1)))).toBe(false)
  })
})

describe('progressSnapshot', () => {
  it('reports today progress and goal state', () => {
    const snap = progressSnapshot([session(noon(0), 6)], 10, 0, noon(0))
    expect(snap.todayCards).toBe(6)
    expect(snap.goalMet).toBe(false)
    expect(snap.goalFraction).toBeCloseTo(0.6)
  })
  it('tracks best streak across history', () => {
    const sessions = [
      session(noon(-10), 10),
      session(noon(-9), 10),
      session(noon(-8), 10),
      session(noon(0), 10),
    ]
    const snap = progressSnapshot(sessions, 10, 0, noon(0))
    expect(snap.bestStreak).toBe(3)
    expect(snap.totalCards).toBe(40)
  })
})
