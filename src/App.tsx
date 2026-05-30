import { useEffect, useState } from 'react'
import { DailySession, type Mode } from './components/DailySession'
import { db } from './db/schema'
import { loadSeedIfNeeded } from './db/seed'
import { useSettings } from './store/useSettings'
import { MotionProvider } from './components/ui/motion'

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
        <p className="animate-pulse text-ink-soft">Loading Atlas...</p>
      </main>
    )
  }

  return (
    <MotionProvider>
      <main className="mx-auto flex min-h-full max-w-2xl flex-col px-5 py-8 sm:px-6 sm:py-10">
        <header className="mb-8 flex items-start justify-between">
          <button type="button" onClick={() => setMode({ kind: 'home' })} className="text-left">
            <h1 className="bg-accent-grad bg-clip-text font-serif text-3xl font-semibold tracking-tight text-transparent">
              Atlas
            </h1>
            <p className="mt-1 text-sm text-ink-softer">
              Ten minutes a day. Forgetting is the learning happening.
            </p>
          </button>
          <div className="flex items-center gap-1.5">
            <IconButton label="Constellation" onClick={() => setMode({ kind: 'constellation' })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="2.2" />
                <circle cx="5" cy="6" r="1.4" />
                <circle cx="19" cy="7" r="1.4" />
                <circle cx="18" cy="17" r="1.4" />
                <circle cx="6" cy="18" r="1.4" />
                <path d="M12 12 5 6M12 12l7-5M12 12l6 5M12 12l-6 6" opacity="0.5" />
              </svg>
            </IconButton>
            <IconButton label="Settings" onClick={() => setMode({ kind: 'settings' })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </IconButton>
          </div>
        </header>
        <DailySession mode={mode} setMode={setMode} />
      </main>
    </MotionProvider>
  )
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-full border border-white/10 bg-bg-soft p-2 text-ink-softer transition-colors hover:border-accent/50 hover:text-ink"
    >
      {children}
    </button>
  )
}

export default App
