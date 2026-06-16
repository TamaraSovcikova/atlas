import { useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { connectionsFor } from '../lib/connections'
import { db, type Concept, type Domain } from '../db/schema'

interface GraphNode {
  id: string
  name: string
  domain: Domain
  known: boolean
  isCenter: boolean
  x?: number
  y?: number
}
interface GraphLink {
  source: string
  target: string
}

interface Props {
  conceptId: string | null
  pulseKey: number
  // 'preview' = static hero (high warmup, no interaction, no labels)
  mode?: 'focus' | 'explore' | 'preview'
  height?: number
}

const ARM_COUNT = 6

// Domain-keyed accent tints so the map reads as a themed star-field.
const DOMAIN_HUE: Record<Domain, string> = {
  history: '#fbbf24',
  geography: '#6ea8fe',
  politics: '#f472b6',
  religions: '#a78bfa',
  culture: '#fb923c',
  science: '#4ade80',
  modern_world: '#22d3ee',
}

export function Constellation({ conceptId, pulseKey, mode = 'focus', height = 240 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const fgRef = useRef<any>(null)
  const [size, setSize] = useState({ w: 320, h: height })
  const [data, setData] = useState<{ nodes: GraphNode[]; links: GraphLink[] }>({
    nodes: [],
    links: [],
  })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: height }))
    ro.observe(el)
    setSize({ w: el.clientWidth, h: height })
    return () => ro.disconnect()
  }, [height])

  useEffect(() => {
    let cancelled = false
    async function build() {
      if (mode === 'explore') {
        const concepts = await db.concepts.toArray()
        const edges = await db.edges.toArray()
        const ids = new Set(concepts.map((c) => c.id))
        const nodes: GraphNode[] = concepts.map((c: Concept) => ({
          id: c.id,
          name: c.name,
          domain: c.domain,
          known: c.lastReviewedAt !== null,
          isCenter: c.id === conceptId,
        }))
        const seen = new Set<string>()
        const links: GraphLink[] = []
        for (const e of edges) {
          if (!ids.has(e.fromId) || !ids.has(e.toId)) continue
          const key = [e.fromId, e.toId].sort().join('|')
          if (seen.has(key)) continue
          seen.add(key)
          links.push({ source: e.fromId, target: e.toId })
        }
        if (!cancelled) setData({ nodes, links })
        return
      }

      if (!conceptId) {
        if (!cancelled) setData({ nodes: [], links: [] })
        return
      }
      const center = await db.concepts.get(conceptId)
      if (!center) return
      const hits = await connectionsFor(conceptId, ARM_COUNT)
      const nodes: GraphNode[] = [
        { id: center.id, name: center.name, domain: center.domain, known: true, isCenter: true },
        ...hits.map((h) => ({
          id: h.concept.id,
          name: h.concept.name,
          domain: h.concept.domain,
          known: h.isKnown,
          isCenter: false,
        })),
      ]
      const links: GraphLink[] = hits.map((h) => ({ source: center.id, target: h.concept.id }))
      if (!cancelled) setData({ nodes, links })
    }
    build()
    return () => {
      cancelled = true
    }
  }, [conceptId, mode])

  // Particle burst + gentle reheat when an answer lands.
  useEffect(() => {
    if (pulseKey === 0 || !fgRef.current) return
    const fg = fgRef.current
    try {
      for (const link of data.links) fg.emitParticle(link)
      fg.d3ReheatSimulation?.()
    } catch {
      /* graph not ready */
    }
  }, [pulseKey])

  const nodeColor = useMemo(
    () => (n: GraphNode) => (n.known ? DOMAIN_HUE[n.domain] : '#3b4763'),
    [],
  )

  return (
    <div ref={containerRef} className="w-full" style={{ height }}>
      {size.w > 0 && (
        <ForceGraph2D
          ref={fgRef}
          width={size.w}
          height={size.h}
          graphData={data}
          backgroundColor="rgba(0,0,0,0)"
          nodeId="id"
          nodeRelSize={5}
          nodeColor={nodeColor as any}
          nodeLabel={(n: GraphNode) => n.name}
          linkColor={() => 'rgba(148, 163, 184, 0.18)'}
          linkWidth={() => 1}
          linkDirectionalParticleWidth={2.5}
          linkDirectionalParticleSpeed={0.012}
          linkDirectionalParticleColor={(l: any) => {
            const tgt = typeof l.target === 'object' ? l.target : null
            return tgt && tgt.known ? DOMAIN_HUE[tgt.domain as Domain] : '#fbbf24'
          }}
          nodeCanvasObjectMode={() => 'replace'}
          nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, scale: number) => {
            const n = node as GraphNode & { x: number; y: number }
            const base = n.isCenter ? 7 : n.known ? 4.5 : 3
            const hue = n.known || n.isCenter ? DOMAIN_HUE[n.domain] : '#3b4763'

            // Outer glow halo (only for lit nodes, keeps dim ones quiet).
            if (n.known || n.isCenter) {
              const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, base * 3.2)
              grad.addColorStop(0, hexA(hue, n.isCenter ? 0.55 : 0.32))
              grad.addColorStop(1, hexA(hue, 0))
              ctx.fillStyle = grad
              ctx.beginPath()
              ctx.arc(n.x, n.y, base * 3.2, 0, 2 * Math.PI)
              ctx.fill()
            }

            // Core dot.
            ctx.beginPath()
            ctx.arc(n.x, n.y, base, 0, 2 * Math.PI)
            ctx.fillStyle = hue
            ctx.fill()
            if (n.isCenter) {
              ctx.lineWidth = 1.4 / scale
              ctx.strokeStyle = '#fff7e6'
              ctx.stroke()
            }

            // Labels: none in preview; always for center; in explore for everything; else only known.
            if (mode === 'preview') return
            if (mode === 'explore' || n.isCenter || n.known) {
              const fontSize = Math.max((n.isCenter ? 11 : 9) / scale, 2.4)
              ctx.font = `${n.isCenter ? '600 ' : ''}${fontSize}px ui-sans-serif, system-ui, sans-serif`
              ctx.textAlign = 'center'
              ctx.textBaseline = 'top'
              ctx.fillStyle = n.isCenter ? '#f6f8fc' : n.known ? '#c2cce0' : '#5b677e'
              ctx.fillText(n.name, n.x, n.y + base + 2)
            }
          }}
          cooldownTicks={mode === 'explore' ? 120 : mode === 'preview' ? 0 : 60}
          warmupTicks={mode === 'explore' ? 40 : mode === 'preview' ? 200 : 18}
          enableZoomInteraction={mode === 'explore'}
          enablePanInteraction={mode === 'explore'}
          enableNodeDrag={mode === 'explore'}
          onEngineStop={() => {
            try {
              fgRef.current?.zoomToFit(400, mode === 'explore' ? 36 : 26)
            } catch {
              /* ignore */
            }
          }}
        />
      )}
    </div>
  )
}

function hexA(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
