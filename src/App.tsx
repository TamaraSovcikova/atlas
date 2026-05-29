import { useEffect, useState } from 'react'
import { DailySession } from './components/DailySession'
import { db } from './db/schema'
import { loadSeedIfNeeded } from './db/seed'

function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function init() {
      await db.open()
      await loadSeedIfNeeded()
      if (!cancelled) setReady(true)
    }
    init()
    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) {
    return (
      <main className="flex h-full items-center justify-center">
        <p className="text-ink-soft">Loading...</p>
      </main>
    )
  }

  return (
    <main className="mx-auto flex h-full max-w-2xl flex-col px-6 py-10">
      <header className="mb-10">
        <h1 className="font-serif text-3xl font-medium tracking-tight">Atlas</h1>
        <p className="mt-1 text-sm text-ink-softer">
          Ten minutes a day. Forgetting is the learning happening.
        </p>
      </header>
      <DailySession />
    </main>
  )
}

export default App
