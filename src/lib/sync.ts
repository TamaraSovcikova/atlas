import { db } from '../db/schema'
import { exportBackup, importBackup, type ImportResult } from './backup'

/**
 * Cloud sync over the atlas-sync Worker (bearer-token-as-account). The token is
 * the only credential: no login, no email. It lives in a settings row so it
 * survives reloads and rides along in local backups, letting a second device
 * adopt the same account by importing a backup or pasting the token.
 *
 * Worker: worker/src/index.ts  (GET/PUT /sync, Bearer auth).
 */

export const SYNC_URL = 'https://atlas-sync.tamara-sovcik.workers.dev'

const TOKEN_KEY = 'syncToken'
const LAST_KEY = 'lastSyncedAt'

export async function getSyncToken(): Promise<string | null> {
  const row = await db.settings.get(TOKEN_KEY)
  return (row?.value as string | undefined) ?? null
}

export async function setSyncToken(token: string): Promise<void> {
  await db.settings.put({ key: TOKEN_KEY, value: token.trim() })
}

/** A token is 32 hex chars (128 bits) — long enough to be unguessable. */
export function generateToken(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export async function ensureSyncToken(): Promise<string> {
  const existing = await getSyncToken()
  if (existing) return existing
  const token = generateToken()
  await setSyncToken(token)
  return token
}

export async function getLastSyncedAt(): Promise<number | null> {
  const row = await db.settings.get(LAST_KEY)
  return (row?.value as number | undefined) ?? null
}

async function markSynced(now = Date.now()): Promise<void> {
  await db.settings.put({ key: LAST_KEY, value: now })
}

export interface SyncResult {
  ok: boolean
  message: string
}

/** Push the full local backup to the cloud under the current token. */
export async function pushToCloud(): Promise<SyncResult> {
  const token = await ensureSyncToken()
  const backup = await exportBackup()
  try {
    const res = await fetch(`${SYNC_URL}/sync`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(backup),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      return { ok: false, message: `Push failed: ${(err as { error?: string }).error ?? res.status}` }
    }
    await markSynced()
    return { ok: true, message: 'Backed up to the cloud.' }
  } catch (e) {
    return { ok: false, message: `Push failed: ${(e as Error).message}` }
  }
}

/** Pull the cloud backup for the current token and replace local data. */
export async function pullFromCloud(): Promise<SyncResult & { imported?: ImportResult }> {
  const token = await getSyncToken()
  if (!token) return { ok: false, message: 'No sync token on this device yet.' }
  try {
    const res = await fetch(`${SYNC_URL}/sync`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.status === 404) return { ok: false, message: 'Nothing in the cloud for this token yet.' }
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      return { ok: false, message: `Pull failed: ${(err as { error?: string }).error ?? res.status}` }
    }
    const body = (await res.json()) as { payload: unknown }
    const imported = await importBackup(JSON.stringify(body.payload))
    if (!imported.ok) return { ok: false, message: imported.message, imported }
    await markSynced()
    return { ok: true, message: 'Pulled from the cloud. Reloading…', imported }
  } catch (e) {
    return { ok: false, message: `Pull failed: ${(e as Error).message}` }
  }
}
