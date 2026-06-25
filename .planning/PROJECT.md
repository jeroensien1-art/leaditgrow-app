# Lead it, Grow — App

**Live URL:** https://app.leaditgrow.be  
**Stack:** Next.js (App Router) · TypeScript · Supabase (`dpfbsipcoydwdgrcfavf`) · Vercel (hobby, 10s timeout) · Resend  
**Repo root:** `C:\Users\Jeroe\leaditgrow-app`

## What exists

| Feature | Status | Notes |
|---------|--------|-------|
| Lead widget | Live | Embeddable chat widget, captures leads |
| Diagnostic / lead magnet | Live | Scored quiz → email gate → Resend sequence |
| CRM dashboard | Live | `/app/dashboard` — lead list, status, replies |
| Email agent (auto-reply) | Live | `lib/crm/autoReply.ts`, sequences, Gmail |
| Ebook funnel | Live | `/app/actiehandboek`, `/app/gratis-handboek` |
| Calculator | Live | `/app/calculator` |
| Blog | Live | `/app/blog` |
| Speed-to-lead service page | Live | `/app/diensten` |

## Supabase — PROTECTED TABLES (NEVER DROP/TRUNCATE)

| Table | Purpose |
|-------|---------|
| `leads` | All captured leads from widget + diagnostic |
| `diagnostics` | Diagnostic answers, scores, lever analysis |

**Rule:** Any new database work for new milestones MUST use new tables only. Never ALTER, DROP, or TRUNCATE existing tables without explicit user confirmation naming exactly what data will be lost.

## Tech constraints

- Vercel hobby plan: **10s API route timeout** — long-running tasks (website research) must use Supabase Edge Functions or background jobs
- Model: `claude-sonnet-4-6` only (Opus times out on Vercel)
- Supabase project shared between this app and `agent-dashboard` — RLS must be enabled on every new public schema table
