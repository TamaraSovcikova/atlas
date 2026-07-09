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
  /** New recall minigames (Chat #21). */
  enablePair: boolean
  enableOdd: boolean
  enableDrop: boolean
  enableEraGuess: boolean
  enableMyth: boolean
  showConstellationReveal: boolean
  /** Cards per day that count as "goal met" and extend the streak. */
  dailyGoalCards: number
  /** Streak freezes available to bridge isolated missed days. */
  streakFreezes: number
  /** Visual theme. */
  theme: Theme
  /** Show the due-review count on the installed app icon (Badging API). */
  dueBadge: boolean
  /** Auto-read concept summaries aloud via Web Speech API. */
  listenMode: boolean
  /** Playback speed for Web Speech TTS (0.5 – 2.0, default 1.0). */
  speechRate: number
  /** Era IDs the user flagged as interesting during onboarding. Biases new-concept selection. */
  interestEras: string[]
}

export const DEFAULT_PREFS: Prefs = {
  intensity: 'balanced',
  minimiseTyping: true,
  enableOrder: true,
  enableSort: true,
  enableMap: true,
  enableContrast: true,
  enablePair: true,
  enableOdd: true,
  enableDrop: true,
  enableEraGuess: true,
  enableMyth: true,
  showConstellationReveal: true,
  dailyGoalCards: 12,
  streakFreezes: 2,
  theme: 'light',
  dueBadge: true,
  listenMode: false,
  speechRate: 1.0,
  interestEras: [],
}

export const MAX_STREAK_FREEZES = 5

export const GOAL_OPTIONS = [6, 12, 20, 30] as const

export interface Policy {
  // true => tap-the-chip cloze; false => typed cloze
  clozeChips: boolean
  // format used when a concept is brand new
  newConceptFormat: 'free' | 'cloze_chips'
  contrast: boolean
  games: {
    order: boolean
    sort: boolean
    map: boolean
    pair: boolean
    odd: boolean
    drop: boolean
    eraGuess: boolean
    myth: boolean
  }
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
      // "Sort into categories" retired — it tested domain-labelling rather than
      // recall and read as filler. Forced off regardless of the stored pref;
      // replacement recall games are tracked in the rework plan.
      sort: false,
      map: p.enableMap,
      pair: p.enablePair,
      odd: p.enableOdd,
      drop: p.enableDrop,
      eraGuess: p.enableEraGuess,
      myth: p.enableMyth,
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
