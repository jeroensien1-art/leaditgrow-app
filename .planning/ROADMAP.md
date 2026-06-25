# Roadmap — Lead it, Grow App — Outreach Dashboard (Milestone 3)

> Prior milestones (lead widget, diagnostic, CRM dashboard, email agent, ebook funnels) are complete and live at app.leaditgrow.be. This roadmap covers Milestone 3: the multi-tenant Outreach Dashboard.

## Phases

- [ ] **Phase 1: Multi-tenant Auth** - Supabase Auth login + Google OAuth per client, encrypted refresh token storage
- [ ] **Phase 2: Sheet Reader + Research Engine** - Client pastes Sheet ID, app reads leads, Supabase Edge Function does website research
- [ ] **Phase 3: Offer Selection + Email Generation** - 3 offer templates, editable textarea, per-client email generation
- [ ] **Phase 4: Gmail Draft + Sheet Writeback** - Draft via client's own token, status + draft ID written back to their Sheet
- [ ] **Phase 5: Admin View** - Jeroen sees all clients, their sessions, draft counts

---

## Phase Details

### Phase 1: Multi-tenant Auth
**Goal**: A client can sign up, connect their Google account via OAuth, and land on their personal dashboard — with their refresh token stored encrypted so every subsequent login is frictionless
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03
**Success Criteria** (what must be TRUE):
  1. Client can sign up and log in via Supabase Auth (email/password or magic link)
  2. Client clicks "Koppel Google account" → goes through OAuth2 consent → app stores encrypted refresh token in Supabase per user
  3. On next login, no re-authorization needed — token is retrieved and used automatically
  4. RLS enabled on all new auth tables — clients can only see their own data
  5. Existing `leads` and `diagnostics` tables are untouched

### Phase 2: Sheet Reader + Research Engine
**Goal**: Client pastes their Google Sheet ID and the app loads their leads; website research runs via Supabase Edge Function to bypass Vercel's 10s timeout
**Depends on**: Phase 1
**Requirements**: SHEET-01, SHEET-02, RES-01, RES-02
**Success Criteria** (what must be TRUE):
  1. Client pastes Sheet ID → app reads leads using their own Google OAuth token
  2. Research call completes within 30s (Edge Function, not Vercel API route)
  3. Thin / bot-blocked websites are marked "handmatig onderzoek vereist"
  4. Research results stored per-session in Supabase (not ephemeral)

### Phase 3: Offer Selection + Email Generation
**Goal**: Client can choose an offer per lead and get a short personalized Dutch email (5-7 sentences)
**Depends on**: Phase 2
**Requirements**: EMAIL-01, EMAIL-02, EMAIL-03
**Success Criteria** (what must be TRUE):
  1. Three offer buttons per card: Leiderschapsanalyse / Speed-to-lead agents / Bedrijfsgroei-analyse
  2. Generated email uses research observation from Phase 2
  3. Email is editable in textarea before creating draft
  4. If research quality is not 'ok', email generation is blocked with clear message

### Phase 4: Gmail Draft + Sheet Writeback
**Goal**: Client creates Gmail draft in their own Gmail account; status + draft ID written back to their Sheet
**Depends on**: Phase 3
**Requirements**: DRAFT-01, DRAFT-02
**Success Criteria** (what must be TRUE):
  1. Gmail draft created using client's own stored OAuth token — appears in their Gmail Drafts
  2. Draft ID + date written back to client's Sheet (columns they define)
  3. Never auto-sends — draft only
  4. Writeback uses single batchUpdate (not row-by-row)

### Phase 5: Admin View
**Goal**: Jeroen can see all clients, their active sessions, and draft counts from a single admin screen
**Depends on**: Phase 4
**Requirements**: ADMIN-01
**Success Criteria** (what must be TRUE):
  1. Admin view at /dashboard/admin (behind Jeroen's Supabase role)
  2. Lists all clients with: name, last session date, total drafts created
  3. Can view any client's session without impersonating them

---

## Progress

| Phase | Plans Complete | Status |
|-------|----------------|--------|
| 1. Multi-tenant Auth | 0/? | Not started |
| 2. Sheet Reader + Research Engine | 0/? | Not started |
| 3. Offer Selection + Email Generation | 0/? | Not started |
| 4. Gmail Draft + Sheet Writeback | 0/? | Not started |
| 5. Admin View | 0/? | Not started |
