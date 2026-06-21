-- Atlas sync store. The bearer token IS the account: one row per token holds
-- that user's full backup payload. No accounts table, no passwords, no PII.
CREATE TABLE IF NOT EXISTS backups (
  token       TEXT PRIMARY KEY,
  payload     TEXT NOT NULL,
  updated_at  INTEGER NOT NULL
);
