# Atlas

General-knowledge PWA built on FSRS-6 spaced repetition. Ten minutes a day, local-first, free to run.

> Full description, purpose, success criteria: `~/workspace/Projects/Atlas/docs/PURPOSE.md`

## Stack

- TypeScript + React + Vite + Tailwind
- Local DB: Dexie (IndexedDB) -- source of truth on every device
- Spaced repetition: `ts-fsrs` (FSRS-6) | State: Zustand
- Sync (Phase 2+): Cloudflare Workers + D1 (bearer-token-as-account; see `~/devhub/recurring_decisions.md`)
- Hosting: Cloudflare Pages, PWA installable | Tests: Vitest

## Layout

```
src/
  components/     React UI (DailySession, SessionView, RecallCard, SwipeRatingZone, cards/)
  db/             schema.ts (Dexie v4), seed.ts
  lib/            fsrs.ts, session.ts, connections.ts
  content/        bank/*.ts, threads.ts, index.ts -- shared knowledge bank
public/
  world-110m.json, fonts/, favicon.svg
```

## Run

```bash
source ~/.nvm/nvm.sh   # WSL non-login shell needs this
npm install
npm run dev            # Vite dev server at :5173
npm test               # Vitest (co-located *.test.ts)
npm run type-check     # tsc --noEmit
```

Deploy: `source ~/.nvm/nvm.sh && npm run build && npx wrangler pages deploy dist --project-name atlas` (run inside WSL). The atlas-deploy skill was removed; use this directly.

Live: **https://atlas-6uj.pages.dev** (OAuth as tamara.sovcik@gmail.com). PWA service worker caches old build -- two loads to see a new deploy.

## Current state

> **Next-work plan:** `~/workspace/Projects/Atlas/docs/PLAN_NEXT.md` (single source for remaining items + how to build each). Design rationale in `docs/REWORK_PLAN_2026-07.md`.

