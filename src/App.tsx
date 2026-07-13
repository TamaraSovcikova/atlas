import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Domain, type Concept } from './db/schema'
import { progressSnapshot } from './lib/progress'
import { loadSeedIfNeeded } from './db/seed'
import { pullCommunityConcepts } from './lib/community'
import { useSettings } from './store/useSettings'
import { MotionProvider } from './components/ui/motion'
import { BottomNav, type Tab } from './components/BottomNav'
import { FeedView } from './components/FeedView'
import { Dashboard } from './components/Dashboard'
import { StoryBrief } from './components/StoryBrief'
import { BrowseView } from './components/BrowseView'
import { PathwayView } from './components/PathwayView'
import { StatsView } from './components/StatsView'
import { SettingsView } from './components/SettingsView'
import { SessionView } from './components/SessionView'
import { ConstellationScreen } from './components/ConstellationScreen'
import { AtlasViz } from './components/AtlasViz'
import { CollectionsView } from './components/CollectionsView'
import { Onboarding } from './components/Onboarding'
import { ConnectionChallenge } from './components/ConnectionChallenge'
import { SearchModal } from './components/SearchModal'
import { SessionMoodPicker } from './components/SessionMoodPicker'

const ONBOARDED_KEY = 'onboarded:v1'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type SessionConfig =
  | { shape: 'daily' }
  | { shape: 'era'; eraId: string }
  | { shape: 'domain'; domain: Domain }
  | { shape: 'thread'; threadId: string }
  | { shape: 'spaced' }
  | { shape: 'mistakes' }
  | { shape: 'collection'; collectionId: string }

type AtlasPanel = 'map' | 'pathway' | 'browse' | 'collections'
type YouPanel = 'progress' | 'settings'

