import { create } from 'zustand'
import { db } from '../db/schema'
import { DEFAULT_PREFS, sanitizeKnowledgeLevel, type Prefs } from '../lib/settings'

const PREFS_KEY = 'prefs'

interface SettingsState {
  prefs: Prefs
  loaded: boolean
  load: () => Promise<void>
  update: (patch: Partial<Prefs>) => Promise<void>
}

export const useSettings = create<SettingsState>((set, get) => ({
  prefs: DEFAULT_PREFS,
  loaded: false,
  load: async () => {
    const row = await db.settings.get(PREFS_KEY)
    const stored = (row?.value as Partial<Prefs> | undefined) ?? {}
    const merged = { ...DEFAULT_PREFS, ...stored }
    merged.knowledgeLevel = sanitizeKnowledgeLevel(merged.knowledgeLevel)
    set({ prefs: merged, loaded: true })
  },
  update: async (patch) => {
    const next = { ...get().prefs, ...patch }
    set({ prefs: next })
    await db.settings.put({ key: PREFS_KEY, value: next })
  },
}))
