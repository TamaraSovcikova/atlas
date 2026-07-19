# Atlas

A personal general-knowledge engine. Ten minutes a day, free to run, designed around how human memory actually works.

Atlas is for one user (initially) who wants to feel broadly caught-up on history, geography, politics, religions, cultures, and current events, without it being school-shaped or embarrassing. It runs locally, syncs across devices via a thin Cloudflare backbone, and turns the daily news from disconnected noise into the live application of what you're learning.

Live: **https://atlas-6uj.pages.dev**

## Stack

- React + Vite + TypeScript + Tailwind
- Dexie (IndexedDB) for local state, FSRS-6 (`ts-fsrs`) for spaced repetition
- Cloudflare Workers + D1 for sync, the shared concept bank, and pooled AI
- PWA from day 1 (`vite-plugin-pwa`)
- Vitest for tests

## Run locally

Everything runs **inside WSL**, where the repo lives. Running npm, vitest or
wrangler from Windows/Git Bash against this path causes line-ending churn and
breaks the tooling.

```bash
source ~/.nvm/nvm.sh   # a non-login shell has no nvm; `nvm use` fails without this
nvm use                # Node 22, pinned in .nvmrc
npm install
npm run dev            # Vite at http://localhost:5173
```

The app is local-first: it seeds its own IndexedDB on first load, so there is no
database to provision and no env vars needed to develop the UI.

## Tests

```bash
npm test               # vitest run (one-shot)
npm run test:watch
npm run type-check     # tsc --noEmit
```

`npm run build` runs `type-check` first, so a type error fails the build.

## Deploy

Two independent deploys. Run both from WSL.

```bash
# 1. The app (Cloudflare Pages)
npm run build
npx wrangler pages deploy dist --project-name atlas

# 2. The Worker, only when worker/ changed
cd worker && npx wrangler deploy
```

The PWA service worker caches the previous build, so a deploy takes **two loads**
(or a hard refresh) to appear. Each deploy also gets its own `<hash>.atlas-6uj.pages.dev`
origin with separate storage, which is useful for testing a clean first-run state.

## Worker configuration

The Worker (`atlas-sync`) binds a D1 database named `atlas-sync`. Every secret is
optional and the app degrades gracefully without it, so a fresh clone still runs:

| Secret | Enables | Without it |
|---|---|---|
| `GEMINI_API_KEY` | pooled AI generation (primary) | `/ai` returns 503, UI offers BYOK |
| `GROQ_API_KEY` | AI cascade fallback | falls through to 503 |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google sign-in | sign-in fails; anonymous token sync still works |
| `AI_DAILY_CAP` | global daily AI cap (default 500) | uses the default |

Set them with `npx wrangler secret put <NAME>` from `worker/`. Note `JWT_SECRET` is
declared in the Env type but unused: session tokens are random ids in the D1
`sessions` table, not signed JWTs.

## More

- Claude Code session orientation: `CLAUDE.md`
- Design brief / art direction: `DESIGN.md`
- Deferred work with context: `TODOS.md`
- Narrative docs (PURPOSE, ARCHITECTURE, EVOLUTION, INTERVIEW, MISTAKES):
  `~/workspace/Projects/Atlas/docs/` — the `~/workspace` symlink only resolves
  inside WSL.
