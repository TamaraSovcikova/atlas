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
 * Deliberately conservative around `$`: a lone `$` before a digit (e.g.
 * "$13 billion") is left alone; only `$…$` pairs whose contents look like math
 * (contain \\ ^ _ or {}) are treated as LaTeX.
 */

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
  let s = input

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
