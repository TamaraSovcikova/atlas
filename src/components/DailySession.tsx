import { HomeView } from './HomeView'
import { SessionView } from './SessionView'
import { SettingsView } from './SettingsView'
import { ConstellationScreen } from './ConstellationScreen'
import { StatsView } from './StatsView'
import type { Domain } from '../db/schema'

type Mode =
  | { kind: 'home' }
  | { kind: 'settings' }
  | { kind: 'constellation' }
  | { kind: 'stats' }
  | { kind: 'session'; shape: 'era'; eraId: string }
  | { kind: 'session'; shape: 'domain'; domain: Domain }
  | { kind: 'session'; shape: 'thread'; threadId: string }
  | { kind: 'session'; shape: 'spaced' }
  | { kind: 'session'; shape: 'daily' }

interface Props {
  mode: Mode
  setMode: (m: Mode) => void
}

export function DailySession({ mode, setMode }: Props) {
  if (mode.kind === 'settings') {
    return <SettingsView onClose={() => setMode({ kind: 'home' })} />
  }

  if (mode.kind === 'constellation') {
    return <ConstellationScreen onClose={() => setMode({ kind: 'home' })} />
  }

  if (mode.kind === 'stats') {
    return <StatsView onClose={() => setMode({ kind: 'home' })} />
  }

  if (mode.kind === 'session') {
    return (
      <SessionView
        shape={mode.shape}
        eraId={mode.shape === 'era' ? mode.eraId : null}
        domain={mode.shape === 'domain' ? mode.domain : null}
        threadId={mode.shape === 'thread' ? mode.threadId : null}
        onFinished={() => setMode({ kind: 'home' })}
        onCancel={() => setMode({ kind: 'home' })}
      />
    )
  }

  return (
    <HomeView
      onStartDaily={() => setMode({ kind: 'session', shape: 'daily' })}
      onStartEra={(eraId) => setMode({ kind: 'session', shape: 'era', eraId })}
      onStartDomain={(domain) => setMode({ kind: 'session', shape: 'domain', domain })}
      onStartThread={(threadId) => setMode({ kind: 'session', shape: 'thread', threadId })}
      onStartSpaced={() => setMode({ kind: 'session', shape: 'spaced' })}
      onOpenConstellation={() => setMode({ kind: 'constellation' })}
      onOpenStats={() => setMode({ kind: 'stats' })}
    />
  )
}

export type { Mode }
