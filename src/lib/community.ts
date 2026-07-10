import { db, type Concept } from '../db/schema'
import { SYNC_URL } from './sync'

/**
 * Community concept bank. AI-generated cards are shared through the Worker so a
 * topic one person generates becomes available to everyone, not just saved to
 * that person's local vault. Online-only and best-effort: every call degrades to
 * a no-op offline, and the local-first core keeps working regardless.
 */

const LAST_PULL_KEY = 'community:lastPull'

/** The raw generated-concept shape returned by `generateConcept` (pre-local-augment). */
export interface RawConcept {
  id: string
  name: string
  domain: string
  summary: string
  approxYear: number | null
  eras: string[]
  threads: string[]
  lat: number | null
  lng: number | null
  wikipediaUrl: string | null
  imageUrl: string | null
}

/** Publish a freshly generated concept to the shared bank (fire-and-forget). */
export async function contributeConcept(concept: RawConcept): Promise<void> {
  try {
    await fetch(`${SYNC_URL}/concepts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concept }),
    })
  } catch {
    // online-only; the concept is already saved locally, so a failed contribution
    // just means it isn't shared this time.
  }
}

/**
 * Pull community concepts contributed since the last pull and insert any the
 * local vault doesn't already have. Returns how many were added. Cheap and safe
 * to call on every app start; a server-provided cursor makes it incremental.
 */
export async function pullCommunityConcepts(now = Date.now()): Promise<number> {
  try {
    const row = await db.settings.get(LAST_PULL_KEY)
    const since = (row?.value as number | undefined) ?? 0
    const res = await fetch(`${SYNC_URL}/concepts?since=${since}`)
    if (!res.ok) return 0
    const body = (await res.json()) as { concepts?: RawConcept[]; cursor?: number }
    let added = 0
    for (const c of body.concepts ?? []) {
      if (!c?.id || !c.id.startsWith('ai:')) continue
      if (await db.concepts.get(c.id)) continue
      const concept: Concept = {
        id: c.id,
        name: c.name,
        domain: c.domain as Concept['domain'],
        lessonId: null,
        summary: c.summary,
        wikipediaUrl: c.wikipediaUrl ?? null,
        imageUrl: c.imageUrl ?? null,
        approxYear: c.approxYear ?? null,
        eras: c.eras ?? [],
        threads: c.threads ?? [],
        lat: c.lat ?? null,
        lng: c.lng ?? null,
        firstSeenAt: null,
        lastReviewedAt: null,
        createdAt: now,
      }
      await db.concepts.put(concept)
      added++
    }
    if (typeof body.cursor === 'number') {
      await db.settings.put({ key: LAST_PULL_KEY, value: body.cursor })
    }
    return added
  } catch {
    return 0
  }
}
