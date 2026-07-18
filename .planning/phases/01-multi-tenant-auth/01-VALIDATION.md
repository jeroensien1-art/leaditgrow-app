# Phase 1: Multi-tenant Auth — Validation

**Phase:** 1 — Multi-tenant Auth
**Created:** 2026-06-25
**Source:** Derived from `01-RESEARCH.md` Validation Architecture section

---

## Test Framework

No test framework is installed in this project (no `jest.config.*`, `vitest.config.*`, or test directories found). All validation for Phase 1 is manual smoke testing verified against the success criteria below.

---

## Phase Requirements → Test Map

| Req ID | Behavior | Test Type | How to Verify |
|--------|----------|-----------|----------------|
| AUTH-01 | Magic link email sent for invited user | Manual | Submit an invited email on `/outreach/login`; check inbox for Supabase magic link |
| AUTH-01 | Magic link confirm route creates session cookie | Manual | Click magic link; open browser DevTools → Application → Cookies; confirm `sb-<ref>-auth-token` is present |
| AUTH-02 | Google OAuth consent screen appears | Manual | From `/outreach/setup/google`, click "Koppel je Google account"; verify Google consent screen loads with Sheets + Gmail scopes listed |
| AUTH-02 | `outreach_tokens` row created with encrypted value | Manual SQL | After OAuth consent, run `SELECT * FROM outreach_tokens;` in Supabase Table Editor; verify row exists and `encrypted_token` is NOT plaintext (should be `iv:tag:ciphertext` format) |
| AUTH-03 | Second login requires no re-authorization | Manual | Log out, wait for session to expire, log in again via magic link; verify no Google OAuth prompt appears and `/outreach/session` loads |
| ALL | RLS: client cannot read another client's tokens | Manual SQL | Query `SELECT * FROM outreach_tokens;` using the anon key (not service key); result must be `[]` |

---

## Wave 0 Gaps (Pre-Execution Checklist)

These must be completed by the user BEFORE executor begins Wave 1:

- [ ] Google Cloud Console: Create OAuth2 Web Application credential; add redirect URI `https://app.leaditgrow.be/api/outreach/auth/callback`
- [ ] Supabase Dashboard: Disable "Allow new users to sign up" under Authentication > Providers > Email
- [ ] `.env.local` + Vercel: Add `SUPABASE_ENCRYPTION_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_APP_URL`
- [ ] Run `npm install @supabase/ssr@0.12.0`
- [ ] Apply SQL migration for `outreach_clients` and `outreach_tokens` (SQL in `01-RESEARCH.md` Pattern 7)

---

## Phase Success Criteria

All five must be TRUE before Phase 1 is marked complete:

1. Client can sign up and log in via magic link (Supabase Auth)
2. Client clicks "Koppel Google account" → OAuth2 consent → app stores encrypted refresh token per user in `outreach_tokens`
3. On next login, no re-authorization needed — token retrieved and reused automatically
4. RLS enabled on `outreach_clients` and `outreach_tokens` — anon key returns `[]` for both tables
5. Existing `leads` and `diagnostics` tables are untouched (verify via Supabase Table Editor after migration)

---

## Security Checks

| Control | Verification |
|---------|-------------|
| CSRF on Google OAuth callback | Simulate CSRF: call `/api/outreach/auth/callback?code=x&state=wrong` with no cookie set; confirm redirect to `/outreach/setup/google?error=csrf` |
| Encrypted token not plaintext | `SELECT encrypted_token FROM outreach_tokens LIMIT 1;` — value must start with a hex IV segment (e.g. `a1b2c3...`) not a Google token format (`ya29...`) |
| Unauthenticated `/outreach/*` redirect | Visit `/outreach/session` without a session cookie; confirm redirect to `/outreach/login` |
| Unauthenticated `/api/outreach/*` 401 | `curl https://app.leaditgrow.be/api/outreach/setup/sheet` without auth; confirm `{"error":"Unauthorized"}` with HTTP 401 |
| Service role key not in client bundle | Run `grep -r "SUPABASE_SERVICE_KEY" .next/` after build; must return no results |
