import { useEffect, useState } from 'react'
import { db } from '../db/schema'
import type { Concept } from '../db/schema'
import type { RelationType } from '../db/schema'
import { useSettings } from '../store/useSettings'
import { AskThePast } from './AskThePast'

function firstSentence(text: string): string {
  const idx = text.indexOf('. ')
  return idx > 0 ? text.slice(0, idx + 1) : text
}

const RELATION_LABEL: Record<RelationType, string> = {
  caused: 'caused',
  influenced_by: 'influenced',
  contemporary_of: 'contemporary of',
  located_in: 'located in',
  part_of: 'part of',
  opposed: 'opposed',
  successor_of: 'successor of',
  belief_in: 'belief in',
  student_of: 'student of',
}

interface KnownNeighbour {
  name: string
  relation: string
}

interface Props {
  concept: Concept
  threadName: string
  onClose: () => void
}

// The optional deep dive, reached by tapping a concept's title. It is NOT part
// of the core read/recall loop — it adds what a feed card can't fit: the fuller
// story, the knowledge-web connections, and "ask the past". Two beats:
//   0 — The story (richer read)
//   1 — How it connects (web + ask the past)
const TOTAL_BEATS = 2

export function StoryBrief({ concept, threadName, onClose }: Props) {
  const prefs = useSettings((s) => s.prefs)
  const listenMode = prefs.listenMode
  const speechRate = prefs.speechRate ?? 1.0

  const [beat, setBeat] = useState(0)
  const [neighbours, setNeighbours] = useState<KnownNeighbour[]>([])
  const [imgLoaded, setImgLoaded] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    async function loadNeighbours() {
      const edges = await db.edges.where('fromId').equals(concept.id).toArray()
      const known: KnownNeighbour[] = []
      for (const e of edges) {
        if (known.length >= 4) break
        const c = await db.concepts.get(e.toId)
        if (c && c.firstSeenAt !== null) {
          known.push({
            name: c.name,
            relation: RELATION_LABEL[e.relation as RelationType] ?? e.relation,
          })
        }
      }
      setNeighbours(known)
    }
    loadNeighbours()
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [concept.id])

  const hook = firstSentence(concept.summary)
  const connectionSentence =
    neighbours.length > 0
      ? `${concept.name} connects to things you already know: ${neighbours.map((n) => n.name).join(', ')}.`
      : `${concept.name} is a foundation concept — an anchor the rest of the story builds on.`

  const beatText: string[] = [`${concept.name}. ${concept.summary}`, connectionSentence]

  useEffect(() => {
    if (!listenMode || !window.speechSynthesis) return
    const text = beatText[beat]
    if (!text) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = speechRate
    utt.onend = () => setSpeaking(false)
    utt.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(utt)
    return () => {
      window.speechSynthesis?.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listenMode, speechRate, beat, neighbours, concept.id])

  function stopSpeech() {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }

  function toggleSpeech() {
    if (!window.speechSynthesis) return
    const text = beatText[beat]
    if (!text) return
    if (speaking) {
      stopSpeech()
      return
    }
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = speechRate
    utt.onend = () => setSpeaking(false)
    utt.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(utt)
  }

  function goNext() {
    stopSpeech()
    if (beat < TOTAL_BEATS - 1) setBeat(beat + 1)
  }
  function goPrev() {
    stopSpeech()
    if (beat > 0) setBeat(beat - 1)
  }

  const domainLabel = concept.domain.replace('_', ' ')
  const yearLabel = concept.approxYear
    ? `${Math.abs(concept.approxYear)} ${concept.approxYear < 0 ? 'BCE' : 'CE'}`
    : null

  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Header bar */}
      <div className="flex flex-none items-center justify-between px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1.5 text-ink-softer transition-colors hover:text-ink"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Beat progress dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_BEATS }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { stopSpeech(); setBeat(i) }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === beat ? 'w-6 bg-accent' : 'w-1.5 bg-ink/20 hover:bg-ink/40'
              }`}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

        {/* Audio toggle */}
        <button
          type="button"
          onClick={toggleSpeech}
          className={`rounded-full p-1.5 transition-colors ${
            speaking ? 'text-accent' : 'text-ink-softer hover:text-ink'
          }`}
          aria-label={speaking ? 'Stop audio' : 'Listen'}
        >
          {speaking ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
      </div>

      {/* Beat content — scrollable */}
      <div className="flex-1 overflow-y-auto px-6">

        {/* Beat 0: The story */}
        {beat === 0 && (
          <div className="space-y-5 py-6">
            <p className="text-[11px] font-medium uppercase tracking-widest text-ink-softer">
              {domainLabel}{yearLabel ? ` · ${yearLabel}` : ''}
            </p>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-ink">
              {concept.name}
            </h2>
            <p className="text-lg leading-relaxed text-ink-soft">{hook}</p>
            {concept.imageUrl && (
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={concept.imageUrl}
                  alt={concept.name}
                  className="h-44 w-full object-cover transition-opacity duration-500"
                  style={{ opacity: imgLoaded ? 1 : 0 }}
                  onLoad={() => setImgLoaded(true)}
                  onError={(e) => {
                    const el = e.currentTarget.parentElement
                    if (el) el.style.display = 'none'
                  }}
                />
              </div>
            )}
            {concept.summary.length > hook.length && (
              <p className="text-base leading-relaxed text-ink-soft">
                {concept.summary.slice(hook.length).trim()}
              </p>
            )}
            <p className="text-[11px] uppercase tracking-widest text-ink-softer/60">
              From · {threadName}
            </p>
          </div>
        )}

        {/* Beat 1: How it connects */}
        {beat === 1 && (
          <div className="space-y-5 py-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-ink-softer">
                How it connects
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">{concept.name}</h2>
            </div>

            {neighbours.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-ink-soft">
                  This links to things you already know:
                </p>
                <ul className="space-y-2">
                  {neighbours.map((n) => (
                    <li
                      key={n.name}
                      className="flex items-center gap-3 rounded-xl border border-ink/[0.08] bg-bg-soft px-4 py-3"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full bg-accent/60" />
                      <span className="flex-1 text-sm font-medium text-ink">{n.name}</span>
                      <span className="text-[11px] capitalize text-ink-softer">{n.relation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-ink-soft">
                This is a foundation concept — one of the anchors everything else
                will hang from as your map grows.
              </p>
            )}

            <div className="mt-2 border-t border-ink/[0.06] pt-4">
              <AskThePast concept={concept} />
            </div>
          </div>
        )}
      </div>

      {/* Navigation footer */}
      <div className="flex-none px-5 pb-8 pt-3">
        {beat < TOTAL_BEATS - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-on-accent transition-opacity active:opacity-80"
          >
            How it connects →
          </button>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-on-accent transition-opacity active:opacity-80"
            >
              Done
            </button>
            <button
              type="button"
              onClick={goPrev}
              className="w-full rounded-xl border border-ink/[0.08] bg-bg-soft py-2.5 text-sm text-ink-soft transition-colors hover:text-ink"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
