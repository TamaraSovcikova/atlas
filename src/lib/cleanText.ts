/**
 * Normalise inline formatting that leaks into card text.
 *
 * The static bank is clean prose, but AI-generated summaries (Gemini / Groq)
 * happily emit Markdown and LaTeX even when asked for plain text — so cards can
 * show literal `**bold**`, `` `code` ``, `$x^{2}+a$`, `\text{...}`, or stray
 * fragments like `+a}$` from a formula the renderer never interpreted. Rather
 * than pull in a full Markdown + KaTeX stack, we render to clean readable plain
 * text, using unicode super/subscripts for the common math cases.
 *
 * We also repair "mojibake" — text that was UTF-8 but got decoded as
 * Windows-1252 somewhere upstream (common in AI provider responses), so an em
 * dash "—" arrives as "â€”", a curly apostrophe "’" as "â€™", "é" as "Ã©", etc.
 *
 * Deliberately conservative around `$`: a lone `$` before a digit (e.g.
 * "$13 billion") is left alone; only `$…$` pairs whose contents look like math
 * (contain \\ ^ _ or {}) are treated as LaTeX.
 */

// Windows-1252 maps bytes 0x80–0x9F to punctuation code points instead of the
// C1 controls Latin-1 uses; these are the byte values whose cp1252 code point
// differs from its raw value. Every other byte 0x00–0xFF decodes to itself, so
// only this table is needed to invert a cp1252 decode.
const CP1252_HIGH_TO_BYTE: Record<number, number> = {
  0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85,
  0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a,
  0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92,
  0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b, 0x0153: 0x9c,
  0x017e: 0x9e, 0x0178: 0x9f,
}

/** The cp1252 byte a character decoded from, or null if it isn't byte-derived. */
function charToCp1252Byte(cp: number): number | null {
  if (cp <= 0x7f) return cp // ASCII
  if (cp >= 0x80 && cp <= 0x9f) return cp // C1 controls == byte (pure Latin-1 decode)
  if (cp >= 0xa0 && cp <= 0xff) return cp // Latin-1 high == cp1252 == raw byte
  return CP1252_HIGH_TO_BYTE[cp] ?? null // cp1252 punctuation (€ " ' – — … etc.)
}

const UTF8_STRICT = new TextDecoder('utf-8', { fatal: true })

/**
 * Lead bytes we accept as the start of a mojibake run. Deliberately NOT the full
 * UTF-8 lead range (0xC2–0xF4): a wide range makes ordinary text self-corrupting,
 * because a genuine accented letter followed by NBSP / ° / ² / a curly quote forms
 * a *valid* two-byte sequence and would be "repaired" into a different character
 * ("CAFÉ<nbsp>:" → "CAFɠ:", "3ײ" from "3×²"). These three cover every artifact
 * that actually occurs here: 0xC2 (Â — °, £, ©, nbsp), 0xC3 (Ã — accented Latin-1),
 * 0xE2 (â — dashes, curly quotes, ellipsis, bullet). Greek/Cyrillic/CJK mojibake is
 * left alone by design: silently mangling correct text is worse than not repairing.
 */
const MOJIBAKE_LEADS = new Set([0xc2, 0xc3, 0xe2])

/**
 * Reverse UTF-8-decoded-as-Windows-1252 corruption. We look for runs that start
 * with one of MOJIBAKE_LEADS, map each char back to its cp1252 byte, and re-decode
 * the run as UTF-8. Strict decoding means anything that isn't well-formed UTF-8 is
 * left untouched. Runs stop at whitespace so a mojibake word can't be spoilt by an
 * unrelated accented word next to it.
 */
function fixMojibake(s: string): string {
  // Fast exit: real mojibake always contains one of the lead chars above.
  if (!/[ÂÃâ]/.test(s)) return s
  let out = ''
  let i = 0
  while (i < s.length) {
    const cp = s.codePointAt(i)!
    const step = cp > 0xffff ? 2 : 1
    const byte = charToCp1252Byte(cp)
    // Only start a run at a known mojibake lead; otherwise pass the char through.
    if (byte === null || !MOJIBAKE_LEADS.has(byte)) {
      out += String.fromCodePoint(cp)
      i += step
      continue
    }
    const bytes: number[] = []
    let j = i
    while (j < s.length) {
      const c = s.codePointAt(j)!
      if (c === 0x20 || c === 0x09 || c === 0x0a || c === 0x0d) break // word boundary
      const b = charToCp1252Byte(c)
      if (b === null) break
      bytes.push(b)
      j += c > 0xffff ? 2 : 1
    }
    if (bytes.length < 2) {
      // A lone lead byte can never be valid UTF-8; skip the guaranteed throw.
      out += s.slice(i, j)
    } else {
      try {
        out += UTF8_STRICT.decode(new Uint8Array(bytes))
      } catch {
        out += s.slice(i, j) // not valid UTF-8 → keep verbatim
      }
    }
    i = j
  }
  return out
}

