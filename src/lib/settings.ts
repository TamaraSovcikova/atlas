export type Intensity = 'playful' | 'balanced' | 'serious'
export type Theme = 'dark' | 'light'

export interface Prefs {
  intensity: Intensity
  // Overrides. minimiseTyping forces tap-only recall regardless of intensity.
  minimiseTyping: boolean
  enableOrder: boolean
  enableSort: boolean
  enableMap: boolean
  enableContrast: boolean
  showConstellationReveal: boolean
  /** Cards per day that count as "goal met" and extend the streak. */
  dailyGoalCards: number
  /** Streak freezes available to bridge isolated missed days. */
  streakFreezes: number
  /** Visual theme. */
  theme: Theme
  /** Show the due-review count on the installed app icon (Badging API). */
  dueBadge: boolean
}

export const DEFAULT_PREFS: Prefs = {
  intensity: 'balanced',
  minimiseTyping: true,
  enableOrder: true,
  enableSort: true,
  enableMap: true,
  enableContrast: true,
  showConstellationReveal: true,
  dailyGoalCards: 12,
  streakFreezes: 2,
  theme: 'dark',
  dueBadge: true,
}

export const MAX_STREAK_FREEZES = 5

export const GOAL_OPTIONS = [6, 12, 20, 30] as const

export interface Policy {
  // true => tap-the-chip cloze; false => typed cloze
  clozeChips: boolean
  // format used when a concept is brand new
  newConceptFormat: 'free' | 'cloze_chips'
  contrast: boolean
  games: { order: boolean; sort: boolean; map: boolean }
}

export function resolvePolicy(p: Prefs): Policy {
  const minimise = p.minimiseTyping || p.intensity === 'playful'
  const seriousTyping = p.intensity === 'serious' && !p.minimiseTyping
  return {
    clozeChips: minimise ? true : !seriousTyping,
    newConceptFormat: minimise ? 'cloze_chips' : 'free',
    contrast: p.enableContrast,
    games: {
      order: p.enableOrder,
      sort: p.enableSort,
      map: p.enableMap,
    },
  }
}

export const INTENSITY_LABEL: Record<Intensity, { title: string; blurb: string }> = {
  playful: {
    title: 'Playful',
    blurb: 'Pure tap and play. No typing, lots of games. Good for the bus.',
  },
  balanced: {
    title: 'Balanced',
    blurb: 'Tap by default, type new things to lock them in. Games mixed in.',
  },
  serious: {
    title: 'Serious study',
    blurb: 'Type your recall. Hardest and most effective. Games still appear.',
  },
}
