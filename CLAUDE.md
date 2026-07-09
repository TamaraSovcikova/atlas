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

2026-07-08 (Chat #20): Five quick fixes + rework master plan (`docs/REWORK_PLAN_2026-07.md`). (1) **AI "Network error: failed to fetch" fixed** -- Worker `/ai` read a non-existent `value` column on `backups` (it's `payload`), threw a D1 error -> Cloudflare 1101 with NO CORS -> browser "failed to fetch". Fixed the column, added Gemini->Groq cascade, wrapped fetch handler in try/catch so all errors carry CORS. Live `/ai` returns 200. (2) **Text artifacts** (`+a}$`, formulas, `**bold**` from AI summaries): new `src/lib/cleanText.ts` (unicode super/subscripts, strips LaTeX/Markdown, keeps real "$13 billion"), wired into `LinkedText`; 8 tests. (3) **Reading-speed chip** in `FeedView` header (listen mode on). (4) **Covered-concepts/eras reliability**: `FeedView` now seeds every scrolled-past concept + the current card on tab-hide/pagehide/unmount (Chat #19's seed-on-leave missed fast flicks + the last card -> "shows as New" and "Eras you know" not updating). (5) **Sort-into-categories minigame retired** (`resolvePolicy` forces `games.sort=false`; Settings toggle removed). 57 tests. Deploy: https://0c9caf3a.atlas-6uj.pages.dev

2026-07-08 (Chat #19): Bug fix -- new concept cards reappearing as "New" in later sessions. Root cause: two advancement paths existed for new (kind:'concept') cards but only one seeded FSRS. The "Got it" button called `recordRating` (setting `firstSeenAt`). An interest swipe or plain scroll-past advanced the card via `FeedView.handleInterest`/`handleCurrentChange` without ever calling `recordRating`, leaving `firstSeenAt = null`. Fix: `FeedView.handleCurrentChange` now auto-seeds any new concept card leaving the viewport without prior grading (tracked with a `gradedKeys` ref parallel to `swipedKeys`). 48 tests still green.

2026-06-26 (Chat #18): TikTok-style feed is the home. `src/lib/feed.ts` recommender = InterestWeights in settings kv `feed:interest:v1`; swipe-left boosts a topic +queues graph neighbours (deepQueue), swipe-right decays, swipe-up = dwell; weights floored 0.25 / capped 3.0; ~25% exploration floor; due reviews interleaved (the Spine wins); diversity guard; pure functions unit-tested. `FeedView.tsx` = vertical scroll-snap pager, infinite append via IntersectionObserver, dwell tracking, pull-down-at-top -> Dashboard, in-feed listen-mode toggle. `Dashboard.tsx` = pull-down surface (today/streak, opt-in Focus session, pathway, collections). `grade.ts` = shared `recordRating` + `recordFeedCard` rolling daily-session accumulator (keeps the streak). Schema v5 adds `feedEvents`. 48 tests.

**Feed/recall unified (Model A).** `FeedCard.tsx` has two honest card types, no overlay: a **Story card** (new concept) you read once -- "Got it" calls recordRating('good')+recordFeedCard to seed FSRS and count it; and a **Recall card** (due review) tested inline where the summary is the *reveal* (so it never duplicates the story). New concepts are tested only when due (no same-session re-quiz). `StoryBrief.tsx` is now purely the **optional deep dive** (tap a concept title): 2 read-only beats -- "The story" + "How it connects" (knowledge web + Ask the Past); layered OVER the feed so closing returns to the same card. The recall-first overlay + `onRecallConcept` chain are removed.

**Gestures.** Horizontal interest-swipe uses native non-passive `touchmove`+preventDefault (iOS Safari ignores `touch-action` inside scroll-snap; pointer-capture failed). The whole card translates+tilts and springs back, with "More like this"/"Less of this" badges + a persistent legend.

**AI.** Worker secrets `GEMINI_API_KEY` (from Revisia GOOGLE_AI_API_KEY) + `GROQ_API_KEY` are set on `atlas-sync` -> pooled AI generation is live. Google OAuth still NOT enabled (needs separate Google Cloud `GOOGLE_CLIENT_ID`/`SECRET`+`JWT_SECRET`; Revisia uses Supabase, no OAuth creds). `speechRate` pref added; listen mode reads cards in the feed + StoryBrief at adjustable speed.

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
