import { useState } from 'react'
import { M, AnimatePresence } from './ui/motion'
import { Button } from './ui/Button'

interface Props {
  onDone: () => void
}

interface Slide {
  glyph: string
  title: string
  body: string
}

const SLIDES: Slide[] = [
  {
    glyph: '✦',
    title: 'Ten minutes a day',
    body: 'Atlas builds broad knowledge the way memory actually works. A few new ideas each day, then short reviews that catch each one just before it fades.',
  },
  {
    glyph: '🜂',
    title: 'Forgetting is the system working',
    body: 'When a card feels hard, that is the scheduler doing its job. You are never wrong here. You see it, you try, and it returns at the right moment.',
  },
  {
    glyph: '↗',
    title: 'Follow the pathway',
    body: 'Each day is one composed session: due reviews plus a little new material from your current story. Finish a story to unlock the next, then come back tomorrow. That is the whole habit.',
  },
]

export function Onboarding({ onDone }: Props) {
  const [i, setI] = useState(0)
  const slide = SLIDES[i]!
  const last = i === SLIDES.length - 1

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col px-6 py-10">
      <div className="flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait">
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
          onClick={onDone}
          className="text-sm text-ink-softer transition-colors hover:text-ink"
        >
          Skip
        </button>
        <Button onClick={() => (last ? onDone() : setI(i + 1))}>
          {last ? 'Begin' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
