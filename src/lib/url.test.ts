import { describe, it, expect } from 'vitest'
import { safeHttpUrl } from './url'

describe('safeHttpUrl', () => {
  it('keeps http and https links', () => {
    expect(safeHttpUrl('https://en.wikipedia.org/wiki/Rome')).toBe('https://en.wikipedia.org/wiki/Rome')
    expect(safeHttpUrl('http://example.com')).toBe('http://example.com')
  })

  it('rejects script-y schemes (the XSS vectors)', () => {
    expect(safeHttpUrl('javascript:alert(1)')).toBeNull()
    expect(safeHttpUrl('JavaScript:alert(1)')).toBeNull()
    expect(safeHttpUrl('  javascript:alert(1)')).toBeNull() // leading space then scheme
    expect(safeHttpUrl('data:text/html,<script>alert(1)</script>')).toBeNull()
    expect(safeHttpUrl('vbscript:msgbox(1)')).toBeNull()
  })

  it('rejects junk, relative and empty values', () => {
    expect(safeHttpUrl(null)).toBeNull()
    expect(safeHttpUrl(undefined)).toBeNull()
    expect(safeHttpUrl('')).toBeNull()
    expect(safeHttpUrl('not a url')).toBeNull()
    expect(safeHttpUrl('/relative/path')).toBeNull()
  })

  it('trims surrounding whitespace on valid links', () => {
    expect(safeHttpUrl('  https://x.com  ')).toBe('https://x.com')
  })
})
