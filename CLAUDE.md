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
  db/             schema.ts (Dexie v3), seed.ts
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

2026-06-24: main=`2caad1f`. Wave 0+1 complete + full paper theme polish. Wave 0: editorial/paper identity (paper #F6F2EA / ink #221D16 / deep-blue #28486B); CSS-var shadows per theme; 3-tab IA Feed/Atlas/You; SegmentControl sub-panel routing (Atlas->Pathway|Browse; You->Progress|Settings); serif Fraunces header. Wave 1: StoryBrief.tsx (3-beat tap-through overlay Hook/Story/Connection before session start, db.edges for graph neighbours, Web Speech API audio at rate 0.92); feed story preview card in HomeView (getNextPathwayConcept, honours tier-gate); all border-white/* hardcodes replaced with border-ink/* across all components -- paper theme fully coherent. 38 tests. Full 2.0 plan in `~/workspace/Projects/Atlas/docs/ATLAS_2.0.md`. NEXT: Wave 2 -- Collections surface, mood/energy session entry, "You" identity. Deferred: heatmap + constellation colour tuning (still use rgba hardcodes).

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
