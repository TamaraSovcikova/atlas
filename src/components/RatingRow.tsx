import type { RecallRating } from '../lib/fsrs'

const RATINGS: { value: RecallRating; label: string; sub: string }[] = [
  { value: 'again', label: 'Again', sub: 'No' },
  { value: 'hard', label: 'Hard', sub: 'With effort' },
  { value: 'good', label: 'Good', sub: 'Got it' },
  { value: 'easy', label: 'Easy', sub: 'No effort' },
]

export function RatingRow({ onRate }: { onRate: (rating: RecallRating) => void }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {RATINGS.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => onRate(r.value)}
          className="rounded-xl border border-bg-softer/40 bg-bg-soft px-2 py-3 text-center transition-colors hover:border-accent/60 hover:bg-accent/5"
        >
          <span className="block text-sm font-medium text-ink">{r.label}</span>
          <span className="block text-[10px] text-ink-softer">{r.sub}</span>
        </button>
      ))}
    </div>
  )
}
