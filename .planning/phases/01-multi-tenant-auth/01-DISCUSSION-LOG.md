# Discussion Log — Phase 1: Multi-tenant Auth

**Date:** 2026-06-25

## Areas Discussed

### Login UX
- **Question:** How should clients log in?
- **Options:** Magic link / Email + password
- **Decision:** Magic link via Supabase Auth

### Route Structure
- **Question:** Where does the outreach dashboard live?
- **Options:** /outreach (own section) / /dashboard/outreach
- **Decision:** /outreach — completely separate from Jeroen's CRM at /dashboard

### Onboarding Flow
- **Question:** What does first-time setup look like?
- **Options:** Setup wizard / Settings page
- **Decision:** Setup wizard (Step 1: Connect Google → Step 2: Sheet ID → dashboard)

### Access Control
- **Question:** How do clients get access?
- **Options:** Invite-only / Open self-registration
- **Decision:** Invite-only — Jeroen adds emails manually

### Client Profile
- **Question:** What client info is stored?
- **Options:** Email + company + Sheet ID / Email + company + Sheet ID + offer preferences
- **Decision:** Email + company name + Sheet ID + default_offer preference

## Claude's Discretion Items

- Google OAuth two-step architecture (Supabase Auth for identity + custom OAuth for API scopes) — only viable approach
- pgcrypto/Vault for refresh token encryption
- Middleware extension pattern (new branch, no changes to existing /dashboard logic)
- Table names: `outreach_clients`, `outreach_tokens`
- Callback route: `/api/outreach/auth/callback`
