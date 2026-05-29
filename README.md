# Atlas

A personal general-knowledge engine. Ten minutes a day, free to run, designed around how human memory actually works.

Atlas is for one user (initially) who wants to feel broadly caught-up on history, geography, politics, religions, cultures, and current events, without it being school-shaped or embarrassing. It runs locally, syncs across devices via a thin Cloudflare backbone, and turns the daily news from disconnected noise into the live application of what you're learning.

## Stack

- React + Vite + TypeScript + Tailwind
- Dexie (IndexedDB) for local state, FSRS-6 (`ts-fsrs`) for spaced repetition
- Cloudflare Workers + D1 + R2 for sync, content, and the daily news cron (Phase 2+)
- PWA from day 1 (`vite-plugin-pwa`)
- Vitest for tests

## Run locally

```bash
nvm use
npm install
npm run dev
```

## Tests

```bash
npm test
```

## More

- For Claude Code session orientation: see `CLAUDE.md`
- For narrative documentation: see `../../OneDrive/Documents/Workspace/Projects/Atlas/docs/` (PURPOSE, ARCHITECTURE, EVOLUTION, INTERVIEW, MISTAKES)
