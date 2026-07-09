/**
 * Atlas sync Worker — bearer-token-as-account (Wave 1) +
 * optional Google OAuth accounts (Wave 3) +
 * AI cascade endpoint (Wave 4).
 *
 * Anonymous sync (always works):
 *   GET  /sync   -> { payload, updatedAt } | 404
 *   PUT  /sync   -> store body; { ok, updatedAt }
 *   GET  /health -> { ok }
 *
 * Google OAuth (requires GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET + JWT_SECRET):
 *   GET  /auth/google/start    -> redirect to Google consent
 *   GET  /auth/google/callback -> exchange code, upsert user, mint session
 *   POST /auth/logout          -> revoke session
 *   GET  /me                   -> { id, email, plan_tier, ai_credits_used }
 *   POST /account/claim        -> merge anonymous blob into signed-in account
 *
 * AI cascade (Wave 4 — requires GEMINI_API_KEY or GROQ_API_KEY):
 *   POST /ai   -> { reply } | 503 if not configured
 */

// ---- D1 type shims (Cloudflare global types are not bundled in plain TS) ----

interface D1Result {
  results?: unknown[]
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = unknown>(col?: string): Promise<T | null>
  run(): Promise<D1Result>
  all<T = unknown>(): Promise<{ results: T[] }>
}
interface D1Database {
  prepare(query: string): D1PreparedStatement
}

interface Env {
  DB: D1Database
  // Optional — Wave 3 Google OAuth
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  JWT_SECRET?: string
  // Optional — Wave 4 AI cascade
  GEMINI_API_KEY?: string
  GROQ_API_KEY?: string
  AI_DAILY_CAP?: string // JSON number, default 500
}

// ---- Constants ----------------------------------------------------------------

const MIN_TOKEN_LEN = 16
const MAX_PAYLOAD_BYTES = 8 * 1024 * 1024 // 8 MB
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

// ---- CORS --------------------------------------------------------------------

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '86400',
}

// ---- Helpers -----------------------------------------------------------------

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
}

function redirect(url: string, status = 302): Response {
  return new Response(null, { status, headers: { Location: url, ...CORS } })
}

function bearer(req: Request): string | null {
  const h = req.headers.get('Authorization') ?? ''
  const m = /^Bearer\s+(.+)$/i.exec(h.trim())
  const token = m?.[1]?.trim()
  if (!token || token.length < MIN_TOKEN_LEN) return null
  return token
}

