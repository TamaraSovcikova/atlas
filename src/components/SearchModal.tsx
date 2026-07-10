import { useEffect, useRef, useState } from 'react'
import { db, type Concept, type Collection } from '../db/schema'
import { generateConcept } from '../lib/ai'
import { contributeConcept } from '../lib/community'
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
  const [concepts, setConcepts] = useState<Concept[]>([]) // cards ABOUT the query (name match)
  const [mentions, setMentions] = useState<Concept[]>([]) // cards that only MENTION the query
  const [collections, setCollections] = useState<Collection[]>([])
  const [threads, setThreads] = useState<ThreadResult[]>([])
  const [rabbitHoleId, setRabbitHoleId] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) {
      setConcepts([])
      setMentions([])
      setCollections([])
      setThreads([])
      setGenError(null)
      return
    }
    let cancelled = false

    async function search() {
      // Cards ABOUT the query = a name match. Query these separately so a popular
      // person who only appears in other cards' summaries never masks the fact
      // that they have no card of their own (which used to suppress generation).
      const nameMatches = await db.concepts
        .filter((c) => c.name.toLowerCase().includes(q))
        .limit(8)
        .toArray()
      const nameIds = new Set(nameMatches.map((c) => c.id))
      const [mentionMatches, cols, ts] = await Promise.all([
        db.concepts
          .filter((c) => !nameIds.has(c.id) && (c.summary?.toLowerCase().includes(q) ?? false))
          .limit(6)
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
      setConcepts(nameMatches)
      setMentions(mentionMatches)
      setCollections(cols)
      setThreads(ts)
      setGenError(null)
    }

    const timer = setTimeout(search, 150)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  async function handleGenerate() {
    const q = query.trim()
    if (!q || generating) return
    setGenerating(true)
    setGenError(null)

    const res = await generateConcept(q)
    setGenerating(false)

    if (!res.ok) {
      setGenError(res.error)
      return
    }

    // Save the AI-generated concept to the local DB so it shows in search results
    // and can be studied later. Mark as AI-generated via the id prefix.
    const now = Date.now()
    const concept: Concept = {
      ...res.concept,
      domain: res.concept.domain as Concept['domain'],
      lessonId: null,
      firstSeenAt: null,
      lastReviewedAt: null,
      createdAt: now,
    }
    await db.concepts.put(concept)
    // Share it with everyone: the topic joins the community bank, not just this
    // person's vault. Fire-and-forget — the local save above already succeeded.
    contributeConcept(res.concept)
    setRabbitHoleId(concept.id)
  }

  // A card ABOUT the query = a name match. Generation is offered whenever there's
  // no such card, even if other cards mention the query — otherwise a person who
  // only appears in others' summaries could never get their own card.
  const hasNameMatch = concepts.length > 0
  const hasOtherResults = mentions.length > 0 || collections.length > 0 || threads.length > 0
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
            onKeyDown={(e) => { if (e.key === 'Enter' && !hasNameMatch && q.length >= 2) handleGenerate() }}
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
          ) : (
            <div className="space-y-6">
              {!hasNameMatch && (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-accent/20 bg-accent/[0.04] px-4 py-5 text-center">
                  <p className="text-sm text-ink-soft">
                    {hasOtherResults ? (
                      <>No card about <span className="font-medium text-ink">&ldquo;{q}&rdquo;</span> yet.</>
                    ) : (
                      <>Nothing in the vault for <span className="font-medium text-ink">&ldquo;{q}&rdquo;</span>.</>
                    )}
                  </p>
                  <button
                    type="button"
                    disabled={generating}
                    onClick={handleGenerate}
                    className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/8 px-5 py-3 text-sm font-medium text-accent hover:bg-accent/15 disabled:opacity-50"
                  >
                    {generating ? (
                      <span className="animate-pulse">Generating…</span>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Generate card for &ldquo;{q}&rdquo;
                      </>
                    )}
                  </button>
                  {genError && (
                    <p className="max-w-xs rounded-xl bg-bg-softer px-3 py-2 text-xs text-ink-soft">{genError}</p>
                  )}
                  <p className="max-w-xs text-[11px] text-ink-softer/60">
                    AI · online only. Saved for you and shared so everyone gets it.
                  </p>
                </div>
              )}
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
                              {c.id.startsWith('ai:') ? ' · AI-generated' : ''}
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

              {mentions.length > 0 && (
                <section>
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-ink-softer">
                    Mentioned in
                  </p>
                  <ul className="space-y-1">
                    {mentions.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => setRabbitHoleId(c.id)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-bg-soft"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm text-ink">{c.name}</span>
                            <span className="block truncate text-[11px] text-ink-softer capitalize">
                              {c.domain.replace('_', ' ')}
                            </span>
                          </span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-ink-softer">
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
