import { useEffect, useMemo, useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { OrderItem } from '../../lib/session'
import type { RecallRating } from '../../lib/fsrs'
import { Button } from '../ui/Button'

interface Props {
  item: OrderItem
  onAnswered: (conceptId: string) => void
  onDone: (ratings: { conceptId: string; rating: RecallRating }[]) => void
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

function fmtYear(y: number | null): string {
  if (y === null) return ''
  return y < 0 ? `${-y} BCE` : `${y}`
}

export function OrderCard({ item, onAnswered, onDone }: Props) {
  const entries = item.entries
  const [order, setOrder] = useState<string[]>([])
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setOrder(shuffle(entries).map((e) => e.concept.id))
    setRevealed(false)
  }, [item.cardKey])

  const correctOrder = useMemo(
    () =>
      [...entries]
        .sort((a, b) => (a.concept.approxYear ?? 0) - (b.concept.approxYear ?? 0))
        .map((e) => e.concept.id),
    [item.cardKey],
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    setOrder((cur) => {
      const oldIdx = cur.indexOf(active.id as string)
      const newIdx = cur.indexOf(over.id as string)
      return arrayMove(cur, oldIdx, newIdx)
    })
  }

  function check() {
    setRevealed(true)
    onAnswered(entries[0]!.concept.id)
  }

  const correctCount = revealed
    ? order.filter((id, i) => correctOrder[i] === id).length
    : 0

  return (
    <article className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-wider text-accent">Timeline</p>
        <h2 className="mt-1 font-serif text-xl text-ink">Drag these into order, earliest at the top</h2>
      </header>

      {!revealed && (
        <>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={order} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2">
                {order.map((id, i) => {
                  const e = entries.find((x) => x.concept.id === id)!
                  return <SortableRow key={id} id={id} index={i} name={e.concept.name} />
                })}
              </ul>
            </SortableContext>
          </DndContext>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-ink-softer">Press and hold to drag. Top is earliest.</p>
            <Button onClick={check}>Check order</Button>
          </div>
        </>
      )}

      {revealed && (
        <>
          <p className="text-sm text-ink-soft">
            {correctCount === entries.length
              ? 'Perfect order. This is the real timeline:'
              : `${correctCount} of ${entries.length} landed in the right spot. Here is the correct order:`}
          </p>
          <ol className="space-y-2">
            {correctOrder.map((id, i) => {
              const e = entries.find((x) => x.concept.id === id)!
              const userIdx = order.indexOf(id)
              const right = userIdx === i
              return (
                <li
                  key={id}
                  className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                    right ? 'border-accent/40 bg-accent/5' : 'border-bad/30 bg-bad/5'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-sm font-medium text-accent">{i + 1}</span>
                    <span>
                      <span className="block text-ink">{e.concept.name}</span>
                      {!right && (
                        <span className="block text-[11px] text-bad/80">you put it at {userIdx + 1}</span>
                      )}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-medium text-ink-soft">
                    {fmtYear(e.concept.approxYear)}
                  </span>
                </li>
              )
            })}
          </ol>
          <p className="text-xs text-ink-softer">
            The year on the right is what sets the order.
          </p>
          <div className="flex justify-end">
            <Button
              onClick={() =>
                onDone(
                  entries.map((e) => {
                    const i = correctOrder.indexOf(e.concept.id)
                    const right = order.indexOf(e.concept.id) === i
                    return { conceptId: e.concept.id, rating: (right ? 'good' : 'again') as RecallRating }
                  }),
                )
              }
            >
              Next
            </Button>
          </div>
        </>
      )}
    </article>
  )
}

function SortableRow({ id, index, name }: { id: string; index: number; name: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={`flex cursor-grab touch-none items-center gap-3 rounded-xl border px-4 py-3 active:cursor-grabbing ${
        isDragging
          ? 'border-accent/60 bg-bg-raised shadow-glow'
          : 'border-white/10 bg-bg-soft'
      }`}
    >
      <span className="text-ink-softer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="9" cy="6" r="1.4" />
          <circle cx="15" cy="6" r="1.4" />
          <circle cx="9" cy="12" r="1.4" />
          <circle cx="15" cy="12" r="1.4" />
          <circle cx="9" cy="18" r="1.4" />
          <circle cx="15" cy="18" r="1.4" />
        </svg>
      </span>
      <span className="text-sm text-ink-softer">{index + 1}</span>
      <span className="text-ink">{name}</span>
    </li>
  )
}
