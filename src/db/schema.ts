import Dexie, { type Table } from 'dexie'

export type Domain =
  | 'history'
  | 'geography'
  | 'politics'
  | 'religions'
  | 'culture'
  | 'science'
  | 'modern_world'

export type RelationType =
  | 'caused'
  | 'influenced_by'
  | 'contemporary_of'
  | 'located_in'
  | 'part_of'
  | 'opposed'
  | 'successor_of'
  | 'belief_in'
  | 'student_of'

export type Region = 'uk' | 'slovak_eu' | 'world'

export type RecallFormat = 'cloze' | 'cloze_chips' | 'contrast' | 'free' | 'map'

export type SessionShape = 'era' | 'domain' | 'spaced' | 'thread' | 'daily' | 'mistakes' | 'collection'

export interface Era {
  id: string
  name: string
  startYear: number
  endYear: number
  description: string
  displayOrder: number
}

export interface ThreadMember {
  conceptId: string
  /** 1 = anchor (skeleton), 2 = supporting event/figure, 3 = detail/story. */
  tier: number
}

/**
 * A narrative storyline: an ordered, tiered reading-list over concepts, cutting
 * vertically through eras (e.g. "20th-century Europe"). Members are authored in
 * narrative order; the session walks them chronologically and introduces lower
 * tiers first, so a thread teaches its skeleton before its detail.
 */
export interface Thread {
  id: string
  name: string
  description: string
  displayOrder: number
  unit?: string
  members: ThreadMember[]
}

export interface Concept {
  id: string
  name: string
  domain: Domain
  lessonId: string | null
  summary: string
  wikipediaUrl: string | null
  imageUrl?: string | null
  approxYear: number | null
  eras: string[]
  threads: string[]
  lat: number | null
  lng: number | null
  firstSeenAt: number | null
  lastReviewedAt: number | null
  createdAt: number
}

export interface Edge {
  id?: number
  fromId: string
  toId: string
  relation: RelationType
  weight: number
  isPersonal: boolean
  note: string | null
  createdAt: number
}

export interface RecallQuestion {
  format: RecallFormat
  prompt: string
  expectedAnswer: string
  distractors?: string[]
  chipDistractors?: string[]
  hint?: string | null
}

export interface Lesson {
  id: string
  conceptId: string
  title: string
  body: string
  recallQuestions: RecallQuestion[]
  sourceUrls: string[]
  lastVerifiedAt: number | null
  createdAt: number
}

export interface Review {
  id?: number
  conceptId: string
  dueAt: number
  stability: number
  difficulty: number
  elapsedDays: number
  scheduledDays: number
  reps: number
  lapses: number
  state: number
  lastReviewedAt: number | null
  failureStreak: number
  createdAt: number
}

export interface Session {
  id?: number
  startedAt: number
  durationMs: number | null
  newCount: number
  reviewCount: number
  accuracy: number | null
  shape: SessionShape | null
  eraId: string | null
  domain: Domain | null
  threadId?: string | null
  collectionId?: string | null
}

export interface Collection {
  id: string
  name: string
  createdAt: number
}

export interface CollectionConcept {
  id?: number
  collectionId: string
  conceptId: string
  addedAt: number
}

export interface NewsItem {
  id: string
  date: string
  headline: string
  bodyRewritten: string
  sourceUrl: string
  sourceOutlet: string
  region: Region
  conceptTags: string[]
  fetchedAt: number
}

export interface SettingsKv {
  key: string
  value: unknown
}

export type SwipeDirection = 'up' | 'left' | 'right'

/**
 * One recorded swipe in the infinite feed. Feeds the preference recommender and
 * gives us a history for tuning / future undo. Interest *weights* live in the
 * settings kv (small, syncs with the token); this table is the raw event log.
 */
export interface FeedEvent {
  id?: number
  /** The feed item's cardKey (e.g. 'concept:rome', 'review:caesar', 'conn:a-b'). */
  itemKey: string
  /** Primary topic touched, for quick aggregate queries. */
  topicDomain: Domain | null
  direction: SwipeDirection
  /** Milliseconds the item was on screen before the swipe. */
  dwellMs: number
  at: number
}

