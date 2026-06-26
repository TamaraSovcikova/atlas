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

  const leftFill = useTransform(x, [-THRESHOLD, -12, 0], [1, 0.35, 0])
  const rightFill = useTransform(x, [0, 12, THRESHOLD], [0, 0.35, 1])
  const againScale = useTransform(x, [-THRESHOLD, 0], [1.3, suggestedRating === 'again' ? 0.9 : 0.72])
  const goodScale = useTransform(x, [0, THRESHOLD], [suggestedRating === 'good' ? 0.9 : 0.72, 1.3])
  const hintOpacity = useTransform(x, [-THRESHOLD / 2, 0, THRESHOLD / 2], [0, 1, 0])
  const rotate = useTransform(x, [-THRESHOLD, THRESHOLD], [-2, 2])

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
      style={{ x, rotate, touchAction: 'pan-y' }}
      drag="x"
      dragConstraints={{ left: -300, right: 300 }}
      dragElastic={0.06}
      onDragStart={() => { dragDist.current = 0 }}
      onDrag={(_: unknown, info: { offset: { x: number } }) => {
        dragDist.current = Math.abs(info.offset.x)
      }}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className="relative overflow-hidden rounded-2xl border border-ink/[0.08] cursor-grab select-none active:cursor-grabbing"
    >
      {/* colored fills */}
      <M.div style={{ opacity: leftFill }} className="pointer-events-none absolute inset-0 bg-red-500/22" />
      <M.div style={{ opacity: rightFill }} className="pointer-events-none absolute inset-0 bg-accent/18" />

      <div className="relative flex items-center justify-between px-5 py-4">
        <M.div style={{ scale: againScale }} className="flex items-center gap-2.5 text-red-400">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-400/35 bg-red-500/12">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </div>
          <span className="text-sm font-medium">See again</span>
        </M.div>

        <M.span style={{ opacity: hintOpacity }} className="text-[10px] uppercase tracking-wider text-ink-softer">
          {hint}
        </M.span>

        <M.div style={{ scale: goodScale }} className="flex items-center gap-2.5 text-accent">
          <span className="text-sm font-medium">Got it</span>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/35 bg-accent/10">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        </M.div>
      </div>
    </M.div>
  )
}
