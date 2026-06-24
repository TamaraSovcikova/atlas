import { db } from '../db/schema'
import { SYNC_URL } from './sync'

/**
 * Optional Google OAuth account layer (Wave 3).
 *
 * Architecture: the Worker handles the OAuth handshake and issues a session
 * token. The client stores that token in IndexedDB settings under 'accountSession'
 * and sends it as a Bearer to all sync/AI endpoints — exactly like the anonymous
 * sync token, but keyed by user_id in D1 instead of by the raw token value.
 *
 * This means lib/sync.ts barely changes: getBestToken() prefers the session
 * token over the anonymous one, and the Worker dispatches on which key type it
 * sees.
 *
 * Requires Worker secrets: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET.
 * Without those the Worker returns 503 and we show a friendly message.
 */

const SESSION_KEY = 'accountSession'
const USER_CACHE_KEY = 'accountUser'

export interface AtlasUser {
  id: string
  email: string
  planTier: 'free' | 'tester' | 'pro'
  aiCreditsUsed: number
}

export async function getAccountSession(): Promise<string | null> {
  const row = await db.settings.get(SESSION_KEY)
  return (row?.value as string | undefined) ?? null
}

export async function setAccountSession(token: string): Promise<void> {
  await db.settings.put({ key: SESSION_KEY, value: token })
}

export async function clearAccountSession(): Promise<void> {
  await db.settings.delete(SESSION_KEY)
  await db.settings.delete(USER_CACHE_KEY)
}

/** Cached user profile — null means not signed in or not yet loaded. */
export async function getCachedUser(): Promise<AtlasUser | null> {
  const row = await db.settings.get(USER_CACHE_KEY)
  return (row?.value as AtlasUser | undefined) ?? null
}

async function cacheUser(user: AtlasUser): Promise<void> {
  await db.settings.put({ key: USER_CACHE_KEY, value: user })
}

/**
 * Fetch the current user from the Worker. Returns null if not signed in or
 * if the Worker hasn't had OAuth credentials configured yet.
 */
export async function fetchUser(): Promise<AtlasUser | null> {
  const session = await getAccountSession()
  if (!session) return null
  try {
    const res = await fetch(`${SYNC_URL}/me`, {
      headers: { Authorization: `Bearer ${session}` },
    })
    if (!res.ok) {
      if (res.status === 401) await clearAccountSession()
      return null
    }
    const raw = (await res.json()) as {
      id: string; email: string; plan_tier: string;
      ai_credits_used: number
    }
    const user: AtlasUser = {
      id: raw.id,
      email: raw.email,
      planTier: (raw.plan_tier ?? 'free') as AtlasUser['planTier'],
      aiCreditsUsed: raw.ai_credits_used ?? 0,
    }
    await cacheUser(user)
    return user
  } catch {
    return null
  }
}

/**
 * Open the Google OAuth flow. The Worker generates a Google auth URL with a
 * state parameter; we open it in a popup (PWA-friendly) and listen for the
 * postMessage that carries the session token back.
 *
 * If the Worker hasn't had GOOGLE_CLIENT_ID configured yet, this throws with
 * a user-friendly message.
 */
export async function signInWithGoogle(): Promise<AtlasUser> {
  // Step 1: get the auth URL from the Worker
  const startRes = await fetch(`${SYNC_URL}/auth/google/start`, {
    headers: { Accept: 'application/json' },
  })
  if (startRes.status === 503) {
    throw new Error('Google sign-in is not enabled yet. Check back soon.')
  }
  if (!startRes.ok) {
    throw new Error(`Could not start sign-in (${startRes.status}).`)
  }
  const { url } = (await startRes.json()) as { url: string }

  // Step 2: open a popup and wait for the session token via postMessage
  return new Promise((resolve, reject) => {
    const popup = window.open(url, 'atlas-signin', 'width=500,height=640,noopener')
    if (!popup) {
      reject(new Error('Popup blocked. Allow popups for this site and try again.'))
      return
    }

    const timer = setTimeout(() => {
      cleanup()
      reject(new Error('Sign-in timed out. Please try again.'))
    }, 5 * 60 * 1000)

    function cleanup() {
      clearTimeout(timer)
      window.removeEventListener('message', onMessage)
    }

    async function onMessage(e: MessageEvent) {
      if (e.origin !== new URL(SYNC_URL).origin) return
      if (e.data?.type !== 'atlas-auth') return
      cleanup()
      popup?.close()
      if (e.data.error) {
        reject(new Error(e.data.error))
        return
      }
      const { session } = e.data as { session: string }
      await setAccountSession(session)
      const user = await fetchUser()
      if (!user) {
        reject(new Error('Signed in but could not load profile. Try again.'))
        return
      }
      resolve(user)
    }

    window.addEventListener('message', onMessage)
  })
}

/**
 * Sign out: revoke the server session and clear local state.
 */
export async function signOut(): Promise<void> {
  const session = await getAccountSession()
  if (session) {
    await fetch(`${SYNC_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session}` },
    }).catch(() => {}) // best-effort
  }
  await clearAccountSession()
}

/**
 * After signing in for the first time, call this to merge the anonymous backup
 * into the new account on the server side. Returns true on success.
 */
export async function claimAnonymousBackup(anonToken: string): Promise<boolean> {
  const session = await getAccountSession()
  if (!session) return false
  try {
    const res = await fetch(`${SYNC_URL}/account/claim`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ anonToken }),
    })
    return res.ok
  } catch {
    return false
  }
}
