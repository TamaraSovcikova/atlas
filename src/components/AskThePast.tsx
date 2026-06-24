import { useRef, useState } from 'react'
import type { Concept } from '../db/schema'
import { askThePast } from '../lib/ai'

/**
 * Ask-the-past chat panel (Wave 4). Embedded in StoryBrief beat 3 and
 * ConceptRabbitHole. Online-only; shows a clear offline/unavailable fallback.
 *
 * Keeps a lightweight local history for the current session only (no persistence).
 */

interface Message {
  role: 'user' | 'assistant'
  text: string
}

interface Props {
  concept: Concept
}

export function AskThePast({ concept }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  async function send() {
    const q = input.trim()
    if (!q || loading) return
    setInput('')
    setError(null)
    const next: Message[] = [...messages, { role: 'user', text: q }]
    setMessages(next)
    setLoading(true)

    const res = await askThePast(concept.name, concept.summary, q)

    setLoading(false)
    if (res.ok) {
      setMessages([...next, { role: 'assistant', text: res.reply }])
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    } else {
      setError(res.error)
    }
    inputRef.current?.focus()
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const starters = [
    `What made ${concept.name} so significant?`,
    `What should I understand about this?`,
    `How does this connect to what came after?`,
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium uppercase tracking-widest text-ink-softer">
          Ask the past
        </span>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
          AI · online
        </span>
      </div>

      {/* Message thread */}
      {messages.length > 0 && (
        <div className="max-h-52 space-y-3 overflow-y-auto rounded-2xl border border-ink/[0.07] bg-bg-soft/60 p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'text-right text-ink-soft'
                  : 'text-ink'
              }`}
            >
              {m.role === 'assistant' && (
                <span className="mb-1 block text-[10px] uppercase tracking-wide text-ink-softer">
                  {concept.name}
                </span>
              )}
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="text-sm text-ink-softer">
              <span className="animate-pulse">…</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Starter prompts (before first message) */}
      {messages.length === 0 && !loading && (
        <div className="flex flex-wrap gap-1.5">
          {starters.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setInput(s); inputRef.current?.focus() }}
              className="rounded-full border border-ink/[0.08] bg-bg-soft px-3 py-1.5 text-[11px] text-ink-soft transition-colors hover:border-accent/30 hover:text-ink"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="rounded-xl bg-bg-softer px-3 py-2 text-xs text-ink-soft">{error}</p>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Ask anything…"
          className="min-w-0 flex-1 rounded-xl border border-ink/[0.08] bg-bg px-4 py-2.5 text-sm text-ink placeholder:text-ink-softer/60 focus:border-accent/50 focus:outline-none"
        />
        <button
          type="button"
          disabled={!input.trim() || loading}
          onClick={send}
          className="flex-none rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent transition-opacity disabled:opacity-40 active:opacity-80"
        >
          Ask
        </button>
      </div>
    </div>
  )
}
