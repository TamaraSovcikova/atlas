import { describe, expect, it } from 'vitest'
import { interleave, type RecallItem } from './session'
import type { Concept, Lesson, Review } from '../db/schema'
import { newReview } from './fsrs'

function makeCard(id: string, domain: Concept['domain']): RecallItem {
  const concept: Concept = {
    id,
    name: id,
    domain,
    lessonId: `${id}--lesson`,
    summary: '',
    wikipediaUrl: null,
    approxYear: null,
    eras: [],
    lat: null,
    lng: null,
    firstSeenAt: null,
    lastReviewedAt: null,
    createdAt: 0,
  }
  const lesson: Lesson = {
    id: `${id}--lesson`,
    conceptId: id,
    title: id,
    body: '',
    recallQuestions: [{ format: 'cloze', prompt: 'q ____', expectedAnswer: 'a' }],
    sourceUrls: [],
    lastVerifiedAt: null,
    createdAt: 0,
  }
  const review: Review = { ...newReview(id, 0), id: 1 }
  return {
    kind: 'recall',
    cardKey: id,
    concept,
    lesson,
    question: lesson.recallQuestions[0]!,
    review,
    isNew: true,
    isFallback: false,
  }
}

describe('interleave', () => {
  it('avoids back-to-back cards from the same domain when possible', () => {
    const cards = [
      makeCard('h1', 'history'),
      makeCard('h2', 'history'),
      makeCard('g1', 'geography'),
      makeCard('g2', 'geography'),
      makeCard('p1', 'politics'),
    ]
    const out = interleave(cards)
    expect(out).toHaveLength(5)
    let sameDomainStreaks = 0
    for (let i = 1; i < out.length; i++) {
      if (out[i]!.concept.domain === out[i - 1]!.concept.domain) {
        sameDomainStreaks++
      }
    }
    expect(sameDomainStreaks).toBeLessThanOrEqual(1)
  })

  it('returns the same single card untouched', () => {
    const cards = [makeCard('h1', 'history')]
    expect(interleave(cards)).toEqual(cards)
  })

  it('does not lose cards when the same domain dominates', () => {
    const cards = [
      makeCard('h1', 'history'),
      makeCard('h2', 'history'),
      makeCard('h3', 'history'),
      makeCard('g1', 'geography'),
    ]
    const out = interleave(cards)
    expect(out).toHaveLength(4)
    expect(out.map((c) => c.concept.id).sort()).toEqual(['g1', 'h1', 'h2', 'h3'])
  })
})
