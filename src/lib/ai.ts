import { db } from '../db/schema'
import { SYNC_URL } from './sync'

/**
 * Atlas AI layer (Wave 4). All AI is optional and online-only; every feature
 * has a graceful non-AI fallback so the core loop works fully offline.
 *
 * Auth modes (matches the Worker /ai endpoint):
 * - BYOK: user pastes their own Gemini API key in Settings — unlimited, free,
 *   zero server-side quota consumption.
 * - Pooled (anonymous): routes via the Worker cascade with a global daily cap
 *   and per-user monthly credit accounting for signed-in users.
 *
 * The Worker cascade: Gemini 2.0 flash-lite → Groq llama-3.1-8b.
 */

const BYOK_KEY = 'byokGeminiKey'
const BYOK_PROVIDER_KEY = 'byokProvider'

export type ByokProvider = 'gemini' | 'groq'

export async function getByokKey(): Promise<string | null> {
  const row = await db.settings.get(BYOK_KEY)
  return (row?.value as string | undefined) ?? null
}

export async function setByokKey(key: string | null): Promise<void> {
  if (key === null || key.trim() === '') {
    await db.settings.delete(BYOK_KEY)
  } else {
    await db.settings.put({ key: BYOK_KEY, value: key.trim() })
  }
}

export async function getByokProvider(): Promise<ByokProvider> {
  const row = await db.settings.get(BYOK_PROVIDER_KEY)
  return ((row?.value as string | undefined) ?? 'gemini') as ByokProvider
}

export async function setByokProvider(p: ByokProvider): Promise<void> {
  await db.settings.put({ key: BYOK_PROVIDER_KEY, value: p })
}

export interface AIResult {
  ok: true
  reply: string
  source: 'byok' | 'pooled' | 'fallback'
}

export interface AIError {
  ok: false
  error: string
}

export type AIResponse = AIResult | AIError

/**
 * Core AI call. Routes to BYOK Gemini directly if a key is set; otherwise
 * calls the Worker /ai endpoint (pooled cascade).
 *
 * Falls back gracefully — callers should check `ok` and display their own
 * static fallback content when `ok === false`.
 */
