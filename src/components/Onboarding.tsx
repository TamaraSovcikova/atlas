import { useState } from 'react'
import { M, AnimatePresence } from './ui/motion'
import { Button } from './ui/Button'
import { db } from '../db/schema'

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
interface InterestSlide {
  kind: 'interest'
}
type Slide = InfoSlide | InterestSlide

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
  { kind: 'interest' },
]

async function saveInterestEras(selected: string[]) {
  const row = await db.settings.get('prefs')
  const existing = (row?.value as Record<string, unknown>) ?? {}
  await db.settings.put({ key: 'prefs', value: { ...existing, interestEras: selected } })
}

export function Onboarding({ onDone }: Props) {
  const [i, setI] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
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

  async function handleNext() {
    if (last) {
      await saveInterestEras([...selected])
      onDone()
    } else {
      setI(i + 1)
    }
  }

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col px-6 py-10">
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
        <button
          type="button"
          onClick={async () => {
            await saveInterestEras([...selected])
            onDone()
          }}
          className="text-sm text-ink-softer transition-colors hover:text-ink"
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
