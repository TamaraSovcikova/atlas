import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type DayMetric } from '../db/schema'

/**
 * §E6 — a read-only, local-only insights panel. Surfaces the daily usage rollup so
 * the founder can see whether the §4b gate is helping or starving new users. Nothing
 * here is ever sent anywhere; the `metrics` table is excluded from backup/sync.
 */

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-ink/[0.06] bg-bg-soft/50 px-3 py-2">
      <p className="text-lg font-medium tabular-nums text-ink">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-ink-softer">{label}</p>
    </div>
  )
}

export function MetricsPanel() {
  const rows = useLiveQuery(
    () => db.metrics.orderBy('day').reverse().toArray(),
    [],
    [] as DayMetric[],
  )
  const [copied, setCopied] = useState(false)

  if (rows.length === 0) {
    return (
      <p className="text-xs text-ink-softer">
        No activity recorded yet. This fills in as you use Atlas — it stays on this device.
      </p>
    )
  }

  const t = rows.reduce(
    (a, r) => ({
      opens: a.opens + r.opens,
      feedCards: a.feedCards + r.feedCards,
      generated: a.generated + r.generated,
      deepened: a.deepened + r.deepened,
      gate1: a.gate1 + r.gate1,
      gate2: a.gate2 + r.gate2,
      gate3: a.gate3 + r.gate3,
    }),
    { opens: 0, feedCards: 0, generated: 0, deepened: 0, gate1: 0, gate2: 0, gate3: 0 },
  )
  const days = rows.length
  const cardsPerDay = days ? Math.round(t.feedCards / days) : 0
  const gateTotal = t.gate1 + t.gate2 + t.gate3
  const pct = (n: number) => (gateTotal ? Math.round((n / gateTotal) * 100) : 0)

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(rows, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Days active" value={days} />
        <Stat label="Cards seen" value={t.feedCards} />
        <Stat label="Cards / day" value={cardsPerDay} />
        <Stat label="Opens" value={t.opens} />
        <Stat label="Generated" value={t.generated} />
        <Stat label="Deepened" value={t.deepened} />
      </div>

      {gateTotal > 0 && (
        <div className="rounded-xl border border-ink/[0.06] bg-bg-soft/50 px-3 py-2">
          <p className="text-xs font-medium text-ink">Gate progression (new-level batches)</p>
          <p className="mt-0.5 text-[11px] text-ink-softer">
            Foundations {pct(t.gate1)}% · Mid {pct(t.gate2)}% · Open {pct(t.gate3)}%
          </p>
          <p className="mt-1 text-[10px] text-ink-softer">
            Mostly stuck at Foundations can mean the gate is starving; a rising Mid/Open share
            means new users are unlocking depth.
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-ink/[0.06]">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-bg-soft/60 text-ink-softer">
            <tr>
              <th className="px-2.5 py-1.5 font-medium">Day</th>
              <th className="px-2.5 py-1.5 font-medium">Level</th>
              <th className="px-2.5 py-1.5 text-right font-medium">Cards</th>
              <th className="px-2.5 py-1.5 text-right font-medium">Gen</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 7).map((r) => (
              <tr key={r.day} className="border-t border-ink/[0.05]">
                <td className="px-2.5 py-1.5 tabular-nums text-ink-soft">{r.day.slice(5)}</td>
                <td className="px-2.5 py-1.5 text-ink-soft">{r.level}</td>
                <td className="px-2.5 py-1.5 text-right tabular-nums text-ink-soft">{r.feedCards}</td>
                <td className="px-2.5 py-1.5 text-right tabular-nums text-ink-soft">{r.generated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={copyJson}
        className="rounded-xl border border-ink/[0.08] bg-bg-soft/50 px-3 py-1.5 text-xs text-ink-soft transition-colors hover:text-ink"
      >
        {copied ? 'Copied ✓' : 'Copy all metrics (JSON)'}
      </button>
    </div>
  )
}
