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

export type SessionShape = 'era' | 'domain' | 'spaced'

export interface Era {
  id: string
  name: string
  startYear: number
  endYear: number
  description: string
  displayOrder: number
}

export interface Concept {
  id: string
  name: string
  domain: Domain
  lessonId: string | null
  summary: string
  wikipediaUrl: string | null
  approxYear: number | null
  eras: string[]
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

export class AtlasDB extends Dexie {
  concepts!: Table<Concept, string>
  edges!: Table<Edge, number>
  lessons!: Table<Lesson, string>
  reviews!: Table<Review, number>
  sessions!: Table<Session, number>
  news!: Table<NewsItem, string>
  settings!: Table<SettingsKv, string>
  eras!: Table<Era, string>

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
  }
}

export const db = new AtlasDB()
