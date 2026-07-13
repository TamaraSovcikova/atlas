import type { KnowledgeLevel } from './settings'

/**
 * Per-level AI-concept variants (§E5) — pure string logic, no DB.
 *
 * A generated card is phrased at the reader's knowledge level, so a topic can
 * exist at up to three depths. In the COMMUNITY bank each depth is a distinct
 * row keyed by a variant id: `some` (and all legacy cards) keep the plain base
 * id `ai:<slug>`; `new`/`confident` append `#new` / `#confident`. First-writer-
 * wins is therefore per level, not per topic.
 *
 * LOCALLY we keep exactly one concept per topic under its BASE id, so edges,
 * reviews, and deepen never fragment. `variantScore` / `isBetterVariant` decide
 * whether an incoming community variant should upgrade the local card's text for
 * a given reader. The ordering is convergent: whatever order variants arrive in,
 * the local card ends up holding the best-available variant for the reader.
 */

export const VARIANT_SEP = '#'

/** The community row id for a base concept at a given level. `some` = the base id. */
export function variantId(baseId: string, level: KnowledgeLevel): string {
  return level === 'some' ? baseId : `${baseId}${VARIANT_SEP}${level}`
}

/** Strip any `#level` suffix to get the topic's canonical base id. */
export function baseId(id: string): string {
  const i = id.indexOf(VARIANT_SEP)
  return i === -1 ? id : id.slice(0, i)
}

/** Which level a community variant id encodes. Unknown/absent suffix ⇒ `some`. */
export function variantLevel(id: string): KnowledgeLevel {
  const i = id.indexOf(VARIANT_SEP)
  if (i === -1) return 'some'
  const s = id.slice(i + 1)
  return s === 'new' || s === 'confident' ? s : 'some'
}

/**
 * How well a variant fits a reader: exact-level = 2, canonical `some` = 1 (a safe
 * default at any level), any other level = 0 (usable only as a last resort). Higher
 * is better; a reader always ends up on the highest-scoring variant they've seen.
 */
export function variantScore(variant: KnowledgeLevel, reader: KnowledgeLevel): number {
  if (variant === reader) return 2
  if (variant === 'some') return 1
  return 0
}

/** Should an incoming variant replace the local card's current variant for this reader? */
export function isBetterVariant(
  incoming: KnowledgeLevel,
  current: KnowledgeLevel,
  reader: KnowledgeLevel,
): boolean {
  return variantScore(incoming, reader) > variantScore(current, reader)
}
