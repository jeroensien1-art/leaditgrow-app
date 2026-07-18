# Phase 1: Multi-tenant Auth — Research

**Researched:** 2026-06-25
**Domain:** Supabase Auth (magic link) + custom Google OAuth2 (googleapis) + encrypted token storage + Next.js 16 App Router middleware
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Magic link via Supabase Auth (`signInWithOtp`). No password.
- **D-02:** Invite-only access. Jeroen adds client emails via admin API. Clients cannot self-register.
- **D-03:** Outreach Dashboard at `/outreach` — separate from `/dashboard`.
- **D-04:** Wizard at `/outreach/setup/google` (Step 1) and `/outreach/setup/sheet` (Step 2). After: redirect to `/outreach/session`.
- **D-05:** Supabase Auth handles app identity only. Separate Google OAuth2 consent grants Sheets + Gmail scopes.
- **D-06:** Store `refresh_token` encrypted in `outreach_tokens` (pgcrypto or Supabase Vault). Access token derived at runtime, never stored.
- **D-07:** Use `googleapis ^173.0.0` for OAuth2. Web app flavor. Redirect URI: `https://app.leaditgrow.be/api/outreach/auth/callback`.
- **D-08:** New table `outreach_clients` (user_id, company_name, sheet_id, default_offer enum). RLS: own row only.
- **D-09:** `default_offer` set during wizard (optional).
- **D-10:** Extend `middleware.ts` — `/outreach` uses Supabase Auth JWT (`@supabase/ssr`). Do NOT change `/dashboard` password-cookie logic.
- **D-11:** Unauthenticated `/outreach/*` redirects to `/outreach/login`. `/api/outreach/*` returns 401 JSON.
- **D-12:** `outreach_clients` — user_id, company_name, sheet_id, default_offer, created_at.
- **D-13:** `outreach_tokens` — user_id, encrypted_token, created_at, updated_at. One row per client, upserted.
- **D-14:** RLS on both tables. Policy: `user_id = auth.uid()`.

### Claude's Discretion
- Exact encryption approach (pgcrypto vs application-level AES) — research recommends AES-256-GCM at application layer (see Encryption section).
- Exact SQL migration syntax.
- Error/loading state UX on wizard pages.

### Deferred Ideas (OUT OF SCOPE)
- Mobile-optimized `/outreach` view
- Client self-service to change Sheet ID after setup
- Multiple Sheet IDs per client
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | Client can sign up and log in via Supabase Auth (magic link) | Supabase `signInWithOtp` + `@supabase/ssr` middleware pattern confirmed |
| AUTH-02 | Client connects Google account via OAuth2 consent; encrypted refresh token stored per user | `googleapis` `generateAuthUrl` + `getToken` + AES-256-GCM Node.js crypto pattern confirmed |
| AUTH-03 | On next login, no re-authorization needed — token retrieved and used automatically | `outreach_tokens` upsert + token retrieval at runtime pattern documented |
</phase_requirements>

---

## Summary

Phase 1 adds a complete second-tier authentication system to an existing Next.js 16 App Router app. The existing `/dashboard` is protected by a simple password cookie; the new `/outreach` section needs Supabase Auth JWT sessions managed via `@supabase/ssr`. The two systems run in the same `middleware.ts` file in parallel branches — the key constraint is that neither branch must interfere with the other.

The auth architecture is intentionally two-step: Supabase Auth establishes who the user is (identity), and a custom Google OAuth2 flow grants scopes for Sheets and Gmail (authorization to act on their behalf). Supabase's built-in Google OAuth provider does NOT grant these API scopes — they must come from a separate consent flow using a web application OAuth2 credential.

The most critical implementation risk is the `@supabase/ssr` middleware pattern. Next.js 16 requires that cookie mutations happen on the `response` object returned from the middleware, not on `request` — getting this wrong silently breaks session refresh. The encryption decision (pgcrypto vs Node.js AES) is resolved in favor of application-level AES-256-GCM: it avoids passing a secret key through SQL where it appears in query logs and replication streams.

