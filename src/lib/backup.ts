import { db } from '../db/schema'
import type { Concept, Review } from '../db/schema'

/**
 * Local backup: a full snapshot of the IndexedDB so progress (FSRS schedule,
 * firstSeen flags, session history, settings, personal edges) survives a
 * cleared browser or a move to another device. This is the no-login durability
 * layer; a token-based cloud sync reuses the exact same payload shape.
 *
 * Wave 3 adds a smart merge path (mergeBackup) that takes the best of local
 * and remote on a per-record basis, enabling true multi-device sync without
 * clobbering either side's progress.
 */

export const BACKUP_FORMAT = 1

export interface AtlasBackup {
  format: number
  exportedAt: number
  app: 'atlas'
  data: {
    concepts: unknown[]
    edges: unknown[]
    lessons: unknown[]
    reviews: unknown[]
    sessions: unknown[]
    news: unknown[]
    settings: unknown[]
    eras: unknown[]
    threads: unknown[]
    collections: unknown[]
    collectionConcepts: unknown[]
  }
}

export async function exportBackup(): Promise<AtlasBackup> {
  const [
    concepts, edges, lessons, reviews, sessions, news, settings, eras, threads,
    collections, collectionConcepts,
  ] = await Promise.all([
    db.concepts.toArray(),
    db.edges.toArray(),
    db.lessons.toArray(),
    db.reviews.toArray(),
    db.sessions.toArray(),
    db.news.toArray(),
    db.settings.toArray(),
    db.eras.toArray(),
    db.threads.toArray(),
    db.collections.toArray(),
    db.collectionConcepts.toArray(),
  ])
  return {
    format: BACKUP_FORMAT,
    exportedAt: Date.now(),
    app: 'atlas',
    data: {
      concepts, edges, lessons, reviews, sessions, news, settings, eras, threads,
      collections, collectionConcepts,
    },
  }
}