const SUP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶',
  '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽',
  ')': '⁾', 'n': 'ⁿ', 'i': 'ⁱ',
}
const SUB: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆',
  '7': '₇', '8': '₈', '9': '₉', '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
}

function toUnicode(body: string, map: Record<string, string>): string | null {
  let out = ''
  for (const ch of body) {
    const m = map[ch]
    if (!m) return null // unmappable — bail, caller keeps a plain fallback
    out += m
  }
  return out
}

/** Convert `^{...}` / `^x` and `_{...}` / `_x` to unicode where possible. */
function scripts(s: string): string {
  // Braced forms first.
  s = s.replace(/\^\{([^{}]*)\}/g, (_, b: string) => toUnicode(b, SUP) ?? b)
  s = s.replace(/_\{([^{}]*)\}/g, (_, b: string) => toUnicode(b, SUB) ?? b)
  // Single-character forms.
  s = s.replace(/\^([0-9n+\-()i])/g, (_, c: string) => SUP[c] ?? c)
  s = s.replace(/_([0-9+\-()])/g, (_, c: string) => SUB[c] ?? c)
  return s
}

/** Replace a handful of common LaTeX commands with readable equivalents. */
function latexCommands(s: string): string {
  return s
    .replace(/\\(?:text|mathrm|mathbf|mathit|textbf|textit|emph)\{([^{}]*)\}/g, '$1')
    .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1/$2)')
    .replace(/\\times\b/g, '×')
    .replace(/\\cdot\b/g, '·')
    .replace(/\\div\b/g, '÷')
    .replace(/\\pm\b/g, '±')
    .replace(/\\approx\b/g, '≈')
    .replace(/\\neq\b/g, '≠')
    .replace(/\\leq\b/g, '≤')
    .replace(/\\geq\b/g, '≥')
    .replace(/\\degree\b|\\deg\b|\^\\circ|\^\{\\circ\}/g, '°')
    .replace(/\\%/g, '%')
    .replace(/\\,|\\;|\\ /g, ' ')
    .replace(/\\left|\\right/g, '')
    .replace(/\\[a-zA-Z]+/g, '') // drop any remaining unknown commands
}

function processMath(body: string): string {
  return scripts(latexCommands(body)).trim()
}

export function cleanText(input: string | null | undefined): string {
  if (!input) return ''
  let s = fixMojibake(input)

  // 1. Explicit LaTeX delimiters — process the inner math, drop the delimiters.
  s = s.replace(/\\\(([\s\S]*?)\\\)/g, (_, b: string) => processMath(b))
  s = s.replace(/\\\[([\s\S]*?)\\\]/g, (_, b: string) => processMath(b))

  // 2. $$…$$ and $…$ — only when the contents actually look like math, so real
  //    currency ("$13 billion") is never touched.
  s = s.replace(/\$\$([\s\S]*?)\$\$/g, (m, b: string) =>
    /[\\^_{}]/.test(b) ? processMath(b) : m,
  )
  s = s.replace(/\$([^$\n]*?)\$/g, (m, b: string) =>
    /[\\^_{}]/.test(b) ? processMath(b) : m,
  )

  // 3. Bare scripts / commands outside any delimiter (AI often omits the $).
  s = latexCommands(s)
  s = scripts(s)

  // 4. Markdown emphasis, inline code, links, headings.
  s = s
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')

  // 5. Sweep up broken-formula leftovers: stray braces (prose never uses them)
  //    and a `$` not acting as currency (i.e. not immediately before a digit).
  s = s.replace(/[{}]/g, '')
  s = s.replace(/\$(?!\d)/g, '')

  // 6. Tidy whitespace the substitutions may have left behind.
  return s.replace(/[ \t]{2,}/g, ' ').replace(/ +([.,;:!?])/g, '$1').trim()
}