**Primary recommendation:** Install `@supabase/ssr`, extend middleware with a dedicated `updateOutreachSession` helper, use Node.js `crypto` (built-in, no install) for AES-256-GCM token encryption, and implement invite-only by disabling signups in the Supabase Dashboard + using `auth.admin.inviteUserByEmail` from a service-role API route.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Identity (who is logged in) | Frontend Server (Next.js middleware + Server Components) | Supabase Auth service | JWT in cookie, validated server-side on every request |
| Session management | Frontend Server (middleware) | Supabase Auth | `@supabase/ssr` refreshes tokens and writes updated cookies |
| Route protection | Frontend Server (middleware) | — | Middleware runs before any page render |
| Google OAuth2 consent initiation | API (Next.js route handler) | — | Server generates state + URL, never browser-generated |
| Google OAuth2 callback + token exchange | API (Next.js route handler) | Google OAuth2 service | `?code=` received, exchanged for tokens server-side |
| Refresh token encryption/storage | API (Next.js route handler) | Database (Supabase) | Encrypt before write; decrypt on retrieval |
| RLS enforcement | Database (Supabase) | — | `user_id = auth.uid()` policies at DB layer |
| Invite management | API (admin route handler) | Supabase Auth admin API | `SUPABASE_SERVICE_KEY` required — never client-side |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@supabase/ssr` | 0.12.0 | Cookie-based Supabase Auth in Next.js Server Components and middleware | Official Supabase package for SSR frameworks; replaces deprecated `@supabase/auth-helpers-nextjs` |
| `@supabase/supabase-js` | 2.103.0 (already installed) | Supabase client for server-side data access and admin operations | Already in project |
| `googleapis` | 173.0.0 (already installed) | Google OAuth2Client for authorization URL generation and token exchange | Already in project; same pattern as uman-dashboard |
| `node:crypto` | built-in (Node 22) | AES-256-GCM token encryption | No install needed; secure, auditable, no SQL key leakage |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@supabase/supabase-js` (service role) | 2.103.0 | Admin invite API (`auth.admin.inviteUserByEmail`) | Admin-only routes behind `SUPABASE_SERVICE_KEY` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Node.js `crypto` AES-256-GCM | pgcrypto `pgp_sym_encrypt` | pgcrypto key appears in SQL query logs and replication streams; application-layer encryption keeps the key in env vars only |
| Node.js `crypto` AES-256-GCM | Supabase Vault | Vault is the best long-term solution but adds complexity (Vault API calls, pgsodium setup); for 5-10 clients, application-layer AES is simpler and equally secure |
| `inviteUserByEmail` | Manual Supabase Dashboard user creation | API route is automatable; dashboard-only is fine for now but harder to build admin Phase 5 UI on |

**Installation (one new package):**
```bash
npm install @supabase/ssr@0.12.0
```

**Version verification:**
```
@supabase/ssr: 0.12.0 (latest as of 2026-06-25) [VERIFIED: npm registry]
```

---

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `@supabase/ssr` | npm | ~2 yrs | Very high (official Supabase org) | github.com/supabase/supabase | OK | Approved |

**Packages removed due to SLOP verdict:** none
**Packages flagged as suspicious SUS:** none

`@supabase/ssr` is published by the `@supabase` organization, the same org as `@supabase/supabase-js`. [VERIFIED: npm registry + official Supabase docs]

---

## Architecture Patterns

### System Architecture Diagram

```
Client browser
    |
    | POST /api/outreach/magic-link  (email)
    v
Next.js API Route (route handler)
    |---> supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } })
    |     Supabase sends magic link email
    v
User clicks email link
    |
    | GET /api/outreach/auth/confirm?token_hash=...&type=email
    v
Next.js Route Handler (confirm)
    |---> supabase.auth.verifyOtp({ token_hash, type: 'email' })
    |     Sets sb-<ref>-auth-token cookie via @supabase/ssr
    v
Redirect to /outreach/setup/google (if no Google token) or /outreach/session
    |
    |  [SETUP STEP 1 — Google OAuth]
    |
    | GET /api/outreach/auth/google  (server-generated URL)
    v
Google consent screen
    |
    | GET /api/outreach/auth/callback?code=...&state=...
    v
Next.js Route Handler (callback)
    |---> googleapis OAuth2Client.getToken(code)
    |     Verify state matches cookie (CSRF)
    |---> encrypt(tokens.refresh_token) with AES-256-GCM
    |---> supabase.from('outreach_tokens').upsert({ user_id, encrypted_token })
    v
Redirect to /outreach/setup/sheet
    |
    |  [SETUP STEP 2 — Sheet ID]
    |
    | POST /api/outreach/setup/sheet  (sheet_id, default_offer)
    v
Next.js Route Handler
    |---> supabase.from('outreach_clients').upsert({ user_id, sheet_id, default_offer })
    v
Redirect to /outreach/session

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MIDDLEWARE (runs on every request)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/dashboard, /api/dashboard, /api/analytics
    --> existing password-cookie check (UNCHANGED)

/outreach, /outreach/*, /api/outreach/*
    --> @supabase/ssr getClaims() JWT check
    --> unauthenticated pages → redirect /outreach/login
    --> unauthenticated API  → return 401 JSON

/outreach/login  (public — no auth check)
/api/outreach/magic-link  (public — sends OTP)
/api/outreach/auth/confirm  (public — exchanges token hash)
/api/outreach/auth/google  (protected — requires Supabase session)
/api/outreach/auth/callback  (public but stateless-CSRF-protected)
```

### Recommended Project Structure

