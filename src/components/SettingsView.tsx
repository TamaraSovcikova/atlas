import { useEffect, useRef, useState } from 'react'
import { useSettings } from '../store/useSettings'
import {
  INTENSITY_LABEL,
  KNOWLEDGE_LEVELS,
  KNOWLEDGE_LEVEL_LABEL,
  GOAL_OPTIONS,
  MAX_STREAK_FREEZES,
  type Intensity,
  type Theme,
} from '../lib/settings'
import { downloadBackup, importBackup } from '../lib/backup'
import {
  ensureSyncToken,
  getSyncToken,
  setSyncToken,
  generateToken,
  getLastSyncedAt,
  pushToCloud,
  pullFromCloud,
} from '../lib/sync'
import {
  fetchUser,
  signInWithGoogle,
  signOut as googleSignOut,
  getCachedUser,
  claimAnonymousBackup,
  type AtlasUser,
} from '../lib/auth'
import { getByokKey, setByokKey } from '../lib/ai'
import { repullForLevel } from '../lib/community'
import { MetricsPanel } from './MetricsPanel'

const INTENSITIES: Intensity[] = ['playful', 'balanced', 'serious']
const THEMES: { key: Theme; label: string }[] = [
  { key: 'dark', label: 'Dark' },
  { key: 'light', label: 'Light' },
]

interface Props {
  canInstall: boolean
  onInstall: () => void
}

