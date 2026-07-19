import type { Concept, Review } from '../db/schema'
import { TIER_REPS_GATE, buildComplexityMap, type ThreadLike } from './gating'

/**
 * Behavioural placement (§E8) — pure functions only, no DB access.
 *
 * Self-reported level is a weak signal: someone taps "Just starting out" out of
 * habit or humility and then breezes through the foundations, yet the pure reps
 * gate keeps them on tier-1-only cards for many days. E8 corrects that by
 * reading the FSRS state the app already records for the tier-1 anchors a 'new'
 * user has met, and crediting *earned* anchor-equivalents for strong early
 * performance — so demonstrated competence raises the ceiling sooner.
 *
 * Scope + safety:
 *  - Acceleration only, and only on the already-gated 'new' path. 'some' and
 *    'confident' are ungated (ceiling Infinity); nothing here is consulted for
 *    them, so their feed rng path stays bit-identical (see gating.ts).
 *  - No new state: the bonus is recomputed from live Review rows each call, so
 *    it is self-healing — if a "known" anchor later lapses it stops counting.
 *  - Bounded: a floor sample is required before any bonus, and the bonus is
 *    capped well below the tier thresholds, so behaviour can *accelerate*
 *    exposure but never fully replace it. The reps gate still guards tier 3.
 *
 * The over-claim direction (a 'some'/'confident' user who is drowning) is
 * deliberately NOT handled here: demoting them would start gating a
 * self-declared level and draw the bias coin, breaking the 'some' bit-identity
 * guarantee. That correction needs its own UX and is tracked in TODOS.md.
 */

/** FSRS difficulty (1..10, lower = easier for this user) at/below which an anchor reads as "known". */
export const STRONG_DIFFICULTY_MAX = 5

/** Strong anchors required before any behavioural bonus applies — guards tiny samples. */
export const MIN_STRONG_ANCHORS = 3

/** Cap on earned anchor-equivalents, so behaviour accelerates but never replaces exposure. */
export const MAX_ANCHOR_BONUS = 5

/**
 * A met tier-1 anchor reads as "strong" when the user has repped it enough and
 * isn't struggling: no lapses and an FSRS difficulty at/below neutral (i.e. it
 * was graded good/easy, not hard/again).
 */
export function isStrongAnchor(r: Review): boolean {
  return r.reps >= TIER_REPS_GATE && r.lapses === 0 && r.difficulty <= STRONG_DIFFICULTY_MAX
}

/**
 * Count distinct tier-1 anchors the user has met AND handled strongly. Mirrors
 * computeAnchorsMet's inputs (min tier across memberships; met = firstSeenAt
 * set) but keeps only the strong ones.
 */
export function countStrongAnchors(
  threads: ThreadLike[],
  conceptById: Map<string, Concept>,
  reviewByConcept: Map<string, Review>,
): number {
  const complexity = buildComplexityMap(threads)
  let strong = 0
  for (const [conceptId, tier] of complexity) {
    if (tier !== 1) continue
    const c = conceptById.get(conceptId)
    if (!c || c.firstSeenAt == null) continue
    const r = reviewByConcept.get(conceptId)
    if (r && isStrongAnchor(r)) strong++
  }
  return strong
}

/**
 * Anchor-equivalents to ADD to computeAnchorsMet before deriving the 'new'
 * ceiling. Zero until MIN_STRONG_ANCHORS strong anchors exist, then one per
 * strong anchor beyond the floor, capped at MAX_ANCHOR_BONUS. Callers on the
 * ungated ('some'/'confident') path must not call this.
 */
export function behaviouralAnchorBonus(
  threads: ThreadLike[],
  conceptById: Map<string, Concept>,
  reviewByConcept: Map<string, Review>,
): number {
  const strong = countStrongAnchors(threads, conceptById, reviewByConcept)
  if (strong < MIN_STRONG_ANCHORS) return 0
  return Math.min(MAX_ANCHOR_BONUS, strong - MIN_STRONG_ANCHORS + 1)
}