```
app/
├── outreach/
│   ├── login/
│   │   └── page.tsx             # Magic link email form (Client Component)
│   ├── setup/
│   │   ├── google/
│   │   │   └── page.tsx         # "Koppel je Google account" button
│   │   └── sheet/
│   │       └── page.tsx         # Sheet ID input + default_offer radio
│   └── session/
│       └── page.tsx             # Client dashboard (Phase 2+)
├── api/
│   └── outreach/
│       ├── magic-link/
│       │   └── route.ts         # signInWithOtp trigger
│       ├── auth/
│       │   ├── confirm/
│       │   │   └── route.ts     # verifyOtp callback (magic link)
│       │   ├── google/
│       │   │   └── route.ts     # generate Google OAuth URL + state cookie
│       │   └── callback/
│       │       └── route.ts     # exchange code, encrypt token, upsert
│       ├── setup/
│       │   └── sheet/
│       │       └── route.ts     # save sheet_id + default_offer
│       └── admin/
│           └── invite/
│               └── route.ts     # inviteUserByEmail (service role)
lib/
└── outreach/
    ├── supabase.ts              # createOutreachClient() helper (server)
    ├── encrypt.ts               # encrypt() / decrypt() AES-256-GCM
    └── google-oauth.ts          # getOAuth2Client(), generateAuthUrl()
middleware.ts                    # EXTENDED — new /outreach branch added
```

### Pattern 1: `@supabase/ssr` Middleware Extension

**What:** The existing `middleware.ts` has a password-cookie branch for `/dashboard`. The new branch handles `/outreach` using `createServerClient` from `@supabase/ssr` to read and refresh the Supabase session cookie.

**When to use:** Every request to `/outreach/*` or `/api/outreach/*`.

**Key insight from Next.js 16 docs:** The `createServerClient` cookie `setAll` must write to the `response` object that is actually returned from the middleware — not to an intermediate response. The standard pattern uses a `let supabaseResponse = NextResponse.next({ request })` that is mutated by cookie setters, then returned. [CITED: supabase.com/docs/guides/auth/server-side/nextjs]

```typescript
// lib/outreach/supabase-middleware.ts
// Source: adapted from Supabase SSR official docs + @the-shubham medium article
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function updateOutreachSession(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl

  // Only handle /outreach routes
  const isOutreachPage = pathname.startsWith('/outreach') && !pathname.startsWith('/outreach/login')
  const isOutreachApi = pathname.startsWith('/api/outreach')

  // Public outreach routes that skip auth
  const isPublicOutreach =
    pathname === '/outreach/login' ||
    pathname.startsWith('/api/outreach/magic-link') ||
    pathname.startsWith('/api/outreach/auth/confirm') ||
    pathname.startsWith('/api/outreach/auth/callback')

  if (!isOutreachPage && !isOutreachApi) return null // not our concern

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: getClaims() validates JWT locally (no network call if asymmetric key)
  // getUser() always hits Supabase network — avoid in middleware for performance
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  if (!isPublicOutreach && !user) {
    if (isOutreachApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = request.nextUrl.clone()
    url.pathname = '/outreach/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

```typescript
// middleware.ts — extended (existing /dashboard logic untouched)
import { NextRequest, NextResponse } from 'next/server'
import { updateOutreachSession } from './lib/outreach/supabase-middleware'

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD ?? 'changeme'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Dashboard protection (UNCHANGED) ─────────────────────────────────────
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/dashboard') || pathname.startsWith('/api/analytics')) {
    const token = request.cookies.get('dashboard_token')?.value
    if (token !== DASHBOARD_PASSWORD) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // ── Outreach protection (NEW) ─────────────────────────────────────────────
  if (pathname.startsWith('/outreach') || pathname.startsWith('/api/outreach')) {
    const outreachResult = await updateOutreachSession(request)
    if (outreachResult) return outreachResult
  }

  // ── Language detection (UNCHANGED) ────────────────────────────────────────
  const host = request.headers.get('host') || ''
  let language = 'nl'
  if (host.includes('leaditgrow.com')) language = 'en'
  else if (host.includes('leaditgrow.be')) language = 'nl'

  const existingLang = request.cookies.get('lang')?.value
  if (existingLang === language) return NextResponse.next()

  const response = NextResponse.next()
  response.cookies.set('lang', language, { maxAge: 60 * 60 * 24 * 365, path: '/' })
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### Pattern 2: Magic Link Flow (Supabase Auth)

**What:** Client submits email → server calls `signInWithOtp` → Supabase sends email with link → user clicks → confirm route exchanges `token_hash` for session.

**Critical:** Use PKCE flow (default in `@supabase/ssr`). The magic link includes `?token_hash=` and `?type=email`. The confirm route calls `verifyOtp`, NOT `exchangeCodeForSession` (that is for OAuth provider callbacks). [CITED: supabase.com/docs/guides/auth/auth-email-passwordless]

