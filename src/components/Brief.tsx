import { useState } from 'react'
import type { Concept } from '../db/schema'
import { LinkedText } from './LinkedText'

interface Props {
  concept: Concept
  variant?: 'intro' | 'reveal'
  onConceptClick?: (conceptId: string) => void
}

export function Brief({ concept, variant = 'intro', onConceptClick }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const tone =
    variant === 'intro'
      ? 'border-accent/30 bg-accent/5'
      : 'border-bg-softer/30 bg-bg-soft/50'
  return (
    <section className={`rounded-2xl border ${tone} p-5`}>
      {variant === 'intro' && (
        <p className="text-[11px] uppercase tracking-wider text-accent">New today</p>
      )}
      <h3 className="mt-1 font-serif text-lg text-ink">{concept.name}</h3>
      {variant === 'intro' && concept.imageUrl && (
        <div className="mt-3 overflow-hidden rounded-xl">
          <img
            src={concept.imageUrl}
            alt={concept.name}
            className="h-36 w-full object-cover transition-opacity duration-500"
            style={{ opacity: imgLoaded ? 1 : 0 }}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              const el = e.currentTarget.parentElement
              if (el) el.style.display = 'none'
            }}
          />
        </div>
      )}
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        {onConceptClick ? (
          <LinkedText text={concept.summary} onConceptClick={onConceptClick} />
        ) : (
          concept.summary
        )}
      </p>
      {concept.wikipediaUrl && (
        <a
          href={concept.wikipediaUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-ink/[0.10] bg-bg-soft px-3 py-1 text-[11px] text-ink-softer transition-colors hover:border-accent/40 hover:text-ink"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.09 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm-1.5 14.5v-9l6.5 4.5-6.5 4.5z"/></svg>
          Read on Wikipedia
        </a>
      )}
      {variant === 'intro' && (
        <p className="mt-4 border-t border-ink/[0.07] pt-3 text-[11px] text-ink-softer">
          Read this, then try it below. Getting it wrong the first time is fine — that is how it sticks.
        </p>
      )}
    </section>
  )
}
