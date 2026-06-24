import type { BankConcept, BankEra, BankThread } from './types'
import { ERAS } from './eras'
import { THREADS } from './threads'
import { ANCIENT } from './bank/ancient'
import { EARLY_MODERN } from './bank/earlyModern'
import { INDUSTRIAL } from './bank/industrial'
import { CONTEMPORARY } from './bank/contemporary'
import { SLOVAK } from './bank/slovak'
import { ANCIENT_EXPANDED } from './bank/ancient-expanded'
import { CLASSICAL_EXPANDED } from './bank/classical-expanded'
import { MEDIEVAL_EXPANDED } from './bank/medieval-expanded'
import { RENAISSANCE_EXPANDED } from './bank/renaissance-expanded'
import { INDUSTRIAL_EXPANDED } from './bank/industrial-expanded'
import { WORLDWARS_EXPANDED } from './bank/worldwars-expanded'
import { COLDWAR_EXPANDED } from './bank/coldwar-expanded'

/**
 * Bump when the bank content changes so the loader re-syncs it into Dexie.
 * Progress (firstSeenAt, lastReviewedAt, review schedule) is preserved across bumps.
 */
export const BANK_VERSION = 'v10'

export const BANK_CONCEPTS: BankConcept[] = [
  ...ANCIENT,
  ...EARLY_MODERN,
  ...INDUSTRIAL,
  ...CONTEMPORARY,
  ...SLOVAK,
  ...ANCIENT_EXPANDED,
  ...CLASSICAL_EXPANDED,
  ...MEDIEVAL_EXPANDED,
  ...RENAISSANCE_EXPANDED,
  ...INDUSTRIAL_EXPANDED,
  ...WORLDWARS_EXPANDED,
  ...COLDWAR_EXPANDED,
]

export const BANK_ERAS: BankEra[] = ERAS

export const BANK_THREADS: BankThread[] = THREADS

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

  // Threads: ids unique, members resolve to real concepts, no dup members.
  const threadIds = new Set<string>()
  for (const t of BANK_THREADS) {
    if (threadIds.has(t.id)) issues.push({ conceptId: t.id, problem: 'duplicate thread id' })
    threadIds.add(t.id)
    if (t.members.length === 0) issues.push({ conceptId: t.id, problem: 'thread has no members' })
    const seenMembers = new Set<string>()
    for (const m of t.members) {
      if (!ids.has(m.concept)) {
        issues.push({ conceptId: t.id, problem: `thread member unknown concept "${m.concept}"` })
      }
      if (seenMembers.has(m.concept)) {
        issues.push({ conceptId: t.id, problem: `duplicate thread member "${m.concept}"` })
      }
      seenMembers.add(m.concept)
    }
  }

  return issues
}
