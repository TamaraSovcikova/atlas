import { HomeView } from './HomeView'
import { SessionView } from './SessionView'
import { SettingsView } from './SettingsView'
import type { Domain } from '../db/schema'

type Mode =
  | { kind: 'home' }
  | { kind: 'settings' }
  | { kind: 'session'; shape: 'era'; eraId: string }
  | { kind: 'session'; shape: 'domain'; domain: Domain }
  | { kind: 'session'; shape: 'spaced' }

interface Props {
  mode: Mode
  setMode: (m: Mode) => void
}

export function DailySession({ mode, setMode }: Props) {
  if (mode.kind === 'settings') {
    return <SettingsView onClose={() => setMode({ kind: 'home' })} />
  }

  if (mode.kind === 'session') {
    return (
      <SessionView
        shape={mode.shape}
        eraId={mode.shape === 'era' ? mode.eraId : null}
        domain={mode.shape === 'domain' ? mode.domain : null}
        onFinished={() => setMode({ kind: 'home' })}
        onCancel={() => setMode({ kind: 'home' })}
      />
    )
  }

  return (
    <HomeView
      onStartEra={(eraId) => setMode({ kind: 'session', shape: 'era', eraId })}
      onStartDomain={(domain) => setMode({ kind: 'session', shape: 'domain', domain })}
      onStartSpaced={() => setMode({ kind: 'session', shape: 'spaced' })}
    />
  )
}

export type { Mode }