export function SettingsView({ canInstall, onInstall }: Props) {
  const prefs = useSettings((s) => s.prefs)
  const update = useSettings((s) => s.update)
  const fileRef = useRef<HTMLInputElement>(null)
  const [backupMsg, setBackupMsg] = useState<string | null>(null)

  const [token, setToken] = useState('')
  const [revealToken, setRevealToken] = useState(false)
  const [lastSynced, setLastSynced] = useState<number | null>(null)
  const [syncMsg, setSyncMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // Account state (Wave 3)
  const [user, setUser] = useState<AtlasUser | null>(null)
  const [accountMsg, setAccountMsg] = useState<string | null>(null)
  const [accountBusy, setAccountBusy] = useState(false)

  // BYOK AI key (Wave 4)
  const [byokKey, setByokKeyState] = useState('')
  const [revealByok, setRevealByok] = useState(false)
  const [byokMsg, setByokMsg] = useState<string | null>(null)

  useEffect(() => {
    getSyncToken().then((t) => setToken(t ?? ''))
    getLastSyncedAt().then(setLastSynced)
    getCachedUser().then(setUser)
    getByokKey().then((k) => setByokKeyState(k ?? ''))
    // Revalidate in background
    fetchUser().then((u) => { if (u) setUser(u) })
  }, [])

  async function onImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBackupMsg('Restoring…')
    const text = await file.text()
    const result = await importBackup(text)
    setBackupMsg(result.message)
    if (result.ok) setTimeout(() => window.location.reload(), 800)
  }

  async function onPush() {
    setBusy(true)
    setSyncMsg('Backing up…')
    await ensureSyncToken()
    const t = await getSyncToken()
    setToken(t ?? '')
    const res = await pushToCloud()
    setSyncMsg(res.message)
    setLastSynced(await getLastSyncedAt())
    setBusy(false)
  }

  async function onPull() {
    setBusy(true)
    setSyncMsg('Pulling…')
    const res = await pullFromCloud()
    setSyncMsg(res.message)
    if (res.ok) setTimeout(() => window.location.reload(), 900)
    else setBusy(false)
  }

  async function onSaveToken() {
    const t = token.trim()
    if (t.length < 16) {
      setSyncMsg('A sync token needs to be at least 16 characters.')
      return
    }
    await setSyncToken(t)
    setSyncMsg('Token saved on this device.')
  }

  async function onRegenerate() {
    const t = generateToken()
    await setSyncToken(t)
    setToken(t)
    setSyncMsg('New token generated. Push to start a fresh cloud backup.')
  }

  async function onSignIn() {
    setAccountBusy(true)
    setAccountMsg(null)
    try {
      const anonToken = await getSyncToken()
      const u = await signInWithGoogle()
      setUser(u)
      if (anonToken) {
        const claimed = await claimAnonymousBackup(anonToken)
        setAccountMsg(
          claimed
            ? `Signed in as ${u.email}. Your progress was merged into your account.`
            : `Signed in as ${u.email}.`,
        )
      } else {
        setAccountMsg(`Signed in as ${u.email}.`)
      }
    } catch (e) {
      setAccountMsg((e as Error).message)
    } finally {
      setAccountBusy(false)
    }
  }

  async function onSignOut() {
    setAccountBusy(true)
    await googleSignOut()
    setUser(null)
    setAccountMsg('Signed out.')
    setAccountBusy(false)
  }

  return (
    <section className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl">Settings</h2>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-ink">Daily goal</h3>
        <p className="text-xs text-ink-softer">
          Cards a day that count as done and keep your streak alive.
        </p>
        <div className="grid grid-cols-4 gap-2">
          {GOAL_OPTIONS.map((g) => {
            const active = prefs.dailyGoalCards === g
            return (
              <button
                key={g}
                type="button"
                onClick={() => update({ dailyGoalCards: g })}
                className={`rounded-2xl border py-3 text-center transition-colors ${
                  active
                    ? 'border-accent/70 bg-accent/10 text-accent'
                    : 'border-bg-softer/40 bg-bg-soft/50 text-ink hover:border-accent/40'
                }`}
              >
                <span className="block text-lg font-semibold tabular-nums">{g}</span>
                <span className="block text-[10px] uppercase tracking-wide text-ink-softer">
                  cards
                </span>
              </button>
            )
          })}
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-bg-softer/40 bg-bg-soft/50 p-4">
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-ink">🛡️ Streak freezes</span>
            <span className="block text-xs text-ink-softer">
              They bridge a missed day so one gap doesn't reset your streak.
            </span>
          </span>
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              aria-label="Fewer freezes"
              disabled={prefs.streakFreezes <= 0}
              onClick={() => update({ streakFreezes: Math.max(0, prefs.streakFreezes - 1) })}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-bg-softer/40 text-ink-soft transition-colors hover:border-accent/40 disabled:opacity-30"
            >
              −
            </button>
            <span className="w-5 text-center text-lg font-semibold tabular-nums text-ink">
              {prefs.streakFreezes}
            </span>
            <button
              type="button"
              aria-label="More freezes"
              disabled={prefs.streakFreezes >= MAX_STREAK_FREEZES}
              onClick={() =>
                update({ streakFreezes: Math.min(MAX_STREAK_FREEZES, prefs.streakFreezes + 1) })
              }
              className="flex h-8 w-8 items-center justify-center rounded-full border border-bg-softer/40 text-ink-soft transition-colors hover:border-accent/40 disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-ink">Appearance</h3>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((t) => {
            const active = prefs.theme === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => update({ theme: t.key })}
                className={`rounded-2xl border py-3 text-center text-sm transition-colors ${
                  active
                    ? 'border-accent/70 bg-accent/10 text-accent'
                    : 'border-bg-softer/40 bg-bg-soft/50 text-ink hover:border-accent/40'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>
        <Toggle
          label="Due count on app icon"
          desc="Badge the installed app icon with how many reviews are waiting."
          value={prefs.dueBadge}
          onChange={(v) => update({ dueBadge: v })}
        />
        <Toggle
          label="Listen mode"
          desc="Auto-read concept briefs aloud using your device's voice. Good for hands-free sessions."
          value={prefs.listenMode}
          onChange={(v) => update({ listenMode: v })}
        />
        {prefs.listenMode && (
          <div className="rounded-2xl border border-ink/[0.08] bg-bg-soft px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">Reading speed</span>
              <span className="text-sm tabular-nums text-ink-soft">{(prefs.speechRate ?? 1.0).toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={prefs.speechRate ?? 1.0}
              onChange={(e) => update({ speechRate: parseFloat(e.target.value) })}
              className="mt-2 w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-[10px] text-ink-softer">
              <span>Slow</span>
              <span>Normal</span>
              <span>Fast</span>
            </div>
          </div>
        )}
        {canInstall && (
          <button
            type="button"
            onClick={onInstall}
            className="w-full rounded-2xl border border-accent/40 bg-accent/10 py-3 text-sm text-accent transition-colors hover:bg-accent/15"
          >
            Install Atlas on this device
          </button>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-ink">Knowledge level</h3>
        <p className="text-xs text-ink-softer">
          How deep new material starts. Changes apply from your next session.
        </p>
        <div className="space-y-2" role="radiogroup" aria-label="Knowledge level">
          {KNOWLEDGE_LEVELS.map((key) => {
            const active = prefs.knowledgeLevel === key
            const label = KNOWLEDGE_LEVEL_LABEL[key]
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  update({ knowledgeLevel: key })
                  // Re-scan the community bank so already-downloaded per-level
                  // variants (§E5) upgrade to this reader's depth, not just cards
                  // pulled after the change. Best-effort, online-only.
                  void repullForLevel(key)
                }}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  active
                    ? 'border-accent/70 bg-accent/10'
                    : 'border-bg-softer/40 bg-bg-soft/50 hover:border-accent/40'
                }`}
              >
                <p className={`text-sm font-medium ${active ? 'text-accent' : 'text-ink'}`}>
                  {label.title}
                </p>
                <p className="mt-0.5 text-xs text-ink-softer">{label.blurb}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-ink">How you study</h3>
        <div className="space-y-2">
          {INTENSITIES.map((key) => {
            const active = prefs.intensity === key
            const label = INTENSITY_LABEL[key]
            return (
              <button
                key={key}
                type="button"
                onClick={() => update({ intensity: key })}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  active
                    ? 'border-accent/70 bg-accent/10'
                    : 'border-bg-softer/40 bg-bg-soft/50 hover:border-accent/40'
                }`}
              >
                <p className={`text-sm font-medium ${active ? 'text-accent' : 'text-ink'}`}>
                  {label.title}
                </p>
                <p className="mt-0.5 text-xs text-ink-softer">{label.blurb}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-ink">Fine tuning</h3>
        <Toggle
          label="Minimise typing"
          desc="Always use tap-the-chip recall instead of the keyboard, even in Serious."
          value={prefs.minimiseTyping}
          onChange={(v) => update({ minimiseTyping: v })}
        />
        <Toggle
          label="Constellation reveal"
          desc="Show the connection map react after each answer."
          value={prefs.showConstellationReveal}
          onChange={(v) => update({ showConstellationReveal: v })}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-ink">Games</h3>
        <Toggle
          label="Timeline ordering"
          desc="Tap events into chronological order."
          value={prefs.enableOrder}
          onChange={(v) => update({ enableOrder: v })}
        />
        <Toggle
          label="Tap on the map"
          desc="Find places on a world map."
          value={prefs.enableMap}
          onChange={(v) => update({ enableMap: v })}
        />
        <Toggle
          label="Pick-the-answer cards"
          desc="Discriminative multiple choice for tricky pairs."
          value={prefs.enableContrast}
          onChange={(v) => update({ enableContrast: v })}
        />
        <Toggle
          label="Connect the pair"
          desc="Match concepts to their related partner."
          value={prefs.enablePair}
          onChange={(v) => update({ enablePair: v })}
        />
        <Toggle
          label="Odd one out"
          desc="Spot the concept that doesn't fit the group."
          value={prefs.enableOdd}
          onChange={(v) => update({ enableOdd: v })}
        />
        <Toggle
          label="Timeline drop"
          desc="Slot one event into a mini-timeline you know."
          value={prefs.enableDrop}
          onChange={(v) => update({ enableDrop: v })}
        />
        <Toggle
          label="Guess the era"
          desc="Clues reveal one at a time — name the era."
          value={prefs.enableEraGuess}
          onChange={(v) => update({ enableEraGuess: v })}
        />
        <Toggle
          label="Two truths & a myth"
          desc="Three statements about a concept — spot the false one."
          value={prefs.enableMyth}
          onChange={(v) => update({ enableMyth: v })}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-ink">Backup</h3>
        <p className="text-xs text-ink-softer">
          Your progress lives in this browser. Export a file to keep it safe or move it to another
          device. Importing replaces everything here with the backup.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => downloadBackup()}
            className="rounded-2xl border border-bg-softer/40 bg-bg-soft/50 py-3 text-sm text-ink transition-colors hover:border-accent/40"
          >
            Export backup
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-2xl border border-bg-softer/40 bg-bg-soft/50 py-3 text-sm text-ink transition-colors hover:border-accent/40"
          >
            Import backup
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={onImportFile}
          className="hidden"
        />
        {backupMsg && <p className="text-xs text-accent">{backupMsg}</p>}
      </div>

      {/* Insights (§E6) — local-only usage rollup */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-ink">Insights</h3>
        <p className="text-xs text-ink-softer">
          A private, on-device record of how you use Atlas. Nothing here is ever sent anywhere.
        </p>
        <MetricsPanel />
      </div>

      {/* Account (Wave 3) */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-ink">Account</h3>
        {user ? (
          <div className="rounded-2xl border border-bg-softer/40 bg-bg-soft/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{user.email}</p>
                <p className="text-xs text-ink-softer capitalize">{user.planTier} plan</p>
              </div>
              <button
                type="button"
                disabled={accountBusy}
                onClick={onSignOut}
                className="shrink-0 rounded-xl border border-bg-softer/40 px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-accent/40 disabled:opacity-50"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-ink-softer">
              Optional. Sign in with Google to sync your progress across devices without copying a token.
              The app works fully without an account.
            </p>
            <button
              type="button"
              disabled={accountBusy}
              onClick={onSignIn}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-bg-softer/40 bg-bg-soft/50 py-3 text-sm text-ink transition-colors hover:border-accent/40 disabled:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {accountBusy ? 'Opening…' : 'Sign in with Google'}
            </button>
          </div>
        )}
        {accountMsg && <p className="text-xs text-accent">{accountMsg}</p>}
      </div>

      {/* AI key (Wave 4) */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-ink">AI (optional)</h3>
        <p className="text-xs text-ink-softer">
          Add your own free Gemini API key for unlimited Ask-the-past, explain-my-answer, and
          did-you-know cards. Without a key, Atlas uses a shared pool with a daily cap.{' '}
          <span className="text-ink-soft">Get a free key at ai.google.dev/gemini-api.</span>
        </p>
        <div className="rounded-2xl border border-bg-softer/40 bg-bg-soft/50 p-3">
          <div className="flex items-center gap-2">
            <input
              type={revealByok ? 'text' : 'password'}
              value={byokKey}
              onChange={(e) => setByokKeyState(e.target.value)}
              placeholder="AIza… (optional)"
              className="min-w-0 flex-1 rounded-lg border border-bg-softer/40 bg-bg px-3 py-2 font-mono text-xs text-ink placeholder:text-ink-softer/60 focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setRevealByok((r) => !r)}
              className="shrink-0 rounded-lg border border-bg-softer/40 px-2 py-2 text-[11px] text-ink-softer hover:text-ink"
            >
              {revealByok ? 'hide' : 'show'}
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={async () => {
                await setByokKey(byokKey || null)
                setByokMsg(byokKey ? 'Key saved on this device.' : 'Key cleared.')
              }}
              className="rounded-lg border border-bg-softer/40 px-3 py-1.5 text-[11px] text-ink-soft hover:border-accent/40"
            >
              Save key
            </button>
            {byokKey && (
              <button
                type="button"
                onClick={async () => {
                  setByokKeyState('')
                  await setByokKey(null)
                  setByokMsg('Key cleared.')
                }}
                className="rounded-lg border border-bg-softer/40 px-3 py-1.5 text-[11px] text-ink-soft hover:border-accent/40"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        {byokMsg && <p className="text-xs text-accent">{byokMsg}</p>}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-ink">Cloud sync</h3>
        <p className="text-xs text-ink-softer">
          No login. Your sync token <em>is</em> your account — keep it secret and reuse it on another
          device to pull your progress. Pulling replaces local data with the cloud copy.
        </p>

        <div className="rounded-2xl border border-bg-softer/40 bg-bg-soft/50 p-3">
          <div className="flex items-center gap-2">
            <input
              type={revealToken ? 'text' : 'password'}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="No token yet — push to create one"
              className="min-w-0 flex-1 rounded-lg border border-bg-softer/40 bg-bg px-3 py-2 font-mono text-xs text-ink placeholder:text-ink-softer/60 focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setRevealToken((r) => !r)}
              className="shrink-0 rounded-lg border border-bg-softer/40 px-2 py-2 text-[11px] text-ink-softer hover:text-ink"
            >
              {revealToken ? 'hide' : 'show'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (token) navigator.clipboard?.writeText(token)
                setSyncMsg('Token copied.')
              }}
              className="shrink-0 rounded-lg border border-bg-softer/40 px-2 py-2 text-[11px] text-ink-softer hover:text-ink"
            >
              copy
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={onSaveToken}
              className="rounded-lg border border-bg-softer/40 px-3 py-1.5 text-[11px] text-ink-soft hover:border-accent/40"
            >
              Save token
            </button>
            <button
              type="button"
              onClick={onRegenerate}
              className="rounded-lg border border-bg-softer/40 px-3 py-1.5 text-[11px] text-ink-soft hover:border-accent/40"
            >
              Generate new
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={onPush}
            className="rounded-2xl border border-accent/40 bg-accent/10 py-3 text-sm text-accent transition-colors hover:bg-accent/15 disabled:opacity-50"
          >
            Push to cloud
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onPull}
            className="rounded-2xl border border-bg-softer/40 bg-bg-soft/50 py-3 text-sm text-ink transition-colors hover:border-accent/40 disabled:opacity-50"
          >
            Pull from cloud
          </button>
        </div>
        {lastSynced && (
          <p className="text-[11px] text-ink-softer">
            Last synced {new Date(lastSynced).toLocaleString()}
          </p>
        )}
        {syncMsg && <p className="text-xs text-accent">{syncMsg}</p>}
      </div>
    </section>
  )
}

function Toggle({
  label,
  desc,
  value,
  onChange,
}: {
  label: string
  desc: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-bg-softer/40 bg-bg-soft/50 p-4 text-left"
    >
      <span>
        <span className="block text-sm text-ink">{label}</span>
        <span className="block text-xs text-ink-softer">{desc}</span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          value ? 'bg-accent' : 'bg-bg-softer'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-bg transition-transform ${
            value ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  )
}
