# TODOS

Deferred work with context. Created by /autoplan (Chat #23, 2026-07-12) during the
§4b knowledge-level gating review; format per gstack TODO conventions.

## DONE — Level-aware AI generation (E5, Chat #23, 2026-07-12)

Shipped the complete/robust variant. Generation (`generateConcept` /
`generateDeeperConcepts`) takes the reader's `knowledgeLevel` and phrases the card
for that depth, and returns a per-card `complexity` (1-3) that the §4b gate folds
in via `buildComplexityMap` for untiered concepts (fixing tier≠difficulty for AI
cards). Community sharing keeps per-level variants: `some` = base id `ai:<slug>`,
`new`/`confident` = `ai:<slug>#new`/`#confident` (first-writer-wins per level, no
worker change — the worker is id-opaque). LOCALLY every AI concept stays under its
base id so edges/reviews/deepen never fragment; `insertAiConcept` upserts and only
overwrites text/complexity when an incoming variant is a strictly better fit for
the reader (`aiVariant.ts` — pure, convergent, unit-tested). New: `src/lib/aiVariant.ts`.
**Remaining sub-scope not built:** AI-generated recall QUESTIONS (make `ai:`
concepts quizzable) — still a separate future task.

## DONE — Local instrumentation (E6, Chat #23, 2026-07-12)

Local-only daily metrics rollup: new `metrics` Dexie table (v6, excluded from
backup/sync), `src/lib/metrics.ts` (pure additive `mergeMetric` + race-safe
`bumpToday` in a rw transaction). Counts opens, feed cards seen, gate stage
served (1/2/3), generations, deepens. Read-only Insights panel in Settings
(`MetricsPanel.tsx`): stat tiles, a gate-progression line (Foundations/Mid/Open %
of 'new'-level batches — the "is the gate starving?" signal), a 7-day table, and
copy-JSON export. No server telemetry. Verified live. **Not built:** D1/D7 return
cohorting and session-completion counting (would need launch-history analysis;
the per-day `opens` rollup is the raw material if wanted later).

## P3 — Behavioral placement (E8)

- **What:** Infer knowledge level from first-session behavior (recall accuracy,
  "Got it" latency, swipe-away rate) instead of / in addition to the onboarding
  question; adjust the ceiling automatically.
- **Why:** Self-reported level is a weak signal (novices overclaim); Duolingo-style
  placement is the industry-standard correction.
- **Pros:** Zero onboarding friction; objective; self-healing for mis-answers.
- **Cons:** Cold-start (session 1) still unsolved; large build; the §4b reps-based
  progression already self-corrects within days.
- **Context:** Approach C in the §4b CEO review 0C-bis; deliberately deferred.
- **Depends on:** E6 (needs the behavioral signals recorded).
- **Effort:** L (human) → M with CC.

## P3 — DESIGN.md refresh (stale directive)

- **What:** Update `DESIGN.md` (last set 2026-05-31): the "constellation must be
  the hero of the home screen / visible during a session" directive was superseded
  by the July feed rework (feed is home; constellation is the tertiary "Web" view
  in AtlasViz). Re-state the current visual north star.
- **Why:** A stale north-star doc misleads future UI sessions that are told to
  calibrate every decision against it.
- **Pros:** Cheap; prevents a future agent from "fixing" the feed back into a
  constellation hero.
- **Cons:** None beyond 15 minutes of writing.
- **Context:** Flagged during the §4b design review (Phase 2, Step 0).
- **Depends on:** nothing.
- **Effort:** S.

