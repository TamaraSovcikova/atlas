import { db } from '../db/schema'
import { exportBackup, importBackup, mergeBackup, type ImportResult, type AtlasBackup } from './backup'

/**
 * Cloud sync over the atlas-sync Worker. Two auth modes:
 *
 * 1. Anonymous (default): the bearer token IS the account — whoever holds the
 *    token owns that row. Self-minted, stored in settings, shared via backup.
 * 2. Signed-in (Wave 3): a Google OAuth session token keyed by user_id in D1,
 *    so the same Google account on any device syncs the same data without
 *    copying a token.
 *
 * Merge strategy (Wave 3): on pull, the smart mergeBackup() function is used
 * instead of a wholesale replace, so two devices used in parallel converge
 * without clobbering either side's progress.
 */

export const SYNC_URL = 'https://atlas-sync.tamara-sovcik.workers.dev'

const TOKEN_KEY = 'syncToken'
const SESSION_KEY = 'accountSession' // set by auth.ts after Google sign-in
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

/**
 * The bearer token to send on authenticated writes: the Google session if signed
 * in, otherwise an anonymous token (minted if this device has none). Contributions
 * to the shared bank require a token, so this guarantees one exists.
 */
export async function ensureAuthToken(): Promise<string> {
  const session = (await db.settings.get(SESSION_KEY))?.value as string | undefined
  if (session) return session
  return ensureSyncToken()
}

export async function getLastSyncedAt(): Promise<number | null> {
  const row = await db.settings.get(LAST_KEY)
  return (row?.value as number | undefined) ?? null
}

async function markSynced(now = Date.now()): Promise<void> {
  await db.settings.put({ key: LAST_KEY, value: now })
}

/**
 * Returns the best available auth header value.
 * - If a Google session is stored, use it (keyed by user_id on server).
 * - Otherwise fall back to the anonymous bearer token.
 */
async function getBestToken(): Promise<string | null> {
  const sessionRow = await db.settings.get(SESSION_KEY)
  const session = sessionRow?.value as string | undefined
  if (session) return session
  return getSyncToken()
}

export interface SyncResult {
  ok: boolean
  message: string
}

/** Push the full local backup to the cloud. */
export async function pushToCloud(): Promise<SyncResult> {
  // Anonymous path: ensure a token exists. Signed-in path: session already present.
  const session = (await db.settings.get(SESSION_KEY))?.value as string | undefined
  if (!session) await ensureSyncToken()

  const token = await getBestToken()
  if (!token) return { ok: false, message: 'No sync token or session on this device.' }

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

/**
 * Pull the cloud backup and merge it into local state (Wave 3: smart merge,
 * not wholesale replace). The merge takes the best of each record so neither
 * device loses progress.
 */
export async function pullFromCloud(): Promise<SyncResult & { imported?: ImportResult }> {
  const token = await getBestToken()
  if (!token) return { ok: false, message: 'No sync token or session on this device yet.' }
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
    const remote = body.payload as AtlasBackup
    const imported = await mergeBackup(remote)
    if (!imported.ok) return { ok: false, message: imported.message, imported }
    await markSynced()
    return { ok: true, message: 'Merged from the cloud.', imported }
  } catch (e) {
    return { ok: false, message: `Pull failed: ${(e as Error).message}` }
  }
}

/**
 * Full replace import (used by the file-import path in SettingsView).
 * When the user explicitly imports a file they want an exact restore, not a
 * merge. pullFromCloud uses mergeBackup; this uses importBackup.
 */
export async function replaceFromCloud(): Promise<SyncResult & { imported?: ImportResult }> {
  const token = await getBestToken()
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
