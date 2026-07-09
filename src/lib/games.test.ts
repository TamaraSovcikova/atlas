import { describe, it, expect } from 'vitest'
import {
  buildPairGame,
  buildOddGame,
  buildDropGame,
  buildEraGuessGame,
  buildMythGame,
  type PairData,
  type OddData,
  type DropData,
  type EraGuessData,
  type MythData,
} from './session'
import type { Domain } from '../db/schema'

const eraNames = new Map([
  ['ancient', 'the Ancient World'],
  ['medieval', 'the Medieval World'],
  ['modern', 'the Modern World'],
  ['coldwar', 'the Cold War'],
])

describe('buildPairGame', () => {
  it('builds pairs from edges, each concept used once', () => {
    const concepts = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id, name: id.toUpperCase() }))
    const edges = [
      { fromId: 'a', toId: 'b', relation: 'caused' },
      { fromId: 'c', toId: 'd', relation: 'influenced_by' },
      { fromId: 'e', toId: 'f', relation: 'located_in' },
    ]
    const g = buildPairGame(concepts, edges)
    expect(g).not.toBeNull()
    const data = g!.data as PairData
    expect(data.pairs).toHaveLength(3)
    expect(new Set(g!.conceptIds).size).toBe(6)
  })

  it('returns null with fewer than 3 usable pairs', () => {
    const concepts = [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }]
    const edges = [{ fromId: 'a', toId: 'b', relation: 'caused' }]
    expect(buildPairGame(concepts, edges)).toBeNull()
  })
})

describe('buildOddGame', () => {
  it('picks three from an era plus one outsider', () => {
    const concepts = [
      { id: '1', name: 'One', eras: ['ancient'], domain: 'history' as Domain },
      { id: '2', name: 'Two', eras: ['ancient'], domain: 'history' as Domain },
      { id: '3', name: 'Three', eras: ['ancient'], domain: 'history' as Domain },
      { id: '4', name: 'Four', eras: ['modern'], domain: 'science' as Domain },
    ]
    const g = buildOddGame(concepts, eraNames)
    expect(g).not.toBeNull()
    const data = g!.data as OddData
    expect(data.options).toHaveLength(4)
    expect(data.options[data.oddIndex]!.id).toBe('4')
    expect(data.bond).toContain('Ancient')
  })
})

describe('buildDropGame', () => {
  it('separates anchors and a target with a real gap', () => {
    const concepts = [
      { id: 'a', name: 'A', approxYear: -500 },
      { id: 'b', name: 'B', approxYear: 100 },
      { id: 'c', name: 'C', approxYear: 800 },
      { id: 'd', name: 'D', approxYear: 1500 },
    ]
    const g = buildDropGame(concepts)
    expect(g).not.toBeNull()
    const data = g!.data as DropData
    expect(data.anchors).toHaveLength(3)
    expect(data.anchors.every((a) => a.id !== data.target.id)).toBe(true)
    // anchors are sorted ascending
    const years = data.anchors.map((a) => a.year)
    expect(years).toEqual([...years].sort((x, y) => x - y))
  })

  it('needs four distinct years', () => {
    expect(buildDropGame([{ id: 'a', name: 'A', approxYear: 100 }])).toBeNull()
  })
})

describe('buildEraGuessGame', () => {
  it('uses three clue concepts and includes the correct era in options', () => {
    const concepts = [
      { id: '1', name: 'One', eras: ['coldwar'] },
      { id: '2', name: 'Two', eras: ['coldwar'] },
      { id: '3', name: 'Three', eras: ['coldwar'] },
    ]
    const g = buildEraGuessGame(concepts, eraNames)
    expect(g).not.toBeNull()
    const data = g!.data as EraGuessData
    expect(data.clues).toHaveLength(3)
    expect(data.answerEraId).toBe('coldwar')
    expect(data.options.some((o) => o.id === 'coldwar')).toBe(true)
  })
})

describe('buildMythGame', () => {
  it('produces three statements with a valid myth index', () => {
    const concepts = [
      {
        id: 'x',
        name: 'The Thing',
        domain: 'history' as Domain,
        eras: ['medieval'],
        approxYear: 1200,
        summary: 'The Thing was a notable medieval development that changed trade routes.',
      },
    ]
    const g = buildMythGame(concepts, eraNames)
    expect(g).not.toBeNull()
    const data = g!.data as MythData
    expect(data.statements).toHaveLength(3)
    expect(data.mythIndex).toBeGreaterThanOrEqual(0)
    expect(data.mythIndex).toBeLessThan(3)
    // the myth is a real string present in statements
    expect(data.statements[data.mythIndex]).toBeTruthy()
  })
})
