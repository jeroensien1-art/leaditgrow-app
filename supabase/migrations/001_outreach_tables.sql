-- Migration: 001_outreach_tables.sql
-- Creates outreach_clients and outreach_tokens tables with RLS.
-- DOES NOT touch leads or diagnostics (protected tables).

CREATE TABLE outreach_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  sheet_id TEXT,
  default_offer TEXT CHECK (default_offer IN ('leiderschapsanalyse', 'speed-to-lead', 'bedrijfsgroei')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE outreach_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Client reads own row"
  ON outreach_clients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Client writes own row"
  ON outreach_clients FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE outreach_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  encrypted_token TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE outreach_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Client reads own token"
  ON outreach_tokens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Client writes own token"
  ON outreach_tokens FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
