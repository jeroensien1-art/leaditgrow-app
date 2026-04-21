# Speed-to-Lead as a Service — Handleiding
**Lead it, Grow | BD Systems**
*Gegenereerd: April 2026*

---

## Wat is het?

Je verkoopt de volledige automatisering die je op leaditgrow.com hebt gebouwd als een white-label dienst aan andere ondernemers:

- **Contactformulier** dat leads automatisch kwalificeert via Claude
- **Diagnostische tool** die een gepersonaliseerd rapport genereert en verstuurt
- **Chat widget** die bezoekers kwalificeert en een gesprek inplant
- **Revenue calculator** die de pijnpunten zichtbaar maakt
- **Automatische follow-up emails** vanuit hun eigen domein

Resultaat voor de klant: elke lead krijgt binnen 60 seconden een persoonlijke reactie, 24/7, zonder dat de klant er iets voor hoeft te doen.

---

## Pakketten & Prijzen

### Pakket 1 — Starter Lead Flow
**€597 setup + €149/mo**

| Wat | Details |
|-----|---------|
| Contactformulier | Claude kwalificeert lead + auto-reply email |
| Chat widget | Floating widget met kwalificatievragen |
| Email automatisatie | 1 gepersonaliseerde reply vanuit hun domein |
| Dashboard | Basis Supabase leads-overzicht |
| Onboarding | 1x intake gesprek (30 min) |

**Tijdsinvestering voor jou:**
- Setup: 3-4 uur
- Maandelijks: 30 min (monitoring + kleine aanpassingen)

**Ideaal voor:** Solo-ondernemer of freelancer met een simpele website en te weinig opvolging.

---

### Pakket 2 — Growth BD System
**€1.197 setup + €249/mo**

| Wat | Details |
|-----|---------|
| Alles uit Starter | + |
| Business Diagnostic tool | Volledige diagnostiek op hun domein, branded |
| Gepersonaliseerd rapport | Claude genereert op maat rapport per lead |
| 2-staps follow-up | Automatische herinnering na 2 uur als geen reactie |
| Revenue Calculator | Rekent hun eigen revenue leak uit |
| Dashboard | Supabase met scores, statussen en rapportstatus |
| Maandelijkse rapportage | Jij stuurt hen een kort overzicht van leads |

**Tijdsinvestering voor jou:**
- Setup: 7-9 uur
- Maandelijks: 1-1,5 uur (monitoring + rapport + aanpassingen)

**Ideaal voor:** Dienstverlener of consultant met actieve lead flow en wil om conversie te verhogen.

---

### Pakket 3 — Full BD Automation
**€2.197 setup + €397/mo**

| Wat | Details |
|-----|---------|
| Alles uit Growth | + |
| Volledig gebrandmerkt systeem | Eigen kleuren, logo, taal, toon |
| Maatwerk Claude prompt | Volledig afgestemd op hun aanbod en doelgroep |
| Chat widget met tijdsslots | Claude stelt concrete tijdstippen voor |
| Maandelijks reviewgesprek | 30 min call om systeem bij te sturen |
| Prioriteit aanpassingen | Aanpassingen binnen 48 uur |

**Tijdsinvestering voor jou:**
- Setup: 12-16 uur
- Maandelijks: 2-3 uur (call + monitoring + aanpassingen + rapport)

**Ideaal voor:** Groeiend bedrijf met meerdere aanbodniveaus, team en serieuze lead flow.

---

## Kostenstructuur (wat het jou kost)

| Kost | Bedrag |
|------|--------|
| Vercel (hosting) | €0 (hobby) of €20/mo (pro) gedeeld |
| Supabase | €0 tot €25/mo afhankelijk van volume |
| Resend | €0-20/mo per klant (eigen domein, eigen kosten) |
| Claude API | ~€0,05-0,30 per lead (Sonnet) |
| Jouw tijd setup | 3-16 uur eenmalig |
| Jouw tijd maandelijks | 0,5-3 uur |

**Marge pakket 1:** €300-400/mo netto na kosten
**Marge pakket 2:** €500-600/mo netto na kosten
**Marge pakket 3:** €700-900/mo netto na kosten

---

## Wat je nodig hebt van de klant

### Eenmalig bij onboarding (1 intake gesprek van 30 min)

1. **DNS toegang** (of iemand die dat voor hen doet)
   - Resend domein verificatie: 3 DNS records
   - Duurt 5-15 minuten, jij begeleidt via scherm
2. **Supabase uitnodiging** (of jij beheert centraal)
   - Optie A: klant krijgt eigen Supabase project
   - Optie B: jij beheert multi-tenant in jouw project (eenvoudiger)
