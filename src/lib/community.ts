import { db, type Concept, type Lesson, type RecallQuestion } from '../db/schema'
import { SYNC_URL, ensureAuthToken } from './sync'
import { safeHttpUrl } from './url'
import { newReview } from './fsrs'
import { generateDeeperConcepts } from './ai'
import type { KnowledgeLevel } from './settings'
import { baseId, isBetterVariant, variantId, variantLevel } from './aiVariant'

/**
 * Community concept bank. AI-generated cards are shared through the Worker so a
 * topic one person generates becomes available to everyone, not just saved to
 * that person's local vault. Online-only and best-effort: every call degrades to
 * a no-op offline, and the local-first core keeps working regardless.
 */

const LAST_PULL_KEY = 'community:lastPull'

const VALID_DOMAINS = [
  'history', 'geography', 'politics', 'religions', 'culture', 'science', 'modern_world',
]

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
  /** Generated accessibility 1-3 (§E5); absent on legacy community cards. */
  complexity?: number
  /** AI-authored cloze(s) so the card is quizzable; absent on legacy cards. */
  recallQuestions?: RecallQuestion[]
}

/** Deterministic lesson id for an AI concept's authored quiz. */
function aiLessonId(conceptId: string): string {
  return `${conceptId}--lesson`
}

const RECALL_FORMATS: RecallQuestion['format'][] = [
  'cloze', 'cloze_chips', 'contrast', 'free', 'map',
]

const MAX_QUESTIONS = 3
const MAX_PROMPT_LEN = 400
const MAX_ANSWER_LEN = 60

function cleanStringArray(v: unknown, cap: number): string[] | undefined {
  if (!Array.isArray(v)) return undefined
  const out = v
    .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
    .map((s) => s.trim().slice(0, MAX_ANSWER_LEN))
    .slice(0, cap)
  return out.length > 0 ? out : undefined
}

/**
 * Harden recall questions arriving from the shared bank. `POST /concepts` is
 * unauthenticated and the Worker stores the payload opaquely, so anything here
 * is attacker-controllable and reaches other users' vaults via the pull path.
 * An unvalidated element is not cosmetic: `findByFormat` does `q.format` on
 * every entry, and `buildMcqDistractors` walks EVERY lesson in the vault, so a
 * single malformed row throws and breaks recall app-wide. Drop anything that
 * isn't a well-formed question rather than trusting the sender.
 */
export function sanitizeRecallQuestions(v: unknown): RecallQuestion[] {
  if (!Array.isArray(v)) return []
  const out: RecallQuestion[] = []
  for (const raw of v.slice(0, MAX_QUESTIONS)) {
    if (!raw || typeof raw !== 'object') continue
    const q = raw as Record<string, unknown>
    if (!RECALL_FORMATS.includes(q.format as RecallQuestion['format'])) continue
    const prompt = typeof q.prompt === 'string' ? q.prompt.trim() : ''
    const expectedAnswer = typeof q.expectedAnswer === 'string' ? q.expectedAnswer.trim() : ''
    if (!prompt || !expectedAnswer) continue
    const clean: RecallQuestion = {
      format: q.format as RecallQuestion['format'],
      prompt: prompt.slice(0, MAX_PROMPT_LEN),
      expectedAnswer: expectedAnswer.slice(0, MAX_ANSWER_LEN),
    }
    const distractors = cleanStringArray(q.distractors, 5)
    if (distractors) clean.distractors = distractors
    const chips = cleanStringArray(q.chipDistractors, 5)
    if (chips) clean.chipDistractors = chips
    if (typeof q.hint === 'string' && q.hint.trim()) {
      clean.hint = q.hint.trim().slice(0, MAX_PROMPT_LEN)
    }
    out.push(clean)
  }
  return out
}

/**
 * Attach AI-authored recall questions to an AI concept as a Lesson row, so the
 * review loop can quiz it like any bank card. No-op when there are no valid
 * questions (the card then relies on the locally-synthesized fallback quiz).
 * Returns the lesson id when one was written, else null.
 */
