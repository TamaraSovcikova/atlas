import { describe, expect, it } from 'vitest'
import type { KnowledgeLevel } from './settings'
import { baseId, isBetterVariant, variantId, variantLevel, variantScore } from './aiVariant'

describe('variantId / baseId / variantLevel round-trip', () => {
  it('some is the plain base id (backward compatible with legacy cards)', () => {
    expect(variantId('ai:radio_waves', 'some')).toBe('ai:radio_waves')
    expect(baseId('ai:radio_waves')).toBe('ai:radio_waves')
    expect(variantLevel('ai:radio_waves')).toBe('some')
  })

  it('new/confident append a #suffix that baseId strips and variantLevel reads back', () => {
    for (const level of ['new', 'confident'] as KnowledgeLevel[]) {
      const id = variantId('ai:radio_waves', level)
      expect(id).toBe(`ai:radio_waves#${level}`)
      expect(baseId(id)).toBe('ai:radio_waves')
      expect(variantLevel(id)).toBe(level)
    }
  })

  it('an unknown suffix degrades to some (never throws)', () => {
    expect(variantLevel('ai:x#banana')).toBe('some')
    expect(baseId('ai:x#banana')).toBe('ai:x')
  })
})

describe('variantScore', () => {
  it('ranks exact-level over canonical some over any other level', () => {
    expect(variantScore('new', 'new')).toBe(2)
    expect(variantScore('some', 'new')).toBe(1)
    expect(variantScore('confident', 'new')).toBe(0)
    // a some reader: some is exact (2), the others are last-resort (0)
    expect(variantScore('some', 'some')).toBe(2)
    expect(variantScore('new', 'some')).toBe(0)
  })
})

describe('isBetterVariant is strict and convergent', () => {
  it('never upgrades to an equal-or-worse fit', () => {
    expect(isBetterVariant('new', 'new', 'new')).toBe(false) // equal
    expect(isBetterVariant('some', 'new', 'new')).toBe(false) // worse
    expect(isBetterVariant('confident', 'some', 'new')).toBe(false) // worse
  })

  it('upgrades toward the reader-preferred variant', () => {
    expect(isBetterVariant('some', 'confident', 'new')).toBe(true) // 1 > 0
    expect(isBetterVariant('new', 'some', 'new')).toBe(true) // 2 > 1
  })

  it('converges to the best-available variant regardless of arrival order', () => {
    // Simulate community variants arriving in every order for a 'new' reader; the
    // local card should always end on the highest-scoring variant it has seen.
    const reader: KnowledgeLevel = 'new'
    const orders: KnowledgeLevel[][] = [
      ['confident', 'some', 'new'],
      ['new', 'some', 'confident'],
      ['some', 'confident', 'new'],
      ['confident', 'new', 'some'],
    ]
    for (const arrivals of orders) {
      let current: KnowledgeLevel | null = null
      for (const incoming of arrivals) {
        if (current === null || isBetterVariant(incoming, current, reader)) current = incoming
      }
      expect(current).toBe('new') // best fit for a 'new' reader is always reached
    }
  })

  it('a some reader without a some variant lands on whatever arrived (last resort)', () => {
    // Only new/confident exist; both score 0 for a some reader, so the first seen
    // sticks (no strict upgrade between equal-score variants) — still shows a card.
    const reader: KnowledgeLevel = 'some'
    let current: KnowledgeLevel | null = null
    for (const incoming of ['confident', 'new'] as KnowledgeLevel[]) {
      if (current === null || isBetterVariant(incoming, current, reader)) current = incoming
    }
    expect(current).toBe('confident') // first arrival kept; a later some variant would win (score 2)
    expect(isBetterVariant('some', current!, reader)).toBe(true)
  })
})
