import { db } from '../db/schema'

/**
 * The "Saved" collection — a one-tap bookmark from the feed (the Save affordance,
 * PLAN_NEXT §1). Saving carries NO interest-weight change: it's "keep this for
 * later", distinct from "More/Less". It's an ordinary collection, so it shows up
 * in the Collections tab with everything else.
 */
const SAVED_ID = 'saved'
const SAVED_NAME = 'Saved'

/** Add a concept to Saved (creating the collection on first use). True if newly added. */
export async function saveConcept(conceptId: string, now = Date.now()): Promise<boolean> {
  if (!(await db.collections.get(SAVED_ID))) {
    await db.collections.put({ id: SAVED_ID, name: SAVED_NAME, createdAt: now })
  }
  const already = await db.collectionConcepts
    .where('[collectionId+conceptId]')
    .equals([SAVED_ID, conceptId])
    .count()
  if (already) return false
  await db.collectionConcepts.add({ collectionId: SAVED_ID, conceptId, addedAt: now })
  return true
}

/** Remove a concept from Saved. */
export async function unsaveConcept(conceptId: string): Promise<void> {
  await db.collectionConcepts
    .where('[collectionId+conceptId]')
    .equals([SAVED_ID, conceptId])
    .delete()
}

export async function isSaved(conceptId: string): Promise<boolean> {
  const n = await db.collectionConcepts
    .where('[collectionId+conceptId]')
    .equals([SAVED_ID, conceptId])
    .count()
  return n > 0
}