2026-07-12 (Chat #23, E6): **Local metrics + Timeline fix** (deploy 83060241). E6: `metrics` Dexie table v6 (excluded from backup/sync), `src/lib/metrics.ts` (pure `mergeMetric` + race-safe `bumpToday`), read-only Insights panel in Settings (`MetricsPanel.tsx`) with gate-progression signal + copy-JSON; local-only. Timeline (`TimeRiver` in AtlasViz): was jumbled (nodes positioned by year, no collision avoidance) — rewrote to even chronological rows, growing band height, centered river + alternating labels. Swipe check: swiping is a CORE feature (never removed; the infinite-swipe feed + deepen-on-swipe), not a bug. 96 tests.

2026-07-12 (Chat #23, E5): **Level-aware AI generation** shipped (commit 67ee81a, deploy 10b697e7). `generateConcept`/`generateDeeperConcepts` take `knowledgeLevel` and phrase cards for that depth + return a `difficulty` 1-3 stored as `Concept.complexity`, folded into the §4b gate for untiered concepts (fixes tier≠difficulty for AI cards). Per-level community variants: `some`=`ai:<slug>`, `new`/`confident`=`ai:<slug>#new`/`#confident` (first-writer-wins per level; worker unchanged). Locally every AI concept stays under its BASE id (no edge/review/deepen fragmentation); new pure `src/lib/aiVariant.ts`; `insertAiConcept` upserts to the reader's best-available variant; Settings level change calls `repullForLevel`. Phrasing proven live. 92 tests. AI recall questions still not built.

2026-07-12 (Chat #23): **§4b knowledge-level gating** shipped via /autoplan (full CEO/design/eng review; plan + audit trail in `~/.gstack/projects/TamaraSovcikova-atlas/`). Onboarding gains a knowledge-level slide (`new`/`some`/`confident`, changeable in Settings); NEW `src/lib/gating.ts` derives per-concept complexity = min thread tier (untiered → 2) and a reps-based ceiling (10/20 anchors). The gate is a **soft bias, never a filter**: feed discovery draws an 80/20 within-ceiling coin (rng-guarded so `'some'` stays bit-identical — regression-proven), the daily Spine fills within-ceiling first then spills (global two-pass), due reviews and the deepQueue are never gated. `'confident'` = all tiers unlocked everywhere (feed, Spine, thread sessions, pathway counts). Feed pill: "Foundations first" → one-shot "Deeper waters unlocked" (`gate:ceilingAck` kv). Onboarding now persists ONE prefs put at Begin AND Skip (level tap before Skip is kept; save failure caught) and App reloads settings after onboarding (fixed stale-store gap). 83 tests. TODOS.md created (E5 gen-phrasing, E6 instrumentation, E8 behavioral placement, DESIGN.md refresh).

2026-07-09 (Chat #22): Three shipped items (deployed pages 66720277, worker 8de89971; `main` pushed to origin). (A) **/review pass on the minigames** -> found + fixed relational games recording FSRS *lapses* (`again`) on every involved concept for one wrong answer; softened grading so misses use `hard` (non-lapsing) or grade only the decision's target (Odd/Era/Pair), Timeline-Drop grades only the target not the context anchors. (B) **Global AI concepts + search fix**: generated cards now shared, not just local -- Worker `GET/POST /concepts` + D1 `community_concepts`; stable `ai:<slug>` ids dedup a topic across users (first-writer-wins); `src/lib/community.ts` contributes on generate + pulls on startup; `ai.ts` mints stable ids. Search now splits name-matches ("Concepts") from summary-only ("Mentioned in") and offers Generate whenever no card is *about* the query (fixes a mentioned-but-no-card person masking generation). (C) **Deepen-on-demand (§4a)**: swipe "More" on a topic with <3 unseen neighbours -> `ai.generateDeeperConcepts` -> inserts concepts (+review rows, +seed->concept edges), contributes to community, surfaces next in the feed ("Digging deeper..." indicator). Fixed latent `seed.ts` bug that DELETED all `ai:` concepts on every bank version bump -- now preserves `ai:` concepts + their edges. 64 tests. **Remaining plan: §4b knowledge-level gating (next), §7 how-things-work + categories + feed toggles, §3 per-card ribbon/mini-map, §5 mini-graph, §1 More/Less/Save, §6 pathway anchors.**

2026-07-09 (Chat #21): Implemented two big plan items. (A) **Five new recall minigames** replacing the retired Sort game: Connect-the-Pair (graph edges), Odd-One-Out (era/domain bond), Timeline-Drop (insert one event), Guess-the-Era (progressive clues), Two-Truths-&-a-Myth (perturbed fact). Unified `kind:'game'` `SessionItem` with a `variant` + fully-serialisable `data` payload -> pass-through persistence; pure builders in `session.ts` (unit-tested); `injectGames` now async (fetches edges/era-names), claims concepts, caps 2 new games/session; new `GameCard.tsx` dispatches all five; 5 `enableX` prefs + Settings toggles. (B) **Atlas visualizations** (`AtlasViz.tsx`, now the Atlas-tab "Map" panel, replacing the constellation there): a Map/Timeline/Web toggle. **Map** = fog-of-war eras on aged-paper SVG (mist lifts with met fraction, mastery core glows, tap -> era session); **Timeline** = river-of-time vertical bands with concepts as lit stones by year (tap -> rabbit hole); **Web** = old constellation kept tertiary. `useAtlasData` derives per-era/per-concept mastery via `mastery.ts`. 64 tests. Deploy: https://95b07571.atlas-6uj.pages.dev

2026-07-08 (Chat #20): Five quick fixes + rework master plan (`docs/REWORK_PLAN_2026-07.md`). (1) **AI "Network error: failed to fetch" fixed** -- Worker `/ai` read a non-existent `value` column on `backups` (it's `payload`), threw a D1 error -> Cloudflare 1101 with NO CORS -> browser "failed to fetch". Fixed the column, added Gemini->Groq cascade, wrapped fetch handler in try/catch so all errors carry CORS. Live `/ai` returns 200. (2) **Text artifacts** (`+a}$`, formulas, `**bold**` from AI summaries): new `src/lib/cleanText.ts` (unicode super/subscripts, strips LaTeX/Markdown, keeps real "$13 billion"), wired into `LinkedText`; 8 tests. (3) **Reading-speed chip** in `FeedView` header (listen mode on). (4) **Covered-concepts/eras reliability**: `FeedView` now seeds every scrolled-past concept + the current card on tab-hide/pagehide/unmount (Chat #19's seed-on-leave missed fast flicks + the last card -> "shows as New" and "Eras you know" not updating). (5) **Sort-into-categories minigame retired** (`resolvePolicy` forces `games.sort=false`; Settings toggle removed). 57 tests. Deploy: https://0c9caf3a.atlas-6uj.pages.dev

2026-07-08 (Chat #19): Bug fix -- new concept cards reappearing as "New" in later sessions. Root cause: two advancement paths existed for new (kind:'concept') cards but only one seeded FSRS. The "Got it" button called `recordRating` (setting `firstSeenAt`). An interest swipe or plain scroll-past advanced the card via `FeedView.handleInterest`/`handleCurrentChange` without ever calling `recordRating`, leaving `firstSeenAt = null`. Fix: `FeedView.handleCurrentChange` now auto-seeds any new concept card leaving the viewport without prior grading (tracked with a `gradedKeys` ref parallel to `swipedKeys`). 48 tests still green.

2026-06-26 (Chat #18): TikTok-style feed is the home. `src/lib/feed.ts` recommender = InterestWeights in settings kv `feed:interest:v1`; swipe-left boosts a topic +queues graph neighbours (deepQueue), swipe-right decays, swipe-up = dwell; weights floored 0.25 / capped 3.0; ~25% exploration floor; due reviews interleaved (the Spine wins); diversity guard; pure functions unit-tested. `FeedView.tsx` = vertical scroll-snap pager, infinite append via IntersectionObserver, dwell tracking, pull-down-at-top -> Dashboard, in-feed listen-mode toggle. `Dashboard.tsx` = pull-down surface (today/streak, opt-in Focus session, pathway, collections). `grade.ts` = shared `recordRating` + `recordFeedCard` rolling daily-session accumulator (keeps the streak). Schema v5 adds `feedEvents`. 48 tests.

**Feed/recall unified (Model A).** `FeedCard.tsx` has two honest card types, no overlay: a **Story card** (new concept) you read once -- "Got it" calls recordRating('good')+recordFeedCard to seed FSRS and count it; and a **Recall card** (due review) tested inline where the summary is the *reveal* (so it never duplicates the story). New concepts are tested only when due (no same-session re-quiz). `StoryBrief.tsx` is now purely the **optional deep dive** (tap a concept title): 2 read-only beats -- "The story" + "How it connects" (knowledge web + Ask the Past); layered OVER the feed so closing returns to the same card. The recall-first overlay + `onRecallConcept` chain are removed.

**Gestures.** Horizontal interest-swipe uses native non-passive `touchmove`+preventDefault (iOS Safari ignores `touch-action` inside scroll-snap; pointer-capture failed). The whole card translates+tilts and springs back, with "More like this"/"Less of this" badges + a persistent legend.

**AI.** Worker secrets `GEMINI_API_KEY` (from Revisia GOOGLE_AI_API_KEY) + `GROQ_API_KEY` are set on `atlas-sync` -> pooled AI generation is live. **Google OAuth ENABLED (Chat #23, 2026-07-12):** `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` set as `atlas-sync` Worker secrets; `/auth/google/start` returns 302 to Google's consent (verified). Redirect URI registered in Google Cloud = `https://atlas-sync.tamara-sovcik.workers.dev/auth/google/callback`. NOTE: `JWT_SECRET` is declared in the Worker Env but UNUSED — session tokens are random ids in the D1 `sessions` table, not signed JWTs. App is in Google "Testing" mode, so only added Test users can complete sign-in. `speechRate` pref added; listen mode reads cards in the feed + StoryBrief at adjustable speed.

> Full phase history: `~/workspace/Projects/Atlas/docs/EVOLUTION.md`

## Read on demand -- do not pre-load

- Architecture, implementation notes, gotchas: `~/workspace/Projects/Atlas/docs/ARCHITECTURE.md`
- Content voice rules (lessons, UI copy): `~/workspace/Projects/Atlas/docs/CONTENT_VOICE.md`
- Credentials: `~/devhub/credentials_reference.md` (Cloudflare API token + Anthropic API key; both in 1Password)
- Session handover log: `~/workspace/Projects/Atlas/docs/SESSION_LOG.md` -- read top entry at session start, prepend new entry at end

## Tests

`src/**/*.test.ts(x)` co-located. `npm test` (one-shot) or `npm run test:watch`.

## End-of-session checklist

- Architecturally meaningful work? -> `~/workspace/Projects/Atlas/docs/ARCHITECTURE.md`
- Direction change or milestone? -> `~/workspace/Projects/Atlas/docs/EVOLUTION.md`
- Notable bug or refactor? -> `~/workspace/Projects/Atlas/docs/MISTAKES.md`
- Interview insight? -> `~/workspace/Projects/Atlas/docs/INTERVIEW.md`
- Always: deploy (`~/.claude/skills/atlas-deploy/SKILL.md`) + prepend entry to SESSION_LOG.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
