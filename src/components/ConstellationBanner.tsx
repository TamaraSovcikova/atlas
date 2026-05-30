import { lazy, Suspense, useEffect, useState } from 'react'
import { Drawer } from 'vaul'
import { connectionsFor, type ConnectionHit } from '../lib/connections'

const Constellation = lazy(() =>
  import('./Constellation').then((m) => ({ default: m.Constellation })),
)

interface Props {
  conceptId: string | null
  conceptName: string
  pulseKey: number
}

/**
 * A thin always-visible strip at the top of a session. Tap or pull it down
 * and it expands (via a vaul top-drawer) into the full interactive
 * constellation. Collapsed, it shows the active concept and a few connection
 * dots so it advertises itself instead of being a skippable footer.
 */
export function ConstellationBanner({ conceptId, conceptName, pulseKey }: Props) {
  const [open, setOpen] = useState(false)
  const [hits, setHits] = useState<ConnectionHit[]>([])

  useEffect(() => {
    let cancelled = false
    if (!conceptId) {
      setHits([])
      return
    }
    connectionsFor(conceptId, 6).then((h) => {
      if (!cancelled) setHits(h)
    })
    return () => {
      cancelled = true
    }
  }, [conceptId, pulseKey])

  const knownCount = hits.filter((h) => h.isKnown).length

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} direction="top">
      <Drawer.Trigger asChild>
        <button
          type="button"
          className="group flex w-full items-center gap-3 rounded-2xl border border-white/[0.08] bg-bg-soft px-4 py-2.5 text-left shadow-card transition-colors hover:border-accent/40"
        >
          <span className="flex -space-x-1.5">
            {hits.slice(0, 5).map((h) => (
              <span
                key={h.concept.id}
                className={`h-2.5 w-2.5 rounded-full ring-2 ring-bg-soft ${
                  h.isKnown ? 'bg-accent' : 'bg-bg-raised'
                }`}
              />
            ))}
            {hits.length === 0 && <span className="h-2.5 w-2.5 rounded-full bg-bg-raised" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs text-ink-soft">
              {conceptName}
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-ink-softer">
              {hits.length > 0
                ? `${hits.length} connections, ${knownCount} you know`
                : 'your constellation'}
            </span>
          </span>
          <span className="text-ink-softer transition-transform group-hover:translate-y-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/60" />
        <Drawer.Content className="fixed inset-x-0 top-0 z-50 mx-auto flex max-h-[85vh] max-w-2xl flex-col rounded-b-3xl border-b border-white/10 bg-bg-soft shadow-raised outline-none">
          <div className="flex items-center justify-between px-6 pt-5">
            <Drawer.Title className="font-serif text-lg text-ink">Your constellation</Drawer.Title>
            <Drawer.Close className="text-sm text-ink-softer hover:text-ink">close</Drawer.Close>
          </div>
          <Drawer.Description className="px-6 text-xs text-ink-softer">
            Bright stars are concepts you have met. Tap and drag to explore how they link.
          </Drawer.Description>
          <div className="mt-2 px-3 pb-3">
            <Suspense fallback={<div style={{ height: 440 }} />}>
              <Constellation conceptId={conceptId} pulseKey={0} mode="explore" height={440} />
            </Suspense>
          </div>
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/15" />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
