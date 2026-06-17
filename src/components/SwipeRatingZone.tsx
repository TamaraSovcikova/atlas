import { useRef } from 'react'
import { useMotionValue, useTransform } from 'motion/react'
import { M } from './ui/motion'
import type { RecallRating } from '../lib/fsrs'

interface Props {
  onRate: (rating: RecallRating) => void
  suggestedRating: RecallRating | null
}

const THRESHOLD = 80

export function SwipeRatingZone({ onRate, suggestedRating }: Props) {
  const x = useMotionValue(0)
  const dragDist = useRef(0)

  const againOpacity = useTransform(x, [-THRESHOLD, 0], [1, suggestedRating === 'again' ? 0.65 : 0.3])
  const goodOpacity = useTransform(x, [0, THRESHOLD], [suggestedRating === 'good' ? 0.65 : 0.3, 1])
  const bgColor = useTransform(
    x,
    [-THRESHOLD, 0, THRESHOLD],
    ['rgba(239,68,68,0.12)', 'rgba(0,0,0,0)', 'rgba(212,175,112,0.12)'],
  )

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x <= -THRESHOLD) onRate('again')
    else if (info.offset.x >= THRESHOLD) onRate('good')
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (dragDist.current > 8) {
      dragDist.current = 0
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    onRate(e.clientX - rect.left < rect.width / 2 ? 'again' : 'good')
  }

  const hint =
    suggestedRating === 'good'
      ? 'got it?'
      : suggestedRating === 'again'
        ? 'see it again?'
        : 'how did it go?'

  return (
    <M.div
      style={{ x, backgroundColor: bgColor }}
      drag="x"
      dragConstraints={{ left: -300, right: 300 }}
      dragElastic={0.08}
      onDragStart={() => {
        dragDist.current = 0
      }}
      onDrag={(_: unknown, info: { offset: { x: number } }) => {
        dragDist.current = Math.abs(info.offset.x)
      }}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className="flex cursor-grab select-none items-center justify-between rounded-2xl border border-white/[0.08] px-5 py-4 active:cursor-grabbing"
    >
      <M.div style={{ opacity: againOpacity }} className="flex items-center gap-2 text-red-400">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span className="text-sm font-medium">See again</span>
      </M.div>
      <span className="text-[11px] uppercase tracking-wider text-ink-softer">{hint}</span>
      <M.div style={{ opacity: goodOpacity }} className="flex items-center gap-2 text-accent">
        <span className="text-sm font-medium">Got it</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </M.div>
    </M.div>
  )
}
