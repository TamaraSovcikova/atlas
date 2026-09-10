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

## DONE — Behavioral placement (E8, Chat #24, 2026-07-19)

Shipped the safe half. New `src/lib/placement.ts`: `behaviouralAnchorBonus` credits earned
anchor-equivalents (up to MAX_ANCHOR_BONUS=5, past MIN_STRONG_ANCHORS=3) for tier-1 anchors
handled strongly (reps>=2, 0 lapses, FSRS difficulty<=5), added to `computeAnchorsMet` before
`complexityCeiling` in `feed.ts` + `session.ts`. Accelerates ONLY the 'new' ceiling, so
'some'/'confident' rng stays bit-identical; stateless + self-healing (recomputed from live
Review rows, so a lapsed anchor stops counting). Existing "Deeper waters unlocked" pill fires
sooner for free. Unit-tested (placement.test.ts). **Deliberately deferred:** the over-claim
direction (demoting a struggling self-declared 'some'/'confident' user) -- that gates a
self-declared level and draws the bias coin, breaking the 'some' bit-identity guarantee, so it
needs its own UX. Cold-start (session 1) still unsolved by design.

<details><summary>original spec</summary>

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

</details>

## DONE — DESIGN.md refresh (Chat #24, 2026-07-19)

Rewrote the stale "constellation = home-screen hero / current home is a regression to undo"
directive to record the July feed rework: feed IS the home, the star atlas lives on the Atlas
tab (Map / Timeline / Web). Framed as a change of PLACE not identity (brightness=retention,
hue=domain still govern). Also fixed the tooling note (Preview MCP does not run from the WSL
UNC path; headless throttles rAF so motion needs a real foreground browser). Commit 5b4efcb.

## P2 — AI recall Qs: perf + coverage follow-ups (Chat #24, 2026-07-19)

- **What:** Two loose ends from the AI-recall-questions `/review`.
  1. **Perf:** `makeSynthRecallItem` calls `buildMcqDistractors`, which deserializes ~320
     full same-domain Concept rows per synth card on the FEED path (previously
     `makeRecallItem` returned null at zero cost). Switch to
     `db.concepts.where('domain').equals(d).primaryKeys()` + `bulkGet` of the hashed top 3.
  2. **Coverage:** the repo has NO DB test infra (`fake-indexeddb` absent). `makeRecallItem`'s
     contract inverted (null -> returns a card) and all of `community.ts` (writeAiLesson,
     sanitizeRecallQuestions, the 3 insert branches) is untested. Add fake-indexeddb + cover.
  3. **Verify the worker upgrade-only upsert** against a LOCAL D1 (a live POST writes junk to
     the shared bank). Confirm an old row with no recallQuestions gains them and re-serves via
     the created_at cursor.
- **Context:** `/review` Chat #24; the testing specialist rated the coverage gap the top risk.
- **Effort:** M.

## P3 — Onboarding visual polish (design opinions, Chat #24)

- **What:** Two `/design-review` findings left as taste calls, not fixed: (a) onboarding is
  centred-everything inside a centred card (DESIGN.md wants editorial asymmetry; also AI-slop
  pattern #4); (b) emoji as hero iconography (`✦ 🜂 ↗`) vs the "consistent custom line set"
  the brief asks for.
- **Effort:** S each. Needs a taste call before building.

