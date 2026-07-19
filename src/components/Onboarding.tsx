import { useState } from 'react'
import { M, AnimatePresence } from './ui/motion'
import { Button } from './ui/Button'
import { db } from '../db/schema'
import {
  KNOWLEDGE_LEVELS,
  KNOWLEDGE_LEVEL_LABEL,
  type KnowledgeLevel,
} from '../lib/settings'

interface Props {
  onDone: () => void
}

const ERA_OPTIONS = [
  { id: 'antiquity', label: 'Ancient World', years: '3000–500 BCE' },
  { id: 'classical', label: 'Classical Antiquity', years: '500 BCE–500 CE' },
  { id: 'medieval', label: 'Medieval World', years: '500–1300' },
  { id: 'renaissance', label: 'Renaissance', years: '1300–1600' },
  { id: 'enlightenment', label: 'Enlightenment', years: '1600–1789' },
  { id: 'revolution', label: 'Age of Revolution', years: '1789–1815' },
  { id: 'long19c', label: '19th Century', years: '1815–1914' },
  { id: 'worldwars', label: 'The World Wars', years: '1914–1945' },
  { id: 'coldwar', label: 'The Cold War', years: '1945–1989' },
  { id: 'postcoldwar', label: 'After the Cold War', years: '1989–2008' },
]

interface InfoSlide {
  kind: 'info'
  glyph: string
  title: string
  body: string
}
interface LevelSlide {
  kind: 'level'
}
interface InterestSlide {
  kind: 'interest'
}
type Slide = InfoSlide | LevelSlide | InterestSlide

const SLIDES: Slide[] = [
  {
    kind: 'info',
    glyph: '✦',
    title: 'Ten minutes a day',
    body: 'Atlas builds broad knowledge the way memory actually works. A few new ideas each day, then short reviews that catch each one just before it fades.',
  },
  {
    kind: 'info',
    glyph: '🜂',
    title: 'Forgetting is the system working',
    body: 'When a card feels hard, that is the scheduler doing its job. You are never wrong here. You see it, you try, and it returns at the right moment.',
  },
  {
    kind: 'info',
    glyph: '↗',
    title: 'Follow the pathway',
    body: 'Each day is one composed session: due reviews plus a little new material from your current story. Finish a story to unlock the next, then come back tomorrow.',
  },
  { kind: 'level' },
  { kind: 'interest' },
]

export function Onboarding({ onDone }: Props) {
  const [i, setI] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [level, setLevel] = useState<KnowledgeLevel | null>(null)
  const slide = SLIDES[i]!
  const last = i === SLIDES.length - 1

  function toggleEra(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // One write for everything the flow collected, used by Begin AND Skip so a
  // level tapped before skipping is never discarded. An unanswered level is
  // simply omitted (DEFAULT_PREFS supplies 'some'). A rejected put (private
  // browsing, storage quota) must never strand the user on the last slide.
  async function persist() {
    try {
      const row = await db.settings.get('prefs')
      const existing = (row?.value as Record<string, unknown>) ?? {}
      const next: Record<string, unknown> = { ...existing, interestEras: [...selected] }
      if (level) next.knowledgeLevel = level
      await db.settings.put({ key: 'prefs', value: next })
    } catch (err) {
      console.warn('onboarding: could not save preferences, continuing with defaults', err)
    }
  }

  async function handleNext() {
    if (last) {
      await persist()
      onDone()
    } else {
      setI(i + 1)
    }
  }

  // min-h-dvh, not min-h-full: the parent <main> only sets min-height:100%, so its
  // own height stays `auto` and a percentage min-height here has no definite basis
  // to resolve against. It collapsed to content height (407px in an 844px viewport),
  // stranding the card at the top with half the screen empty. dvh is viewport-relative
  // and tracks the mobile URL bar.
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-10">
      <div className="flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait">
          {slide.kind === 'info' ? (
            <M.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="surface p-8 text-center"
            >
              <div className="text-4xl">{slide.glyph}</div>
              <h2 className="mt-4 font-serif text-2xl text-ink">{slide.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{slide.body}</p>
            </M.div>
          ) : slide.kind === 'level' ? (
            <M.div
              key="level"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="surface p-6"
            >
              <div className="text-center">
                <div className="text-3xl">🧭</div>
                <h2 className="mt-3 font-serif text-xl text-ink">
                  How much do you already know?
                </h2>
                <p className="mt-2 text-sm text-ink-softer">Atlas will pace new material to match.</p>
              </div>
              <div className="mt-5 space-y-2" role="radiogroup" aria-label="Knowledge level">
                {KNOWLEDGE_LEVELS.map((key) => {
                  const active = level === key
                  const label = KNOWLEDGE_LEVEL_LABEL[key]
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setLevel(key)}
                      className={`w-full rounded-2xl border p-4 text-left transition-colors active:scale-[0.99] ${
                        active
                          ? 'border-accent/70 bg-accent/10'
                          : 'border-ink/[0.08] bg-bg-soft/60 hover:border-accent/40'
                      }`}
                    >
                      <p className={`text-sm font-medium ${active ? 'text-accent' : 'text-ink'}`}>
                        {label.title}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-softer">{label.blurb}</p>
                    </button>
                  )
                })}
              </div>
              {level === null && (
                <p className="mt-3 text-center text-[11px] text-ink-softer">
                  Not sure? Atlas starts balanced and adjusts as you go.
                </p>
              )}
              <p className="mt-1.5 text-center text-[11px] text-ink-softer">
                You can change this anytime in Settings.
              </p>
            </M.div>
          ) : (
            <M.div
              key="interest"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="surface p-6"
            >
              <div className="text-center">
                <div className="text-3xl">🌍</div>
                <h2 className="mt-3 font-serif text-xl text-ink">What draws you most?</h2>
                <p className="mt-2 text-sm text-ink-softer">
                  Pick any eras that interest you. Atlas will gently lean your new material toward them.
                  You can always explore everything.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {ERA_OPTIONS.map((era) => {
                  const on = selected.has(era.id)
                  return (
                    <button
                      key={era.id}
                      type="button"
                      onClick={() => toggleEra(era.id)}
                      className={`flex flex-col rounded-xl border px-3 py-2 text-left transition-all active:scale-[0.97] ${
                        on
                          ? 'border-accent/60 bg-accent/10 text-accent'
                          : 'border-ink/[0.08] bg-bg-soft/60 text-ink-soft hover:border-accent/30 hover:text-ink'
                      }`}
                    >
                      <span className="text-[13px] font-medium leading-tight">{era.label}</span>
                      <span className="text-[10px] opacity-60">{era.years}</span>
                    </button>
                  )
                })}
              </div>
              {selected.size === 0 && (
                <p className="mt-3 text-center text-[11px] text-ink-softer">
                  No preference — that is fine too. You will get a balanced mix.
                </p>
              )}
            </M.div>
          )}
        </AnimatePresence>

        {/* Progress dots */}
        <div className="mt-6 flex justify-center gap-2">
          {SLIDES.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? 'w-6 bg-accent' : 'w-1.5 bg-bg-softer'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* Negative margin keeps the label optically flush with the container edge
            while the padding gives it a real 44px touch target (it measured 29x20).
            ink-soft, not ink-softer: softer is ~3.5:1 on paper, under WCAG AA. */}
        <button
          type="button"
          onClick={async () => {
            await persist()
            onDone()
          }}
          className="-mx-3 -my-3 px-3 py-3 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          Skip
        </button>
        <Button onClick={handleNext}>
          {last ? 'Begin' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
