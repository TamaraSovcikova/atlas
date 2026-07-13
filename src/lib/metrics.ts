import { db, type DayMetric } from '../db/schema'

/**
 * Local-only usage metrics (§E6). A per-day rollup incremented in place, so the
 * founder can see whether the §4b gate is helping or starving new users without
 * any server telemetry. Best-effort: every write is wrapped so a metrics failure
 * can never block the app, and nothing here ever leaves the device.
 */

export type MetricField = Exclude<keyof DayMetric, 'day' | 'level'>

export type MetricPatch = Partial<Record<MetricField, number>> & { level?: string }

const ZERO: Omit<DayMetric, 'day' | 'level'> = {
  opens: 0,
  feedCards: 0,
  gate1: 0,
  gate2: 0,
  gate3: 0,
  generated: 0,
  deepened: 0,
}

/** Local YYYY-MM-DD key for a timestamp (day boundaries follow the device clock). */
export function dayKey(now = Date.now()): string {
  const d = new Date(now)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** Pure additive merge: numeric fields sum; `level` is overwritten when provided. */
export function mergeMetric(existing: DayMetric | undefined, day: string, patch: MetricPatch): DayMetric {
  const base: DayMetric = existing ?? { day, level: 'some', ...ZERO }
  const out: DayMetric = { ...base, day, level: patch.level ?? base.level }
  for (const k of Object.keys(ZERO) as MetricField[]) {
    out[k] = base[k] + (patch[k] ?? 0)
  }
  return out
}

/**
 * Increment today's rollup. Wrapped in a readwrite transaction so overlapping
 * bumps (e.g. a fast scroll firing several) serialize instead of racing the
 * read-modify-write and dropping increments.
 */
export async function bumpToday(patch: MetricPatch, now = Date.now()): Promise<void> {
  const day = dayKey(now)
  try {
    await db.transaction('rw', db.metrics, async () => {
      const existing = await db.metrics.get(day)
      await db.metrics.put(mergeMetric(existing, day, patch))
    })
  } catch {
    // Metrics are best-effort; never surface or block on a failure.
  }
}

/** Bump the counter for a served gate stage (1/2/3). No-op for out-of-range input. */
export async function recordGateStage(stage: 1 | 2 | 3 | null, now = Date.now()): Promise<void> {
  if (stage == null) return
  await bumpToday({ [`gate${stage}` as MetricField]: 1 }, now)
}

/** All daily rows, newest first. */
export async function readMetrics(): Promise<DayMetric[]> {
  return db.metrics.orderBy('day').reverse().toArray()
}
