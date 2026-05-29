import { db, type Concept, type RelationType } from '../db/schema'

export interface ConnectionHit {
  concept: Concept
  relation: RelationType
  direction: 'outgoing' | 'incoming'
  isKnown: boolean
}

export async function connectionsFor(conceptId: string, limit = 5): Promise<ConnectionHit[]> {
  const outgoing = await db.edges.where('fromId').equals(conceptId).toArray()
  const incoming = await db.edges.where('toId').equals(conceptId).toArray()
  const seen = new Set<string>()
  const hits: ConnectionHit[] = []

  for (const e of outgoing) {
    if (seen.has(e.toId)) continue
    const concept = await db.concepts.get(e.toId)
    if (!concept) continue
    seen.add(e.toId)
    hits.push({
      concept,
      relation: e.relation,
      direction: 'outgoing',
      isKnown: concept.lastReviewedAt !== null,
    })
  }
  for (const e of incoming) {
    if (seen.has(e.fromId)) continue
    const concept = await db.concepts.get(e.fromId)
    if (!concept) continue
    seen.add(e.fromId)
    hits.push({
      concept,
      relation: e.relation,
      direction: 'incoming',
      isKnown: concept.lastReviewedAt !== null,
    })
  }

  hits.sort((a, b) => {
    if (a.isKnown !== b.isKnown) return a.isKnown ? -1 : 1
    return a.concept.name.localeCompare(b.concept.name)
  })

  return hits.slice(0, limit)
}

export function describeRelation(relation: RelationType, direction: 'outgoing' | 'incoming'): string {
  const out: Record<RelationType, string> = {
    caused: direction === 'outgoing' ? 'caused' : 'was caused by',
    influenced_by: direction === 'outgoing' ? 'was influenced by' : 'influenced',
    contemporary_of: 'lived alongside',
    located_in: direction === 'outgoing' ? 'is located in' : 'contains',
    part_of: direction === 'outgoing' ? 'is part of' : 'includes',
    opposed: 'stood opposed to',
    successor_of: direction === 'outgoing' ? 'followed from' : 'led to',
    belief_in: 'is a belief within',
    student_of: direction === 'outgoing' ? 'studied under' : 'taught',
  }
  return out[relation]
}
