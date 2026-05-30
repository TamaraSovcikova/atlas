import type { Domain, RelationType } from '../db/schema'

/**
 * The shared content bank. Authored once (by Claude Code on the Max plan,
 * grounded in Wikipedia), committed here, and fetched identically by every
 * user. No per-user generation, no runtime AI, no recurring cost.
 *
 * These are plain typed data modules so `tsc` validates them at build time
 * and the index validator can check cross-references. A later migration can
 * serialise this to JSON in Cloudflare R2 once the bank outgrows the bundle.
 */

export interface BankQuestion {
  format: 'cloze' | 'contrast'
  prompt: string
  answer: string
  /** Required for contrast: 2-3 plausible wrong options. */
  distractors?: string[]
  /** Optional override chips for cloze tap-mode; otherwise synthesised. */
  chipDistractors?: string[]
}

export interface BankConcept {
  id: string
  name: string
  domain: Domain
  /** Single representative year; negative = BCE. null only for timeless concepts. */
  approxYear: number | null
  eras: string[]
  /** For geographic concepts, so they can appear on the map game. */
  lat?: number
  lng?: number
  /** 2-3 sentences, vivid, concrete, accurate. Ends implicitly cited by `wikipedia`. */
  summary: string
  wikipedia: string
  questions: BankQuestion[]
  edges: { to: string; relation: RelationType }[]
}

export interface BankEra {
  id: string
  name: string
  startYear: number
  endYear: number
  description: string
  displayOrder: number
}