```typescript
// app/api/outreach/magic-link/route.ts
import { createClient } from '@/lib/outreach/supabase'  // anon key, server client
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,  // invite-only: reject unknown emails
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/outreach/auth/confirm`,
    },
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
```

```typescript
// app/api/outreach/auth/confirm/route.ts
// Source: Supabase PKCE email confirmation pattern
import { createClient } from '@/lib/outreach/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as 'email' | 'invite' | null
  const next = searchParams.get('next') ?? '/outreach/setup/google'

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  return NextResponse.redirect(new URL('/outreach/login?error=invalid_link', request.url))
}
```

### Pattern 3: Server-Side Supabase Client Helper

**What:** A factory function that creates a `createServerClient` wired to Next.js `cookies()`. Used in route handlers and server components — NOT in middleware (middleware gets its own client).

```typescript
// lib/outreach/supabase.ts
// Source: official @supabase/ssr pattern
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore: called from Server Component, middleware handles cookie refresh
          }
        },
      },
    }
  )
}

export function createAdminClient() {
  // Service role — ONLY for admin operations (invite)
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
}
```

### Pattern 4: Google OAuth2 Flow (Two-Step)

**What:** Server generates an authorization URL with `access_type: 'offline'` and `prompt: 'consent'` (required to receive a `refresh_token`). After consent, the callback receives `?code=` and exchanges it for tokens. [CITED: developers.google.com/identity/protocols/oauth2/web-server]

**Scopes required:**
- Gmail compose: `https://www.googleapis.com/auth/gmail.compose` [VERIFIED: developers.google.com/identity/protocols/oauth2/scopes]
- Sheets: `https://www.googleapis.com/auth/spreadsheets` [VERIFIED: developers.google.com/identity/protocols/oauth2/scopes]

**CSRF protection:** Generate a random `state` value, store it in an httpOnly cookie, and verify on callback.

```typescript
// lib/outreach/google-oauth.ts
import { google } from 'googleapis'

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    'https://app.leaditgrow.be/api/outreach/auth/callback'
  )
}

export function generateAuthUrl(state: string): string {
  const client = getOAuth2Client()
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',          // REQUIRED to always receive refresh_token
    scope: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/gmail.compose',
    ],
    state,
  })
}
```

```typescript
// app/api/outreach/auth/google/route.ts
import { generateAuthUrl } from '@/lib/outreach/google-oauth'
import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest) {
  const state = randomBytes(16).toString('hex')
  const url = generateAuthUrl(state)
  const res = NextResponse.redirect(url)
  res.cookies.set('outreach_oauth_state', state, {
    httpOnly: true, secure: true, sameSite: 'lax', maxAge: 600, path: '/',
  })
  return res
}
```

```typescript
// app/api/outreach/auth/callback/route.ts
import { getOAuth2Client } from '@/lib/outreach/google-oauth'
import { encrypt } from '@/lib/outreach/encrypt'
import { createClient } from '@/lib/outreach/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const storedState = req.cookies.get('outreach_oauth_state')?.value

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(new URL('/outreach/setup/google?error=csrf', req.url))
  }

  const oauth2Client = getOAuth2Client()
  const { tokens } = await oauth2Client.getToken(code)

  if (!tokens.refresh_token) {
    // User already granted access — no refresh_token returned
    // This happens if prompt:consent was bypassed or token already exists
    // Redirect to sheet setup if token already stored, else force re-consent
    return NextResponse.redirect(new URL('/outreach/setup/google?error=no_refresh', req.url))
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/outreach/login', req.url))

  const encryptedToken = encrypt(tokens.refresh_token)
  await supabase.from('outreach_tokens').upsert({
    user_id: user.id,
    encrypted_token: encryptedToken,
    updated_at: new Date().toISOString(),
  })

  const res = NextResponse.redirect(new URL('/outreach/setup/sheet', req.url))
  res.cookies.delete('outreach_oauth_state')
  return res
}
```

### Pattern 5: Application-Level AES-256-GCM Encryption

**What:** Encrypt the Google refresh token with Node.js built-in `crypto` before storing in Supabase. The encryption key lives only in env vars — never in SQL. [ASSUMED — standard Node.js crypto pattern, no official docs URL for this specific use case]

**Why not pgcrypto:** When using `pgp_sym_encrypt(token, key)` in SQL, the key appears in: PostgreSQL logs, pg_stat_activity, replication streams (if logical replication is on), and any query tracing tool. Application-level encryption keeps the key in the environment only. [CITED: github.com/orgs/supabase/discussions/627]

```typescript
// lib/outreach/encrypt.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.SUPABASE_ENCRYPTION_KEY!, 'hex') // 32 bytes = 64 hex chars

export function encrypt(plaintext: string): string {
  const iv = randomBytes(12)  // 96-bit IV for GCM
  const cipher = createCipheriv(ALGORITHM, KEY, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  // Format: iv:tag:ciphertext (all hex)
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`
}