function App() {
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState<Tab>('feed')
  const [atlasPanel, setAtlasPanel] = useState<AtlasPanel>('map')
  const [youPanel, setYouPanel] = useState<YouPanel>('progress')
  const [session, setSession] = useState<{ config: SessionConfig; returnTo: Tab } | null>(null)
  const [constellationOpen, setConstellationOpen] = useState(false)
  const [challengeOpen, setChallengeOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [moodPickerOpen, setMoodPickerOpen] = useState(false)
  const [dashboardOpen, setDashboardOpen] = useState(false)
  const [storyBriefData, setStoryBriefData] = useState<{ concept: Concept; threadName: string } | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const loadSettings = useSettings((s) => s.load)
  const prefs = useSettings((s) => s.prefs)
  const streak = useStreak()

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
      // Pull community-generated concepts in the background (online-only, never
      // blocks first paint). New cards appear via live queries when they land.
      // Pass the reader's level so per-level variants (§E5) converge on their depth.
      pullCommunityConcepts(useSettings.getState().prefs.knowledgeLevel).catch(() => {})
    }
    init()
    return () => {
      cancelled = true
    }
  }, [loadSettings])

  async function finishOnboarding() {
    await db.settings.put({ key: ONBOARDED_KEY, value: true })
    // Onboarding writes prefs (interest eras, knowledge level) straight to the
    // db; reload the store so the first feed/session sees them without a
    // full app restart.
    await loadSettings()
    setShowOnboarding(false)
  }

  // Apply theme: paper is the default (:root), dark navy is the override.
  useEffect(() => {
    if (prefs.theme === 'dark') {
      document.documentElement.dataset.theme = 'dark'
    } else {
      delete document.documentElement.dataset.theme
    }
  }, [prefs.theme])

  // Capture the install prompt so Settings can offer "Install Atlas".
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function promptInstall() {
    if (!installPrompt) return
    await installPrompt.prompt()
    setInstallPrompt(null)
  }

  // Badge the installed app icon with the count of due reviews.
  useEffect(() => {
    let active = true
    const nav = navigator as Navigator & {
      setAppBadge?: (n?: number) => Promise<void>
      clearAppBadge?: () => Promise<void>
    }
    if (!nav.setAppBadge) return
    async function update() {
      if (!prefs.dueBadge) {
        nav.clearAppBadge?.()
        return
      }
      const dueReviews = await db.reviews.where('dueAt').belowOrEqual(Date.now()).toArray()
      let count = 0
      for (const r of dueReviews) {
        const c = await db.concepts.get(r.conceptId)
        if (c?.firstSeenAt != null) count++
      }
      if (!active) return
      if (count > 0) nav.setAppBadge?.(count)
      else nav.clearAppBadge?.()
    }
    update()
    const onFocus = () => update()
    window.addEventListener('focus', onFocus)
    return () => {
      active = false
      window.removeEventListener('focus', onFocus)
    }
  }, [prefs.dueBadge, session])

  function startSession(config: SessionConfig, returnTo: Tab = tab) {
    setConstellationOpen(false)
    setSession({ config, returnTo })
  }

  function endSession() {
    const returnTo = session?.returnTo ?? 'feed'
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
            collectionId={cfg.shape === 'collection' ? cfg.collectionId : null}
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

  // Connection Challenge overlay — full screen, no bottom nav
  if (challengeOpen) {
    return (
      <MotionProvider>
        <main className="mx-auto flex min-h-full max-w-2xl flex-col">
          <ConnectionChallenge onClose={() => setChallengeOpen(false)} />
        </main>
      </MotionProvider>
    )
  }

  // Dashboard overlay — the feed's pull-down surface, full screen, no bottom nav
  if (dashboardOpen) {
    return (
      <MotionProvider>
        <main className="h-full">
          <Dashboard
            onStartFocus={() => { setDashboardOpen(false); setMoodPickerOpen(true) }}
            onStartPractice={() => { setDashboardOpen(false); startSession({ shape: 'spaced' }, 'feed') }}
            onNavigate={(t) => { setDashboardOpen(false); setTab(t) }}
            onClose={() => setDashboardOpen(false)}
          />
        </main>
      </MotionProvider>
    )
  }

  return (
    <MotionProvider>
      <div className="flex h-full flex-col">
        {/* Editorial header — wordmark · quiet streak · search */}
        <header className="flex-none border-b border-ink/[0.08] bg-bg px-5 py-3">
          <div className="mx-auto flex max-w-2xl items-center gap-3">
            <button type="button" onClick={() => setTab('feed')} className="mr-auto text-left">
              <h1 className="font-serif text-2xl font-semibold tracking-tight text-accent">Atlas</h1>
            </button>
            {streak > 0 && (
              <button
                type="button"
                onClick={() => { setTab('you'); setYouPanel('progress') }}
                className="flex items-center gap-1 text-sm text-ink-softer hover:text-ink"
              >
                <span>🔥</span>
                <span className="tabular-nums">{streak}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="rounded-full p-1.5 text-ink-softer hover:text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </header>

        {/* Tab content — feed is full-bleed and owns its own vertical paging */}
        <div className="flex-1 min-h-0">
          {tab === 'feed' ? (
            <FeedView
              onOpenConcept={(concept, threadName) =>
                setStoryBriefData({ concept, threadName: threadName ?? '' })
              }
              onOpenDashboard={() => setDashboardOpen(true)}
            />
          ) : (
          <div className="h-full overflow-y-auto"><div className="mx-auto max-w-2xl px-5 py-6">
            {tab === 'atlas' && (
              <div className="space-y-5">
                <SegmentControl
                  options={[
                    { key: 'map' as AtlasPanel, label: 'Atlas' },
                    { key: 'pathway' as AtlasPanel, label: 'Pathway' },
                    { key: 'browse' as AtlasPanel, label: 'Browse' },
                    { key: 'collections' as AtlasPanel, label: 'Collections' },
                  ]}
                  active={atlasPanel}
                  onChange={setAtlasPanel}
                />
                {atlasPanel === 'map' && (
                  <AtlasViz onStartEra={(eraId) => startSession({ shape: 'era', eraId }, 'atlas')} />
                )}
                {atlasPanel === 'pathway' && (
                  <PathwayView
                    onStartThread={(threadId) =>
                      startSession({ shape: 'thread', threadId }, 'atlas')
                    }
                  />
                )}
                {atlasPanel === 'browse' && (
                  <BrowseView
                    onStartEra={(eraId) => startSession({ shape: 'era', eraId }, 'atlas')}
                    onStartDomain={(domain) =>
                      startSession({ shape: 'domain', domain }, 'atlas')
                    }
                    onStartThread={(threadId) =>
                      startSession({ shape: 'thread', threadId }, 'atlas')
                    }
                    onStartSpaced={() => startSession({ shape: 'spaced' }, 'atlas')}
                    onStartMistakes={() => startSession({ shape: 'mistakes' }, 'atlas')}
                    onOpenChallenge={() => setChallengeOpen(true)}
                  />
                )}
                {atlasPanel === 'collections' && (
                  <CollectionsView
                    onStudy={(collectionId) =>
                      startSession({ shape: 'collection', collectionId }, 'atlas')
                    }
                  />
                )}
              </div>
            )}
            {tab === 'you' && (
              <div className="space-y-5">
                <SegmentControl
                  options={[
                    { key: 'progress' as YouPanel, label: 'Progress' },
                    { key: 'settings' as YouPanel, label: 'Settings' },
                  ]}
                  active={youPanel}
                  onChange={setYouPanel}
                />
                {youPanel === 'progress' && <StatsView />}
                {youPanel === 'settings' && (
                  <SettingsView canInstall={!!installPrompt} onInstall={promptInstall} />
                )}
              </div>
            )}
          </div></div>
          )}
        </div>

        <BottomNav active={tab} onChange={setTab} />
      </div>

      {/* Story Brief — the optional deep dive (tap a concept's title). Layered
          OVER the feed so it stays mounted underneath; closing returns the user
          to the exact card they left, with the interest-swipe still available. */}
      {storyBriefData && (
        <div className="fixed inset-0 z-50 bg-bg">
          <StoryBrief
            concept={storyBriefData.concept}
            threadName={storyBriefData.threadName}
            onClose={() => setStoryBriefData(null)}
          />
        </div>
      )}

      {/* Search modal — layered on top of everything */}
      {searchOpen && (
        <SearchModal
          onClose={() => setSearchOpen(false)}
          onNavigateAtlas={() => { setTab('atlas'); setAtlasPanel('browse') }}
        />
      )}

      {/* Mood picker — shown before starting a daily session */}
      {moodPickerOpen && (
        <SessionMoodPicker
          onStart={() => { setMoodPickerOpen(false); startSession({ shape: 'daily' }, 'feed') }}
          onCancel={() => setMoodPickerOpen(false)}
        />
      )}
    </MotionProvider>
  )
}

function SegmentControl<T extends string>({
  options,
  active,
  onChange,
}: {
  options: { key: T; label: string }[]
  active: T
  onChange: (key: T) => void
}) {
  return (
    <div className="flex rounded-xl p-1" style={{ border: '1px solid rgb(var(--ink) / 0.08)', backgroundColor: 'rgb(var(--bg-softer))' }}>
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            active === opt.key
              ? 'bg-bg-raised text-ink shadow-card'
              : 'text-ink-softer hover:text-ink-soft'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function useStreak(): number {
  const sessions = useLiveQuery(() => db.sessions.toArray(), [], [])
  const prefs = useSettings((s) => s.prefs)
  return useMemo(
    () => progressSnapshot(sessions, prefs.dailyGoalCards, prefs.streakFreezes).streak,
    [sessions, prefs.dailyGoalCards, prefs.streakFreezes],
  )
}

export default App
