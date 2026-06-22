import type { Concept, Lesson, RecallQuestion, Thread } from './schema'
import { db } from './schema'
import { newReview } from '../lib/fsrs'
import { BANK_CONCEPTS, BANK_ERAS, BANK_THREADS, BANK_VERSION } from '../content'

const FLAG_KEY = `bank:${BANK_VERSION}:loaded`

function toRecallQuestions(c: (typeof BANK_CONCEPTS)[number]): RecallQuestion[] {
  return c.questions.map((q) => ({
    format: q.format,
    prompt: q.prompt,
    expectedAnswer: q.answer,
    distractors: q.distractors,
    chipDistractors: q.chipDistractors,
    hint: null,
  }))
}

/**
 * Sync the shared content bank into the local database.
 *
 * Idempotent and progress-preserving: existing concepts keep their
 * firstSeenAt / lastReviewedAt and their FSRS review schedule. New concepts
 * are added. Lessons and non-personal graph edges are rebuilt from the bank
 * so content edits propagate. Personal edges (user notes) are never touched.
 */
export async function loadSeedIfNeeded(): Promise<void> {
  const flag = await db.settings.get(FLAG_KEY)
  if (flag) return

  const now = Date.now()
  const bankIds = new Set(BANK_CONCEPTS.map((c) => c.id))

  // Invert thread membership: conceptId -> [threadId, ...] for the concept tag.
  const threadsByConcept = new Map<string, string[]>()
  for (const t of BANK_THREADS) {
    for (const m of t.members) {
      const list = threadsByConcept.get(m.concept) ?? []
      list.push(t.id)
      threadsByConcept.set(m.concept, list)
    }
  }

  await db.transaction(
    'rw',
    [db.concepts, db.lessons, db.edges, db.reviews, db.settings, db.eras, db.threads],
    async () => {
      for (const era of BANK_ERAS) {
        await db.eras.put(era)
      }

      for (const t of BANK_THREADS) {
        const thread: Thread = {
          id: t.id,
          name: t.name,
          description: t.description,
          displayOrder: t.displayOrder,
          unit: t.unit,
          members: t.members.map((m) => ({ conceptId: m.concept, tier: m.tier ?? 1 })),
        }
        await db.threads.put(thread)
      }

      for (const c of BANK_CONCEPTS) {
        const lessonId = `${c.id}--lesson`
        const existing = await db.concepts.get(c.id)

        const concept: Concept = {
          id: c.id,
          name: c.name,
          domain: c.domain,
          lessonId,
          summary: c.summary,
          wikipediaUrl: c.wikipedia,
          imageUrl: c.imageUrl ?? null,
          approxYear: c.approxYear,
          eras: c.eras,
          threads: threadsByConcept.get(c.id) ?? [],
          lat: c.lat ?? null,
          lng: c.lng ?? null,
          firstSeenAt: existing?.firstSeenAt ?? null,
          lastReviewedAt: existing?.lastReviewedAt ?? null,
          createdAt: existing?.createdAt ?? now,
        }
        await db.concepts.put(concept)

        const lesson: Lesson = {
          id: lessonId,
          conceptId: c.id,
          title: c.name,
          body: c.summary,
          recallQuestions: toRecallQuestions(c),
          sourceUrls: [c.wikipedia],
          lastVerifiedAt: now,
          createdAt: now,
        }
        await db.lessons.put(lesson)

        const review = await db.reviews.where('conceptId').equals(c.id).first()
        if (!review) await db.reviews.add(newReview(c.id, now))
      }

      // Rebuild non-personal edges from the bank; keep user-authored ones.
      const personalEdges = await db.edges.filter((e) => e.isPersonal).toArray()
      await db.edges.clear()
      for (const e of personalEdges) await db.edges.add(e)
      for (const c of BANK_CONCEPTS) {
        for (const edge of c.edges) {
          await db.edges.add({
            fromId: c.id,
            toId: edge.to,
            relation: edge.relation,
            weight: 1,
            isPersonal: false,
            note: null,
            createdAt: now,
          })
        }
      }

      // Remove concepts that the bank no longer contains (and their artefacts).
      const allConcepts = await db.concepts.toArray()
      for (const c of allConcepts) {
        if (bankIds.has(c.id)) continue
        await db.concepts.delete(c.id)
        if (c.lessonId) await db.lessons.delete(c.lessonId)
        const stale = await db.reviews.where('conceptId').equals(c.id).toArray()
        for (const r of stale) if (r.id !== undefined) await db.reviews.delete(r.id)
      }

      // Remove threads the bank no longer defines.
      const threadIds = new Set(BANK_THREADS.map((t) => t.id))
      for (const t of await db.threads.toArray()) {
        if (!threadIds.has(t.id)) await db.threads.delete(t.id)
      }

      await db.settings.put({
        key: FLAG_KEY,
        value: { loadedAt: now, count: BANK_CONCEPTS.length },
      })
    },
  )
}

export const SEED_COUNT = BANK_CONCEPTS.length
export const ERA_COUNT = BANK_ERAS.length
export const THREAD_COUNT = BANK_THREADS.length
