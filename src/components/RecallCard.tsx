import type { SessionCard } from '../lib/session'
import type { RecallRating } from '../lib/fsrs'
import { ClozeCard } from './cards/ClozeCard'
import { ContrastCard } from './cards/ContrastCard'
import { FreeCard } from './cards/FreeCard'

interface Props {
  card: SessionCard
  onRated: (rating: RecallRating) => void
}

export function RecallCard({ card, onRated }: Props) {
  switch (card.question.format) {
    case 'cloze':
      return <ClozeCard card={card} onRated={onRated} />
    case 'contrast':
      return <ContrastCard card={card} onRated={onRated} />
    case 'free':
      return <FreeCard card={card} onRated={onRated} />
  }
}
