# Atlas

A personal general-knowledge engine. Ten minutes a day, local-first, free to run. Built around FSRS-6 spaced repetition and a personal knowledge graph that connects history, geography, politics, religions, cultures, science, and current events.

> See `docs/PURPOSE.md` (in OneDrive `Workspace/Projects/Atlas/docs/`) for full description: target user, problem solved, success criteria.

## Stack

- **Language:** TypeScript end-to-end
- **Framework:** React + Vite + Tailwind
- **Local DB:** Dexie (IndexedDB), source of truth on every device
- **Spaced repetition:** `ts-fsrs` (FSRS-6)
- **State:** Zustand (lightweight; no Redux)
- **Sync (Phase 2+):** Cloudflare Workers + D1 (bearer-token-as-account pattern, see `~/devhub/recurring_decisions.md`)
- **Content storage (Phase 3+):** Cloudflare R2 for pre-generated lesson JSON + news archive
- **AI (Phase 2+):** Cloudflare Workers AI for daily news rewrite + answer judging; Anthropic API for one-off content batches (offline)
- **Hosting:** Cloudflare Workers (assets), PWA installable
- **Tests:** Vitest

## Layout

```
src/
  components/     React components (DailySession, etc.)
  db/
    schema.ts     Dexie schema (concepts, edges, lessons, reviews, sessions, news, settings)
  lib/
    fsrs.ts       FSRS wrapper (newReview, applyRating, shouldShowMcqFallback)
    fsrs.test.ts  Vitest unit tests for the FSRS wrapper
  App.tsx         App shell, opens Dexie, renders DailySession
  main.tsx        React mount
  index.css       Tailwind entrypoint
public/
  favicon.svg     PWA icon
index.html        Vite entry
vite.config.ts    Vite + PWA + Vitest config
tailwind.config.js
```

## How to run

```bash
nvm use            # if .nvmrc present
npm install
npm run dev        # Vite dev server
npm test           # Vitest unit tests
npm run type-check # tsc --noEmit
```

## Current state (one sentence; date it)

