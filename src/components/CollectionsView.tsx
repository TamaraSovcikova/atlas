import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Collection } from '../db/schema'
import { Button } from './ui/Button'

interface Props {
  onStudy: (collectionId: string) => void
}

export function CollectionsView({ onStudy }: Props) {
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const collections = useLiveQuery(() => db.collections.orderBy('createdAt').reverse().toArray(), [], [] as Collection[])

  const conceptCountsByCollection = useLiveQuery(async () => {
    const rows = await db.collectionConcepts.toArray()
    const counts = new Map<string, number>()
    for (const row of rows) {
      counts.set(row.collectionId, (counts.get(row.collectionId) ?? 0) + 1)
    }
    return counts
  }, [], new Map<string, number>())

  const expandedConcepts = useLiveQuery(async () => {
    if (!expandedId) return []
    const members = await db.collectionConcepts.where('collectionId').equals(expandedId).toArray()
    const concepts = (await db.concepts.bulkGet(members.map((m) => m.conceptId))).filter(Boolean)
    return concepts
  }, [expandedId], [])

  async function createCollection() {
    const name = newName.trim()
    if (!name) return
    const id = `col_${Date.now()}`
    await db.collections.put({ id, name, createdAt: Date.now() })
    setNewName('')
    setCreating(false)
  }

  async function deleteCollection(id: string) {
    await db.collections.delete(id)
    await db.collectionConcepts.where('collectionId').equals(id).delete()
    if (expandedId === id) setExpandedId(null)
  }

  async function removeConcept(collectionId: string, conceptId: string) {
    await db.collectionConcepts.where('[collectionId+conceptId]').equals([collectionId, conceptId]).delete()
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-ink">Collections</h2>
        <button
          type="button"
          onClick={() => setCreating((v) => !v)}
          className="rounded-full border border-ink/[0.10] px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-accent/40 hover:text-ink"
        >
          {creating ? 'Cancel' : '+ New'}
        </button>
      </div>

      {creating && (
        <div className="surface flex gap-2 p-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createCollection()}
            placeholder="Collection name…"
            autoFocus
            className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-softer"
          />
          <Button onClick={createCollection} disabled={!newName.trim()}>
            Create
          </Button>
        </div>
      )}

      {collections.length === 0 && !creating && (
        <div className="surface p-6 text-center">
          <p className="text-sm text-ink-soft">No collections yet.</p>
          <p className="mt-1 text-[11px] text-ink-softer">
            Open any concept in the rabbit hole and tap "Save" to start one.
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {collections.map((col) => {
          const count = conceptCountsByCollection.get(col.id) ?? 0
          const isExpanded = expandedId === col.id
          return (
            <li key={col.id} className="surface overflow-hidden p-0">
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : col.id)}
                className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-bg-raised/40"
              >
                <span className="flex-1">
                  <span className="block font-serif text-base text-ink">{col.name}</span>
                  <span className="text-[11px] text-ink-softer">{count} concept{count !== 1 ? 's' : ''}</span>
                </span>
                <span className="text-ink-softer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ transform: isExpanded ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }}>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </button>

              {isExpanded && (
                <div className="border-t border-ink/[0.08] px-4 pb-4 pt-3 space-y-3">
                  {expandedConcepts.length === 0 ? (
                    <p className="text-sm text-ink-softer">No concepts saved yet.</p>
                  ) : (
                    <ul className="flex flex-wrap gap-2">
                      {expandedConcepts.map((c) => c && (
                        <li key={c.id} className="flex items-center gap-1 rounded-full border border-ink/[0.08] bg-bg-raised pl-3 pr-1 py-1">
                          <span className="text-sm text-ink">{c.name}</span>
                          <button
                            type="button"
                            onClick={() => removeConcept(col.id, c.id)}
                            className="rounded-full p-0.5 text-ink-softer hover:text-ink"
                            aria-label="Remove"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => deleteCollection(col.id)}
                      className="text-[11px] text-ink-softer hover:text-bad transition-colors"
                    >
                      Delete collection
                    </button>
                    <Button onClick={() => onStudy(col.id)} disabled={count === 0}>
                      Study{count > 0 ? ` (${count})` : ''}
                    </Button>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