3. **Embed snippet op hun website**
   - 1 regel HTML die ze in hun `<head>` of via Google Tag Manager plakken
   - Of: jij krijgt eenmalig CMS-toegang (Webflow, WordPress, etc.)
4. **Brand input**
   - Logo (SVG of PNG)
   - Kleuren (hex codes)
   - Beschrijving aanbod en doelgroep (half A4, jij vult in tijdens gesprek)
   - Agenda-beschikbaarheid (welke dagen/tijden voor gesprekken)

### Dat is alles. Geen technische kennis vereist van de klant.

---

## Stappenplan: nieuwe klant opzetten

### Stap 1 — Intake (30 min)
- [ ] Aanbod, doelgroep en toon begrijpen
- [ ] Beschikbaarheid en tijdzone noteren
- [ ] Bevestigen welk pakket
- [ ] DNS en website afspraken maken

### Stap 2 — Technische setup (2-4 uur, jij doet dit)
- [ ] `client_id` aanmaken in Supabase `clients` tabel
- [ ] Claude system prompt schrijven op basis van intake
- [ ] Resend domein verificatie doorlopen met klant
- [ ] Widget configureren (kleuren, logo, taal, challenges)
- [ ] Embed snippet genereren en aanleveren

### Stap 3 — Testen (1 uur)
- [ ] Test lead insturen via widget
- [ ] Controleer Supabase lead binnenkomt
- [ ] Controleer email arriveert vanuit hun domein
- [ ] Controleer reply is correct qua toon en inhoud
- [ ] (Pakket 2+) Diagnostic testen met testdata

### Stap 4 — Oplevering (30 min call)
- [ ] Dashboard tonen
- [ ] Uitleggen wat automatisch gebeurt
- [ ] Eerste maand monitoring afspreken
- [ ] Factuur sturen

### Stap 5 — Maandelijkse opvolging
- [ ] Leads reviewen in dashboard
- [ ] Kwaliteit Claude replies checken (steekproef)
- [ ] Rapport sturen (pakket 2+)
- [ ] Call (pakket 3)

---

## Technisch: hoe je multi-tenant bouwt

De huidige leaditgrow-app is single-tenant (hardcoded voor Lead it, Grow). Om meerdere klanten te bedienen:

### Supabase
```sql
-- Voeg toe aan leads en diagnostics tabel
ALTER TABLE leads ADD COLUMN client_id TEXT;
ALTER TABLE diagnostics ADD COLUMN client_id TEXT;

-- Nieuwe clients tabel
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  name TEXT,
  system_prompt TEXT,
  from_email TEXT,
  reply_to TEXT,
  widget_config JSONB,
  available_hours TEXT,
  timezone TEXT,
  active BOOLEAN DEFAULT true
);
```

### Widget embed
```html
<!-- Klant plakt dit in hun website -->
<script src="https://leaditgrow.com/widget.js?client=CLIENT_ID"></script>
```

### API routes
Elke API call krijgt `client_id` mee. Route laadt config uit Supabase en geeft die door aan Claude en Resend.

**Tijdsinvestering multi-tenant bouwen: 6-10 uur eenmalig.**
Daarna is elke nieuwe klant een config-entry, geen code.

---

## Verkoopgesprek — wat je zegt

> "Elke lead die jou contacteert krijgt vandaag waarschijnlijk een antwoord na 4-48 uur, als ze al een antwoord krijgen. Studies tonen aan dat je kans om die lead te converteren met 21x daalt als je niet binnen 5 minuten reageert. Ik zet een systeem op dat elke lead automatisch kwalificeert en een persoonlijk antwoord stuurt, vanuit jouw naam, in jouw toon, met concrete tijdstippen voor een gesprek — binnen 60 seconden na inzending. Jij hoeft er niets voor te doen."

**Haak voor discovery call:**
> "Hoeveel leads per maand bereiken jou via je website? En hoeveel daarvan zetten door naar een gesprek?"

---

## Naam van de dienst (suggesties)

- **LeadFlow** — clean, direct
- **InstantLead** — benadrukt snelheid
- **BD Autopilot** — aansluitend bij BD Sprint aanbod
- **Lead Reactor** — speed-to-lead angle

Of gewoon als onderdeel van je BD Sprint positioneren: *"Wij bouwen je volledige lead-to-call automatisering in 4 weken."*

---

## Upsell logica

```
Geen website / slechte website
  → Website pakket eerst (partner of zelf)

Wel website, weinig leads
  → Starter Lead Flow (contactform + widget)

Redelijke leads, slechte conversie
  → Growth BD System (diagnostic + follow-up)

Serieuze pipeline, wil schalen
  → Full BD Automation + maandelijks retainer
```

---

*Aangemaakt door Claude Code — Lead it, Grow BD Systems*
