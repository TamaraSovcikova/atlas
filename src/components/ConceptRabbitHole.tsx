import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Drawer } from 'vaul'
import { db, type Thread } from '../db/schema'
import { masteryOf, MASTERY_META } from '../lib/mastery'
import { LinkedText } from './LinkedText'

interface Props {
  rootConceptId: string | null
  onClose: () => void
}

function formatDue(dueAt: number): string {
  const diff = dueAt - Date.now()
  const days = Math.round(diff / 86400000)
  if (days <= 0) return 'Due now'
  if (days === 1) return 'Due tomorrow'
  return `Due in ${days}d`
}

export function ConceptRabbitHole({ rootConceptId, onClose }: Props) {
  const [extraStack, setExtraStack] = useState<string[]>([])

  useEffect(() => {
    setExtraStack([])
  }, [rootConceptId])

  const fullStack = rootConceptId ? [rootConceptId, ...extraStack] : []
  const currentId = fullStack[fullStack.length - 1] ?? null

  const concept = useLiveQuery(
    () => (currentId ? db.concepts.get(currentId) : undefined),
    [currentId],
  )

  const review = useLiveQuery(
    () => (currentId ? db.reviews.where('conceptId').equals(currentId).first() : undefined),
    [currentId],
  )

  const threads = useLiveQuery(
    () =>
      currentId
        ? db.threads
            .filter((t) => t.members.some((m) => m.conceptId === currentId))
            .toArray()
        : Promise.resolve([] as Thread[]),
    [currentId],
    [] as Thread[],
  )

  const mastery = masteryOf(review, concept?.firstSeenAt != null)
  const masteryMeta = MASTERY_META[mastery]

  const canGoBack = fullStack.length > 1

  function drillInto(id: string) {
    setExtraStack((prev) => [...prev, id])
  }

  function goBack() {
    setExtraStack((prev) => prev.slice(0, -1))
  }

  return (
    <Drawer.Root open={rootConceptId !== null} onOpenChange={(open) => { if (!open) onClose() }}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/60" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[80vh] max-w-2xl flex-col rounded-t-3xl border-t border-ink/[0.10] bg-bg-soft shadow-raised outline-none">
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-ink/[0.12]" />

          <div className="flex shrink-0 items-center justify-between px-6 py-3">
            {canGoBack ? (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-1 text-sm text-ink-softer hover:text-ink"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back
              </button>
            ) : (
              <div />
            )}
            <Drawer.Title className="font-serif text-base text-ink">
              {concept?.name ?? '...'}
            </Drawer.Title>
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] uppercase tracking-wider text-ink-softer hover:text-ink"
            >
              Return
            </button>
          </div>

          <Drawer.Description className="sr-only">
            Explore this concept. Tap linked terms to go deeper, or Return to go back to your card.
          </Drawer.Description>

          <div className="flex-1 overflow-y-auto px-6 pb-8 pt-1">
            {concept ? (
              <div className="space-y-4">
                {/* Mastery + due */}
                {mastery !== 'new' && review && (
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-bg-softer/60 px-2.5 py-0.5 text-[11px] text-ink-soft">
                      {masteryMeta.label}
                    </span>
                    <span className="text-[11px] text-ink-softer">{formatDue(review.dueAt)}</span>
                  </div>
                )}

                {concept.imageUrl && (
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src={concept.imageUrl}
                      alt={concept.name}
                      className="h-40 w-full object-cover"
                      onError={(e) => {
                        const el = e.currentTarget.parentElement
                        if (el) el.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                <p className="text-sm leading-relaxed text-ink-soft">
                  <LinkedText text={concept.summary} onConceptClick={drillInto} />
                </p>

                {/* Thread memberships */}
                {threads && threads.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {threads.map((t) => (
                      <span
                        key={t.id}
                        className="rounded-full border border-ink/[0.07] bg-bg-softer/40 px-2.5 py-0.5 text-[11px] text-ink-softer"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                )}

                {concept.wikipediaUrl && (
                  <a
                    href={concept.wikipediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-bg-softer/40 bg-bg-soft/70 px-2.5 py-0.5 text-[11px] text-ink-softer hover:border-accent/40 hover:text-ink"
                  >
                    source
                  </a>
                )}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-ink-softer">Loading...</p>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
