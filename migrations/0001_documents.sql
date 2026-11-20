CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL CHECK(json_valid(data)),
  revision INTEGER NOT NULL CHECK(revision >= 1),
  updated_at TEXT NOT NULL
);
