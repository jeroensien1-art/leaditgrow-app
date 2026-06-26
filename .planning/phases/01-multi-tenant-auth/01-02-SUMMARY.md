---
phase: 01-multi-tenant-auth
plan: "02"
subsystem: auth
tags: [supabase, supabase-ssr, magic-link, google-oauth, wizard, nextjs, dutch-ui]

requires:
  - "@supabase/ssr server client factory (createClient, createAdminClient) in lib/outreach/supabase.ts"
  - "AES-256-GCM encrypt/decrypt helpers in lib/outreach/crypto.ts"
  - "Google OAuth2 URL generator in lib/outreach/googleAuth.ts"
  - "Extended middleware.ts protecting /outreach and /api/outreach routes"
  - "outreach_clients and outreach_tokens tables with RLS in Supabase"
provides:
  - "/outreach/login — magic-link email form (warm-parchment LIG style, Dutch copy)"
  - "/api/outreach/magic-link — signInWithOtp with shouldCreateUser:false, email enumeration safe"
  - "/api/outreach/auth/confirm — verifyOtp(token_hash) redirects to setup wizard"
  - "/outreach/setup/google — wizard step 1, Koppel je Google account CTA with error handling"
  - "/api/outreach/auth/google — generates OAuth URL with random state, sets sameSite=lax cookie"
  - "/api/outreach/auth/callback — validates CSRF state, exchanges code, encrypts + upserts refresh token"
  - "/outreach/setup/sheet — wizard step 2, Sheet ID + default_offer radio form"
  - "/api/outreach/setup/sheet — validates and upserts to outreach_clients via session-bound client"
  - "/outreach/session — server component post-setup landing page with company_name greeting"
affects: [02-outreach-engine, all future outreach plans]

tech-stack:
  added: []
  patterns:
    - "Email enumeration mitigation: always return ok from magic-link route regardless of email existence"
    - "CSRF protection on Google OAuth: randomBytes(16) state in httpOnly sameSite=lax cookie"
    - "Supabase verifyOtp (not exchangeCodeForSession) for magic link confirm"
    - "useSearchParams wrapped in Suspense boundary for client component with search params"
    - "Session-bound createClient (anon key + RLS) for all client-initiated writes"
    - "company_name derived from user_metadata.company_name or email prefix"

key-files:
  created:
    - app/outreach/login/page.tsx
    - app/api/outreach/magic-link/route.ts
    - app/api/outreach/auth/confirm/route.ts
    - app/outreach/setup/google/page.tsx
    - app/outreach/setup/google/GoogleSetupInner.tsx
    - app/api/outreach/auth/google/route.ts
    - app/api/outreach/auth/callback/route.ts
    - app/outreach/setup/sheet/page.tsx
    - app/api/outreach/setup/sheet/route.ts
    - app/outreach/session/page.tsx
  modified: []

key-decisions:
  - "GoogleSetupInner.tsx extracted as separate client component — page.tsx wraps it in Suspense to safely use useSearchParams (Next.js App Router requirement)"
  - "magic-link route never reveals email existence — returns ok even for unknown emails (email enumeration mitigation per RESEARCH pitfall 4)"
  - "OAuth callback uses NextResponse.cookies.set with maxAge:0 to clear state cookie (not delete() — more portable across environments)"
  - "outreach_tokens upsert uses { onConflict: 'user_id' } explicit option for clarity"
  - "session/page.tsx uses createClient + getUser() (not just session) for authoritative user check before reading outreach_clients"

requirements-completed: [AUTH-01, AUTH-02, AUTH-03]

duration: 12min
completed: "2026-06-26"
---

# Phase 01 Plan 02: Client Auth Wizard Summary

**Magic-link login + Google OAuth wizard (2 steps) + Sheet ID setup + session landing — full client auth flow wired to plan 01-01 infrastructure**

## Performance

- **Duration:** ~12 min
- **Tasks:** 3 automated + 1 human checkpoint (Task 4 not yet executed)
- **Files created:** 10

## Accomplishments

- Built the complete end-to-end client auth wizard: magic-link login, Google OAuth consent, Sheet ID setup, session landing
- All routes use session-bound `createClient` (never admin client) for client-initiated writes, respecting RLS
- Email enumeration protection: magic-link route always returns `{ ok: true }` regardless of whether email is invited
- CSRF protection on Google OAuth callback: random state in httpOnly `sameSite: 'lax'` cookie, verified on return
- Wizard progress indicator (2-step) with Dutch copy, warm-parchment LIG visual style, no em dashes