2026-06-16: Phase 5 editorial redesign shipped. Warm Observatory palette (warm near-black #1a1410, no blue-black), Fraunces display + Plus Jakarta Sans body via Google Fonts CDN, constellation regression fixed. Home screen: new ConstellationPreview static canvas hero (golden-spiral layout, domain-colour star glows, always visible, 280px). Session screen: ConstellationPreview (160px) always visible above the progress bar showing active concept highlighted with connection lines -- replaces the old collapsed vaul drawer. Interactive ForceGraph preserved for the dedicated full-screen explore view only. Focus is personal use, not commercial.

Libraries (all MIT): @dnd-kit, motion (LazyMotion `m`), vaul, react-force-graph-2d, dexie, ts-fsrs, zustand.

KNOWN FOLLOW-UP: Fonts from Google Fonts CDN (breaks true offline PWA). Self-host Fraunces + Plus Jakarta Sans woff2 in public/fonts/ when going offline-first. Light "Daylight gallery" theme not yet implemented.

Last updated: 2026-05-30 by claude-code

> See `docs/EVOLUTION.md` for the journey.

## Voice rules for content (lessons, questions, news rewrites, UI copy)

These propagate to every AI generation prompt and every hand-written string. They are the active ingredient in Atlas not feeling like Kinnu.

- **Patient-tutor tone.** Forgetting is normal and expected. Never "wrong" - always "not yet; here it is; you'll see it again soon." The user has decided to learn; do not make them feel dumb for not already knowing.
- **No condescension.** No "fun facts" or "did you know" framing. Adult reader, treated as one.
- **Concrete over abstract.** Names, dates, places, consequences. Not "various factors led to..." but "Bismarck negotiated three wars in seven years to make Prussia the dominant German state."
- **One vivid image per lesson where possible.** Memory hooks better to a picture than a list.
- **Cite the source.** Every lesson ends with the Wikipedia URL it was distilled from. If a user notices an error, the source is one tap away.
- **No em-dashes, anywhere.** Hyphens only. This is a workspace-wide rule (see `~/ai_system/_AGENT_QUICKREF.md`).
- **Neutral on politics and religion.** State the policy or the belief; never editorialise. "The Catholic Church teaches that..." not "Catholics believe that...". "The 2024 UK general election returned a Labour government with X seats" not "Labour swept to victory".

## Project-specific gotchas

- **FSRS cold-start.** The scheduler needs ~1000 reviews per user to fit personal parameters. First 6-8 weeks of use behave like SM-2. Do not panic-tune.
- **Local-first means data loss on phone wipe.** Built-in export-to-file is Phase 1; encrypted backup to R2 is Phase 2.
- **No live AI on screen render. Ever.** All AI work is (a) one-time at generation, (b) cron at controlled cadence, or (c) explicit user-triggered (answer judging). See `~/devhub/recurring_decisions.md` "AI cost-protection patterns".
- **The hallucination-defence pipeline is non-negotiable.** Every generated lesson must carry per-fact citations to a Wikipedia source. Same shape as `calorie-tracker`'s "AI returns names + grams; values resolved from authoritative data" rule.

## Credentials this project needs

None yet at Phase 0. Phase 2+ will need:
- `CLOUDFLARE_API_TOKEN` for Worker deploy (lives in 1Password per `~/devhub/credentials_reference.md`)
- `ANTHROPIC_API_KEY` for one-off content generation runs (lives in 1Password)

No credentials are needed at dev-server time for Phase 0/1.

## Where the tests live + how they work

`src/**/*.test.ts(x)` co-located with the file under test. Vitest with jsdom environment for component tests, plain Node for pure logic. Run with `npm test` (one-shot) or `npm run test:watch`.

## Architectural decisions

> See `docs/ARCHITECTURE.md` for technical decisions, alternatives considered, anti-decisions.

Highlights:
- Local-first via Dexie; sync via Cloudflare D1, not Supabase (free-tier slots exhausted by Revisia + Parralel).
- Layered free-recall (typed answers + AI grading + MCQ soft-landing), not MCQ-only. Research-grounded; see ARCHITECTURE for the Dunlosky / Karpicke / Bjork citations.
- Strict retrieval-grounded AI content generation. Every fact tied to a Wikipedia URL.
- PWA from day 1; no native app.

Implementation notes for future sessions:
- **Content bank**: `src/content/` is the shared knowledge bank (`bank/*.ts` BankConcept arrays by era-cluster, `eras.ts`, `index.ts` assembling + `validateBank()` tested in `bank.test.ts`). `db/seed.ts` syncs it into Dexie on each `BANK_VERSION` bump, preserving progress + personal edges, pruning removed concepts. Author more as Claude Code on the Max plan (NOT the API key), Wikipedia URL per concept, bump `BANK_VERSION`.
- **Recall variety is position-driven**: `chooseQuestion` in `session.ts` rotates format by the card's session index (`rotationIndex`), not `review.reps`. Do not regate on maturity or a cold start goes all-cloze.
- **Design system**: tokens in `tailwind.config.js`; `.surface`/`.surface-raised`/`.chip` in `index.css`; motion via `src/components/ui/motion.tsx` (LazyMotion `m` to keep bundle down) + `Button.tsx`. `prefers-reduced-motion` handled globally.
- **Constellation**: Two implementations. `ConstellationPreview.tsx` is a lightweight static canvas (golden-angle spiral positions, no physics, domain-colour glows, focus mode highlights concept + draws connection lines). Used as home hero (280px) and in-session strip (160px). `Constellation.tsx` (react-force-graph-2d) is lazy-imported only by `ConstellationScreen.tsx` (full-screen explore). Never use the ForceGraph on first-paint paths -- the physics simulation freezes CDP screenshots and is expensive.
- **Drag**: `OrderCard` uses @dnd-kit (Pointer + Touch sensor, 120ms hold so scroll still works). `SortCard` is tap-to-select-then-tap-bucket (more reliable on touch than drop zones).
- **World map**: `public/world-110m.json` (slimmed Natural Earth, 0.1deg), hand-rolled equirectangular projection in `MapCard`. In workbox `globPatterns` for offline.

## Open questions for Tamara

- Backup-export UX on first sync (Phase 2).
- Slovak-context callouts in lessons (default: yes, decision at Phase 3).
- Voice and tone for the daily news rewrite specifically (will be drafted in Phase 4).

---

## End-of-session checklist (for Claude Code)

Before ending the session, ask yourself:

- Architecturally-meaningful work? -> update `docs/ARCHITECTURE.md`
- Direction change or milestone? -> update `docs/EVOLUTION.md`
- Notable bug or refactor? -> update `docs/MISTAKES.md`
- Interview-relevant insight? -> update `docs/INTERVIEW.md`
- Project purpose shifted? -> append pivot section to `docs/PURPOSE.md`

If none apply: no doc updates. Save doc updates for things that matter.
