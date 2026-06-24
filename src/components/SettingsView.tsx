import { useEffect, useRef, useState } from 'react'
import { useSettings } from '../store/useSettings'
import {
  INTENSITY_LABEL,
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

  useEffect(() => {
    getSyncToken().then((t) => setToken(t ?? ''))
    getLastSyncedAt().then(setLastSynced)
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
          label="Sort into groups"
          desc="Drop concepts into the right category."
          value={prefs.enableSort}
          onChange={(v) => update({ enableSort: v })}
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
