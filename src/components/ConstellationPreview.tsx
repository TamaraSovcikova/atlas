import { useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Concept, type Domain } from '../db/schema'
import { connectionsFor } from '../lib/connections'

const DOMAIN_HUE: Record<Domain, string> = {
  history: '#fbbf24',
  geography: '#6ea8fe',
  politics: '#f472b6',
  religions: '#a78bfa',
  culture: '#fb923c',
  science: '#4ade80',
  modern_world: '#22d3ee',
}

function hexA(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Golden-angle sunflower spiral -- stable positions, no physics
function starPositions(count: number, w: number, h: number, pad: number) {
  const phi = (1 + Math.sqrt(5)) / 2
  const rx = w / 2 - pad
  const ry = h / 2 - pad
  return Array.from({ length: count }, (_, i) => {
    const t = (2 * Math.PI * i) / (phi * phi)
    const frac = Math.sqrt(i / count)
    return {
      x: w / 2 + frac * rx * Math.cos(t),
      y: h / 2 + frac * ry * Math.sin(t),
    }
  })
}

interface Props {
  height?: number
  // When provided, this concept is the focus: highlighted and connections drawn
  focusConceptId?: string | null
  // Pulse key: when it increments, briefly animate a connection shimmer
  pulseKey?: number
}

export function ConstellationPreview({ height = 280, focusConceptId, pulseKey = 0 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [width, setWidth] = useState(0)

  const concepts = useLiveQuery(() => db.concepts.toArray(), [], [] as Concept[])
  const [connections, setConnections] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!focusConceptId) { setConnections(new Set()); return }
    let cancelled = false
    connectionsFor(focusConceptId, 8).then((hits) => {
      if (!cancelled) setConnections(new Set(hits.map((h) => h.concept.id)))
    })
    return () => { cancelled = true }
  }, [focusConceptId, pulseKey])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setWidth(el.clientWidth))
    ro.observe(el)
    setWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !concepts || concepts.length === 0 || width === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, width, height)

    const pad = 28
    const positions = starPositions(concepts.length, width, height, pad)
    const posMap = new Map(concepts.map((c, i) => [c.id, { ...positions[i]!, concept: c }]))
    const focusEntry = focusConceptId ? posMap.get(focusConceptId) : null

    // Draw connection lines from focus to neighbours
    if (focusEntry && connections.size > 0) {
      for (const connId of connections) {
        const neighbour = posMap.get(connId)
        if (!neighbour) continue
        ctx.beginPath()
        ctx.moveTo(focusEntry.x, focusEntry.y)
        ctx.lineTo(neighbour.x, neighbour.y)
        ctx.strokeStyle = hexA(DOMAIN_HUE[neighbour.concept.domain], 0.22)
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    // Draw stars
    for (const [id, { x, y, concept }] of posMap) {
      const known = concept.firstSeenAt !== null
      const isFocus = id === focusConceptId
      const isNeighbour = connections.has(id)
      const hue = DOMAIN_HUE[concept.domain]

      const base = isFocus ? 5.5 : isNeighbour ? 3.5 : known ? 3 : 2

      if (known || isFocus || isNeighbour) {
        const glowR = isFocus ? base * 4 : base * 3
        const alpha = isFocus ? 0.55 : isNeighbour ? 0.35 : 0.25
        const grad = ctx.createRadialGradient(x, y, 0, x, y, glowR)
        grad.addColorStop(0, hexA(hue, alpha))
        grad.addColorStop(1, hexA(hue, 0))
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(x, y, glowR, 0, 2 * Math.PI)
        ctx.fill()
      }

      ctx.beginPath()
      ctx.arc(x, y, base, 0, 2 * Math.PI)
      ctx.fillStyle = isFocus || isNeighbour || known ? hue : 'rgba(100, 90, 75, 0.45)'
      ctx.fill()

      if (isFocus) {
        ctx.lineWidth = 1.2
        ctx.strokeStyle = 'rgba(255, 240, 210, 0.7)'
        ctx.stroke()
      }
    }
  }, [concepts, connections, width, height, focusConceptId])

  return (
    <div ref={containerRef} className="w-full" style={{ height }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
