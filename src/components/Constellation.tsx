import { useEffect, useState } from 'react'
import { connectionsFor, describeRelation, type ConnectionHit } from '../lib/connections'

interface Props {
  conceptId: string
  conceptName: string
  highlightId?: string | null
}

const ARM_COUNT = 6

export function Constellation({ conceptId, conceptName, highlightId }: Props) {
  const [hits, setHits] = useState<ConnectionHit[]>([])

  useEffect(() => {
    let cancelled = false
    connectionsFor(conceptId, ARM_COUNT).then((h) => {
      if (!cancelled) setHits(h)
    })
    return () => {
      cancelled = true
    }
  }, [conceptId])

  const SIZE = 200
  const C = SIZE / 2
  const RADIUS = SIZE * 0.34
  const armCount = Math.min(hits.length, ARM_COUNT)

  return (
    <figure className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        className="overflow-visible"
        aria-hidden="true"
      >
        {hits.slice(0, armCount).map((h, i) => {
          const angle = (-Math.PI / 2) + (i * 2 * Math.PI) / armCount
          const x = C + RADIUS * Math.cos(angle)
          const y = C + RADIUS * Math.sin(angle)
          const isHighlighted = h.concept.id === highlightId
          const opacity = isHighlighted ? 1 : h.isKnown ? 0.65 : 0.22
          const stroke = h.isKnown ? '#fbbf24' : '#64748b'
          return (
            <g key={h.concept.id} opacity={opacity}>
              <line
                x1={C}
                y1={C}
                x2={x}
                y2={y}
                stroke={stroke}
                strokeWidth={isHighlighted ? 2 : 1}
                strokeDasharray={h.isKnown ? undefined : '3 3'}
              />
              <circle
                cx={x}
                cy={y}
                r={isHighlighted ? 9 : h.isKnown ? 7 : 5}
                fill={h.isKnown ? '#fbbf24' : '#1e293b'}
                stroke={h.isKnown ? '#fcd34d' : '#475569'}
                strokeWidth={1.5}
              />
            </g>
          )
        })}
        <circle cx={C} cy={C} r={14} fill="#0f172a" stroke="#fbbf24" strokeWidth={2.5} />
        <circle cx={C} cy={C} r={5} fill="#fbbf24" />
      </svg>
      <figcaption className="mt-1 text-center text-[11px] uppercase tracking-wide text-ink-softer">
        {conceptName}
      </figcaption>
      {armCount > 0 && (
        <ul className="mt-3 w-full space-y-1 text-xs">
          {hits.slice(0, armCount).map((h) => (
            <li key={h.concept.id} className="flex items-baseline gap-2">
              <span
                className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                  h.isKnown ? 'bg-accent' : 'bg-bg-softer'
                }`}
              />
              <span className={h.isKnown ? 'text-ink-soft' : 'text-ink-softer/60'}>
                <span className={h.isKnown ? 'text-ink' : ''}>{h.concept.name}</span>{' '}
                <span className="text-ink-softer/70">
                  {describeRelation(h.relation, h.direction)} this
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </figure>
  )
}