export class AtlasDB extends Dexie {
  concepts!: Table<Concept, string>
  edges!: Table<Edge, number>
  lessons!: Table<Lesson, string>
  reviews!: Table<Review, number>
  sessions!: Table<Session, number>
  news!: Table<NewsItem, string>
  settings!: Table<SettingsKv, string>
  eras!: Table<Era, string>
  threads!: Table<Thread, string>
  collections!: Table<Collection, string>
  collectionConcepts!: Table<CollectionConcept, number>
  feedEvents!: Table<FeedEvent, number>

  constructor() {
    super('atlas')
    this.version(1).stores({
      concepts: 'id, name, domain, lastReviewedAt',
      edges: '++id, fromId, toId, [fromId+toId], isPersonal',
      lessons: 'id, conceptId',
      reviews: '++id, conceptId, dueAt, state',
      sessions: '++id, startedAt',
      news: 'id, date, region',
      settings: 'key',
    })
    this.version(2)
      .stores({
        concepts: 'id, name, domain, approxYear, lastReviewedAt, *eras',
        edges: '++id, fromId, toId, [fromId+toId], isPersonal',
        lessons: 'id, conceptId',
        reviews: '++id, conceptId, dueAt, state',
        sessions: '++id, startedAt',
        news: 'id, date, region',
        settings: 'key',
        eras: 'id, displayOrder',
      })
      .upgrade(async (tx) => {
        await tx.table('settings').delete('seed:v1:loaded')
        await tx.table('concepts').clear()
        await tx.table('edges').clear()
        await tx.table('lessons').clear()
        await tx.table('reviews').clear()
      })
    // v3 adds threads (narrative storylines) and a multiEntry index on
    // concepts.threads. Re-seed (drop the bank flag) so memberships populate;
    // FSRS reviews and firstSeenAt on concepts are preserved.
    this.version(3).stores({
      concepts: 'id, name, domain, approxYear, lastReviewedAt, *eras, *threads',
      edges: '++id, fromId, toId, [fromId+toId], isPersonal',
      lessons: 'id, conceptId',
      reviews: '++id, conceptId, dueAt, state',
      sessions: '++id, startedAt',
      news: 'id, date, region',
      settings: 'key',
      eras: 'id, displayOrder',
      threads: 'id, displayOrder',
    })
    // v4 adds collections and collectionConcepts tables. Purely additive -- no
    // existing data is touched.
    this.version(4).stores({
      concepts: 'id, name, domain, approxYear, lastReviewedAt, *eras, *threads',
      edges: '++id, fromId, toId, [fromId+toId], isPersonal',
      lessons: 'id, conceptId',
      reviews: '++id, conceptId, dueAt, state',
      sessions: '++id, startedAt',
      news: 'id, date, region',
      settings: 'key',
      eras: 'id, displayOrder',
      threads: 'id, displayOrder',
      collections: 'id, createdAt',
      collectionConcepts: '++id, collectionId, conceptId, [collectionId+conceptId]',
    })
    // v5 adds feedEvents (swipe history for the infinite feed recommender).
    // Purely additive -- no existing data is touched.
    this.version(5).stores({
      concepts: 'id, name, domain, approxYear, lastReviewedAt, *eras, *threads',
      edges: '++id, fromId, toId, [fromId+toId], isPersonal',
      lessons: 'id, conceptId',
      reviews: '++id, conceptId, dueAt, state',
      sessions: '++id, startedAt',
      news: 'id, date, region',
      settings: 'key',
      eras: 'id, displayOrder',
      threads: 'id, displayOrder',
      collections: 'id, createdAt',
      collectionConcepts: '++id, collectionId, conceptId, [collectionId+conceptId]',
      feedEvents: '++id, at',
    })
  }
}

export const db = new AtlasDB()