function randomId(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Resolve a session token -> user_id, or null if expired/invalid. */
async function resolveSession(
  db: D1Database,
  token: string,
): Promise<string | null> {
  const row = await db
    .prepare('SELECT user_id, expires_at FROM sessions WHERE token = ?')
    .bind(token)
    .first<{ user_id: string; expires_at: number }>()
  if (!row) return null
  if (row.expires_at < Date.now()) return null // expired
  return row.user_id
}

/**
 * Decide whether a given bearer token is a session token or an anonymous sync
 * token. Returns { mode: 'session', userId } or { mode: 'anon', token }.
 */
async function resolveToken(
  db: D1Database,
  token: string,
): Promise<{ mode: 'session'; userId: string } | { mode: 'anon'; token: string }> {
  const userId = await resolveSession(db, token)
  if (userId) return { mode: 'session', userId }
  return { mode: 'anon', token }
}

// ---- Route handlers ----------------------------------------------------------

async function handleSync(req: Request, env: Env): Promise<Response> {
  const token = bearer(req)
  if (!token) return json({ error: 'missing or too-short bearer token' }, 401)

  const resolved = await resolveToken(env.DB, token)

  if (req.method === 'GET') {
    let row: { payload: string; updated_at: number } | null
    if (resolved.mode === 'session') {
      row = await env.DB.prepare(
        'SELECT payload, updated_at FROM backups WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
      ).bind(resolved.userId).first()
    } else {
      row = await env.DB.prepare(
        'SELECT payload, updated_at FROM backups WHERE token = ?',
      ).bind(resolved.token).first()
    }
    if (!row) return json({ error: 'no backup for this token' }, 404)
    return json({ payload: JSON.parse(row.payload), updatedAt: row.updated_at })
  }

  if (req.method === 'PUT') {
    const text = await req.text()
    if (text.length > MAX_PAYLOAD_BYTES) return json({ error: 'payload too large' }, 413)
    let parsed: { app?: string }
    try { parsed = JSON.parse(text) } catch {
      return json({ error: 'body is not valid JSON' }, 400)
    }
    if (parsed.app !== 'atlas') return json({ error: 'not an Atlas backup' }, 400)
    const now = Date.now()

    if (resolved.mode === 'session') {
      await env.DB.prepare(
        `INSERT INTO backups (token, payload, updated_at, user_id)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(token) DO UPDATE SET payload = excluded.payload,
           updated_at = excluded.updated_at, user_id = excluded.user_id`,
      ).bind(`user:${resolved.userId}`, text, now, resolved.userId).run()
    } else {
      await env.DB.prepare(
        `INSERT INTO backups (token, payload, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT(token) DO UPDATE SET payload = excluded.payload,
           updated_at = excluded.updated_at`,
      ).bind(resolved.token, text, now).run()
    }
    return json({ ok: true, updatedAt: now })
  }

  return json({ error: 'method not allowed' }, 405)
}

async function handleGoogleStart(req: Request, env: Env): Promise<Response> {
  if (!env.GOOGLE_CLIENT_ID) {
    return json({ error: 'Google auth not configured on this server.' }, 503)
  }
  const state = randomId()
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: new URL('/auth/google/callback', req.url).toString(),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  })
  return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}

async function handleGoogleCallback(req: Request, env: Env): Promise<Response> {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return json({ error: 'Google auth not configured.' }, 503)
  }
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  if (!code) return json({ error: 'Missing code from Google.' }, 400)

  // Exchange code for tokens
  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: new URL('/auth/google/callback', req.url).toString(),
      grant_type: 'authorization_code',
    }),
  })
  if (!tokenRes.ok) return json({ error: 'Failed to exchange code.' }, 502)
  const { access_token } = (await tokenRes.json()) as { access_token: string }

  // Get user info
  const userRes = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  if (!userRes.ok) return json({ error: 'Failed to fetch user info.' }, 502)
  const gUser = (await userRes.json()) as { sub: string; email: string }

  // Upsert user in D1
  const now = Date.now()
  let user = await env.DB.prepare(
    'SELECT id FROM users WHERE provider = ? AND provider_sub = ?',
  ).bind('google', gUser.sub).first<{ id: string }>()

  if (!user) {
    const newId = randomId()
    await env.DB.prepare(
      'INSERT INTO users (id, provider, provider_sub, email, created_at) VALUES (?, ?, ?, ?, ?)',
    ).bind(newId, 'google', gUser.sub, gUser.email, now).run()
    user = { id: newId }
  } else {
    // Update email in case it changed
    await env.DB.prepare('UPDATE users SET email = ? WHERE id = ?')
      .bind(gUser.email, user.id).run()
  }

  // Mint session
  const sessionToken = randomId()
  await env.DB.prepare(
    'INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)',
  ).bind(sessionToken, user.id, now, now + SESSION_TTL_MS).run()

  // Return session to the popup via postMessage HTML
  const html = `<!DOCTYPE html><html><body><script>
    window.opener?.postMessage({ type:'atlas-auth', session:${JSON.stringify(sessionToken)} }, '*');
    window.close();
  </script><p>Signed in. You can close this window.</p></body></html>`
  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
}

async function handleLogout(req: Request, env: Env): Promise<Response> {
  const token = bearer(req)
  if (!token) return json({ error: 'no session' }, 401)
  await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run()
  return json({ ok: true })
}

