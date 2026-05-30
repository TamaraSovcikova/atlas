import { lazy, Suspense } from 'react'
import { Button } from './ui/Button'

const Constellation = lazy(() =>
  import('./Constellation').then((m) => ({ default: m.Constellation })),
)

export function ConstellationScreen({ onClose }: { onClose: () => void }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl">Your constellation</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Everything you have met, and how it connects. Bright stars are learned; dim ones wait.
          </p>
        </div>
        <Button variant="ghost" onClick={onClose}>
          Done
        </Button>
      </div>
      <div className="surface overflow-hidden p-2">
        <Suspense fallback={<div style={{ height: 520 }} />}>
          <Constellation conceptId={null} pulseKey={0} mode="explore" height={520} />
        </Suspense>
      </div>
      <p className="text-xs text-ink-softer">Drag to rearrange, pinch or scroll to zoom.</p>
    </section>
  )
}
