import { useSettings } from '../store/useSettings'

interface Props {
  onStart: () => void
  onCancel: () => void
}

const MOODS = [
  {
    id: 'tap' as const,
    label: 'Tap',
    blurb: 'Tap chips, no typing. Good for the bus.',
    icon: '👆',
    prefs: { minimiseTyping: true, listenMode: false },
  },
  {
    id: 'type' as const,
    label: 'Type',
    blurb: 'Type your recall. Hardest, most effective.',
    icon: '⌨️',
    prefs: { minimiseTyping: false, listenMode: false },
  },
  {
    id: 'listen' as const,
    label: 'Listen',
    blurb: 'Audio reads everything aloud. Hands-free.',
    icon: '🎧',
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
                <span className="text-2xl">{mood.icon}</span>
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
