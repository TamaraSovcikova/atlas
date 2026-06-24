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

2026-06-24: main=`d117584`. Waves 1-5 complete + feed/search/mood (deploy23 efab99f4). Wave 3: mergeBackup (smart per-record sync), auth.ts (Google OAuth popup flow), sync.ts dual-mode, worker expanded (users/sessions D1 tables, /auth /me /claim /ai routes), SettingsView Account section. Wave 4: ai.ts (BYOK Gemini direct + pooled Worker cascade Gemini->Groq), AskThePast.tsx chat component (embedded in ConceptRabbitHole + StoryBrief), SessionView explain-my-answer on Again, HomeView DYK card, SettingsView AI+BYOK section. Wave 5: ConnectionChallenge.tsx (graph quiz, is/not-connected modes, score), share.ts (Canvas share card + Web Share API), StatsView Share button, Onboarding era interest-tilt slide (interestEras pref), buildDailySession floats interest-era threads first. Post-wave: HomeView rewritten as infinite feed (review teasers, story, connection, DYK, pathway, collections cards), SearchModal (full-screen search across concepts/threads/collections, ConceptRabbitHole nested), SessionMoodPicker (Tap/Type/Listen bottom sheet before daily sessions). 38 tests. Worker secrets (GOOGLE_CLIENT_ID etc.) not yet set in Cloudflare -- OAuth + pooled AI degrade gracefully.

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
