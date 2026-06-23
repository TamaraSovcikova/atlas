import { useEffect, useState } from 'react'
import { db, type Domain } from './db/schema'
import { loadSeedIfNeeded } from './db/seed'
import { useSettings } from './store/useSettings'
import { MotionProvider } from './components/ui/motion'
import { BottomNav, type Tab } from './components/BottomNav'
import { HomeView } from './components/HomeView'
import { BrowseView } from './components/BrowseView'
import { PathwayView } from './components/PathwayView'
import { StatsView } from './components/StatsView'
import { SettingsView } from './components/SettingsView'
import { SessionView } from './components/SessionView'
import { ConstellationScreen } from './components/ConstellationScreen'
import { Onboarding } from './components/Onboarding'

const ONBOARDED_KEY = 'onboarded:v1'

export type SessionConfig =
  | { shape: 'daily' }
  | { shape: 'era'; eraId: string }
  | { shape: 'domain'; domain: Domain }
  | { shape: 'thread'; threadId: string }
  | { shape: 'spaced' }
  | { shape: 'mistakes' }

function App() {
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState<Tab>('today')
  const [session, setSession] = useState<{ config: SessionConfig; returnTo: Tab } | null>(null)
  const [constellationOpen, setConstellationOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const loadSettings = useSettings((s) => s.load)

  useEffect(() => {
    let cancelled = false
    async function init() {
      await db.open()
      await loadSeedIfNeeded()
      await loadSettings()
      const onboarded = await db.settings.get(ONBOARDED_KEY)
      if (!cancelled) {
        setShowOnboarding(!onboarded?.value)
        setReady(true)
      }
    }
    init()
    return () => {
      cancelled = true
    }
  }, [loadSettings])

  async function finishOnboarding() {
    await db.settings.put({ key: ONBOARDED_KEY, value: true })
    setShowOnboarding(false)
  }

  function startSession(config: SessionConfig, returnTo: Tab = tab) {
    setConstellationOpen(false)
    setSession({ config, returnTo })
  }

  function endSession() {
    const returnTo = session?.returnTo ?? 'today'
    setSession(null)
    setTab(returnTo)
  }

  if (!ready) {
    return (
      <main className="flex h-full items-center justify-center">
        <p className="animate-pulse text-ink-soft">Loading Atlas…</p>
      </main>
    )
  }

  // First-run explainer — full screen, before anything else
  if (showOnboarding) {
    return (
      <MotionProvider>
        <main className="min-h-full">
          <Onboarding onDone={finishOnboarding} />
        </main>
      </MotionProvider>
    )
  }

  // Session overlay — full screen, no bottom nav
  if (session) {
    const cfg = session.config
    return (
      <MotionProvider>
        <main className="mx-auto flex min-h-full max-w-2xl flex-col px-5 py-8 sm:px-6 sm:py-10">
          <SessionView
            shape={cfg.shape}
            eraId={cfg.shape === 'era' ? cfg.eraId : null}
            domain={cfg.shape === 'domain' ? cfg.domain : null}
            threadId={cfg.shape === 'thread' ? cfg.threadId : null}
            onFinished={endSession}
            onCancel={endSession}
          />
        </main>
      </MotionProvider>
    )
  }

  // Constellation overlay — full screen, no bottom nav
  if (constellationOpen) {
    return (
      <MotionProvider>
        <main className="mx-auto flex min-h-full max-w-2xl flex-col px-5 py-8 sm:px-6 sm:py-10">
          <ConstellationScreen onClose={() => setConstellationOpen(false)} />
        </main>
      </MotionProvider>
    )
  }

  return (
    <MotionProvider>
      <div className="flex h-full flex-col">
        {/* Compact top bar */}
        <header className="flex-none border-b border-white/[0.04] bg-bg px-5 py-3">
          <div className="mx-auto flex max-w-2xl items-center">
            <button type="button" onClick={() => setTab('today')} className="text-left">
              <h1 className="bg-accent-grad bg-clip-text font-serif text-2xl font-semibold tracking-tight text-transparent">
                Atlas
              </h1>
            </button>
          </div>
        </header>

        {/* Scrollable tab content */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-5 py-6">
            {tab === 'today' && (
              <HomeView
                onStartDaily={() => startSession({ shape: 'daily' }, 'today')}
                onStartPractice={() => startSession({ shape: 'spaced' }, 'today')}
                onOpenConstellation={() => setConstellationOpen(true)}
                onNavigate={setTab}
              />
            )}
            {tab === 'pathway' && (
              <PathwayView
                onStartThread={(threadId) => startSession({ shape: 'thread', threadId }, 'pathway')}
              />
            )}
            {tab === 'browse' && (
              <BrowseView
                onStartEra={(eraId) => startSession({ shape: 'era', eraId }, 'browse')}
                onStartDomain={(domain) => startSession({ shape: 'domain', domain }, 'browse')}
                onStartThread={(threadId) => startSession({ shape: 'thread', threadId }, 'browse')}
                onStartSpaced={() => startSession({ shape: 'spaced' }, 'browse')}
                onStartMistakes={() => startSession({ shape: 'mistakes' }, 'browse')}
              />
            )}
            {tab === 'stats' && <StatsView />}
            {tab === 'settings' && <SettingsView />}
          </div>
        </div>

        <BottomNav active={tab} onChange={setTab} />
      </div>
    </MotionProvider>
  )
}

export default App