async function handleMe(req: Request, env: Env): Promise<Response> {
  const token = bearer(req)
  if (!token) return json({ error: 'not authenticated' }, 401)
  const userId = await resolveSession(env.DB, token)
  if (!userId) return json({ error: 'session expired or invalid' }, 401)
  const user = await env.DB.prepare(
    'SELECT id, email, plan_tier, ai_credits_used FROM users WHERE id = ?',
  ).bind(userId).first<{ id: string; email: string; plan_tier: string; ai_credits_used: number }>()
  if (!user) return json({ error: 'user not found' }, 404)
  return json(user)
}

async function handleClaim(req: Request, env: Env): Promise<Response> {
  const token = bearer(req)
  if (!token) return json({ error: 'not authenticated' }, 401)
  const userId = await resolveSession(env.DB, token)
  if (!userId) return json({ error: 'session expired' }, 401)

  let body: { anonToken?: string }
  try { body = await req.json() } catch { return json({ error: 'invalid body' }, 400) }
  const anonToken = body.anonToken?.trim()
  if (!anonToken || anonToken.length < MIN_TOKEN_LEN) return json({ error: 'invalid token' }, 400)

  const row = await env.DB.prepare(
    'SELECT payload, updated_at FROM backups WHERE token = ?',
  ).bind(anonToken).first<{ payload: string; updated_at: number }>()
  if (!row) return json({ ok: true, merged: false }) // nothing to claim

  // Copy anonymous backup to the user_id keyed slot
  const now = Date.now()
  await env.DB.prepare(
    `INSERT INTO backups (token, payload, updated_at, user_id)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(token) DO UPDATE SET payload = excluded.payload,
       updated_at = excluded.updated_at, user_id = excluded.user_id`,
  ).bind(`user:${userId}`, row.payload, now, userId).run()

  return json({ ok: true, merged: true })
}

// ---- Wave 4: AI endpoint (stub — full cascade in Wave 4) --------------------

async function handleAI(req: Request, env: Env): Promise<Response> {
  if (!env.GEMINI_API_KEY && !env.GROQ_API_KEY) {
    return json({ error: 'AI not configured on this server. Use BYOK in Settings.' }, 503)
  }

  const token = bearer(req)
  let byok: string | null = null
  let body: { prompt?: string; system?: string; byokKey?: string; byokProvider?: string }
  try { body = await req.json() } catch { return json({ error: 'invalid body' }, 400) }

  byok = body.byokKey ?? null

  if (!body.prompt) return json({ error: 'prompt required' }, 400)

  // If user provided their own key, use it directly (no quota consumption)
  if (byok) {
    const provider = body.byokProvider ?? 'gemini'
    return callGemini(byok, body.prompt, body.system ?? '', true)
  }

  // Pooled path: check rate limits (simple global cap via D1)
  const capEnv = parseInt(env.AI_DAILY_CAP ?? '500', 10)
  const dayKey = `ai:day:${new Date().toISOString().slice(0, 10)}`
  // The counter reuses the backups table (token = dayKey), storing the count in
  // the `payload` column — there is no `value` column, so reading one throws a
  // D1 exception, which Cloudflare surfaces as a 1101 (500) WITHOUT CORS headers,
  // which the browser then reports to the app as "Network error: failed to fetch".
  const capRow = await env.DB.prepare(
    'SELECT payload FROM backups WHERE token = ?',
  ).bind(dayKey).first<{ payload?: string }>()
  const todayCount = parseInt(capRow?.payload ?? '0', 10)
  if (todayCount >= capEnv) {
    return json({ error: 'Daily AI cap reached. Try again tomorrow or add your own key in Settings.' }, 429)
  }

  // Per-user rate limit if signed-in
  if (token) {
    const userId = await resolveSession(env.DB, token)
    if (userId) {
      const user = await env.DB.prepare(
        'SELECT plan_tier, ai_credits_used, ai_window_start FROM users WHERE id = ?',
      ).bind(userId).first<{ plan_tier: string; ai_credits_used: number; ai_window_start: number }>()
      if (user) {
        const windowMs = 30 * 24 * 60 * 60 * 1000
        const windowStart = Date.now() - windowMs
        const creditsInWindow = user.ai_window_start < windowStart ? 0 : user.ai_credits_used
        const monthlyLimit = user.plan_tier === 'tester' ? 200 : user.plan_tier === 'pro' ? Infinity : 20
        if (creditsInWindow >= monthlyLimit) {
          return json({ error: 'Monthly AI credit limit reached. Add your own key in Settings for unlimited use.' }, 429)
        }
        // Increment credits
        const newStart = user.ai_window_start < windowStart ? Date.now() : user.ai_window_start
        await env.DB.prepare(
          'UPDATE users SET ai_credits_used = ?, ai_window_start = ? WHERE id = ?',
        ).bind(creditsInWindow + 1, newStart, userId).run()
      }
    }
  }

  // Increment global daily cap
  const newCount = todayCount + 1
  await env.DB.prepare(
    `INSERT INTO backups (token, payload, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(token) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`,
  ).bind(dayKey, String(newCount), Date.now()).run()

  // Try Gemini, cascade to Groq on any failure (quota, 502, exception).
  if (env.GEMINI_API_KEY) {
    const res = await callGemini(env.GEMINI_API_KEY, body.prompt, body.system ?? '', false)
    if (res.ok) return res
    if (env.GROQ_API_KEY) return callGroq(env.GROQ_API_KEY, body.prompt, body.system ?? '')
    return res
  }
  if (env.GROQ_API_KEY) {
    return callGroq(env.GROQ_API_KEY, body.prompt, body.system ?? '')
  }

  return json({ error: 'No AI provider available.' }, 503)
}

