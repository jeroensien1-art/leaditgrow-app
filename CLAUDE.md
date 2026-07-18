@AGENTS.md

# leaditgrow-app — Projectstatus

Domein: leaditgrow.be
Branch: main
Vercel project: prj_y8AA5qU8wgAWpHoER6D7sHidSsUe
Supabase project: dpfbsipcoydwdgrcfavf (gedeeld met agent-dashboard + content-studio)

## Wat dit is

Marketing site + funnel voor Lead it, Grow (Jeroen's agency). Bezoekers landen op de site, doen de gratis diagnose, en worden via email-sequenties klant.

## Gebouwde pagina's en features (stand 2026-07-15)

| Route | Wat het is | Status |
|-------|-----------|--------|
| `/` | Homepage met hero, diensten, CTA | Live |
| `/diagnostic` | Gratis diagnose (scored quiz, email-gate) | Live |
| `/diensten` | Dienstenoverzicht | Live |
| `/content-strategie` | Sales page content intelligence systeem | Live (deploy 2026-07-15) |
| `/api/leads` | Lead opslaan vanuit diagnostic | Live |
| `/api/diagnostic` | Diagnostic score berekenen | Live |
| `/api/calculator` | ROI calculator | Live |

## Design tokens (brutalist, canonical)

ink `#0e0d0b` · bg `#f2f0eb` · bg2 `#eae8e2` · groen `#1a5e35` · lime `#4ade80` · orange `#c96442` · muted `#787068`
Fonts: `var(--font-brutalist)` Space Grotesk, `var(--font-mono-brutalist)` Space Mono
Radius: 0. Nooit em-dashes in copy.

## Patroon voor nieuwe pagina's

```tsx
'use client'
import { Nav } from '@/components/nav'
import { useLang } from '@/components/lang-context'
// Inline styles, geen Tailwind classes
```

## Open punten

- [ ] Groeiladder component porten naar React (vervangt PineTreeLadder, design: variant-2.html "Het Pad")
- [ ] Content-strategie pagina live verifiëren via curl

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
