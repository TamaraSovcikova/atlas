# TODOS

Deferred work with context. Created by /autoplan (Chat #23, 2026-07-12) during the
§4b knowledge-level gating review; format per gstack TODO conventions.

## P2 — Level-aware AI generation phrasing (E5)

- **What:** Feed `prefs.knowledgeLevel` into the Worker `/ai` generation prompts so
  generated concepts (and eventually recall questions) are phrased at the reader's
  depth; long-term, per-card difficulty from generation replaces the thread-tier
  complexity proxy.
- **Why:** The tier proxy measures thread position, not reader difficulty (a tier-3
  card can be the most accessible in the bank). Generation-aware difficulty is the
  honest fix and the differentiated move for an LLM-native product.
- **Pros:** Real per-card difficulty; better beginner experience; substrate already
  laid (knowledgeLevel pref + complexity notion from §4b).
- **Cons:** Touches worker prompt pipeline + community-sharing dedup (same `ai:` slug
  at different depths); needs a schema decision for storing difficulty.
- **Context:** §4b (2026-07) shipped the soft prefer-within-ceiling gate using min
  thread tier as complexity. See the CEO review 10x check in
  `~/.gstack/projects/TamaraSovcikova-atlas/ceo-plans/2026-07-12-4b-knowledge-gating.md`.
- **Depends on:** §4b shipped.
- **Effort:** M (human) → S with CC.

## P3 — Local instrumentation for gate + retention signals (E6)

- **What:** Lightweight local-only counters (level distribution, gate hit-rate,
  session completion, D1/D7 return) stored in Dexie; a debug view or export.
- **Why:** §4b shipped on founder-user judgment (n=1). If the user base grows,
  there is currently no way to see whether gating helps or hurts.
- **Pros:** Falsifiable product decisions; catches "starved feed" regressions.
- **Cons:** New infra; privacy posture must stay local-first; easy to over-build.
- **Context:** Raised as F1 in the §4b CEO review (outside voice wanted telemetry
  as a precondition; tempered to this TODO).
- **Depends on:** nothing.
- **Effort:** M (human) → S with CC.

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