async function writeAiLesson(
  concept: Pick<Concept, 'id' | 'name' | 'summary'>,
  questions: RecallQuestion[] | undefined,
  now: number,
): Promise<string | null> {
  // Sanitize here rather than at the call sites: this is the single choke point
  // for both the local generate path and the untrusted community pull path.
  const safe = sanitizeRecallQuestions(questions)
  if (safe.length === 0) return null
  const id = aiLessonId(concept.id)
  const lesson: Lesson = {
    id,
    conceptId: concept.id,
    title: concept.name,
    body: concept.summary,
    recallQuestions: safe,
    sourceUrls: [],
    lastVerifiedAt: null,
    createdAt: now,
  }
  await db.lessons.put(lesson)
  return id
}

/**
 * Insert or upgrade an AI concept locally. Stored under its BASE id (`ai:<slug>`)
 * so edges/reviews/deepen never fragment across per-level variants. `textLevel`
 * is the level `c`'s summary is phrased at (derived from the community id on pull,
 * or the generator's level locally); `reader` is the current user's level, used to
 * decide whether an incoming variant is a better fit than the one already stored.
 *
 * A FSRS review row is added on first insert so the card can be seeded and never
 * resurfaces forever as New. AI concepts now get a Lesson row too when the
 * generator returned a valid cloze, so they are quizzable rather than read-only.
 * Returns true only when a NEW local concept was created (not on an upgrade).
 */
export async function insertAiConcept(
  c: RawConcept,
  textLevel: KnowledgeLevel = 'some',
  reader: KnowledgeLevel = 'some',
  now = Date.now(),
): Promise<boolean> {
  if (!c?.id || !c.id.startsWith('ai:')) return false
  const localId = baseId(c.id)
  const existing = await db.concepts.get(localId)

  if (existing) {
    // Upgrade the stored text/complexity only if this variant fits the reader
    // better than what we hold. Keep id, reviews, edges, and seen-state intact.
    const currentVariant = existing.aiVariant ?? 'some'
    if (isBetterVariant(textLevel, currentVariant, reader)) {
      const lessonId =
        (await writeAiLesson(
          { id: localId, name: c.name, summary: c.summary },
          c.recallQuestions,
          now,
        )) ?? existing.lessonId
      await db.concepts.update(localId, {
        summary: c.summary,
        aiVariant: textLevel,
        lessonId,
        ...(typeof c.complexity === 'number' ? { complexity: c.complexity } : {}),
      })
    } else if (!existing.lessonId && c.recallQuestions?.length) {
      // Not a better text variant, but we finally have a quiz for a card that
      // had none — attach it so the concept stops being read-only.
      const lessonId = await writeAiLesson(
        { id: localId, name: c.name, summary: c.summary },
        c.recallQuestions,
        now,
      )
      if (lessonId) await db.concepts.update(localId, { lessonId })
    }
    return false
  }

  const lessonId = await writeAiLesson(
    { id: localId, name: c.name, summary: c.summary },
    c.recallQuestions,
    now,
  )
  const concept: Concept = {
    id: localId,
    name: c.name,
    // Community payloads are unauthenticated; an arbitrary domain string would
    // land in an indexed column and flow into domain-keyed queries. Match the
    // generate path (ai.ts) and fall back to 'history'.
    domain: VALID_DOMAINS.includes(c.domain) ? (c.domain as Concept['domain']) : 'history',
    lessonId,
    summary: c.summary,
    // Only keep http(s) links; a javascript:/data: URL from an unauth community
    // payload would otherwise become a live href when the card renders.
    wikipediaUrl: safeHttpUrl(c.wikipediaUrl),
    imageUrl: safeHttpUrl(c.imageUrl),
    approxYear: c.approxYear ?? null,
    eras: c.eras ?? [],
    threads: c.threads ?? [],
    lat: c.lat ?? null,
    lng: c.lng ?? null,
    firstSeenAt: null,
    lastReviewedAt: null,
    createdAt: now,
    aiVariant: textLevel,
    ...(typeof c.complexity === 'number' ? { complexity: c.complexity } : {}),
  }
  await db.concepts.put(concept)
  const existingReview = await db.reviews.where('conceptId').equals(localId).first()
  if (!existingReview) await db.reviews.add(newReview(localId, now))
  return true
}

