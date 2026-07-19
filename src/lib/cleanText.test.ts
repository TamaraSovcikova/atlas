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

  // Reproduce the two real-world corruptions: UTF-8 bytes decoded as
  // Windows-1252 (the visible "â€"" form) or as pure Latin-1 (C1 controls).
  const asCp1252 = (correct: string) =>
    new TextDecoder('windows-1252').decode(new TextEncoder().encode(correct))
  const asLatin1 = (correct: string) =>
    String.fromCharCode(...new TextEncoder().encode(correct))

  it('repairs UTF-8-as-Windows-1252 mojibake (em/en dash, quotes, ellipsis)', () => {
    expect(cleanText(asCp1252('A short period—a tense one.'))).toBe(
      'A short period—a tense one.',
    )
    expect(cleanText(asCp1252('1945–1991'))).toBe('1945–1991')
    expect(cleanText(asCp1252('It’s over'))).toBe('It’s over')
    expect(cleanText(asCp1252('and so on…'))).toBe('and so on…')
  })

  it('repairs pure-Latin-1 mojibake incl. bytes cp1252 leaves undefined', () => {
    // The closing curly quote ” is byte 0x9D, undefined in cp1252 but a clean
    // pass-through under Latin-1 — recoverable only via the C1-control branch.
    expect(cleanText(asLatin1('“war”'))).toBe('“war”')
    expect(cleanText(asLatin1('It’s over'))).toBe('It’s over')
  })

  it('repairs mojibaked accented letters without harming real ones', () => {
    expect(cleanText(asCp1252('café in München'))).toBe('café in München')
    // A genuinely-accented char is a lone byte, not valid UTF-8 → left as-is.
    expect(cleanText('café already correct')).toBe('café already correct')
    // A real em dash must survive untouched.
    expect(cleanText('a period—a tense one')).toBe('a period—a tense one')
  })

  // Regression: an accented letter followed by NBSP / ° / ² / a curly quote forms
  // a VALID two-byte sequence, so a permissive lead range silently rewrote correct
  // text ("CAFÉ<nbsp>:" → "CAFɠ:"). Only 0xC2/0xC3/0xE2 may start a repair run.
  it('never rewrites genuine text whose accent abuts a continuation-range char', () => {
    expect(cleanText('CAFÉ : ouvert')).toBe('CAFÉ : ouvert')
    expect(cleanText('MÜ’s')).toBe('MÜ’s')
    expect(cleanText('3×²')).toBe('3×²')
    expect(cleanText('Å°C')).toBe('Å°C')
    expect(cleanText('Ø²')).toBe('Ø²')
    expect(cleanText('« café »')).toBe('« café »')
    expect(cleanText('René Descartes')).toBe('René Descartes')
  })

  it('is null-safe', () => {
    expect(cleanText(null)).toBe('')
    expect(cleanText(undefined)).toBe('')
    expect(cleanText('')).toBe('')
  })
})
