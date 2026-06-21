import type { Review } from '../db/schema'

/**
 * Mastery is DERIVED from FSRS stability (days until ~90% recall), not stored.
 * A concept the user has never opened is `new`; once seen it climbs the bands
 * as its stability grows through successful reviews. This turns the binary
 * met/unmet flag into the gradient the scheduler already tracks, so the
 * Constellation can brighten by degrees and domains can show a real % mastered.
 */
export type MasteryLevel = 'new' | 'seen' | 'learning' | 'familiar' | 'known' | 'mastered'

export const MASTERY_ORDER: MasteryLevel[] = [
  'new',
  'seen',
  'learning',
  'familiar',
  'known',
  'mastered',
]

/** Stability (days) at or above which each band begins. */
const BANDS: { level: MasteryLevel; minStability: number }[] = [
  { level: 'mastered', minStability: 60 },
  { level: 'known', minStability: 21 },
  { level: 'familiar', minStability: 7 },
  { level: 'learning', minStability: 1 },
  { level: 'seen', minStability: 0 },
]

export const MASTERY_META: Record<MasteryLevel, { label: string; brightness: number }> = {
  // brightness 0..1 drives how lit a star is in the Constellation.
  new: { label: 'Not started', brightness: 0 },
  seen: { label: 'Seen', brightness: 0.2 },
  learning: { label: 'Learning', brightness: 0.4 },
  familiar: { label: 'Familiar', brightness: 0.6 },
  known: { label: 'Known', brightness: 0.8 },
  mastered: { label: 'Mastered', brightness: 1 },
}

/**
 * Level for one concept. `seen` is whether firstSeenAt is set; a concept with
 * a review row but never actually shown still reads as `new`.
 */
export function masteryOf(review: Review | undefined, seen: boolean): MasteryLevel {
  if (!seen || !review) return 'new'
  const s = review.stability
  for (const band of BANDS) {
    if (s >= band.minStability) return band.level
  }
  return 'seen'
}

/** 0..1 progress toward fully mastered, for rings and aggregate bars. */
export function masteryProgress(level: MasteryLevel): number {
  return MASTERY_META[level].brightness
}

export interface MasterySpread {
  counts: Record<MasteryLevel, number>
  total: number
  /** Mean brightness across all members, 0..1 — a single "how mastered" number. */
  fraction: number
}

/** Roll a set of levels into counts + a single 0..1 mastery fraction. */
export function masterySpread(levels: MasteryLevel[]): MasterySpread {
  const counts: Record<MasteryLevel, number> = {
    new: 0,
    seen: 0,
    learning: 0,
    familiar: 0,
    known: 0,
    mastered: 0,
  }
  for (const l of levels) counts[l]++
  const total = levels.length
  const sum = levels.reduce((acc, l) => acc + masteryProgress(l), 0)
  return { counts, total, fraction: total === 0 ? 0 : sum / total }
}