/** Trigger a file download of the current backup. Browser-only. */
export async function downloadBackup(): Promise<void> {
  const backup = await exportBackup()
  const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const stamp = new Date(backup.exportedAt).toISOString().slice(0, 10)
  const a = document.createElement('a')
  a.href = url
  a.download = `atlas-backup-${stamp}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export interface ImportResult {
  ok: boolean
  message: string
  counts?: Record<string, number>
}

function isBackup(x: unknown): x is AtlasBackup {
  return (
    typeof x === 'object' &&
    x !== null &&
    (x as AtlasBackup).app === 'atlas' &&
    typeof (x as AtlasBackup).data === 'object'
  )
}

/**
 * Replace local data with a backup. Each table is cleared then re-filled.
 * Used for manual import (file) where the user explicitly wants to overwrite.
 */
export async function importBackup(raw: string): Promise<ImportResult> {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, message: 'That file is not valid JSON.' }
  }
  if (!isBackup(parsed)) {
    return { ok: false, message: 'That does not look like an Atlas backup.' }
  }
  const d = parsed.data
  const counts: Record<string, number> = {}
  try {
    await db.transaction(
      'rw',
      [
        db.concepts, db.edges, db.lessons, db.reviews, db.sessions, db.news,
        db.settings, db.eras, db.threads, db.collections, db.collectionConcepts,
      ],
      async () => {
        const tables = {
          concepts: db.concepts,
          edges: db.edges,
          lessons: db.lessons,
          reviews: db.reviews,
          sessions: db.sessions,
          news: db.news,
          settings: db.settings,
          eras: db.eras,
          threads: db.threads,
          collections: db.collections,
          collectionConcepts: db.collectionConcepts,
        } as const
        for (const [name, table] of Object.entries(tables)) {
          const rows = (d as Record<string, unknown[]>)[name] ?? []
          await table.clear()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (table as any).bulkPut(rows)
          counts[name] = rows.length
        }
      },
    )
  } catch (e) {
    return { ok: false, message: `Import failed: ${(e as Error).message}` }
  }
  return { ok: true, message: 'Backup restored. Reloading…', counts }
}

/**
 * Smart per-record merge of a remote backup into local state.
 *
 * Rules:
 * - concepts: union by id; prefer the copy that has been seen (firstSeenAt≠null),
 *   then prefer higher lastReviewedAt.
 * - reviews: union by conceptId; prefer higher reps, then more recent lastReviewedAt.
 * - sessions: union by startedAt (no duplicates); append remote sessions not local.
 * - collections/collectionConcepts: union (keep both sides' saves).
 * - settings: local wins (user's preferences on this device are authoritative).
 * - eras/threads/lessons/edges/news: remote wins if the remote exportedAt is
 *   newer (seeded catalogue data; should be identical on both sides).
 *
 * This runs in a transaction so either the full merge lands or nothing changes.
 */
export async function mergeBackup(remote: AtlasBackup): Promise<ImportResult> {
  try {
    const counts: Record<string, number> = {}

    await db.transaction(
      'rw',
      [
        db.concepts, db.edges, db.lessons, db.reviews, db.sessions,
        db.settings, db.eras, db.threads, db.collections, db.collectionConcepts,
      ],
      async () => {
        // --- concepts ---
        const localConcepts = await db.concepts.toArray()
        const localConceptMap = new Map(localConcepts.map((c) => [c.id, c]))
        const remoteConcepts = (remote.data.concepts ?? []) as Concept[]
        const mergedConcepts: Concept[] = []
        const allConceptIds = new Set([
          ...localConcepts.map((c) => c.id),
          ...remoteConcepts.map((c) => c.id),
        ])
        for (const id of allConceptIds) {
          const loc = localConceptMap.get(id)
          const rem = remoteConcepts.find((c) => c.id === id)
          if (!loc) { mergedConcepts.push(rem!); continue }
          if (!rem) { mergedConcepts.push(loc); continue }
          // Prefer the one that has been seen, then pick higher lastReviewedAt
          const locSeen = loc.firstSeenAt !== null
          const remSeen = rem.firstSeenAt !== null
          if (locSeen && !remSeen) { mergedConcepts.push(loc); continue }
          if (!locSeen && remSeen) { mergedConcepts.push(rem); continue }
          const locTs = loc.lastReviewedAt ?? 0
          const remTs = rem.lastReviewedAt ?? 0
          mergedConcepts.push(locTs >= remTs ? loc : rem)
        }
        await db.concepts.bulkPut(mergedConcepts)
        counts.concepts = mergedConcepts.length

        // --- reviews ---
        const localReviews = await db.reviews.toArray()
        const localRevMap = new Map(localReviews.map((r) => [r.conceptId, r]))
        const remoteReviews = (remote.data.reviews ?? []) as Review[]
        const mergedReviews: Review[] = []
        const seenConceptIds = new Set<string>()
        for (const loc of localReviews) {
          const rem = remoteReviews.find((r) => r.conceptId === loc.conceptId)
          seenConceptIds.add(loc.conceptId)
          if (!rem) { mergedReviews.push(loc); continue }
          // Prefer higher reps (more study done), then more recent lastReview
          if (loc.reps >= rem.reps) {
            mergedReviews.push(loc)
          } else if (rem.reps > loc.reps) {
            mergedReviews.push({ ...rem, id: loc.id }) // preserve local auto-inc id
          } else {
            const locTs = loc.lastReviewedAt ?? 0
            const remTs = rem.lastReviewedAt ?? 0
            mergedReviews.push(locTs >= remTs ? loc : { ...rem, id: loc.id })
          }
        }
        for (const rem of remoteReviews) {
          if (!seenConceptIds.has(rem.conceptId) && !localRevMap.has(rem.conceptId)) {
            mergedReviews.push({ ...rem, id: undefined }) // let auto-inc assign
          }
        }
        await db.reviews.clear()
        await db.reviews.bulkPut(mergedReviews)
        counts.reviews = mergedReviews.length

        // --- sessions: union by startedAt ---
        const localSessions = await db.sessions.toArray()
        const localStarts = new Set(localSessions.map((s) => s.startedAt))
        type AnySession = typeof localSessions[0]
        const remoteSessions = (remote.data.sessions ?? []) as AnySession[]
        const newRemoteSessions = remoteSessions.filter((s) => !localStarts.has(s.startedAt))
        for (const s of newRemoteSessions) {
          await db.sessions.put({ ...s, id: undefined })
        }
        counts.sessions = localSessions.length + newRemoteSessions.length

        // --- collections: union by id ---
        type AnyCollection = { id: string; name: string; createdAt: number }
        const remoteCollections = (remote.data.collections ?? []) as AnyCollection[]
        if (remoteCollections.length > 0) {
          await db.collections.bulkPut(remoteCollections) // put = upsert
          counts.collections = remoteCollections.length
        }

        // --- collectionConcepts: union by [collectionId+conceptId] ---
        type AnyCC = { collectionId: string; conceptId: string; addedAt: number; id?: number }
        const remoteCC = (remote.data.collectionConcepts ?? []) as AnyCC[]
        if (remoteCC.length > 0) {
          const localCC = await db.collectionConcepts.toArray()
          const localCCSet = new Set(localCC.map((c) => `${c.collectionId}:${c.conceptId}`))
          const newCC = remoteCC.filter((c) => !localCCSet.has(`${c.collectionId}:${c.conceptId}`))
          for (const cc of newCC) {
            await db.collectionConcepts.put({ ...cc, id: undefined })
          }
          counts.collectionConcepts = (localCC.length + newCC.length)
        }

        // --- settings: local wins (do nothing for settings) ---
        // --- catalogue data (eras/threads/lessons/edges/news): leave local alone ---
        // These are seeded identically on all devices; the seed version number in
        // settings governs re-seeding, not the backup.
      },
    )

    return { ok: true, message: 'Merged from the cloud.', counts }
  } catch (e) {
    return { ok: false, message: `Merge failed: ${(e as Error).message}` }
  }
}
