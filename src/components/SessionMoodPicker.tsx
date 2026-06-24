import { useSettings } from '../store/useSettings'

interface Props {
  onStart: () => void
  onCancel: () => void
}

const TAP_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M9 11V6a2 2 0 0 1 4 0v5"/><path d="M13 11V8a2 2 0 0 1 4 0v3"/><path d="M17 11a2 2 0 0 1 4 0v3a8 8 0 0 1-8 8H9a8 8 0 0 1-8-8v-1a2 2 0 0 1 4 0"/>
  </svg>
)
const TYPE_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M6 16h12"/>
  </svg>
)
const LISTEN_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
)

const MOODS = [
  {
    id: 'tap' as const,
    label: 'Tap',
    blurb: 'Tap chips, no typing. Good for the bus.',
    icon: TAP_ICON,
    prefs: { minimiseTyping: true, listenMode: false },
  },
  {
    id: 'type' as const,
    label: 'Type',
    blurb: 'Type your recall. Hardest, most effective.',
    icon: TYPE_ICON,
    prefs: { minimiseTyping: false, listenMode: false },
  },
  {
    id: 'listen' as const,
    label: 'Listen',
    blurb: 'Audio reads everything aloud. Hands-free.',
    icon: LISTEN_ICON,
    prefs: { minimiseTyping: true, listenMode: true },
  },
]

export function SessionMoodPicker({ onStart, onCancel }: Props) {
  const prefs = useSettings((s) => s.prefs)
  const update = useSettings((s) => s.update)

  // Derive current mood from prefs
  const currentMood = prefs.listenMode
    ? 'listen'
    : prefs.minimiseTyping
      ? 'tap'
      : 'type'

  async function pick(mood: (typeof MOODS)[number]) {
    await update(mood.prefs)
    onStart()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-6">
      <div className="w-full max-w-md rounded-3xl border border-ink/[0.08] bg-bg p-6 shadow-raised">
        <h2 className="font-serif text-lg text-ink">How are you studying today?</h2>
        <p className="mt-1 text-sm text-ink-softer">Sets the style for this session.</p>

        <div className="mt-4 space-y-2">
          {MOODS.map((mood) => {
            const active = mood.id === currentMood
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => pick(mood)}
                className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all active:scale-[0.98] ${
                  active
                    ? 'border-accent/50 bg-accent/[0.06]'
                    : 'border-ink/[0.08] bg-bg-soft hover:border-accent/30'
                }`}
              >
                <span className={active ? 'text-accent' : 'text-ink-soft'}>{mood.icon}</span>
                <span className="flex-1">
                  <span
                    className={`block text-sm font-semibold ${active ? 'text-accent' : 'text-ink'}`}
                  >
                    {mood.label}
                  </span>
                  <span className="block text-[12px] text-ink-softer">{mood.blurb}</span>
                </span>
                {active && (
                  <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-accent">
                    current
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="mt-4 w-full py-2 text-sm text-ink-softer hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
