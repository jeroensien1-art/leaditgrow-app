# Phase 1: Multi-tenant Auth — Context

**Gathered:** 2026-06-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a complete auth layer for the Outreach Dashboard: clients log in via magic link, connect their own Google account (Sheets + Gmail scopes), and complete a setup wizard (Google OAuth → Sheet ID → dashboard). Jeroen controls access by invite. All new data lives in new Supabase tables with RLS — existing `leads` and `diagnostics` tables are never touched.

</domain>

<decisions>
## Implementation Decisions

### Login
- **D-01:** Magic link via Supabase Auth (`signInWithOtp`). No password. Client types email → gets link → lands on `/outreach`.
- **D-02:** Invite-only access. Jeroen adds client emails via Supabase dashboard or a simple admin API route. Clients cannot self-register.

### Routes
- **D-03:** Outreach Dashboard lives at `/outreach` — completely separate from `/dashboard` (Jeroen's CRM). Clients never see `/dashboard`.
- **D-04:** Wizard pages at `/outreach/setup/google` (Step 1) and `/outreach/setup/sheet` (Step 2). After wizard: redirect to `/outreach/session`.

### Google OAuth (two-step)
- **D-05:** Supabase Auth (magic link) handles app identity only. A **separate** Google OAuth2 consent flow grants `spreadsheets` + `gmail.compose` scopes. These are different flows — Supabase Auth Google provider does NOT give API access to Sheets/Gmail.
- **D-06:** After Google OAuth consent, store the `refresh_token` encrypted in a new `outreach_tokens` table (one row per client, pgcrypto or Supabase Vault). Access token is derived at runtime; never stored.
- **D-07:** Use `googleapis ^173.0.0` (already in package.json) for the OAuth2 flow — same library as the uman-dashboard. Web app flavor: redirect URI = `https://app.leaditgrow.be/api/outreach/auth/callback`.

### Client Profile
- **D-08:** New table `outreach_clients` stores: `user_id` (FK to Supabase auth.users), `company_name`, `sheet_id`, `default_offer` (enum: leiderschapsanalyse | speed-to-lead | bedrijfsgroei | null). RLS: client can only read/write their own row.
- **D-09:** `default_offer` is set during the wizard (optional step after Sheet ID). If set, pre-selects the offer button per lead card.

### Middleware
- **D-10:** Extend existing `middleware.ts` — add `/outreach` route protection using Supabase Auth JWT (`@supabase/ssr` `createServerClient`). Do NOT change existing `/dashboard` password-cookie logic.
- **D-11:** Unauthenticated requests to `/outreach/*` redirect to `/outreach/login`. API routes at `/api/outreach/*` return 401 JSON.

### Supabase Tables (new — never touch `leads` or `diagnostics`)
- **D-12:** `outreach_clients` — client profile (user_id, company_name, sheet_id, default_offer, created_at)
- **D-13:** `outreach_tokens` — encrypted Google refresh token (user_id, encrypted_token, created_at, updated_at). One row per client, upserted after each OAuth consent.
- **D-14:** RLS enabled on both tables from the first migration. Policy: `user_id = auth.uid()`.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing App Structure
- `middleware.ts` — existing auth middleware (password cookie for /dashboard). New /outreach protection adds here without removing existing logic.
- `lib/crm/store.ts` — shows existing Supabase client pattern (`createClient` with `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_KEY`). New routes follow the same pattern.
- `app/login/page.tsx` — existing login UI pattern and styling (warm parchment theme, LIG branding). `/outreach/login` should match this visual style.

### Project Constraints
- `.planning/PROJECT.md` — Supabase protection rules, Vercel 10s timeout, model constraint (claude-sonnet-4-6)
- `.planning/ROADMAP.md` — Phase 1 success criteria

### No external specs — requirements fully captured in decisions above

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `@supabase/supabase-js ^2.103.0` — already installed. Add `@supabase/ssr` for server-side cookie-based auth in Next.js App Router.
- `googleapis ^173.0.0` — already installed. OAuth2Client pattern from `uman-dashboard/auth.js` is directly reusable for the web app callback flow.
- `app/login/page.tsx` — visual reference for `/outreach/login` (same brand, same warm parchment style).

### Established Patterns
- Supabase client: `createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY)` for server routes. Use `createServerClient` from `@supabase/ssr` in middleware and Server Components.
- API routes: Next.js App Router `route.ts` files under `app/api/`.
- No ORM — raw Supabase client `.from('table').select()` throughout.

### Integration Points
- `middleware.ts` — Phase 1 adds a new branch for `/outreach` JWT validation alongside the existing password-cookie branch.
- New env vars needed: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (the web app OAuth2 credentials, different from the uman-dashboard installed-app credentials). `SUPABASE_ENCRYPTION_KEY` for pgcrypto token encryption.

</code_context>

<specifics>
## Specific Ideas

- Google OAuth callback route: `app/api/outreach/auth/callback/route.ts` — handles `?code=` param, exchanges for tokens, encrypts refresh_token, upserts into `outreach_tokens`, redirects to `/outreach/setup/sheet` (or `/outreach/session` if sheet_id already set).
- Setup wizard step 1 (`/outreach/setup/google`): button "Koppel je Google account" → redirects to Google consent URL.
- Setup wizard step 2 (`/outreach/setup/sheet`): text input for Sheet ID + optional default offer radio buttons → saves to `outreach_clients` → redirects to `/outreach/session`.

</specifics>

<deferred>
## Deferred Ideas

- Mobile-optimized `/outreach` view — Phase 2+ concern.
- Client self-service to change Sheet ID after setup — belongs in a Settings page (Phase 4 or 5).
- Multiple Sheet IDs per client — out of scope for now.

</deferred>

---

*Phase: 1 — Multi-tenant Auth*
*Context gathered: 2026-06-25*
