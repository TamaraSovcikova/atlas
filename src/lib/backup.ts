import { db } from '../db/schema'

/**
 * Local backup: a full snapshot of the IndexedDB so progress (FSRS schedule,
 * firstSeen flags, session history, settings, personal edges) survives a
 * cleared browser or a move to another device. This is the no-login durability
 * layer; a token-based cloud sync can later reuse the exact same payload shape.
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
  }
}

export async function exportBackup(): Promise<AtlasBackup> {
  const [concepts, edges, lessons, reviews, sessions, news, settings, eras, threads] =
    await Promise.all([
      db.concepts.toArray(),
      db.edges.toArray(),
      db.lessons.toArray(),
      db.reviews.toArray(),
      db.sessions.toArray(),
      db.news.toArray(),
      db.settings.toArray(),
      db.eras.toArray(),
      db.threads.toArray(),
    ])
  return {
    format: BACKUP_FORMAT,
    exportedAt: Date.now(),
    app: 'atlas',
    data: { concepts, edges, lessons, reviews, sessions, news, settings, eras, threads },
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
 * Replace local data with a backup. Each table is cleared then re-filled, so
 * the result is exactly the snapshot — no merge surprises. Auto-increment keys
 * are preserved because they're included in the exported rows.
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
      [db.concepts, db.edges, db.lessons, db.reviews, db.sessions, db.news, db.settings, db.eras, db.threads],
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
