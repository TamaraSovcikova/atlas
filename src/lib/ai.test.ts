import { describe, expect, it } from 'vitest'
import { parseRecallQuestions } from './ai'

describe('parseRecallQuestions', () => {
  it('accepts a well-formed cloze and normalises to a RecallQuestion', () => {
    const qs = parseRecallQuestions({
      prompt: 'The first crewed Moon landing was in ____.',
      answer: '1969',
    })
    expect(qs).toEqual([
      { format: 'cloze', prompt: 'The first crewed Moon landing was in ____.', expectedAnswer: '1969' },
    ])
  })

  it('trims surrounding whitespace on prompt and answer', () => {
    const qs = parseRecallQuestions({ prompt: '  Rome fell to ____  ', answer: '  the Goths ' })
    expect(qs[0]?.prompt).toBe('Rome fell to ____')
    expect(qs[0]?.expectedAnswer).toBe('the Goths')
  })

  it('rejects a prompt with no blank (not a real cloze)', () => {
    expect(parseRecallQuestions({ prompt: 'Who unified Germany?', answer: 'Bismarck' })).toEqual([])
  })

  it('rejects when the answer is still visible in the prompt (a giveaway)', () => {
    expect(
      parseRecallQuestions({ prompt: 'Bismarck unified ____; Bismarck led Prussia.', answer: 'Bismarck' }),
    ).toEqual([])
  })

  it('rejects empty, missing, or sentence-length answers', () => {
    expect(parseRecallQuestions({ prompt: 'x ____', answer: '' })).toEqual([])
    expect(parseRecallQuestions({ prompt: 'x ____' })).toEqual([])
    expect(
      parseRecallQuestions({ prompt: 'x ____', answer: 'a'.repeat(61) }),
    ).toEqual([])
  })

  it('is safe on non-object / null input', () => {
    expect(parseRecallQuestions(null)).toEqual([])
    expect(parseRecallQuestions(undefined)).toEqual([])
    expect(parseRecallQuestions('nope')).toEqual([])
    expect(parseRecallQuestions(42)).toEqual([])
  })
})
