import { useEffect, useState } from 'react'
import { DailySession, type Mode } from './components/DailySession'
import { db } from './db/schema'
import { loadSeedIfNeeded } from './db/seed'
import { useSettings } from './store/useSettings'

function App() {
  const [ready, setReady] = useState(false)
  const [mode, setMode] = useState<Mode>({ kind: 'home' })
  const loadSettings = useSettings((s) => s.load)

  useEffect(() => {
    let cancelled = false
    async function init() {
      await db.open()
      await loadSeedIfNeeded()
      await loadSettings()
      if (!cancelled) setReady(true)
    }
    init()
    return () => {
      cancelled = true
    }
  }, [loadSettings])

  if (!ready) {
    return (
      <main className="flex h-full items-center justify-center">
        <p className="text-ink-soft">Loading...</p>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-full max-w-2xl flex-col px-6 py-10">
      <header className="mb-10 flex items-start justify-between">
        <button type="button" onClick={() => setMode({ kind: 'home' })} className="text-left">
          <h1 className="font-serif text-3xl font-medium tracking-tight">Atlas</h1>
          <p className="mt-1 text-sm text-ink-softer">
            Ten minutes a day. Forgetting is the learning happening.
          </p>
        </button>
        <button
          type="button"
          onClick={() => setMode({ kind: 'settings' })}
          aria-label="Settings"
          className="rounded-full border border-bg-softer/40 p-2 text-ink-softer transition-colors hover:border-accent/50 hover:text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </header>
      <DailySession mode={mode} setMode={setMode} />
    </main>
  )
}

export default App
