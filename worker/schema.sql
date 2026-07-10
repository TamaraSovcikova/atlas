-- Atlas sync store.
-- Wave 1: the bearer token IS the account (anonymous, no PII).
-- Wave 3: optional Google accounts layer on top. Anonymous path unchanged.

CREATE TABLE IF NOT EXISTS backups (
  token       TEXT PRIMARY KEY,
  payload     TEXT NOT NULL,
  updated_at  INTEGER NOT NULL,
  user_id     TEXT                      -- NULL for anonymous, set for signed-in
);
CREATE INDEX IF NOT EXISTS backups_user_id ON backups(user_id) WHERE user_id IS NOT NULL;

-- Wave 3: Google OAuth accounts (optional, never required).
CREATE TABLE IF NOT EXISTS users (
  id              TEXT PRIMARY KEY,     -- random UUID minted on first sign-in
  provider        TEXT NOT NULL,        -- 'google'
  provider_sub    TEXT NOT NULL UNIQUE, -- Google 'sub' claim
  email           TEXT,
  created_at      INTEGER NOT NULL,
  plan_tier       TEXT NOT NULL DEFAULT 'free', -- free | tester | pro
  ai_credits_used INTEGER NOT NULL DEFAULT 0,
  ai_window_start INTEGER NOT NULL DEFAULT 0    -- start of current credit window (ms)
);

-- Session tokens issued after OAuth (separate from the anonymous sync token).
CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

-- Community-contributed AI concepts. When a user generates a card for a topic
-- the vault lacks, it's shared here so every user gets it. Stable `ai:<slug>` ids
-- dedup a topic globally; INSERT OR IGNORE keeps the first author's version.
CREATE TABLE IF NOT EXISTS community_concepts (
  id         TEXT PRIMARY KEY,     -- ai:<slug>, stable across users
  payload    TEXT NOT NULL,        -- JSON of the generated concept
  name       TEXT,
  name_key   TEXT,                 -- normalised name for lookup/dedup
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS community_concepts_created ON community_concepts(created_at);