## Task Commits

1. **Task 1: Magic link login page and confirm routes** - `28e1dcd` (feat)
2. **Task 2: Google OAuth wizard step 1 and token callback** - `85f3dc2` (feat)
3. **Task 3: Sheet setup wizard step 2 and session landing page** - `8d99c03` (feat)

## Files Created

- `app/outreach/login/page.tsx` - Client component email form, warm-parchment style, sends POST to magic-link route, shows "Check je mail" success state
- `app/api/outreach/magic-link/route.ts` - signInWithOtp with shouldCreateUser:false; always returns ok (email enumeration safe)
- `app/api/outreach/auth/confirm/route.ts` - GET handler; reads token_hash + type from query; verifyOtp; redirects to /outreach/setup/google on success
- `app/outreach/setup/google/page.tsx` - Server component wrapper with Suspense boundary for GoogleSetupInner
- `app/outreach/setup/google/GoogleSetupInner.tsx` - Client component; reads ?error= from search params; shows CSRF/no_refresh error messages; "Koppel je Google account" anchor to /api/outreach/auth/google; wizard step 1 of 2 progress bar
- `app/api/outreach/auth/google/route.ts` - GET handler; randomBytes(16) state; generateAuthUrl(state); sets outreach_oauth_state cookie (httpOnly, secure, sameSite:lax, maxAge:600); redirects to Google consent
- `app/api/outreach/auth/callback/route.ts` - GET handler; validates state against cookie; getToken(code); checks refresh_token present; getUser(); encrypt(refresh_token); upserts to outreach_tokens; clears state cookie; redirects to /outreach/setup/sheet
- `app/outreach/setup/sheet/page.tsx` - Client component; Sheet ID text input + 3 offer radios + "geen voorkeur"; POSTs to /api/outreach/setup/sheet; redirects to /outreach/session on success; wizard step 2 of 2 progress bar
- `app/api/outreach/setup/sheet/route.ts` - POST handler; getUser() via session-bound client (401 if no session); validates sheet_id and default_offer; derives company_name from user_metadata or email prefix; upserts to outreach_clients
- `app/outreach/session/page.tsx` - Server component; getUser(); reads company_name from outreach_clients; greets "Welkom, [company_name]! Je setup is klaar."

## Decisions Made

- `GoogleSetupInner.tsx` extracted as a separate client component to avoid the Next.js App Router constraint that `useSearchParams` must be inside a Suspense boundary
- Magic-link route ignores the Supabase error return and always responds `{ ok: true }` for email enumeration safety
- State cookie cleared with `maxAge: 0` instead of `res.cookies.delete()` for maximum portability
- `onConflict: 'user_id'` passed explicitly to both upsert calls for clarity

## Deviations from Plan

### Auto-added

**1. [Rule 2 - Missing critical functionality] Suspense boundary for GoogleSetupInner**
- **Found during:** Task 2
- **Issue:** Next.js App Router requires components using `useSearchParams()` to be wrapped in a Suspense boundary; without it the build would fail or cause a hydration error
- **Fix:** Split into `page.tsx` (Server Component with Suspense) + `GoogleSetupInner.tsx` (Client Component with useSearchParams)
- **Files modified:** app/outreach/setup/google/page.tsx, app/outreach/setup/google/GoogleSetupInner.tsx

Otherwise, plan executed exactly as written.

## Known Stubs

- `app/outreach/session/page.tsx` — placeholder landing page ("Het dashboard wordt hier gebouwd in fase 2"). Intentional per plan spec; Phase 2 will build the real dashboard content here.

## Threat Flags

None. No new network surface beyond what was planned. All API routes are either protected by middleware JWT check or intentionally public (magic-link, confirm, callback) per the threat model in RESEARCH.md.

---
*Phase: 01-multi-tenant-auth*
*Completed: 2026-06-26*

## Self-Check: PASSED

- app/outreach/login/page.tsx: FOUND
- app/api/outreach/magic-link/route.ts: FOUND
- app/api/outreach/auth/confirm/route.ts: FOUND
- app/outreach/setup/google/page.tsx: FOUND
- app/api/outreach/auth/google/route.ts: FOUND
- app/api/outreach/auth/callback/route.ts: FOUND
- app/outreach/setup/sheet/page.tsx: FOUND
- app/api/outreach/setup/sheet/route.ts: FOUND
- app/outreach/session/page.tsx: FOUND
- Commit 28e1dcd: FOUND
- Commit 85f3dc2: FOUND
- Commit 8d99c03: FOUND
