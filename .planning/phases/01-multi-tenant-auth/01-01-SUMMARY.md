---
phase: 01-multi-tenant-auth
plan: "01"
subsystem: auth
tags: [supabase, supabase-ssr, aes-256-gcm, google-oauth, middleware, rls, nextjs]

requires: []
provides:
  - "@supabase/ssr server client factory (createClient, createAdminClient) in lib/outreach/supabase.ts"
  - "AES-256-GCM encrypt/decrypt helpers in lib/outreach/crypto.ts"
  - "Google OAuth2 URL generator in lib/outreach/googleAuth.ts"
  - "updateOutreachSession middleware helper in lib/outreach/supabase-middleware.ts"
  - "Extended middleware.ts protecting /outreach and /api/outreach routes"
  - "SQL migration for outreach_clients and outreach_tokens tables with RLS"
affects: [01-02, all future outreach plans]

tech-stack:
  added: ["@supabase/ssr@0.12.0"]
  patterns:
    - "createServerClient with mutable supabaseResponse pattern (Pitfall 1 avoidance)"
    - "getClaims() over getUser() in middleware (avoids network call per request)"
    - "AES-256-GCM iv:tag:ciphertext hex format for encrypted token storage"
    - "setAuthTag before final() for tamper detection on decrypt"

key-files:
  created:
    - lib/outreach/crypto.ts
    - lib/outreach/googleAuth.ts
    - lib/outreach/supabase.ts
    - lib/outreach/supabase-middleware.ts
    - supabase/migrations/001_outreach_tables.sql
  modified:
    - middleware.ts
    - package.json

key-decisions:
  - "getClaims() is available in @supabase/supabase-js 2.103.0 — confirmed from type definitions, no fallback needed"
  - "AES-256-GCM key read lazily inside encrypt/decrypt (not module-level) so SUPABASE_ENCRYPTION_KEY missing at import time does not throw"
  - "middleware.ts kept (not renamed to proxy.ts) — Next.js 16 deprecated middleware but it still works; renaming would be an unplanned architectural change"
  - "Public outreach paths checked with startsWith to handle trailing path segments correctly"

patterns-established:
  - "lib/outreach/* is the module boundary for all outreach auth infrastructure"
  - "updateOutreachSession returns null for non-outreach paths (allows middleware fall-through)"
  - "Admin client uses SUPABASE_SERVICE_KEY (bypasses RLS); anon client uses NEXT_PUBLIC_SUPABASE_ANON_KEY (respects RLS)"

requirements-completed: [AUTH-01, AUTH-02, AUTH-03]

duration: 5min
completed: "2026-06-26"
---

# Phase 01 Plan 01: Auth Infrastructure Summary

**Supabase SSR cookie auth + AES-256-GCM token encryption + Google OAuth2 helpers + /outreach middleware protection with two new RLS-enforced Supabase tables**

## Performance

- **Duration:** 5 min
- **Started:** 2026-06-25T22:02:04Z
- **Completed:** 2026-06-25T22:07:26Z
- **Tasks:** 4 (3 automated + 1 human checkpoint, all complete)
- **Files modified:** 6

## Accomplishments

- Installed `@supabase/ssr@0.12.0` and created all four `lib/outreach/*` helper modules
- Created `supabase/migrations/001_outreach_tables.sql` with `outreach_clients` and `outreach_tokens`, both with RLS enabled and `auth.uid() = user_id` policies
- Extended `middleware.ts` to protect `/outreach` and `/api/outreach` routes using `getClaims()` without touching the existing `/dashboard` or language detection branches

## Task Commits

1. **Task 1: Install @supabase/ssr, crypto helper, Google auth helper** - `c835b80` (feat)
2. **Task 2: Supabase server clients and outreach tables migration** - `7966c64` (feat)
3. **Task 3: Extend middleware with /outreach protection** - `b9ec874` (feat)
4. **Task 4: Human checkpoint** - APPROVED by user (2026-06-26)

## Files Created/Modified

- `lib/outreach/crypto.ts` - AES-256-GCM encrypt/decrypt; key read from SUPABASE_ENCRYPTION_KEY; iv:tag:ciphertext hex format; setAuthTag before final() for tamper detection
- `lib/outreach/googleAuth.ts` - getOAuth2Client() factory; generateAuthUrl(state) with access_type:offline, prompt:consent, spreadsheets + gmail.compose scopes
- `lib/outreach/supabase.ts` - createClient() (SSR cookie-based, anon key) and createAdminClient() (service role, bypasses RLS)
- `lib/outreach/supabase-middleware.ts` - updateOutreachSession() helper; getClaims() for JWT validation; public path bypass; 401 JSON for API routes; redirect for page routes
- `supabase/migrations/001_outreach_tables.sql` - outreach_clients (id, user_id, company_name, sheet_id, default_offer CHECK constraint, created_at) + outreach_tokens (id, user_id, encrypted_token, created_at, updated_at), ENABLE ROW LEVEL SECURITY on both, SELECT + ALL policies
- `middleware.ts` - made async, added import updateOutreachSession, added /outreach branch between /dashboard and language detection
- `package.json` - added @supabase/ssr@0.12.0

## Decisions Made

- `getClaims()` confirmed available in installed `@supabase/auth-js` (found in GoTrueClient.d.ts) - no fallback to `getUser()` needed
- Key reading moved inside encrypt/decrypt functions (not module-level) to avoid errors when SUPABASE_ENCRYPTION_KEY is absent at import time (e.g., in build environments)
- `middleware.ts` kept as-is (not renamed to `proxy.ts`) - Next.js 16 deprecates the name but the file still functions; renaming was out of scope per plan constraint
- `supabase-middleware.ts` uses `startsWith(p + '/')` in addition to exact match for public path check, correctly handling URLs like `/api/outreach/magic-link?email=x`

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - TypeScript check clean, round-trip crypto test passed, generateAuthUrl params verified.

## Human Checkpoint Result (Task 4)

**Status: APPROVED (2026-06-26)**

All steps completed and verified:

1. outreach_clients and outreach_tokens created in Supabase with RLS shield icon active
2. leads and diagnostics tables confirmed untouched
3. Signups disabled (invite-only mode enabled)
4. Google OAuth credential created with redirect URI https://app.leaditgrow.be/api/outreach/auth/callback
5. GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SUPABASE_ENCRYPTION_KEY, NEXT_PUBLIC_APP_URL added to .env.local (via 1Password op:// references) and Vercel
6. RLS smoke test passed: SET LOCAL ROLE anon; SELECT * FROM outreach_tokens; returned 0 rows

## Next Phase Readiness

- All `lib/outreach/*` interfaces are defined; plan 01-02 (UI + route handlers) can import them directly
- Migration SQL is ready to apply; tables will be live after human checkpoint
- Middleware protection is active; unauthenticated /outreach requests will redirect/401 once deployed

---
*Phase: 01-multi-tenant-auth*
*Completed: 2026-06-26*

## Self-Check: PASSED

- lib/outreach/crypto.ts: FOUND
- lib/outreach/googleAuth.ts: FOUND
- lib/outreach/supabase.ts: FOUND
- lib/outreach/supabase-middleware.ts: FOUND
- supabase/migrations/001_outreach_tables.sql: FOUND
- .planning/phases/01-multi-tenant-auth/01-01-SUMMARY.md: FOUND
- Commit c835b80: FOUND
- Commit 7966c64: FOUND
- Commit b9ec874: FOUND
