import type { RecallItem } from '../lib/session'
import type { RecallRating } from '../lib/fsrs'
import { ClozeCard } from './cards/ClozeCard'
import { ClozeChipsCard } from './cards/ClozeChipsCard'
import { ContrastCard } from './cards/ContrastCard'
import { FreeCard } from './cards/FreeCard'
import { MapCard } from './cards/MapCard'

interface Props {
  item: RecallItem
  onAnswered: (conceptId: string) => void
  onDone: (ratings: { conceptId: string; rating: RecallRating }[]) => void
}

export function RecallCard({ item, onAnswered, onDone }: Props) {
  switch (item.question.format) {
    case 'cloze_chips':
      return <ClozeChipsCard item={item} onAnswered={onAnswered} onDone={onDone} />
    case 'cloze':
      return <ClozeCard item={item} onAnswered={onAnswered} onDone={onDone} />
    case 'contrast':
      return <ContrastCard item={item} onAnswered={onAnswered} onDone={onDone} />
    case 'free':
      return <FreeCard item={item} onAnswered={onAnswered} onDone={onDone} />
    case 'map':
      return <MapCard item={item} onAnswered={onAnswered} onDone={onDone} />
  }
}
