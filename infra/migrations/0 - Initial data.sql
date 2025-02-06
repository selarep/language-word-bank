CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE word_banks (
  word_bank_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE entries (
  entry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  term VARCHAR(255) NOT NULL,
  pronunciation VARCHAR(255) NOT NULL
);

CREATE TABLE word_banks_entries (
  word_bank_id UUID NOT NULL REFERENCES word_banks(word_bank_id),
  entry_id UUID NOT NULL REFERENCES entries(entry_id),
  PRIMARY KEY (word_bank_id, entry_id)
);

CREATE TABLE definitions (
  definition_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  definition_text TEXT NOT NULL,
  examples TEXT[] NOT NULL,
  entry_id UUID NOT NULL REFERENCES entries(entry_id) ON DELETE CASCADE
);