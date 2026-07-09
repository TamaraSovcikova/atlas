import { describe, it, expect } from 'vitest'
import { cleanText } from './cleanText'

describe('cleanText', () => {
  it('leaves clean prose untouched', () => {
    expect(cleanText('The Cold War was a period of tension.')).toBe(
      'The Cold War was a period of tension.',
    )
  })

  it('preserves real currency amounts (lone $ before a digit)', () => {
    expect(cleanText('provided over $13 billion (roughly $150 billion today)')).toBe(
      'provided over $13 billion (roughly $150 billion today)',
    )
  })

  it('strips markdown emphasis and inline code', () => {
    expect(cleanText('This is **bold**, *italic*, and `code`.')).toBe(
      'This is bold, italic, and code.',
    )
  })

  it('converts LaTeX superscripts and subscripts to unicode', () => {
    expect(cleanText('The formula $x^{2}$ and water $H_{2}O$.')).toBe(
      'The formula x² and water H₂O.',
    )
    expect(cleanText('E = mc^2 releases energy.')).toBe('E = mc² releases energy.')
  })

  it('replaces common latex commands', () => {
    expect(cleanText('Roughly $2 \\times 10^{3}$ years.')).toBe('Roughly 2 × 10³ years.')
    expect(cleanText('\\text{speed} increases')).toBe('speed increases')
  })

  it('sweeps up broken formula leftovers', () => {
    expect(cleanText('the value +a}$ appears')).toBe('the value +a appears')
    expect(cleanText('a stray } brace')).toBe('a stray brace')
  })

  it('handles markdown links and headings', () => {
    expect(cleanText('See [Wikipedia](https://x.com) for more.')).toBe(
      'See Wikipedia for more.',
    )
    expect(cleanText('## Overview\nText')).toBe('Overview\nText')
  })

  it('is null-safe', () => {
    expect(cleanText(null)).toBe('')
    expect(cleanText(undefined)).toBe('')
    expect(cleanText('')).toBe('')
  })
})