export function decrypt(stored: string): string {
  const [ivHex, tagHex, cipherHex] = stored.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const tag = Buffer.from(tagHex, 'hex')
  const ciphertext = Buffer.from(cipherHex, 'hex')
  const decipher = createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
}
```

**Generating the key (one-time):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Store the output as `SUPABASE_ENCRYPTION_KEY` in `.env.local` and Vercel environment.

### Pattern 6: Invite-Only Flow

**What:** Disable signups in Supabase Dashboard (Authentication > Providers > Email > toggle off "Allow new users to sign up"). Then Jeroen uses a protected admin route to invite clients by email. [CITED: rapidevelopers.com/supabase-tutorial/how-to-allow-login-only-for-invited-users-in-supabase]

```typescript
// app/api/outreach/admin/invite/route.ts
// Protected by dashboard_token cookie (Jeroen only)
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/outreach/supabase'

export async function POST(req: NextRequest) {
  const token = req.cookies.get('dashboard_token')?.value
  if (token !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { email, company_name } = await req.json()
  const admin = createAdminClient()

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { company_name },
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/outreach/setup/google`,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true, user_id: data.user.id })
}
```

**What the invited user receives:** A Supabase-sent email with a magic link. Clicking it confirms their account and redirects to `redirectTo`. [CITED: rapidevelopers.com/supabase-tutorial/how-to-allow-login-only-for-invited-users-in-supabase]

**After invitation, on subsequent logins:** Client uses `signInWithOtp` with `shouldCreateUser: false`. Since signup is disabled in the dashboard, non-invited emails receive no email (they are silently ignored — Supabase does not confirm or deny existence). [CITED: supabase.com/docs/guides/auth/auth-email-passwordless]

### Pattern 7: Supabase Migration SQL

```sql
-- Migration: 001_outreach_tables.sql

-- Enable pgcrypto (not used for token encryption, but useful for uuid gen)
-- Already enabled by default in Supabase projects [ASSUMED]

-- outreach_clients
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

-- outreach_tokens
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
```

**Note on RLS and service role:** The `createAdminClient()` uses `SUPABASE_SERVICE_KEY` which bypasses RLS. Write operations from the admin invite route (creating outreach_clients row) must use the admin client. All client-facing operations use the anon client with JWT session — RLS enforces row isolation.

### Anti-Patterns to Avoid

- **Calling `getUser()` in middleware:** Always use `getClaims()` in middleware. `getUser()` makes a network request to Supabase on every request — under Vercel's 10s timeout this is a risk, and at scale it hammers the Auth server. [CITED: supabase.com/docs/guides/auth/server-side/nextjs]
- **Using the Supabase Google OAuth provider for Sheets/Gmail:** Supabase's built-in Google OAuth provider only provides identity scopes. It does NOT return tokens that work with the Sheets or Gmail APIs. These require a separate web app credential.
- **Generating Google OAuth URL client-side:** The `state` parameter for CSRF protection must be set server-side and stored in an httpOnly cookie. Client-side generation leaks the state value.
- **Storing the refresh token in plaintext:** Even with RLS, a Supabase support incident or SQL injection could expose raw tokens. Encrypt before insert.
- **Using `prompt: 'consent'` only on first login:** Google only returns a `refresh_token` when `prompt: 'consent'` is set AND `access_type: 'offline'`. Omitting `prompt: 'consent'` means subsequent re-authorizations return no refresh_token. [CITED: developers.google.com/identity/protocols/oauth2/web-server]
- **Omitting `shouldCreateUser: false`:** Without this flag, any email address can trigger a Supabase signup even if signups are disabled via dashboard — the behavior is invitation-style when the flag is set.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cookie-based session refresh in Next.js middleware | Custom JWT parsing + cookie write logic | `@supabase/ssr` `createServerClient` | Cookie refresh timing, token rotation, and secure cookie flags are edge cases with many failure modes |
| PKCE email confirmation | Custom token validation | `supabase.auth.verifyOtp({ token_hash, type })` | Handles expiry, single-use enforcement, and session creation |
| Google OAuth2 PKCE | Custom HTTP OAuth flow | `googleapis` `OAuth2Client.generateAuthUrl()` + `getToken()` | State management, token parsing, error handling |
| Refresh token encryption | Custom crypto logic | Node.js `crypto` module | GCM auth tag verification prevents tampering; rolling your own is a known failure point |
| User invitation | Custom email + token system | `supabase.auth.admin.inviteUserByEmail()` | Supabase handles token generation, expiry, and email delivery |

**Key insight:** The 3 most common auth bugs in Next.js + Supabase projects are: (1) missing cookie refresh in middleware, (2) using `getSession()` instead of `getClaims()` server-side, (3) not returning the mutated `supabaseResponse` from middleware. All three are solved by following the `@supabase/ssr` pattern exactly.

---

## Common Pitfalls

### Pitfall 1: Middleware returns wrong response object
**What goes wrong:** Session cookies are not refreshed; users get logged out unexpectedly after token expiry.
**Why it happens:** The `createServerClient` `setAll` callback must mutate `supabaseResponse` (the variable that gets returned), not a separate `response` variable. If you assign `const response = NextResponse.next()` and return `response` while setting cookies on a different `supabaseResponse`, the cookies never reach the browser.
**How to avoid:** Use the pattern: `let supabaseResponse = NextResponse.next({ request })` — mutable let, reassigned inside `setAll`, returned at end.
**Warning signs:** Session works on first login but expires after 1 hour and does not auto-refresh.

### Pitfall 2: Google refresh_token missing on callback
**What goes wrong:** `tokens.refresh_token` is `null` or `undefined`; cannot store a working token.
**Why it happens:** Google only sends `refresh_token` when (a) `access_type: 'offline'` AND (b) `prompt: 'consent'` are both set, AND (c) this is a new authorization or the user revoked previous access.
**How to avoid:** Always set both parameters. Handle the `null` case explicitly in the callback — redirect to an error page that asks the user to re-authorize.
**Warning signs:** Callback succeeds but subsequent Gmail/Sheets calls fail with "invalid_grant".

### Pitfall 3: Magic link token_hash vs code confusion
**What goes wrong:** Confirm route calls `exchangeCodeForSession(code)` but magic links use `token_hash`, causing `invalid_grant` error.
**Why it happens:** `exchangeCodeForSession` is for OAuth provider flows (Supabase Google login, GitHub login). Magic links use `verifyOtp({ token_hash, type: 'email' })`.
**How to avoid:** Use `verifyOtp` in the magic link confirm route. Only use `exchangeCodeForSession` for Supabase OAuth provider callbacks.
**Warning signs:** "invalid code" or "expired token" errors in the confirm route despite a fresh magic link.

### Pitfall 4: Supabase `shouldCreateUser` behavior when signups disabled
**What goes wrong:** With signups disabled in the dashboard, calling `signInWithOtp` without `shouldCreateUser: false` still attempts signup and may return unexpected error codes.
**Why it happens:** `shouldCreateUser` defaults to `true`, which conflicts with dashboard-level signup restriction.
**How to avoid:** Always set `shouldCreateUser: false` in the `/api/outreach/magic-link` route.
**Warning signs:** Non-invited emails receive confusing errors or no feedback.

### Pitfall 5: CSRF state mismatch on Google OAuth callback
**What goes wrong:** `state !== storedState` check fails; users cannot complete Google OAuth.
**Why it happens:** The state cookie expires (default maxAge too short) or the callback request loses the cookie due to cross-domain redirect (Google → app.leaditgrow.be). `sameSite: 'lax'` allows cookies on redirect.
**How to avoid:** Set `sameSite: 'lax'` (not `'strict'`) on the state cookie; set `maxAge: 600` (10 min); confirm the redirect URI exactly matches what is registered in Google Cloud Console.
**Warning signs:** CSRF errors only during Google OAuth, not magic link flow.

### Pitfall 6: RLS blocks admin insert on outreach_clients
**What goes wrong:** When the invite API creates an initial `outreach_clients` row (to store company_name before the client logs in), RLS blocks the insert because `auth.uid()` is null in a service-role context.
**Why it happens:** RLS policies using `auth.uid()` only evaluate correctly when there is an authenticated session. Service role bypasses RLS entirely — this is correct behavior, but the row insert should use `createAdminClient()`, not `createClient()`.
**How to avoid:** Use the admin client (service role key) for any server-side inserts that happen before the user has a session. Use the anon client for all client-initiated mutations.
**Warning signs:** 403 or RLS violation errors on insert from admin invite route.

---

## Code Examples

### Get authenticated user in a Route Handler

```typescript
// Source: @supabase/ssr official pattern
const supabase = await createClient()
const { data: { user }, error } = await supabase.auth.getUser()
if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
```

### Retrieve and use the stored Google refresh token

```typescript
// Source: standard googleapis pattern + project-specific decrypt
import { decrypt } from '@/lib/outreach/encrypt'
import { getOAuth2Client } from '@/lib/outreach/google-oauth'

async function getAuthenticatedGoogleClient(userId: string, supabase: SupabaseClient) {
  const { data } = await supabase
    .from('outreach_tokens')
    .select('encrypted_token')
    .eq('user_id', userId)
    .single()

  if (!data) throw new Error('No Google token found')

  const refreshToken = decrypt(data.encrypted_token)
  const client = getOAuth2Client()
  client.setCredentials({ refresh_token: refreshToken })
  return client  // googleapis auto-refreshes access token on first API call
}
```

### signInWithOtp for invite-only (no new users)

```typescript
// Source: supabase.com/docs/guides/auth/auth-email-passwordless
await supabase.auth.signInWithOtp({
  email,
  options: {
    shouldCreateUser: false,
    emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/outreach/auth/confirm`,
  },
})
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@supabase/auth-helpers-nextjs` | `@supabase/ssr` | ~2024 | Auth helpers deprecated; `@supabase/ssr` is the official replacement |
| `supabase.auth.getSession()` server-side | `supabase.auth.getClaims()` | Mid-2024 | `getSession()` not reliable server-side; `getClaims()` validates JWT locally |
| `supabase.auth.getUser()` in middleware | `supabase.auth.getClaims()` in middleware | Late 2024 | `getUser()` makes a network call per request; `getClaims()` is local (with asymmetric key) |
| Implicit OAuth flow | PKCE flow (default in `@supabase/ssr`) | 2024 | PKCE is now the default and recommended flow for SSR |

**Deprecated/outdated:**
- `@supabase/auth-helpers-nextjs`: Deprecated — replaced by `@supabase/ssr`. Do not install.
- `supabase.auth.getSession()` in server code: Unreliable — can return stale or unauthenticated sessions. Use `getClaims()` or `getUser()`.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | AES-256-GCM encrypt/decrypt implementation (exact code) | Code Examples, Pattern 5 | Incorrect format string could cause decrypt failures; test with a round-trip before deploying |
| A2 | pgcrypto is enabled by default in Supabase projects | Pattern 7 (SQL comment) | Low risk — comment only, pgcrypto not used for token encryption |
| A3 | `getClaims()` is available in `@supabase/supabase-js` 2.103.0 | Pattern 1 | If not available, fall back to `getUser()`; check type definitions after install |
| A4 | Supabase's asymmetric key setting — if not configured, `getClaims()` falls back to network call | Pattern 1 | Performance impact only; auth still works; check Supabase project JWT settings |

**If A3 is wrong:** `getUser()` is the safe fallback. It makes a network call but is always correct. Given the Vercel 10s limit, confirm `getClaims()` is available before relying on it in middleware.

---

## Open Questions (RESOLVED)

1. **Is `getClaims()` available in supabase-js 2.103.0?** (RESOLVED)
   - What we know: It's documented in current Supabase docs as the recommended middleware method.
   - What's unclear: The installed version (2.103.0) may predate this API addition.
   - **Resolution:** Executor checks TypeScript types after installing `@supabase/ssr` in Wave 0 Task 1. Inspect `node_modules/@supabase/supabase-js` types for `getClaims`. If absent, replace all `getClaims()` calls with `getUser()` — auth correctness is identical, the only cost is one extra network call per middleware invocation (acceptable for invite-only low-traffic use).

2. **Does the Supabase project use asymmetric JWT signing?** (RESOLVED)
   - What we know: By default, Supabase uses HS256 (symmetric). Asymmetric requires enabling in project settings.
   - What's unclear: Current setting on `dpfbsipcoydwdgrcfavf`.
   - **Resolution:** Executor checks Authentication > JWT Settings in Supabase dashboard for project `dpfbsipcoydwdgrcfavf`. If HS256 (the default), `getClaims()` falls back to a network call automatically — functionally identical to `getUser()`. No code change needed. For this low-traffic invite-only use case the performance impact is negligible.

3. **Google Cloud Console OAuth2 credentials created?** (RESOLVED)
   - What we know: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are NOT in `.env.local` yet.
   - What's unclear: Whether a web application credential exists or needs to be created.
   - **Resolution:** Resolved by the human checkpoint in Wave 0 Task 4 of `01-01-PLAN.md`. Executor pauses at that task and waits for user confirmation before proceeding to Wave 1. Credentials are NOT created autonomously.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `@supabase/ssr` | Middleware + server auth | Not installed | 0.12.0 (latest) | None — must install |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth2 | Not in .env.local | — | Create in Google Cloud Console |
| `SUPABASE_ENCRYPTION_KEY` | Token encryption | Not in .env.local | — | Generate with `crypto.randomBytes(32).toString('hex')` |
| `NEXT_PUBLIC_APP_URL` | emailRedirectTo URLs | Not confirmed in .env.local | — | Hardcode `https://app.leaditgrow.be` or add to env |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `@supabase/ssr` client | In .env.local (confirmed) | — | Already available |
| `SUPABASE_SERVICE_KEY` | Admin invite API | In .env.local (confirmed) | — | Already available |
| `googleapis` | Google OAuth2 | Installed 173.0.0 | 173.0.0 | Already available |
| Node.js `crypto` | AES-256-GCM | Built-in (Node 22) | Node v22.21.0 | Already available |

