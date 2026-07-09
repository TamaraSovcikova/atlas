import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/schema'
import { cleanText } from '../lib/cleanText'

interface Props {
  text: string
  onConceptClick: (conceptId: string) => void
}

export function LinkedText({ text: rawText, onConceptClick }: Props) {
  const concepts = useLiveQuery(() => db.concepts.toArray(), [])
  // Strip Markdown / LaTeX artifacts (chiefly from AI-generated summaries) so
  // cards never show literal "**", "$x^{2}$", or broken fragments like "+a}$".
  const text = useMemo(() => cleanText(rawText), [rawText])

  const parts = useMemo(() => {
    if (!concepts || concepts.length === 0) return [{ text, id: null as string | null }]
    // Longest names first so "Austria-Hungary" matches before "Hungary"
    const sorted = [...concepts].sort((a, b) => b.name.length - a.name.length)
    const escaped = sorted.map((c) => c.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    const regex = new RegExp(`(${escaped.join('|')})`, 'gi')
    const raw = text.split(regex)
    return raw.map((chunk) => {
      const match = sorted.find((c) => c.name.toLowerCase() === chunk.toLowerCase())
      return { text: chunk, id: match?.id ?? null }
    })
  }, [text, concepts])

  return (
    <>
      {parts.map((part, i) =>
        part.id ? (
          <button
            key={i}
            type="button"
            onClick={() => onConceptClick(part.id!)}
            className="rounded px-0.5 text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
          >
            {part.text}
          </button>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  )
}
