import { lazy, Suspense, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Concept, type Era, type Review } from '../db/schema'
import { masteryOf, masterySpread } from '../lib/mastery'
import { ConceptRabbitHole } from './ConceptRabbitHole'

const Constellation = lazy(() =>
  import('./Constellation').then((m) => ({ default: m.Constellation })),
)

type Mode = 'map' | 'timeline' | 'web'

interface Props {
  onStartEra: (eraId: string) => void
}

// ── Shared data ──────────────────────────────────────────────────────────────

interface EraStat {
  era: Era
  total: number
  met: number
  /** 0..1 mean mastery across the era's concepts. */
  mastery: number
  /** 0..1 share of the era's concepts the user has met (drives the fog). */
  explored: number
}

interface ConceptNode {
  id: string
  name: string
  year: number
  met: boolean
  brightness: number
}

function useAtlasData() {
  const concepts = useLiveQuery(() => db.concepts.toArray(), [], [] as Concept[])
  const reviews = useLiveQuery(() => db.reviews.toArray(), [], [] as Review[])
  const eras = useLiveQuery(() => db.eras.orderBy('displayOrder').toArray(), [], [] as Era[])

  return useMemo(() => {
    const reviewByConcept = new Map<string, Review>()
    for (const r of reviews) reviewByConcept.set(r.conceptId, r)

    const eraStats: EraStat[] = eras.map((era) => {
      const members = concepts.filter((c) => c.eras.includes(era.id))
      const levels = members.map((c) => masteryOf(reviewByConcept.get(c.id), c.firstSeenAt !== null))
      const met = members.filter((c) => c.firstSeenAt !== null).length
      return {
        era,
        total: members.length,
        met,
        mastery: masterySpread(levels).fraction,
        explored: members.length === 0 ? 0 : met / members.length,
      }
    })

    // Concepts bucketed into the era whose year-range contains them, for the river.
    const nodesByEra = new Map<string, ConceptNode[]>()
    for (const era of eras) nodesByEra.set(era.id, [])
    for (const c of concepts) {
      if (c.approxYear === null) continue
      const era = eras.find((e) => c.approxYear! >= e.startYear && c.approxYear! < e.endYear)
      if (!era) continue
      const level = masteryOf(reviewByConcept.get(c.id), c.firstSeenAt !== null)
      nodesByEra.get(era.id)!.push({
        id: c.id,
        name: c.name,
        year: c.approxYear,
        met: c.firstSeenAt !== null,
        brightness: masterySpread([level]).fraction,
      })
    }
    for (const list of nodesByEra.values()) list.sort((a, b) => a.year - b.year)

    const totalConcepts = concepts.length
    const totalMet = concepts.filter((c) => c.firstSeenAt !== null).length

    return { eraStats, nodesByEra, totalConcepts, totalMet }
  }, [concepts, reviews, eras])
}

// ── Container + mode toggle ──────────────────────────────────────────────────

