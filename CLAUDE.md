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

Deploy: see `~/.claude/skills/atlas-deploy/SKILL.md` (WSL + wrangler BOM-safe script pattern).

Live: **https://atlas-6uj.pages.dev** (OAuth as tamara.sovcik@gmail.com). PWA service worker caches old build -- two loads to see a new deploy.

## Current state

2026-06-26: main=`3d8255a`+feed restructure (Chat #15). Waves 1-5 + feed/search/mood + audit fixes. Full restructure of the home into a TikTok-style infinite swipe feed with a calm-personalized recommender. New `src/lib/feed.ts`: InterestWeights in settings kv `feed:interest:v1`; swipe-left boosts a topic +queues its graph neighbours (deepQueue), swipe-right decays, swipe-up = dwell signal; weights floored at 0.25 / capped 3.0 so discovery never collapses; ~25% exploration floor; due reviews always interleaved at a cadence (the Spine wins); diversity guard; pure scoring/selection functions unit-tested. `FeedView.tsx` = vertical scroll-snap pager, infinite append via IntersectionObserver, dwell tracking, pull-down-at-top -> Dashboard. `FeedCard.tsx` = per-type cards; discovery cards have a horizontal interest-swipe affordance, learning cards run concept brief -> inline recall -> SwipeRatingZone grade. `Dashboard.tsx` = the pull-down surface (today progress/streak, opt-in Focus session, pathway, collections). `grade.ts` extracts recordRating (shared by SessionView + feed) and adds recordFeedCard, a rolling daily-session accumulator so the streak keeps working. Schema v5 adds `feedEvents`. HomeView.tsx retired. Feed subsumes the daily session; the structured session stays as the opt-in "Focus session". 48 tests (+10 feed). Worker secrets (GOOGLE_CLIENT_ID etc.) still not set in Cloudflare -- OAuth + pooled AI degrade gracefully.

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
