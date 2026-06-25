@AGENTS.md

# Supabase — protected tables

Project ID: `dpfbsipcoydwdgrcfavf`

NEVER run DROP, TRUNCATE, or destructive ALTER on these tables without naming what data will be lost and getting explicit confirmation:
- `leads` — all captured leads from widget and diagnostic
- `diagnostics` — all diagnostic answers and scores

New milestones add NEW tables only. Always enable RLS on every new public schema table immediately.

# Model

Always use `claude-sonnet-4-6` in this app. Opus times out on Vercel hobby (10s limit).

# GSD planning

Planning artifacts live in `.planning/`. Read `ROADMAP.md` and `STATE.md` before starting any new phase.