export function AtlasViz({ onStartEra }: Props) {
  const [mode, setMode] = useState<Mode>('map')
  const data = useAtlasData()
  const [conceptId, setConceptId] = useState<string | null>(null)

  const pctExplored = data.totalConcepts === 0 ? 0 : Math.round((data.totalMet / data.totalConcepts) * 100)

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-ink">The Atlas of You</h2>
          <p className="mt-1 text-sm text-ink-soft">
            {pctExplored}% charted · {data.totalMet} of {data.totalConcepts} concepts met
          </p>
        </div>
      </div>

      <div className="inline-flex rounded-full border border-ink/[0.08] bg-bg-soft p-0.5 text-xs">
        {(['map', 'timeline', 'web'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-full px-3.5 py-1.5 capitalize transition-colors ${
              mode === m ? 'bg-accent text-on-accent' : 'text-ink-soft hover:text-ink'
            }`}
          >
            {m === 'web' ? 'Web' : m}
          </button>
        ))}
      </div>

      {mode === 'map' && <EraMap stats={data.eraStats} onStartEra={onStartEra} />}
      {mode === 'timeline' && (
        <TimeRiver stats={data.eraStats} nodesByEra={data.nodesByEra} onOpenConcept={setConceptId} />
      )}
      {mode === 'web' && (
        <div className="surface overflow-hidden p-2">
          <Suspense fallback={<div style={{ height: 520 }} />}>
            <Constellation conceptId={null} pulseKey={0} mode="explore" height={520} />
          </Suspense>
          <p className="px-2 pb-1 pt-2 text-xs text-ink-softer">
            The raw connection web. Drag to rearrange, scroll to zoom.
          </p>
        </div>
      )}

      <ConceptRabbitHole rootConceptId={conceptId} onClose={() => setConceptId(null)} />
    </section>
  )
}

// ── Fog-of-war map ───────────────────────────────────────────────────────────

/** Two-column zigzag down the page — deterministic spacing guarantees no overlap. */
function EraMap({ stats, onStartEra }: { stats: EraStat[]; onStartEra: (eraId: string) => void }) {
  const W = 400
  const stepY = 74
  const H = 60 + stats.length * stepY
  const pos = (i: number) => ({ x: i % 2 === 0 ? 132 : 268, y: 56 + i * stepY })
  const radius = (s: EraStat) => 26 + Math.min(16, s.total / 6)

  const path = stats
    .map((_, i) => {
      const p = pos(i)
      return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    })
    .join(' ')

  return (
    <div className="surface relative overflow-hidden p-2">
      {/* Aged-paper wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.6]"
        style={{
          background:
            'radial-gradient(120% 80% at 15% 10%, rgb(var(--accent) / 0.06), transparent 60%), radial-gradient(120% 80% at 85% 90%, rgb(var(--accent) / 0.05), transparent 55%)',
        }}
      />
      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 320, height: H * 0.9 }} role="img" aria-label="Map of eras you have explored">
          {/* Sea route between eras (the chronological path) */}
          <path d={path} className="stroke-current text-ink" fill="none" strokeWidth={1.5} strokeDasharray="2 5" strokeOpacity={0.25} />

          {stats.map((s, i) => {
            const p = pos(i)
            const r = radius(s)
            const explored = s.explored
            const charted = s.met > 0
            return (
              <g key={s.era.id} onClick={() => onStartEra(s.era.id)} style={{ cursor: 'pointer' }}>
                {/* Land */}
                <circle cx={p.x} cy={p.y} r={r} className="fill-current text-accent" fillOpacity={0.08 + explored * 0.28} />
                <circle cx={p.x} cy={p.y} r={r} className="stroke-current text-accent" fill="none" strokeWidth={1.25} strokeOpacity={0.3 + explored * 0.5} />
                {/* Mastery core — brightens as you truly know it */}
                <circle cx={p.x} cy={p.y} r={r * 0.5} className="fill-current text-accent" fillOpacity={s.mastery * 0.6} />
                {/* Fog for the unexplored share */}
                {explored < 0.999 && (
                  <circle cx={p.x} cy={p.y} r={r} className="fill-current text-bg" fillOpacity={(1 - explored) * 0.55} />
                )}
                {/* Label */}
                <text
                  x={p.x}
                  y={p.y + r + 14}
                  textAnchor="middle"
                  className="fill-current text-ink"
                  style={{ fontSize: 11, fontWeight: 600 }}
                  fillOpacity={charted ? 0.9 : 0.4}
                >
                  {charted ? s.era.name : 'Uncharted'}
                </text>
                <text
                  x={p.x}
                  y={p.y + r + 27}
                  textAnchor="middle"
                  className="fill-current text-ink-softer"
                  style={{ fontSize: 9 }}
                >
                  {charted ? `${s.met}/${s.total} · ${Math.round(s.mastery * 100)}% mastered` : `${s.total} concepts`}
                </text>
              </g>
            )
          })}

          {/* Compass rose */}
          <g transform={`translate(${W - 34} 34)`} className="stroke-current text-ink-softer" strokeOpacity={0.5}>
            <circle r={14} fill="none" strokeWidth={1} />
            <path d="M0 -12 L3 0 L0 12 L-3 0 Z" className="fill-current text-accent" strokeWidth={0} fillOpacity={0.6} />
            <text x={0} y={-17} textAnchor="middle" className="fill-current text-ink-softer" style={{ fontSize: 8 }} strokeWidth={0}>N</text>
          </g>
        </svg>
      </div>
      <p className="relative px-2 pb-1 pt-1 text-xs text-ink-softer">
        Each land is an era. Mist lifts as you meet its concepts; the core glows as you master them. Tap a land to study it.
      </p>
    </div>
  )
}

// ── River of time ────────────────────────────────────────────────────────────

const RIVER_BAND = 210
const MAX_NODES_PER_ERA = 14

function TimeRiver({
  stats,
  nodesByEra,
  onOpenConcept,
}: {
  stats: EraStat[]
  nodesByEra: Map<string, ConceptNode[]>
  onOpenConcept: (id: string) => void
}) {
  return (
    <div className="surface overflow-hidden">
      <div className="relative">
        {stats.map((s, i) => {
          const all = nodesByEra.get(s.era.id) ?? []
          const nodes = all.slice(0, MAX_NODES_PER_ERA)
          const extra = all.length - nodes.length
          return (
            <div key={s.era.id} className="relative border-b border-ink/[0.06] last:border-0" style={{ minHeight: RIVER_BAND }}>
              {/* Era label */}
              <div className="absolute left-3 top-3 z-10 max-w-[45%]">
                <p className="font-serif text-sm text-ink">{s.era.name}</p>
                <p className="text-[10px] text-ink-softer">
                  {fmtRange(s.era.startYear, s.era.endYear)} · {s.met}/{s.total}
                </p>
              </div>

              {/* The river segment */}
              <svg viewBox={`0 0 100 ${RIVER_BAND}`} preserveAspectRatio="none" width="100%" style={{ height: RIVER_BAND }} className="absolute inset-0" aria-hidden="true">
                <path
                  d={riverPath(i)}
                  className="stroke-current text-accent"
                  fill="none"
                  strokeWidth={2.5}
                  strokeOpacity={0.18 + s.explored * 0.3}
                  strokeLinecap="round"
                />
              </svg>

              {/* Concept nodes placed by year, alternating sides */}
              {nodes.map((n, j) => {
                const t = (n.year - s.era.startYear) / Math.max(1, s.era.endYear - s.era.startYear)
                const top = 24 + Math.min(0.95, Math.max(0.02, t)) * (RIVER_BAND - 44)
                const left = j % 2 === 0 ? 54 : 62 // percentages, near the river
                const side = j % 2 === 0 ? 'right' : 'left'
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => onOpenConcept(n.id)}
                    className="absolute z-10 flex items-center gap-1.5"
                    style={{ top, [side === 'right' ? 'left' : 'right']: `${side === 'right' ? left : 100 - left}%` }}
                  >
                    {side === 'left' && <NodeLabel name={n.name} year={n.year} met={n.met} align="right" />}
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full border ${
                        n.met ? 'border-accent bg-accent' : 'border-ink/30 bg-bg'
                      }`}
                      style={n.met ? { boxShadow: `0 0 ${4 + n.brightness * 8}px rgb(var(--accent) / ${0.4 + n.brightness * 0.5})` } : undefined}
                    />
                    {side === 'right' && <NodeLabel name={n.name} year={n.year} met={n.met} align="left" />}
                  </button>
                )
              })}

              {extra > 0 && (
                <p className="absolute bottom-2 right-3 text-[10px] text-ink-softer">+{extra} more in this era</p>
              )}
            </div>
          )
        })}
      </div>
      <p className="px-3 py-2 text-xs text-ink-softer">
        Time flows top to bottom. Lit stones are concepts you've met — the brighter, the better you know them. Tap any to open it.
      </p>
    </div>
  )
}

function NodeLabel({ name, year, met, align }: { name: string; year: number; met: boolean; align: 'left' | 'right' }) {
  return (
    <span className={`max-w-[38vw] truncate text-[11px] ${align === 'right' ? 'text-right' : 'text-left'} ${met ? 'text-ink' : 'text-ink-softer'}`}>
      {name} <span className="text-ink-softer">· {fmtYearShort(year)}</span>
    </span>
  )
}

function riverPath(i: number): string {
  // Gentle S that meets the previous/next band at the horizontal centre.
  const flip = i % 2 === 0
  return flip
    ? `M 58 0 C 74 60, 42 150, 58 ${RIVER_BAND}`
    : `M 58 0 C 42 60, 74 150, 58 ${RIVER_BAND}`
}

function fmtYearShort(y: number): string {
  return y < 0 ? `${-y}BCE` : `${y}`
}
function fmtRange(a: number, b: number): string {
  return `${fmtYearShort(a)}–${fmtYearShort(b)}`
}
