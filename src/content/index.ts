import type { BankConcept, BankEra } from './types'
import { ERAS } from './eras'
import { ANCIENT } from './bank/ancient'
import { EARLY_MODERN } from './bank/earlyModern'
import { INDUSTRIAL } from './bank/industrial'
import { CONTEMPORARY } from './bank/contemporary'

/**
 * Bump when the bank content changes so the loader re-syncs it into Dexie.
 * Progress (firstSeenAt, lastReviewedAt, review schedule) is preserved across bumps.
 */
export const BANK_VERSION = 'v4'

export const BANK_CONCEPTS: BankConcept[] = [
  ...ANCIENT,
  ...EARLY_MODERN,
  ...INDUSTRIAL,
  ...CONTEMPORARY,
]

export const BANK_ERAS: BankEra[] = ERAS

export interface BankIssue {
  conceptId: string
  problem: string
}

/**
 * Integrity check run by a test (and optionally at load). Catches authoring
 * mistakes that would otherwise teach nothing or crash: duplicate ids, edges
 * pointing nowhere, unknown era tags, malformed contrast questions.
 */
export function validateBank(): BankIssue[] {
  const issues: BankIssue[] = []
  const ids = new Set<string>()
  const eraIds = new Set(BANK_ERAS.map((e) => e.id))

  for (const c of BANK_CONCEPTS) {
    if (ids.has(c.id)) issues.push({ conceptId: c.id, problem: 'duplicate id' })
    ids.add(c.id)
    if (c.eras.length === 0) issues.push({ conceptId: c.id, problem: 'no era tags' })
    for (const era of c.eras) {
      if (!eraIds.has(era)) issues.push({ conceptId: c.id, problem: `unknown era "${era}"` })
    }
    if (c.questions.length === 0) issues.push({ conceptId: c.id, problem: 'no questions' })
    for (const q of c.questions) {
      if (q.format === 'cloze' && !q.prompt.includes('____')) {
        issues.push({ conceptId: c.id, problem: 'cloze without a ____ blank' })
      }
      if (q.format === 'contrast' && (!q.distractors || q.distractors.length < 2)) {
        issues.push({ conceptId: c.id, problem: 'contrast needs 2+ distractors' })
      }
    }
    if (!c.wikipedia.startsWith('https://en.wikipedia.org/')) {
      issues.push({ conceptId: c.id, problem: 'missing or non-Wikipedia source' })
    }
  }

  // Second pass: edges must point to ids that exist.
  for (const c of BANK_CONCEPTS) {
    for (const e of c.edges) {
      if (!ids.has(e.to)) {
        issues.push({ conceptId: c.id, problem: `edge to unknown concept "${e.to}"` })
      }
    }
  }

  return issues
}
