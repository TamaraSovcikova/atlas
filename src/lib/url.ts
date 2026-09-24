/**
 * Return `url` only if it is a plain http(s) link, else null. Blocks `javascript:`,
 * `data:`, `vbscript:` and every other scheme, so an AI-generated or community-pulled
 * URL can never become a live `href`/`src` that runs script when clicked.
 */
export function safeHttpUrl(url: unknown): string | null {
  if (typeof url !== 'string' || !url) return null
  const trimmed = url.trim()
  try {
    const u = new URL(trimmed)
    return u.protocol === 'https:' || u.protocol === 'http:' ? trimmed : null
  } catch {
    return null
  }
}
