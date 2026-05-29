import { useEffect, useState } from 'react'
import { connectionsFor, describeRelation, type ConnectionHit } from '../lib/connections'

export function ConnectionPanel({ conceptId }: { conceptId: string }) {
  const [hits, setHits] = useState<ConnectionHit[]>([])

  useEffect(() => {
    let cancelled = false
    connectionsFor(conceptId, 5).then((h) => {
      if (!cancelled) setHits(h)
    })
    return () => {
      cancelled = true
    }
  }, [conceptId])

  if (hits.length === 0) {
    return null
  }

  const known = hits.filter((h) => h.isKnown)
  const unknown = hits.filter((h) => !h.isKnown)

  return (
    <aside className="rounded-xl border border-bg-softer/40 bg-bg-soft/50 p-5 text-sm">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-softer">Connects to</h3>
      {known.length > 0 && (
        <ul className="mt-3 space-y-2">
          {known.map((h) => (
            <li key={h.concept.id} className="text-ink-soft">
              <span className="text-accent">{h.concept.name}</span>
              <span className="text-ink-softer"> {describeRelation(h.relation, h.direction)} this</span>
              <span className="ml-2 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-accent">
                known
              </span>
            </li>
          ))}
        </ul>
      )}
      {unknown.length > 0 && (
        <>
          <p className="mt-4 text-xs text-ink-softer">You will meet these soon</p>
          <ul className="mt-2 space-y-1 text-ink-softer">
            {unknown.map((h) => (
              <li key={h.concept.id}>
                {h.concept.name}{' '}
                <span className="text-ink-softer/60">
                  ({describeRelation(h.relation, h.direction)})
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  )
}
