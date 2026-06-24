import { useEffect, useRef, useState } from 'react'
import { db, type Concept, type Collection } from '../db/schema'
import { ConceptRabbitHole } from './ConceptRabbitHole'

interface ThreadResult {
  id: string
  name: string
  description: string
}

interface Props {
  onClose: () => void
  onNavigateAtlas: () => void
}

export function SearchModal({ onClose, onNavigateAtlas }: Props) {
  const [query, setQuery] = useState('')
  const [concepts, setConcepts] = useState<Concept[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [threads, setThreads] = useState<ThreadResult[]>([])
  const [rabbitHoleId, setRabbitHoleId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) {
      setConcepts([])
      setCollections([])
      setThreads([])
      return
    }
    let cancelled = false

    async function search() {
      const [cs, cols, ts] = await Promise.all([
        db.concepts
          .filter((c) => c.name.toLowerCase().includes(q) || (c.summary?.toLowerCase().includes(q) ?? false))
          .limit(8)
          .toArray(),
        db.collections.filter((c) => c.name.toLowerCase().includes(q)).limit(4).toArray(),
        db.threads
          .filter(
            (t) =>
              t.name.toLowerCase().includes(q) ||
              (t.description?.toLowerCase().includes(q) ?? false),
          )
          .limit(4)
          .toArray()
          .then((ts) => ts.map((t) => ({ id: t.id, name: t.name, description: t.description }))),
      ])
      if (cancelled) return
      setConcepts(cs)
      setCollections(cols)
      setThreads(ts)
    }

    const timer = setTimeout(search, 150)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  const hasResults = concepts.length > 0 || collections.length > 0 || threads.length > 0
  const q = query.trim()

  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col bg-bg">
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-ink/[0.08] px-4 py-3">
          <svg
            className="shrink-0 text-ink-softer"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search concepts, stories, collections…"
            className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-softer"
          />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-sm text-ink-softer hover:text-ink"
          >
            Cancel
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {q.length < 2 ? (
            <p className="mt-8 text-center text-sm text-ink-softer">
              Type at least 2 characters to search
            </p>
          ) : !hasResults ? (
            <p className="mt-8 text-center text-sm text-ink-softer">
              No results for &ldquo;{q}&rdquo;
            </p>
          ) : (
            <div className="space-y-6">
              {concepts.length > 0 && (
                <section>
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-ink-softer">
                    Concepts
                  </p>
                  <ul className="space-y-1">
                    {concepts.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => setRabbitHoleId(c.id)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-bg-soft"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-ink">
                              {c.name}
                            </span>
                            <span className="block truncate text-[11px] text-ink-softer capitalize">
                              {c.domain.replace('_', ' ')}
                              {c.firstSeenAt ? ' · met' : ''}
                            </span>
                          </span>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="shrink-0 text-ink-softer"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {threads.length > 0 && (
                <section>
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-ink-softer">
                    Stories
                  </p>
                  <ul className="space-y-1">
                    {threads.map((t) => (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onNavigateAtlas()
                            onClose()
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-bg-soft"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-ink">
                              {t.name}
                            </span>
                            <span className="block truncate text-[11px] text-ink-softer">
                              {t.description}
                            </span>
                          </span>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="shrink-0 text-ink-softer"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {collections.length > 0 && (
                <section>
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-ink-softer">
                    Collections
                  </p>
                  <ul className="space-y-1">
                    {collections.map((col) => (
                      <li key={col.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onNavigateAtlas()
                            onClose()
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-bg-soft"
                        >
                          <span className="text-sm text-ink">{col.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Concept rabbit hole triggered from search results */}
      <ConceptRabbitHole
        rootConceptId={rabbitHoleId}
        onClose={() => setRabbitHoleId(null)}
      />
    </>
  )
}
