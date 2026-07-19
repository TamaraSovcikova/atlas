import { describe, expect, it } from 'vitest'
import type { Concept, Review } from '../db/schema'
import { newReview } from './fsrs'
import { synthLessonFor, synthQuestionFor } from './session'
import { TIER_REPS_GATE } from './gating'
import {
  MAX_ANCHOR_BONUS,
  MIN_STRONG_ANCHORS,
  STRONG_DIFFICULTY_MAX,
  behaviouralAnchorBonus,
  countStrongAnchors,
  isStrongAnchor,
} from './placement'

function makeConcept(id: string, seen: boolean): Concept {
  return {
    id,
    name: id,
    domain: 'history',
    lessonId: `${id}--lesson`,
    summary: '',
    wikipediaUrl: null,
    approxYear: null,
    eras: [],
    threads: [],
    lat: null,
    lng: null,
    firstSeenAt: seen ? 1 : null,
    lastReviewedAt: null,
    createdAt: 0,
  }
}

function makeReview(
  conceptId: string,
  over: Partial<Pick<Review, 'reps' | 'lapses' | 'difficulty'>> = {},
): Review {
  return {
    ...newReview(conceptId, 0),
    id: 1,
    reps: over.reps ?? TIER_REPS_GATE,
    lapses: over.lapses ?? 0,
    difficulty: over.difficulty ?? 3, // ≤ STRONG_DIFFICULTY_MAX → strong by default
  }
}

const thread = (members: { conceptId: string; tier: number }[]) => ({ members })

describe('isStrongAnchor', () => {
  it('needs enough reps, zero lapses, and non-hard difficulty', () => {
    expect(isStrongAnchor(makeReview('a'))).toBe(true)
    expect(isStrongAnchor(makeReview('a', { reps: TIER_REPS_GATE - 1 }))).toBe(false)
    expect(isStrongAnchor(makeReview('a', { lapses: 1 }))).toBe(false)
    expect(isStrongAnchor(makeReview('a', { difficulty: STRONG_DIFFICULTY_MAX + 1 }))).toBe(false)
    expect(isStrongAnchor(makeReview('a', { difficulty: STRONG_DIFFICULTY_MAX }))).toBe(true)
  })
})

describe('countStrongAnchors', () => {
  const threads = [
    thread([
      { conceptId: 'a1', tier: 1 },
      { conceptId: 'deep', tier: 3 },
    ]),
    thread([{ conceptId: 'a2', tier: 1 }]),
  ]

  it('counts only met, tier-1, strongly-handled anchors', () => {
    const concepts = new Map([
      ['a1', makeConcept('a1', true)],
      ['a2', makeConcept('a2', true)],
      ['deep', makeConcept('deep', true)],
    ])
    const reviews = new Map([
      ['a1', makeReview('a1')], // strong tier-1 anchor ✓
      ['a2', makeReview('a2', { lapses: 2 })], // struggling → not strong
      ['deep', makeReview('deep')], // tier 3 → never an anchor
    ])
    expect(countStrongAnchors(threads, concepts, reviews)).toBe(1)
  })

  it('ignores anchors that were never met', () => {
    const concepts = new Map([
      ['a1', makeConcept('a1', false)], // never seen
      ['a2', makeConcept('a2', true)],
    ])
    const reviews = new Map([
      ['a1', makeReview('a1')],
      ['a2', makeReview('a2')],
    ])
    expect(countStrongAnchors(threads, concepts, reviews)).toBe(1)
  })
})

// The synthesized quiz asks for the concept NAME, so nothing in its stimulus may
// contain that name — otherwise every card auto-grades 'good' and pollutes FSRS.
describe('synthesized quiz stimulus', () => {
  const concept = makeConcept('ai:treaty', true)
  concept.name = 'Treaty of Westphalia'
  concept.summary = 'It ended the Thirty Years War and redrew the map of Europe.'

  it('never leaks the answer through the ephemeral lesson', () => {
    const lesson = synthLessonFor(concept)
    // The lesson is a data carrier only — it must not ship a question whose
    // prompt/answer could be rendered as the stimulus.
    expect(lesson.recallQuestions).toEqual([])
    expect(lesson.body).toBe(concept.summary)
    expect(lesson.body).not.toContain(concept.name)
  })

  it('asks for the name and keeps it out of the prompt', () => {
    const q = synthQuestionFor(concept, ['A', 'B', 'C'])
    expect(q.expectedAnswer).toBe(concept.name)
    expect(q.prompt).not.toContain(concept.name)
    expect(q.distractors).toHaveLength(3)
  })
})

describe('behaviouralAnchorBonus', () => {
  // n distinct tier-1 anchors, all met + strong.
  const buildStrong = (n: number) => {
    const threads = Array.from({ length: n }, (_, i) => thread([{ conceptId: `a${i}`, tier: 1 }]))
    const concepts = new Map(
      Array.from({ length: n }, (_, i) => [`a${i}`, makeConcept(`a${i}`, true)] as const),
    )
    const reviews = new Map(
      Array.from({ length: n }, (_, i) => [`a${i}`, makeReview(`a${i}`)] as const),
    )
    return { threads, concepts, reviews }
  }
  const bonus = (n: number) => {
    const { threads, concepts, reviews } = buildStrong(n)
    return behaviouralAnchorBonus(threads, concepts, reviews)
  }

  it('gives nothing below the minimum sample', () => {
    expect(bonus(0)).toBe(0)
    expect(bonus(MIN_STRONG_ANCHORS - 1)).toBe(0)
  })

  it('credits one per strong anchor above the floor', () => {
    expect(bonus(MIN_STRONG_ANCHORS)).toBe(1)
    expect(bonus(MIN_STRONG_ANCHORS + 1)).toBe(2)
  })

  it('caps at MAX_ANCHOR_BONUS', () => {
    expect(bonus(MIN_STRONG_ANCHORS + MAX_ANCHOR_BONUS - 1)).toBe(MAX_ANCHOR_BONUS)
    expect(bonus(MIN_STRONG_ANCHORS + MAX_ANCHOR_BONUS + 5)).toBe(MAX_ANCHOR_BONUS)
  })
})