export async function callAI(
  prompt: string,
  system = '',
): Promise<AIResponse> {
  const byok = await getByokKey()

  if (byok) {
    // Direct call to Gemini — no Worker involved, no quota
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${byok}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: system ? { parts: [{ text: system }] } : undefined,
            generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
          }),
        },
      )
      if (!res.ok) {
        const err = await res.text()
        return { ok: false, error: `Gemini: ${err.slice(0, 120)}` }
      }
      const data = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
      }
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      if (!reply) return { ok: false, error: 'Empty response from Gemini.' }
      return { ok: true, reply, source: 'byok' }
    } catch (e) {
      return { ok: false, error: String(e) }
    }
  }

  // Pooled path via Worker
  try {
    const sessionRow = await db.settings.get('accountSession')
    const session = sessionRow?.value as string | undefined
    const anonRow = await db.settings.get('syncToken')
    const anonToken = anonRow?.value as string | undefined
    const authToken = session ?? anonToken

    const res = await fetch(`${SYNC_URL}/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({ prompt, system }),
    })
    if (res.status === 503) {
      return { ok: false, error: 'AI is resting. Add your own free Gemini key in Settings for unlimited use.' }
    }
    if (res.status === 429) {
      return { ok: false, error: 'Daily AI limit reached. Come back tomorrow, or add your own Gemini key in Settings.' }
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: res.statusText }))
      return { ok: false, error: (body as { error?: string }).error ?? res.statusText }
    }
    const body = (await res.json()) as { reply?: string }
    if (!body.reply) return { ok: false, error: 'Empty response.' }
    return { ok: true, reply: body.reply, source: 'pooled' }
  } catch (e) {
    return { ok: false, error: `Network error: ${(e as Error).message}` }
  }
}

// ---- Specialist prompts -------------------------------------------------------

const HISTORICAL_SYSTEM = `You are a vivid but concise historical guide. Your job is to answer questions as
if you ARE the historical figure or era being discussed — first person, present tense, lively but brief
(2-4 sentences max). Never break character. If asked something outside the historical context, gently
redirect. If you don't know, say so briefly in character.`

/**
 * "Ask the past" — talk to a concept/figure as if it is present.
 * conceptName: e.g. "Julius Caesar", "The Black Death", "The Enlightenment"
 */
export async function askThePast(
  conceptName: string,
  conceptSummary: string,
  question: string,
): Promise<AIResponse> {
  const prompt = `Context: ${conceptName} — ${conceptSummary.slice(0, 300)}

User question: ${question}`
  return callAI(prompt, `${HISTORICAL_SYSTEM}\n\nYou are speaking as or about: ${conceptName}.`)
}

/**
 * Explain a wrong answer on a recall card.
 * conceptName: the concept being reviewed
 * question: the recall question that was asked
 * givenAnswer: what the user typed/selected
 * correctAnswer: the actual expected answer
 */
export async function explainMyAnswer(
  conceptName: string,
  question: string,
  givenAnswer: string,
  correctAnswer: string,
): Promise<AIResponse> {
  const prompt = `The student was reviewing: "${conceptName}"
Question: "${question}"
Their answer: "${givenAnswer}"
Correct answer: "${correctAnswer}"

In 2-3 sentences: why is the correct answer right, and what was tricky about this? Be encouraging, not condescending.`
  return callAI(prompt, 'You are a calm, encouraging history tutor. Be brief and specific.')
}

/**
 * Generate a concept card for a query not found in the vault.
 * Returns structured concept data parsed from the AI JSON reply.
 * Degrades gracefully when the AI endpoint isn't configured.
 */
export async function generateConcept(query: string): Promise<
  | {
      ok: true
      concept: {
        id: string
        name: string
        domain: string
        summary: string
        approxYear: number | null
        eras: string[]
        threads: string[]
        lat: number | null
        lng: number | null
        wikipediaUrl: string | null
        imageUrl: null
      }
    }
  | { ok: false; error: string }
> {
  const system = `You are Atlas, a structured knowledge database for a history learning app.
Return ONLY valid JSON — no markdown fences, no prose, nothing else outside the JSON object.`
  const prompt = `Query: "${query}"

Return a single JSON object for the closest matching historical/world-knowledge concept:
{
  "name": "canonical English name",
  "domain": "one of: history|geography|politics|religions|culture|science|modern_world",
  "summary": "2-3 sentence encyclopedic summary",
  "approxYear": year as integer or null,
  "lat": decimal latitude or null,
  "lng": decimal longitude or null,
  "wikipediaUrl": "https://en.wikipedia.org/wiki/..." or null
}`

  const res = await callAI(prompt, system)
  if (!res.ok) return res

  try {
    // Strip any accidental markdown fences the model may add
    const cleaned = res.reply.trim().replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '')
    const parsed = JSON.parse(cleaned) as {
      name?: string
      domain?: string
      summary?: string
      approxYear?: number | null
      lat?: number | null
      lng?: number | null
      wikipediaUrl?: string | null
    }
    const VALID_DOMAINS = ['history', 'geography', 'politics', 'religions', 'culture', 'science', 'modern_world']
    const name = parsed.name ?? query
    const id = `ai:${name.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40)}_${Date.now()}`
    return {
      ok: true,
      concept: {
        id,
        name,
        domain: VALID_DOMAINS.includes(parsed.domain ?? '') ? (parsed.domain as string) : 'history',
        summary: parsed.summary ?? '',
        approxYear: typeof parsed.approxYear === 'number' ? parsed.approxYear : null,
        eras: [],
        threads: [],
        lat: typeof parsed.lat === 'number' ? parsed.lat : null,
        lng: typeof parsed.lng === 'number' ? parsed.lng : null,
        wikipediaUrl: typeof parsed.wikipediaUrl === 'string' ? parsed.wikipediaUrl : null,
        imageUrl: null,
      },
    }
  } catch {
    return { ok: false, error: 'Could not parse AI response. Try a different search.' }
  }
}

/**
 * Generate a "did you know" connection between two concepts the user knows.
 */
export async function generateDidYouKnow(
  conceptA: string,
  summaryA: string,
  conceptB: string,
  summaryB: string,
): Promise<AIResponse> {
  const prompt = `Two historical concepts:
1. ${conceptA}: ${summaryA.slice(0, 200)}
2. ${conceptB}: ${summaryB.slice(0, 200)}

Write one surprising, vivid connection or contrast between them in 2 sentences.
Start with "Did you know..." Make it feel like a revelation, not a textbook.`
  return callAI(prompt, 'You are a passionate history enthusiast who loves surprising connections.')
}
