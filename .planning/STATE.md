# State — Lead it, Grow App

**Last updated:** 2026-06-15

## Current milestone: 3 — Outreach Dashboard

**Status:** Planning

**Next action:** Run `/gsd-discuss-phase 1` in `C:\Users\Jeroe\leaditgrow-app` to define implementation decisions for Phase 01 (multi-tenant auth).

## Active constraints (carry forward to every phase)

- Supabase project `dpfbsipcoydwdgrcfavf` — tables `leads` and `diagnostics` are PROTECTED
- New tables need RLS enabled before any data is written
- Vercel 10s timeout — research logic must live in Supabase Edge Functions
- Model: claude-sonnet-4-6 only

## Deferred ideas

- Mobile app version
- Automated sending (explicitly out of scope — drafts only)
- LinkedIn DM integration (separate milestone)
