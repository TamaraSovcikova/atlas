import { useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { connectionsFor } from '../lib/connections'
import { db, type Concept } from '../db/schema'

interface GraphNode {
  id: string
  name: string
  known: boolean
  isCenter: boolean
}
interface GraphLink {
  source: string
  target: string
}

interface Props {
  conceptId: string | null
  pulseKey: number
  mode?: 'focus' | 'explore'
  height?: number
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
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: height })
    })
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
      const hits = await connectionsFor(conceptId, 6)
      const nodes: GraphNode[] = [
        { id: center.id, name: center.name, known: true, isCenter: true },
        ...hits.map((h) => ({
          id: h.concept.id,
          name: h.concept.name,
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

  // Particle burst on answer.
  useEffect(() => {
    if (pulseKey === 0 || !fgRef.current) return
    const fg = fgRef.current
    try {
      for (const link of data.links) fg.emitParticle(link)
      fg.d3ReheatSimulation?.()
    } catch {
      // ignore if graph not ready
    }
  }, [pulseKey])

  const nodeColor = useMemo(
    () => (n: GraphNode) => {
      if (n.isCenter) return '#fbbf24'
      return n.known ? '#fcd34d' : '#475569'
    },
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
          nodeVal={(n: GraphNode) => (n.isCenter ? 6 : n.known ? 3 : 1.5)}
          nodeColor={nodeColor as any}
          nodeLabel={(n: GraphNode) => n.name}
          linkColor={() => 'rgba(251, 191, 36, 0.25)'}
          linkWidth={(l: any) => (typeof l === 'object' ? 1 : 1)}
          linkDirectionalParticleWidth={2.5}
          linkDirectionalParticleColor={() => '#fbbf24'}
          nodeCanvasObjectMode={() => 'after'}
          nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, scale: number) => {
            const n = node as GraphNode & { x: number; y: number }
            if (n.isCenter) {
              ctx.beginPath()
              ctx.arc(n.x, n.y, 9, 0, 2 * Math.PI)
              ctx.fillStyle = 'rgba(251,191,36,0.18)'
              ctx.fill()
            }
            if (mode === 'explore' || n.isCenter) {
              const label = n.name
              const fontSize = Math.max(10 / scale, 2.5)
              ctx.font = `${fontSize}px ui-sans-serif, system-ui, sans-serif`
              ctx.textAlign = 'center'
              ctx.textBaseline = 'top'
              ctx.fillStyle = n.known ? '#cbd5e1' : '#64748b'
              ctx.fillText(label, n.x, n.y + 8)
            }
          }}
          cooldownTicks={mode === 'explore' ? 120 : 60}
          warmupTicks={mode === 'explore' ? 40 : 20}
          enableZoomInteraction={mode === 'explore'}
          enablePanInteraction={mode === 'explore'}
          onEngineStop={() => {
            try {
              fgRef.current?.zoomToFit(300, mode === 'explore' ? 30 : 20)
            } catch {
              // ignore
            }
          }}
        />
      )}
    </div>
  )
}
