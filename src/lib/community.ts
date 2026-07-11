import { db, type Concept } from '../db/schema'
import { SYNC_URL } from './sync'
import { newReview } from './fsrs'
import { generateDeeperConcepts } from './ai'

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

/**
 * Insert a generated/community concept locally if it isn't already present, plus
 * a FSRS review row so it can be seeded (firstSeenAt) and mastery-tracked like any
 * concept. AI concepts have no lesson, so they're read-only (not quizzed) — but
 * they still need a review row or "Got it"/scroll-past can't mark them seen, and
 * they'd resurface forever as New. Returns true if newly inserted.
 */
export async function insertAiConcept(c: RawConcept, now = Date.now()): Promise<boolean> {
  if (!c?.id || !c.id.startsWith('ai:')) return false
  if (await db.concepts.get(c.id)) return false
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
  const existingReview = await db.reviews.where('conceptId').equals(c.id).first()
  if (!existingReview) await db.reviews.add(newReview(c.id, now))
  return true
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
      if (await insertAiConcept(c, now)) added++
    }
    if (typeof body.cursor === 'number') {
      await db.settings.put({ key: LAST_PULL_KEY, value: body.cursor })
    }
    return added
  } catch {
    return 0
  }
}

/**
 * Deepen-on-demand. Generate 3-5 more-specific concepts under `seedId`, insert
 * any new ones locally (with a review row), wire an edge from the seed to each so
 * they join the knowledge graph + feed deep-queue, and share them to the community
 * bank. Returns the ids of the deeper concepts (existing or new). Online-only and
 * best-effort — a no-op when AI is unavailable. Caller decides WHEN to deepen
 * (e.g. only when the seed has little unseen linked content).
 */
export async function deepenConcept(seedId: string, now = Date.now()): Promise<string[]> {
  try {
    const seed = await db.concepts.get(seedId)
    if (!seed) return []

    // Names already linked to the seed, so the model doesn't just repeat them.
    const outEdges = await db.edges.where('fromId').equals(seedId).toArray()
    const inEdges = await db.edges.where('toId').equals(seedId).toArray()
    const neighbourIds = new Set<string>([...outEdges.map((e) => e.toId), ...inEdges.map((e) => e.fromId)])
    const known = [seed.name]
    for (const id of neighbourIds) {
      const c = await db.concepts.get(id)
      if (c) known.push(c.name)
    }

    const res = await generateDeeperConcepts(seed.name, seed.summary, known)
    if (!res.ok) return []

    const newIds: string[] = []
    for (const dc of res.concepts) {
      if (dc.id === seedId) continue
      const inserted = await insertAiConcept(
        {
          id: dc.id,
          name: dc.name,
          domain: dc.domain,
          summary: dc.summary,
          approxYear: dc.approxYear,
          eras: [],
          threads: [],
          lat: null,
          lng: null,
          wikipediaUrl: dc.wikipediaUrl,
          imageUrl: null,
        },
        now,
      )
      if (inserted) {
        contributeConcept({
          id: dc.id, name: dc.name, domain: dc.domain, summary: dc.summary,
          approxYear: dc.approxYear, eras: [], threads: [],
          lat: null, lng: null, wikipediaUrl: dc.wikipediaUrl, imageUrl: null,
        })
      }
      // Link the seed to the deeper concept (skip if the edge already exists).
      const dup = await db.edges.where('[fromId+toId]').equals([seedId, dc.id]).count()
      if (!dup) {
        await db.edges.add({
          fromId: seedId, toId: dc.id, relation: dc.relation,
          weight: 1, isPersonal: false, note: null, createdAt: now,
        })
      }
      newIds.push(dc.id)
    }
    return newIds
  } catch {
    return []
  }
}