/**
 * Publish a freshly generated concept to the shared bank under its per-level
 * variant id (§E5), so `new`/`some`/`confident` phrasings coexist and first-writer-
 * wins applies per level. Fire-and-forget: the concept is already saved locally.
 */
export async function contributeConcept(concept: RawConcept, level: KnowledgeLevel = 'some'): Promise<void> {
  try {
    const token = await ensureAuthToken()
    const payload = { ...concept, id: variantId(baseId(concept.id), level) }
    await fetch(`${SYNC_URL}/concepts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ concept: payload }),
    })
  } catch {
    // online-only; the concept is already saved locally, so a failed contribution
    // just means it isn't shared this time.
  }
}

/**
 * Pull community concepts contributed since the last pull and insert/upgrade them.
 * `reader` is the current user's level, so a beginner's local cards converge on the
 * `new` variant when one exists (falling back to the canonical `some` version, or
 * to whatever variant the bank holds). Returns how many were NEWLY added. Cheap and
 * safe to call on every app start.
 */
export async function pullCommunityConcepts(
  reader: KnowledgeLevel = 'some',
  now = Date.now(),
): Promise<number> {
  try {
    const row = await db.settings.get(LAST_PULL_KEY)
    const since = (row?.value as number | undefined) ?? 0
    const res = await fetch(`${SYNC_URL}/concepts?since=${since}`)
    if (!res.ok) return 0
    const body = (await res.json()) as { concepts?: RawConcept[]; cursor?: number }
    let added = 0
    for (const c of body.concepts ?? []) {
      if (await insertAiConcept(c, variantLevel(c.id), reader, now)) added++
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
 * Re-scan the whole community bank for a (possibly new) reader level. The normal
 * pull is cursor-incremental, so a variant already downloaded while the reader was
 * at a different level is never re-fetched — which means changing knowledge level
 * in Settings would otherwise leave existing local cards stuck at the old phrasing.
 * Resetting the cursor forces `insertAiConcept` to re-see every variant and upgrade
 * local cards to the reader's best-available depth. Best-effort; online-only.
 */
export async function repullForLevel(reader: KnowledgeLevel, now = Date.now()): Promise<number> {
  await db.settings.put({ key: LAST_PULL_KEY, value: 0 })
  return pullCommunityConcepts(reader, now)
}

/**
 * Deepen-on-demand. Generate 3-5 more-specific concepts under `seedId`, insert
 * any new ones locally (with a review row), wire an edge from the seed to each so
 * they join the knowledge graph + feed deep-queue, and share them to the community
 * bank. Returns the ids of the deeper concepts (existing or new). Online-only and
 * best-effort — a no-op when AI is unavailable. Caller decides WHEN to deepen
 * (e.g. only when the seed has little unseen linked content).
 */
export async function deepenConcept(
  seedId: string,
  reader: KnowledgeLevel = 'some',
  now = Date.now(),
): Promise<string[]> {
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

    const res = await generateDeeperConcepts(seed.name, seed.summary, known, reader)
    if (!res.ok) return []

    const newIds: string[] = []
    for (const dc of res.concepts) {
      if (dc.id === seedId) continue
      const raw: RawConcept = {
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
        complexity: dc.complexity,
        recallQuestions: dc.recallQuestions,
      }
      // Freshly generated at the reader's level, so text level = reader.
      await insertAiConcept(raw, reader, reader, now)
      // Always share this level's variant (server dedups per variant id), so a
      // depth the bank lacks is contributed even when the topic is already local.
      contributeConcept(raw, reader)
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
