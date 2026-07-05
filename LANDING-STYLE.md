# LeadItGrow — Landing Page Stijlgids

Referentie voor toekomstige landing pages. Gebaseerd op `C:\Users\Jeroe\leaditgrow-makeover.html`.
Pas dit NIET toe op de bestaande website zonder expliciete instructie.

---

## Kleurpalet

```css
:root {
  --parchment: #faf9f5;       /* hoofdachtergrond */
  --sand: #ede9de;             /* sectie-achtergrond alternerend */
  --sand-dark: #e0ddd3;        /* borders, dividers */
  --terracotta: #c96442;       /* primary action, accent */
  --terracotta-dark: #b05535;  /* hover state */
  --brown: #3d3929;            /* primaire tekst */
  --brown-light: #6b6550;      /* secondaire tekst */
  --charcoal: #262624;         /* donkere secties, nav */
  --charcoal-light: #33322f;   /* footer */
  --text-muted: #9a917e;       /* labels, captions */
}
```

---

## Typografie

| Rol | Font | Gewicht | Grootte |
|-----|------|---------|---------|
| Display / H1 | Playfair Display | 700 | 42–72px |
| Sectie heading | Playfair Display | 700 | 30–44px |
| Card titel | Inter | 600 | 19–22px |
| Body | Inter | 400 | 16–18px |
| Nav links | Inter | 500 | 14px |
| Labels/tags | Inter | 700 uppercase | 11px, letter-spacing 0.14em |

Google Fonts import:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```

---

## Spacing (8pt grid)

```
xs:  8px   — kleine interne padding
sm:  16px  — component padding
md:  32px  — tussen gerelateerde elementen
lg:  64px  — tussen paginasecties
xl:  96px  — hero spacing
2xl: 128px — fullscreen hero padding
```

---

## Secties (volgorde landing page)

1. **Sticky Nav** — charcoal dark, backdrop-blur, logo links, links midden, CTA rechts
2. **Hero** — min-h-screen, donker overlay over foto, serif headline, 2 CTAs
3. **USP Bar** — charcoal, 3 kolommen met icoon + title + beschrijving
4. **Groeifasen** — 5-kolom grid, per fase een gekleurde balk onderaan
5. **Diensten Grid** — 3 cards, image overlay, hover lift
6. **Offer Ladder** — 4 pricing cards, featured kaart in charcoal
7. **About Strip** — charcoal bg, tekst links + foto rechts
8. **CTA Sectie** — volledig terracotta bg, gecentreerde headline + witte knop
9. **Footer** — charcoal-light, 4 kolommen, bottom bar met legal links

---

## Key CSS Patronen

```css
/* Card hover lift */
transition: transform 240ms ease, box-shadow 240ms ease;
hover: translateY(-6px) + box-shadow: 0 16px 48px rgba(61,57,41,0.16);

/* Image overlay op card */
background: linear-gradient(to top, rgba(38,38,36,0.72) 0%, rgba(38,38,36,0.15) 60%);

/* Sectie label */
font-size: 11px; font-weight: 700; letter-spacing: 0.14em;
text-transform: uppercase; color: var(--terracotta);

/* Primary button */
background: #c96442; color: white; padding: 14px 28px;
border-radius: 8px; transition: background 240ms ease;

/* Ghost button */
border: 1.5px solid rgba(255,255,255,0.45); color: var(--parchment);
hover: background rgba(250,249,245,0.08);

/* Sticky nav */
background: rgba(38,38,36,0.94); backdrop-filter: blur(12px);
border-bottom: 1px solid rgba(255,255,255,0.06);
```

---

## Regels

- Witruimte IS de layout. Nooit cramped.
- Secties alterneren: parchment ↔ sand ↔ charcoal
- Nooit: cold blue, neon groen, pure black/white
- Altijd: serif voor display headlines, Inter voor body
- Borders op cards: 1.5px solid var(--sand-dark)
- Featured pricing card: charcoal achtergrond, terracotta accent
- Hero overlay: minimaal 65% opacity zodat tekst leesbaar blijft