**Missing dependencies with no fallback:**
- `@supabase/ssr` — must install before middleware extension
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — must create in Google Cloud Console
- `SUPABASE_ENCRYPTION_KEY` — must generate

**Missing dependencies with fallback:**
- `NEXT_PUBLIC_APP_URL` — can hardcode the production URL in routes if env var absent

---

## Validation Architecture

> No test framework is currently installed in this project (no `jest.config.*`, `vitest.config.*`, or test directories found). Validation for this phase is manual smoke testing per the success criteria.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| AUTH-01 | Magic link email sent for invited user | Manual | — | Requires real Supabase project + email |
| AUTH-01 | Magic link confirm route creates session cookie | Manual | — | Check browser cookies after clicking link |
| AUTH-02 | Google OAuth consent screen appears | Manual | — | Requires live Google credentials |
| AUTH-02 | `outreach_tokens` row created with encrypted value | Manual SQL | `SELECT * FROM outreach_tokens;` via Supabase dashboard | Verify token is not plaintext |
| AUTH-03 | Second login requires no re-authorization | Manual | — | Login again after session expiry; check no Google prompt |
| ALL | RLS: client cannot read another client's tokens | Manual SQL | Run as anon user: `SELECT * FROM outreach_tokens;` should return `[]` | [MEMORY: Supabase RLS rule — verify with anon key returning []] |

