import type { Concept, Review, ThreadMember } from '../db/schema'
import type { KnowledgeLevel } from './settings'

/**
 * Knowledge-level gating (§4b) — pure functions only, no DB access.
 *
 * The gate is a SOFT bias, never a hard filter: for 'new'-level users,
 * within-ceiling concepts are strongly preferred when introducing new
 * material, but deeper cards stay possible (and the pool spills to
 * everything when no within-ceiling candidate remains). 'some' must be
 * bit-identical to the pre-gate app — callers guarantee that by not
 * consulting these functions (and, in the feed, by never drawing the
 * bias coin) unless the ceiling is finite.
 *
 * Complexity is derived from thread tiers: a concept's complexity is the
 * LOWEST tier across its thread memberships. Tier encodes thread position,
 * not reader difficulty, so it is usable as a preference signal only —
 * see docs/ARCHITECTURE.md ("tier-as-complexity proxy").
 */

/** Minimum FSRS reps a tier must reach before the next tier unlocks (soft pacing). */
export const TIER_REPS_GATE = 2

/** Probability that a gated discovery pick draws from the within-ceiling pool. */
export const WITHIN_BIAS = 0.8

/** Distinct tier-1 anchors (met + reps ≥ TIER_REPS_GATE) that raise the ceiling. */
export const ANCHORS_FOR_CEILING_2 = 10
export const ANCHORS_FOR_CEILING_3 = 20

/** Complexity for concepts that belong to no thread (`ai:` cards, chrono-only). */
export const UNTIERED_COMPLEXITY = 2

export interface ThreadLike {
  members: ThreadMember[]
}

/** conceptId → min tier across all thread memberships. Absent id ⇒ untiered. */
export function buildComplexityMap(threads: ThreadLike[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const t of threads) {
    for (const m of t.members) {
      const cur = map.get(m.conceptId)
      if (cur === undefined || m.tier < cur) map.set(m.conceptId, m.tier)
    }
  }
  return map
}

export function conceptComplexity(conceptId: string, complexityById: Map<string, number>): number {
  return complexityById.get(conceptId) ?? UNTIERED_COMPLEXITY
}

/**
 * Count distinct tier-1 anchors the user has met and repped. An anchor is a
 * concept whose min tier across memberships is 1 (dedup by conceptId, so a
 * concept that is tier 1 in one thread and tier 3 in another counts once).
 */
export function computeAnchorsMet(
  threads: ThreadLike[],
  conceptById: Map<string, Concept>,
  reviewByConcept: Map<string, Review>,
): number {
  const complexity = buildComplexityMap(threads)
  let met = 0
  for (const [conceptId, tier] of complexity) {
    if (tier !== 1) continue
    const c = conceptById.get(conceptId)
    if (!c || c.firstSeenAt == null) continue
    const r = reviewByConcept.get(conceptId)
    if (r != null && r.reps >= TIER_REPS_GATE) met++
  }
  return met
}

/**
 * The complexity ceiling for new-concept introduction. Infinity means "no
 * gate" — the caller must then leave the ungated codepath untouched
 * (including its rng call sequence). Monotonic in anchorsMet; a level switch
 * simply re-derives from scratch (stateless).
 */
export function complexityCeiling(level: KnowledgeLevel, anchorsMet: number): number {
  if (level !== 'new') return Infinity
  const anchors = Math.max(0, anchorsMet)
  if (anchors >= ANCHORS_FOR_CEILING_3) return Infinity
  if (anchors >= ANCHORS_FOR_CEILING_2) return 2
  return 1
}

/**
 * Stable partition: within-ceiling candidates first (original order), then
 * the rest. Identity when the ceiling is not finite — callers on the
 * ungated path may (and should) skip calling this entirely.
 */
export function orderByCeiling<T extends { id: string }>(
  candidates: T[],
  complexityById: Map<string, number>,
  ceiling: number,
): T[] {
  if (!Number.isFinite(ceiling)) return candidates
  const within: T[] = []
  const beyond: T[] = []
  for (const c of candidates) {
    if (conceptComplexity(c.id, complexityById) <= ceiling) within.push(c)
    else beyond.push(c)
  }
  return [...within, ...beyond]
}
