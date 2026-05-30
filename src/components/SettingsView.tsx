import { useSettings } from '../store/useSettings'
import { INTENSITY_LABEL, type Intensity } from '../lib/settings'

interface Props {
  onClose: () => void
}

const INTENSITIES: Intensity[] = ['playful', 'balanced', 'serious']

export function SettingsView({ onClose }: Props) {
  const prefs = useSettings((s) => s.prefs)
  const update = useSettings((s) => s.update)

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl">Settings</h2>
        <button type="button" onClick={onClose} className="text-sm text-ink-softer hover:text-ink">
          Done
        </button>
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
