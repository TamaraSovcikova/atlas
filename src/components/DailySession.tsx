import { useState } from 'react'
import { HomeView } from './HomeView'
import { SessionView } from './SessionView'

type Mode = 'home' | 'session'

export function DailySession() {
  const [mode, setMode] = useState<Mode>('home')

  if (mode === 'session') {
    return (
      <SessionView
        onFinished={() => setMode('home')}
        onCancel={() => setMode('home')}
      />
    )
  }

  return <HomeView onStartSession={() => setMode('session')} />
}
