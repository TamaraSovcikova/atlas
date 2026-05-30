import { useEffect, useRef, useState } from 'react'
import type { RecallItem } from '../../lib/session'
import type { RecallRating } from '../../lib/fsrs'

interface Props {
  item: RecallItem
  onAnswered: (conceptId: string) => void
  onDone: (ratings: { conceptId: string; rating: RecallRating }[]) => void
}

interface GeoFeature {
  geometry: { type: string; coordinates: number[][][] | number[][][][] }
}

// Equirectangular: lng [-180,180] -> x [0,360]; lat [90,-90] -> y [0,180]
const W = 360
const H = 180
const CORRECT_KM = 800

let cache: GeoFeature[] | null = null
async function loadWorld(): Promise<GeoFeature[]> {
  if (cache) return cache
  const res = await fetch('/world-110m.json')
  const json = (await res.json()) as { features: GeoFeature[] }
  cache = json.features
  return cache
}

function ringToPath(ring: number[][]): string {
  return (
    ring
      .map(([lng, lat], i) => {
        const x = (lng as number) + 180
        const y = 90 - (lat as number)
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ') + 'Z'
  )
}

function featurePaths(features: GeoFeature[]): string[] {
  const paths: string[] = []
  for (const f of features) {
    const g = f.geometry
    if (g.type === 'Polygon') {
      for (const ring of g.coordinates as number[][][]) paths.push(ringToPath(ring))
    } else if (g.type === 'MultiPolygon') {
      for (const poly of g.coordinates as number[][][][]) {
        for (const ring of poly) paths.push(ringToPath(ring))
      }
    }
  }
  return paths
}

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371
  const dLat = ((bLat - aLat) * Math.PI) / 180
  const dLng = ((bLng - aLng) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

export function MapCard({ item, onAnswered, onDone }: Props) {
  const { concept } = item
  const svgRef = useRef<SVGSVGElement>(null)
  const [paths, setPaths] = useState<string[]>([])
  const [tap, setTap] = useState<{ lng: number; lat: number } | null>(null)

  useEffect(() => {
    setTap(null)
    let cancelled = false
    loadWorld().then((f) => {
      if (!cancelled) setPaths(featurePaths(f))
    })
    return () => {
      cancelled = true
    }
  }, [item.cardKey])

  const targetLat = concept.lat ?? 0
  const targetLng = concept.lng ?? 0
  const distance = tap ? haversineKm(tap.lat, tap.lng, targetLat, targetLng) : null
  const correct = distance !== null && distance <= CORRECT_KM

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    if (tap || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * W
    const y = ((e.clientY - rect.top) / rect.height) * H
    const lng = x - 180
    const lat = 90 - y
    setTap({ lng, lat })
    onAnswered(concept.id)
  }

  const targetXY = { x: targetLng + 180, y: 90 - targetLat }
  const tapXY = tap ? { x: tap.lng + 180, y: 90 - tap.lat } : null

  return (
    <article className="space-y-5">
      <header>
        <p className="text-[11px] uppercase tracking-wider text-accent">Where in the world</p>
        <h2 className="mt-1 font-serif text-xl text-ink">{concept.name}</h2>
        <p className="mt-1 text-sm text-ink-soft">Tap roughly where it is on the map.</p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-bg-softer/40 bg-bg-soft/40">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          onClick={handleClick}
          className="w-full cursor-crosshair touch-none select-none"
          style={{ aspectRatio: '2 / 1' }}
        >
          {paths.map((d, i) => (
            <path key={i} d={d} fill="#1e293b" stroke="#334155" strokeWidth={0.2} />
          ))}
          {tap && (
            <>
              <line
                x1={tapXY!.x}
                y1={tapXY!.y}
                x2={targetXY.x}
                y2={targetXY.y}
                stroke={correct ? '#fbbf24' : '#f87171'}
                strokeWidth={0.6}
                strokeDasharray="2 2"
              />
              <circle cx={tapXY!.x} cy={tapXY!.y} r={2.5} fill="#f87171" />
              <circle cx={targetXY.x} cy={targetXY.y} r={3} fill="#fbbf24" stroke="#0f172a" strokeWidth={0.6} />
            </>
          )}
        </svg>
      </div>

      {tap && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-ink-soft">
            {correct
              ? 'Spot on.'
              : `About ${Math.round(distance!).toLocaleString()} km off. The pin shows the spot.`}
          </p>
          <button
            type="button"
            onClick={() => onDone([{ conceptId: concept.id, rating: correct ? 'good' : 'again' }])}
            className="rounded-xl bg-accent px-5 py-2 text-sm font-medium text-bg hover:bg-accent-soft"
          >
            Next
          </button>
        </div>
      )}
    </article>
  )
}