### Wave 0 Gaps

- [ ] Google Cloud Console: Create OAuth2 Web Application credential, add redirect URI
- [ ] Supabase Dashboard: Disable "Allow new users to sign up" under Authentication > Providers > Email
- [ ] `.env.local` and Vercel env: Add `SUPABASE_ENCRYPTION_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_APP_URL`
- [ ] `npm install @supabase/ssr@0.12.0`
- [ ] Run `supabase migration up` (or apply SQL directly in Supabase dashboard) for outreach tables

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes | Supabase Auth magic link (invite-only, `shouldCreateUser: false`) |
| V3 Session Management | Yes | `@supabase/ssr` cookie-based JWT, httpOnly, secure, sameSite=lax |
| V4 Access Control | Yes | Supabase RLS `user_id = auth.uid()`; middleware route protection |
| V5 Input Validation | Yes | Validate `email` format before `signInWithOtp`; validate `state` on OAuth callback |
| V6 Cryptography | Yes | Node.js `crypto` AES-256-GCM with authenticated tag — do not hand-roll |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| CSRF on Google OAuth callback | Spoofing | `state` parameter + httpOnly cookie comparison |
| Stolen refresh token from DB | Information Disclosure | AES-256-GCM encryption before insert; RLS limits read surface |
| Unauthenticated access to `/outreach/*` | Elevation of Privilege | Middleware JWT check; API routes return 401 |
| Service role key exposed client-side | Elevation of Privilege | Admin client only in server-side route handlers; never in Client Components |
| Session fixation after magic link | Spoofing | Supabase `verifyOtp` invalidates the one-time token on use |
| Magic link email enumeration | Information Disclosure | `shouldCreateUser: false` returns success to client regardless of whether email exists |