async function callGemini(apiKey: string, prompt: string, system: string, isByok: boolean): Promise<Response> {
  try {
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: system ? { parts: [{ text: system }] } : undefined,
      generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
    }
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    )
    if (res.status === 429 && !isByok) {
      // quota exhausted on flash-lite; cascade handled at caller level
      return json({ error: 'quota', _cascade: true }, 429)
    }
    if (!res.ok) {
      const err = await res.text()
      return json({ error: `Gemini error: ${err.slice(0, 200)}` }, 502)
    }
    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    return json({ reply })
  } catch (e) {
    return json({ error: String(e) }, 502)
  }
}

async function callGroq(apiKey: string, prompt: string, system: string): Promise<Response> {
  try {
    const body = {
      model: 'llama-3.1-8b-instant',
      messages: [
        ...(system ? [{ role: 'system', content: system }] : []),
        { role: 'user', content: prompt },
      ],
      max_tokens: 512,
      temperature: 0.7,
    }
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.text()
      return json({ error: `Groq error: ${err.slice(0, 200)}` }, 502)
    }
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const reply = data.choices?.[0]?.message?.content ?? ''
    return json({ reply })
  } catch (e) {
    return json({ error: String(e) }, 502)
  }
}

// ---- Main fetch handler -------------------------------------------------------

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url)
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
    // Wrap every handler so an unexpected exception still returns JSON WITH CORS
    // headers. A bare thrown error becomes a Cloudflare 1101 with no CORS, which
    // the browser reports to the app as an opaque "failed to fetch".
    try {
      if (url.pathname === '/health') return json({ ok: true })
      if (url.pathname === '/sync') return await handleSync(req, env)
      if (url.pathname === '/auth/google/start') return await handleGoogleStart(req, env)
      if (url.pathname === '/auth/google/callback') return await handleGoogleCallback(req, env)
      if (url.pathname === '/auth/logout' && req.method === 'POST') return await handleLogout(req, env)
      if (url.pathname === '/me') return await handleMe(req, env)
      if (url.pathname === '/account/claim' && req.method === 'POST') return await handleClaim(req, env)
      if (url.pathname === '/ai' && req.method === 'POST') return await handleAI(req, env)
      return json({ error: 'not found' }, 404)
    } catch (e) {
      return json({ error: `Server error: ${(e as Error).message}` }, 500)
    }
  },
}
