import { LazyMotion, domAnimation, m, AnimatePresence } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Lightweight motion setup. We import the `m` component plus the
 * `domAnimation` feature bundle via LazyMotion, which keeps the shipped
 * animation runtime far smaller than the full `motion` component
 * (~20KB gz instead of ~34KB). Use `<M.div>` etc. everywhere instead of
 * `motion.div`.
 */
export const M = m
export { AnimatePresence }

export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>
}

// Shared transition presets so motion feels consistent across the app.
export const spring = { type: 'spring' as const, stiffness: 380, damping: 30 }
export const ease = { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }

export type SwipeDir = 'left' | 'right' | null

export const cardVariants = {
  enter: (dir: SwipeDir) => ({
    opacity: 0,
    x: dir === 'right' ? -56 : dir === 'left' ? 56 : 0,
    y: dir ? 4 : 14,
    scale: 0.97,
  }),
  center: { opacity: 1, x: 0, y: 0, scale: 1 },
  exit: (dir: SwipeDir) => ({
    opacity: 0,
    x: dir === 'left' ? -160 : dir === 'right' ? 160 : 0,
    y: dir ? 0 : -10,
    scale: dir ? 0.92 : 0.99,
    rotate: dir === 'left' ? -5 : dir === 'right' ? 5 : 0,
  }),
}

export const cardTransition = {
  type: 'spring' as const,
  stiffness: 360,
  damping: 30,
  mass: 0.85,
}
