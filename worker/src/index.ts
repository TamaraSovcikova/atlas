/**
 * Atlas sync Worker — bearer-token-as-account.
 *
 * The token a client sends in `Authorization: Bearer <token>` IS the account.
 * There is no sign-up, no password, no email: whoever holds the token owns that
 * row. So the token must be long and random (the client generates 32 hex chars).
 * One row per token stores the full backup payload produced by `lib/backup.ts`.
 *
 *   GET  /sync   -> { payload, updatedAt } | 404
 *   PUT  /sync   -> store body; { ok, updatedAt }
 *   GET  /health -> ok
 */

interface D1Result {
  results?: unknown[]
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = unknown>(col?: string): Promise<T | null>
  run(): Promise<D1Result>
}
interface D1Database {
  prepare(query: string): D1PreparedStatement
}

interface Env {
  DB: D1Database
}

const MIN_TOKEN_LEN = 16
const MAX_PAYLOAD_BYTES = 8 * 1024 * 1024 // 8 MB

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '86400',
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
}

function bearer(req: Request): string | null {
  const h = req.headers.get('Authorization') ?? ''
  const m = /^Bearer\s+(.+)$/i.exec(h.trim())
  const token = m?.[1]?.trim()
  if (!token || token.length < MIN_TOKEN_LEN) return null
  return token
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url)

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })

    if (url.pathname === '/health') return json({ ok: true })

    if (url.pathname !== '/sync') return json({ error: 'not found' }, 404)

    const token = bearer(req)
    if (!token) return json({ error: 'missing or too-short bearer token' }, 401)

    if (req.method === 'GET') {
      const row = await env.DB.prepare(
        'SELECT payload, updated_at FROM backups WHERE token = ?',
      )
        .bind(token)
        .first<{ payload: string; updated_at: number }>()
      if (!row) return json({ error: 'no backup for this token' }, 404)
      return json({ payload: JSON.parse(row.payload), updatedAt: row.updated_at })
    }

    if (req.method === 'PUT') {
      const text = await req.text()
      if (text.length > MAX_PAYLOAD_BYTES) return json({ error: 'payload too large' }, 413)
      let parsed: { app?: string }
      try {
        parsed = JSON.parse(text)
      } catch {
        return json({ error: 'body is not valid JSON' }, 400)
      }
      if (parsed.app !== 'atlas') return json({ error: 'not an Atlas backup' }, 400)
      const now = Date.now()
      await env.DB.prepare(
        `INSERT INTO backups (token, payload, updated_at) VALUES (?, ?, ?)
         ON CONFLICT(token) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`,
      )
        .bind(token, text, now)
        .run()
      return json({ ok: true, updatedAt: now })
    }

    return json({ error: 'method not allowed' }, 405)
  },
}