---

## Sources

### Primary (HIGH confidence)
- [CITED: supabase.com/docs/guides/auth/auth-email-passwordless] — signInWithOtp, shouldCreateUser, rate limits (60s cooldown, 1hr expiry), PKCE vs implicit
- [CITED: developers.google.com/identity/protocols/oauth2/web-server] — generateAuthUrl, getToken, access_type:offline, prompt:consent, token response shape
- [CITED: developers.google.com/identity/protocols/oauth2/scopes] — exact scope strings for Gmail compose and Sheets
- [CITED: supabase.com/docs/reference/javascript/auth-admin-inviteuserbyemail] — inviteUserByEmail signature and admin API requirement
- [VERIFIED: npm registry] — `@supabase/ssr` 0.12.0 exists and is the latest stable version

### Secondary (MEDIUM confidence)
- [CITED: supabase.com/docs/reference/javascript/auth-getclaims] — getClaims() vs getUser() distinction, network behavior
- [CITED: rapidevelopers.com/supabase-tutorial/how-to-allow-login-only-for-invited-users-in-supabase] — dashboard invite-only setup steps, inviteUserByEmail options
- [CITED: the-shubham.medium.com — Next.js + Supabase Cookie-Based Auth 2025] — middleware pattern with createServerClient, setAll cookie handling

### Tertiary (LOW confidence)
- [ASSUMED] — Node.js AES-256-GCM encrypt/decrypt utility implementation (standard crypto pattern, not from a single authoritative source)
- [ASSUMED] — pgcrypto enabled by default (widely stated but not verified against current Supabase docs for dpfbsipcoydwdgrcfavf specifically)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — `@supabase/ssr` is the official Supabase SSR package; all other dependencies already installed and working
- Architecture: HIGH — Two-step auth (identity + Google OAuth) pattern is the documented approach; middleware extension pattern verified against Next.js 16 and Supabase docs
- Pitfalls: HIGH — All pitfalls derived from documented behavior (getClaims vs getUser, prompt:consent for refresh_token, PKCE vs implicit)
- Encryption approach: MEDIUM — Application-level AES is well-established but the exact implementation is [ASSUMED]; requires round-trip testing

**Research date:** 2026-06-25
**Valid until:** 2026-07-25 (Supabase SSR APIs are stable; Google OAuth scopes are stable)
