'use client'

import { useState, useMemo, useEffect } from 'react'
import { useLang } from '@/components/lang-context'

type Step = 'intro' | 'context' | 'questions' | 'results' | 'capture' | 'thanks'

interface ContextAnswers {
  industry: string
  monthlyLeads: string
  avgDealValue: string
  teamSize: string
}

interface Question {
  lever: string
  theme: string
  meta: string
  label: string
  emotion: string
  options: { main: string; feel: string; score: number }[]
}

// ── EN DATA ────────────────────────────────────────────────────────────

const contextQuestionsEn = [
  {
    id: 'industry',
    label: 'What type of business are you running?',
    emotion: 'This helps us tailor every recommendation to your situation.',
    options: [
      'B2B services (consulting, agency, professional services)',
      'B2C services (coaching, health, personal services)',
      'Trade / construction / installation',
      'Retail or e-commerce',
      'Other',
    ],
  },
  {
    id: 'monthlyLeads',
    label: 'How many new enquiries or leads do you receive per month?',
    emotion: 'Rough estimate is fine.',
    options: ['Fewer than 5', '5 to 20', '20 to 50', 'More than 50'],
  },
  {
    id: 'avgDealValue',
    label: 'What is your typical deal or project value?',
    emotion: 'Average across your clients.',
    options: ['Under €1,000', '€1,000 to €5,000', '€5,000 to €20,000', 'Over €20,000'],
  },
  {
    id: 'teamSize',
    label: 'How many people work in your business (including you)?',
    emotion: 'Full-time equivalents.',
    options: ['Just me', '2 to 5', '6 to 15', 'More than 15'],
  },
]

const questionsEn: Question[] = [
  {
    lever: 'time', theme: 'Your time', meta: 'Time and freedom',
    label: 'When did you last have a full day completely off, no messages, no checking in, no thinking about the business?',
    emotion: 'Not a holiday where you just quickly checked in. A real day.',
    options: [
      { main: 'Last week, I have proper boundaries.', feel: 'Time is protected, the business runs without me', score: 0 },
      { main: 'A few weeks ago, it happens sometimes.', feel: 'I can disconnect, but not reliably', score: 1 },
      { main: 'I honestly cannot remember the last time.', feel: 'The business follows me everywhere', score: 2 },
      { main: 'That is not really possible for me right now.', feel: 'If I stop, everything stops', score: 3 },
    ],
  },
  {
    lever: 'leadership', theme: 'Your role', meta: 'Leadership and team',
    label: 'When something goes wrong in the business, what usually happens?',
    emotion: 'Think about the last real problem. How did it get resolved?',
    options: [
      { main: 'My team handles it. I hear about it after.', feel: 'Systems and people work without me', score: 0 },
      { main: 'Someone flags it and waits for my call.', feel: 'Decisions still run through me', score: 1 },
      { main: 'Usually I am the one who spots it first.', feel: 'Still in the weeds more than I should be', score: 2 },
      { main: 'Nothing moves unless I am directly involved.', feel: 'I am the bottleneck for everything', score: 3 },
    ],
  },
  {
    lever: 'speed_to_lead', theme: 'Your leads', meta: 'Speed-to-lead',
    label: 'When a new enquiry comes in, a form, a DM, a call, how quickly does your business respond?',
    emotion: 'On a Saturday afternoon. Or a Tuesday evening when your team has gone home.',
    options: [
      { main: 'Within 5 minutes, automatically.', feel: 'A system handles first contact every time', score: 0 },
      { main: 'Within the hour, usually.', feel: 'Someone picks it up when they see it', score: 1 },
      { main: 'Same day, when there is time.', feel: 'Inconsistent, depends who is around', score: 2 },
      { main: 'Next day or later, it varies.', feel: 'Leads regularly go cold before we reach them', score: 3 },
    ],
  },
  {
    lever: 'pipeline', theme: 'Your pipeline', meta: 'Follow-up and nurture',
    label: 'What happens to a lead who shows interest but does not buy immediately?',
    emotion: "Think about the last 10 people who said \"I'll think about it.\"",
    options: [
      { main: 'They enter an automated follow-up sequence.', feel: 'No lead falls through the cracks', score: 0 },
      { main: 'I or my team follows up manually a few times.', feel: 'Inconsistent but we try', score: 1 },
      { main: 'We follow up once, then leave it to them.', feel: 'Most warm leads go cold', score: 2 },
      { main: 'Honestly, most of them just disappear.', feel: 'We have no real follow-up process', score: 3 },
    ],
  },
  {
    lever: 'marketing', theme: 'Your visibility', meta: 'Online presence',
    label: 'If you stopped all active outreach tomorrow, no referral chasing, no DMs, no networking, what would happen?',
    emotion: 'Honest answer.',
    options: [
      { main: 'Pipeline keeps running. Inbound handles it.', feel: 'Strong online presence working on its own', score: 0 },
      { main: 'It would slow, but not stop.', feel: 'Some inbound, but I still push it along', score: 1 },
      { main: 'It would dry up within a couple of weeks.', feel: 'Almost entirely dependent on my direct effort', score: 2 },
      { main: 'It would stop immediately.', feel: 'I am the marketing. There is no system.', score: 3 },
    ],
  },
  {
    lever: 'sales', theme: 'Your conversions', meta: 'Sales close rate',
    label: 'When you get into a real conversation with a potential client who seems like a good fit, what usually happens?',
    emotion: 'Think about your last 10 conversations.',
    options: [
      { main: 'Most of them buy. The process works.', feel: '60%+ conversion, clear and consistent', score: 0 },
      { main: 'About half close. Depends on the day.', feel: '40-60%, good but not reliable', score: 1 },
      { main: 'Maybe 1 in 4. Lots of "let me think about it."', feel: '20-30%, the gap between interest and commitment', score: 2 },
      { main: 'Rarely. Great conversations, few decisions.', feel: 'Under 20%, something is breaking down', score: 3 },
    ],
  },
  {
    lever: 'retention', theme: 'Your clients', meta: 'Client retention and referrals',
    label: 'What happens after a client finishes working with you?',
    emotion: 'Think about how many past clients have come back or referred someone.',
    options: [
      { main: 'Most come back and send referrals regularly.', feel: 'Clients become long-term advocates', score: 0 },
      { main: 'Some come back, some refer. Not systematic.', feel: 'Good relationships, no deliberate process', score: 1 },
      { main: 'We finish the project and that is mostly it.', feel: 'No follow-up, referrals happen by chance', score: 2 },
      { main: 'We rarely hear from clients after delivery.', feel: 'No retention or referral system at all', score: 3 },
    ],
  },
]

const leverConfigEn: Record<string, { label: string; color: string }> = {
  time:          { label: 'Owner time',         color: '#c96442' },
  leadership:    { label: 'Leadership',          color: '#8b4513' },
  speed_to_lead: { label: 'Speed-to-lead',       color: '#c0392b' },
  pipeline:      { label: 'Pipeline & nurture',  color: '#7d3c98' },
  marketing:     { label: 'Online presence',     color: '#2980b9' },
  sales:         { label: 'Sales close rate',    color: '#16a085' },
  retention:     { label: 'Client retention',    color: '#27ae60' },
}

const leverDetailEn: Record<string, { title: string; emotion: string; desc: string; action: string }> = {
  time: {
    title: 'Buy back your time',
    emotion: '"I did not start this business to work more than I did in a job."',
    desc: 'Every task that only you can do is a ceiling on your growth. The goal is a business that operates without your constant presence.',
    action: 'List every task you did last week. Mark the ones only you can genuinely do. Everything else gets automated or delegated this month.',
  },
  leadership: {
    title: 'Stop being the bottleneck',
    emotion: '"My team is great, but everything still comes back to me."',
    desc: 'The business can only grow as fast as your attention allows. Build clear decision frameworks so your team can act without waiting for you.',
    action: 'Identify 3 recurring decisions your team escalates to you. Write the criteria for each. Hand them over this week.',
  },
  speed_to_lead: {
    title: 'Never let a lead go cold again',
    emotion: '"We paid to get that lead. Someone replied six hours later."',
    desc: 'Research shows responding in under 5 minutes makes you 100x more likely to connect with a lead vs 30 minutes. Slow response is your most expensive hidden cost.',
    action: 'Set up an automated first-response that fires in under 60 seconds, including weekends and after hours.',
  },
  pipeline: {
    title: 'Build a follow-up system that never forgets',
    emotion: '"They were interested. Then they just went quiet."',
    desc: '80% of sales require 5+ follow-ups. Most businesses stop at one. The money is not in the first contact. It is in the sequence.',
    action: 'Map your last 10 lost deals. How many follow-ups happened? Build a 5-touch sequence for every warm lead this week.',
  },
  marketing: {
    title: 'Build something that works while you sleep',
    emotion: '"When I stop pushing, the pipeline dries up."',
    desc: 'Referrals are a starting point, not a strategy. A business dependent on your personal effort is fragile. The right system works while you are with your family.',
    action: 'Identify your one highest-converting channel. Spend 2 focused hours improving it this week, then systematise it.',
  },
  sales: {
    title: 'Close more of the right conversations',
    emotion: '"Great meeting. They seemed so interested. Then nothing."',
    desc: 'Most close rate problems are not a persuasion issue. They are a qualification and framing issue. The right leads, with the right expectations, close themselves.',
    action: 'Review your last 5 lost deals. Find the moment the conversation shifted. That single insight is your fix.',
  },
  retention: {
    title: 'Turn every client into a growth engine',
    emotion: '"I keep finding new clients instead of growing the ones I have."',
    desc: 'Acquiring a new client costs 5 to 7x more than retaining one. Your existing clients are your cheapest source of new revenue, and most businesses ignore them after delivery.',
    action: 'List every client from the last 12 months. Email the top 5 with a simple check-in this week.',
  },
}

// ── NL DATA ────────────────────────────────────────────────────────────

const contextQuestionsNl = [
  {
    id: 'industry',
    label: 'Wat voor type bedrijf run jij?',
    emotion: 'Dit helpt ons elke aanbeveling af te stemmen op jouw situatie.',
    options: [
      'B2B diensten (consulting, agency, professionele diensten)',
      'B2C diensten (coaching, gezondheid, persoonlijke diensten)',
      'Bouw / installatie / ambachten',
      'Retail of e-commerce',
      'Ander',
    ],
  },
  {
    id: 'monthlyLeads',
    label: 'Hoeveel nieuwe aanvragen of leads ontvang je per maand?',
    emotion: 'Een ruwe schatting is prima.',
    options: ['Minder dan 5', '5 tot 20', '20 tot 50', 'Meer dan 50'],
  },
  {
    id: 'avgDealValue',
    label: 'Wat is de gemiddelde waarde van een opdracht of project?',
    emotion: 'Gemiddeld over je klanten.',
    options: ['Onder €1.000', '€1.000 tot €5.000', '€5.000 tot €20.000', 'Boven €20.000'],
  },
  {
    id: 'teamSize',
    label: 'Hoeveel mensen werken er in jouw bedrijf (inclusief jijzelf)?',
    emotion: 'Voltijdsequivalenten.',
    options: ['Alleen ik', '2 tot 5', '6 tot 15', 'Meer dan 15'],
  },
]

const questionsNl: Question[] = [
  {
    lever: 'time', theme: 'Jouw tijd', meta: 'Tijd en vrijheid',
    label: 'Wanneer had je voor het laatst een volledige vrije dag, geen berichten, niet inchecken, niet denken aan het bedrijf?',
    emotion: 'Niet een vakantie waarbij je even snel checkte. Een echte dag.',
    options: [
      { main: 'Vorige week, ik heb goede grenzen.', feel: 'Mijn tijd is beschermd, het bedrijf draait zonder mij', score: 0 },
      { main: 'Een paar weken geleden, het lukt soms.', feel: 'Ik kan loskoppelen, maar niet consequent', score: 1 },
      { main: 'Ik kan me eerlijk gezegd niet herinneren wanneer.', feel: 'Het bedrijf volgt me overal naartoe', score: 2 },
      { main: 'Dat is momenteel niet echt mogelijk voor mij.', feel: 'Als ik stop, stopt alles', score: 3 },
    ],
  },
  {
    lever: 'leadership', theme: 'Jouw rol', meta: 'Leiderschap en team',
    label: 'Als er iets misgaat in het bedrijf, wat gebeurt er dan normaal?',
    emotion: 'Denk aan het laatste echte probleem. Hoe werd het opgelost?',
    options: [
      { main: 'Mijn team lost het op. Ik hoor het achteraf.', feel: 'Systemen en mensen werken zonder mij', score: 0 },
      { main: 'Iemand geeft het door en wacht op mijn reactie.', feel: 'Beslissingen lopen nog steeds via mij', score: 1 },
      { main: 'Meestal ben ik degene die het als eerste opmerkt.', feel: 'Nog te veel in de details', score: 2 },
      { main: 'Niets beweegt tenzij ik er direct bij betrokken ben.', feel: 'Ik ben de bottleneck voor alles', score: 3 },
    ],
  },
  {
    lever: 'speed_to_lead', theme: 'Jouw leads', meta: 'Snelheid van opvolging',
    label: 'Als er een nieuwe aanvraag binnenkomt, een formulier, een DM, een telefoontje, hoe snel reageert jouw bedrijf?',
    emotion: 'Op een zaterdagmiddag. Of een dinsdagavond als je team naar huis is.',
    options: [
      { main: 'Binnen 5 minuten, automatisch.', feel: 'Een systeem handelt het eerste contact altijd af', score: 0 },
      { main: 'Binnen het uur, meestal.', feel: 'Iemand pakt het op wanneer ze het zien', score: 1 },
      { main: 'Dezelfde dag, als er tijd voor is.', feel: 'Inconsistent, afhankelijk van wie er is', score: 2 },
      { main: 'De volgende dag of later, het varieert.', feel: 'Leads gaan regelmatig koud voor we ze bereiken', score: 3 },
    ],
  },
  {
    lever: 'pipeline', theme: 'Jouw pipeline', meta: 'Opvolging en nurture',
    label: 'Wat gebeurt er met een lead die interesse toont maar niet meteen koopt?',
    emotion: "Denk aan de laatste 10 mensen die zeiden 'ik denk er over na'.",
    options: [
      { main: 'Ze komen in een geautomatiseerde opvolgingssequentie.', feel: 'Geen lead valt door de mazen', score: 0 },
      { main: 'Ik of mijn team volgt manueel een paar keer op.', feel: 'Inconsistent maar we proberen het', score: 1 },
      { main: 'We volgen eenmaal op en laten het dan aan hen.', feel: 'De meeste warme leads gaan koud', score: 2 },
      { main: 'Eerlijk gezegd verdwijnen de meesten gewoon.', feel: 'We hebben geen echt opvolgingsproces', score: 3 },
    ],
  },
  {
    lever: 'marketing', theme: 'Jouw zichtbaarheid', meta: 'Online aanwezigheid',
    label: 'Als je morgen alle actieve outreach stopzet, geen referrals najagen, geen DMs, geen netwerken, wat zou er gebeuren?',
    emotion: 'Eerlijk antwoord.',
    options: [
      { main: 'Pipeline blijft draaien. Inbound regelt het.', feel: 'Sterke online aanwezigheid die op eigen kracht werkt', score: 0 },
      { main: 'Het zou vertragen, maar niet stoppen.', feel: 'Wat inbound, maar ik duw het nog mee', score: 1 },
      { main: 'Het zou opdrogen binnen een paar weken.', feel: 'Bijna volledig afhankelijk van mijn directe inspanning', score: 2 },
      { main: 'Het zou meteen stoppen.', feel: 'Ik BEN de marketing. Er is geen systeem.', score: 3 },
    ],
  },
  {
    lever: 'sales', theme: 'Jouw conversies', meta: 'Sluitingspercentage',
    label: 'Als je in een echt gesprek komt met een potentieel klant die goed lijkt te passen, wat gebeurt er dan meestal?',
    emotion: 'Denk aan je laatste 10 gesprekken.',
    options: [
      { main: 'De meesten kopen. Het proces werkt.', feel: '60%+ conversie, duidelijk en consistent', score: 0 },
      { main: 'Ongeveer de helft sluit. Hangt af van de dag.', feel: '40-60%, goed maar niet betrouwbaar', score: 1 },
      { main: 'Misschien 1 op 4. Veel "ik denk er over na".', feel: '20-30%, de kloof tussen interesse en beslissing', score: 2 },
      { main: 'Zelden. Geweldige gesprekken, weinig beslissingen.', feel: 'Onder 20%, iets gaat mis', score: 3 },
    ],
  },
  {
    lever: 'retention', theme: 'Jouw klanten', meta: 'Klantbehoud en doorverwijzingen',
    label: 'Wat gebeurt er nadat een klant klaar is met werken met jou?',
    emotion: 'Denk na hoeveel klanten zijn teruggekomen of iemand hebben doorverwezen.',
    options: [
      { main: 'De meesten komen terug en sturen regelmatig doorverwijzingen.', feel: 'Klanten worden langetermijn ambassadeurs', score: 0 },
      { main: 'Sommigen komen terug, sommigen verwijzen door. Niet systematisch.', feel: 'Goede relaties, geen bewust proces', score: 1 },
      { main: 'We ronden het project af en dat is het grotendeels.', feel: 'Geen opvolging, doorverwijzingen gebeuren toevallig', score: 2 },
      { main: 'We horen zelden van klanten na de levering.', feel: 'Geen klantbehoud of doorverwijzingssysteem', score: 3 },
    ],
  },
]

const leverConfigNl: Record<string, { label: string; color: string }> = {
  time:          { label: 'Tijd eigenaar',          color: '#c96442' },
  leadership:    { label: 'Leiderschap',             color: '#8b4513' },
  speed_to_lead: { label: 'Snelheid opvolging',      color: '#c0392b' },
  pipeline:      { label: 'Pipeline & nurture',      color: '#7d3c98' },
  marketing:     { label: 'Online aanwezigheid',     color: '#2980b9' },
  sales:         { label: 'Sluitingspercentage',     color: '#16a085' },
  retention:     { label: 'Klantbehoud',             color: '#27ae60' },
}

const leverDetailNl: Record<string, { title: string; emotion: string; desc: string; action: string }> = {
  time: {
    title: 'Koop jouw tijd terug',
    emotion: '"Ik ben niet voor mezelf begonnen om meer te werken dan in loondienst."',
    desc: 'Elke taak die alleen jij kunt doen is een plafond op jouw groei. Het doel is een bedrijf dat draait zonder jouw constante aanwezigheid.',
    action: 'Maak een lijst van elke taak die je vorige week deed. Markeer de taken die alleen jij echt kunt doen. Alles andere wordt deze maand geautomatiseerd of gedelegeerd.',
  },
  leadership: {
    title: 'Stop de bottleneck te zijn',
    emotion: '"Mijn team is geweldig, maar alles komt toch nog bij mij terecht."',
    desc: 'Het bedrijf kan alleen zo snel groeien als jouw aandacht toelaat. Bouw duidelijke beslissingskaders zodat jouw team kan handelen zonder op jou te wachten.',
    action: 'Identificeer 3 terugkerende beslissingen die je team aan jou escaleert. Schrijf de criteria op voor elk. Geef ze door deze week.',
  },
  speed_to_lead: {
    title: 'Laat nooit meer een lead afkoelen',
    emotion: '"We betaalden voor die lead. Iemand antwoordde zes uur later."',
    desc: 'Onderzoek toont aan dat reageren binnen 5 minuten je 100x meer kans geeft om contact te maken met een lead dan na 30 minuten. Trage opvolging is jouw duurste verborgen kost.',
    action: 'Zet een geautomatiseerde eerste reactie op die binnen 60 seconden verstuurd wordt, inclusief weekends en na kantooruren.',
  },
  pipeline: {
    title: 'Bouw een opvolgingssysteem dat nooit vergeet',
    emotion: '"Ze waren geinteresseerd. Toen werden ze gewoon stil."',
    desc: '80% van de verkopen vereist 5 of meer opvolgingen. De meeste bedrijven stoppen bij een. Het geld zit niet in het eerste contact. Het zit in de sequentie.',
    action: 'Bekijk je laatste 10 verloren deals. Hoeveel opvolgingen waren er? Bouw deze week een 5-stap sequentie voor elke warme lead.',
  },
  marketing: {
    title: 'Bouw iets dat werkt terwijl jij slaapt',
    emotion: '"Als ik stop met duwen, droogt de pipeline op."',
    desc: 'Doorverwijzingen zijn een startpunt, geen strategie. Een bedrijf dat afhankelijk is van jouw persoonlijke inspanning is kwetsbaar. Het juiste systeem werkt terwijl jij bij je gezin bent.',
    action: 'Identificeer jouw best converterende kanaal. Besteed er deze week 2 gefocuste uren aan en systematiseer het daarna.',
  },
  sales: {
    title: 'Sluit meer van de juiste gesprekken',
    emotion: '"Geweldige meeting. Ze leken zo geinteresseerd. Daarna niets."',
    desc: 'De meeste problemen met sluitingspercentages zijn geen overtuigingsprobleem. Het is een kwalificatie- en framing-probleem. De juiste leads, met de juiste verwachtingen, verkopen zichzelf.',
    action: 'Bekijk je laatste 5 verloren deals. Vind het moment waarop het gesprek kantelde. Dat ene inzicht is jouw oplossing.',
  },
  retention: {
    title: 'Maak van elke klant een groeimotor',
    emotion: '"Ik blijf nieuwe klanten zoeken in plaats van de bestaande te laten groeien."',
    desc: 'Een nieuwe klant werven kost 5 tot 7 keer meer dan een bestaande houden. Je huidige klanten zijn je goedkoopste bron van nieuwe omzet, en de meeste bedrijven negeren hen na de levering.',
    action: 'Maak een lijst van alle klanten van de afgelopen 12 maanden. Stuur de top 5 deze week een kort check-in berichtje.',
  },
}

// ── CSS ────────────────────────────────────────────────────────────────

const css = `
  :root {
    --cream: #faf7f2; --warm-white: #fff9f4; --sand: #f0e9de; --sand-mid: #e2d5c3;
    --ink: #1c1a18; --ink-mid: #4a4540; --ink-muted: #9a9088; --ink-faint: #c8bfb4;
    --rust: #c96442; --rust-light: #fdf1eb; --rust-border: rgba(201,100,66,0.2);
    --green: #2d6a4f; --green-light: #eaf4ee;
    --border: rgba(28,26,24,0.08); --border-mid: rgba(28,26,24,0.14);
    --font-display: 'Georgia', serif; --font-body: system-ui, sans-serif;
    --shadow-card: 0 1px 3px rgba(28,26,24,0.06);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .diag-page { font-family: var(--font-body); background: var(--sand); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
  .wrap { background: var(--warm-white); border-radius: 20px; max-width: 520px; width: 100%; overflow: hidden; box-shadow: 0 8px 48px rgba(28,26,24,0.12); }
  .top-stripe { height: 4px; background: linear-gradient(90deg,#c96442,#e0845a,#c96442); }
  .inner { padding: 2.2rem 2rem 2.6rem; }
  .eyebrow { font-size:10px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--rust); margin-bottom:10px; }
  .headline { font-family:var(--font-display); font-size:26px; font-weight:700; color:var(--ink); line-height:1.2; margin-bottom:10px; }
  .headline em { font-style:italic; color:var(--rust); }
  .subline { font-size:14px; color:var(--ink-muted); line-height:1.7; margin-bottom:1.8rem; }
  .moments { display:flex; flex-direction:column; gap:6px; margin-bottom:1.6rem; }
  .moment { display:flex; align-items:flex-start; gap:10px; padding:11px 14px; background:var(--cream); border-radius:8px; border-left:2px solid var(--sand-mid); }
  .moment-text { font-size:13px; color:var(--ink-mid); line-height:1.55; }
  .moment-text strong { font-weight:600; color:var(--ink); display:block; margin-bottom:2px; }
  .btn-primary { width:100%; padding:14px 24px; background:var(--rust); color:white; border:none; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; transition:all .15s; box-shadow:0 2px 8px rgba(201,100,66,.25); }
  .btn-primary:hover { background:#b8572a; transform:translateY(-1px); }
  .btn-primary:disabled { opacity:.4; cursor:not-allowed; transform:none; }
  .btn-ghost { padding:14px 18px; background:transparent; color:var(--ink-muted); border:1.5px solid var(--border-mid); border-radius:10px; font-size:13px; cursor:pointer; transition:all .15s; }
  .btn-ghost:hover { border-color:var(--ink-muted); color:var(--ink-mid); }
  .btn-row { display:flex; gap:8px; }
  .btn-row .btn-primary { flex:1; width:auto; }
  .progress-wrap { margin-bottom:2rem; }
  .progress-meta { display:flex; justify-content:space-between; margin-bottom:8px; }
  .prog-label { font-size:11px; font-weight:500; color:var(--ink-muted); letter-spacing:.06em; }
  .progress-track { height:3px; background:var(--sand); border-radius:2px; overflow:hidden; }
  .progress-fill { height:100%; background:var(--rust); border-radius:2px; transition:width .5s ease; }
  .q-meta { font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--ink-faint); margin-bottom:10px; }
  .q-label { font-family:var(--font-display); font-size:19px; font-weight:700; color:var(--ink); line-height:1.35; margin-bottom:6px; }
  .q-emotion { font-size:14px; font-style:italic; color:var(--ink-muted); line-height:1.55; margin-bottom:1.4rem; }
  .options { display:flex; flex-direction:column; gap:7px; margin-bottom:1.6rem; }
  .opt { background:var(--cream); border:1.5px solid transparent; border-radius:10px; padding:13px 16px; cursor:pointer; transition:all .15s; text-align:left; display:flex; gap:12px; align-items:flex-start; box-shadow:var(--shadow-card); width:100%; }
  .opt:hover { border-color:var(--sand-mid); background:var(--warm-white); transform:translateY(-1px); }
  .opt.selected { border-color:var(--rust); background:var(--rust-light); transform:translateY(-1px); }
  .opt-marker { width:20px; height:20px; border-radius:50%; border:1.5px solid var(--sand-mid); flex-shrink:0; margin-top:2px; transition:all .15s; display:flex; align-items:center; justify-content:center; }
  .opt.selected .opt-marker { background:var(--rust); border-color:var(--rust); }
  .opt-dot { width:6px; height:6px; background:white; border-radius:50%; }
  .opt-main { font-size:13px; font-weight:500; color:var(--ink); line-height:1.35; margin-bottom:2px; }
  .opt-feel { font-size:12px; color:var(--ink-muted); font-style:italic; line-height:1.4; }
  .result-hero { background:var(--ink); border-radius:12px; padding:1.6rem; margin-bottom:1.4rem; }
  .rh-eyebrow { font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,.35); margin-bottom:10px; }
  .rh-score { font-family:var(--font-display); font-size:52px; font-weight:700; color:white; line-height:1; margin-bottom:6px; }
  .rh-score span { font-size:20px; color:rgba(255,255,255,.35); margin-left:4px; }
  .rh-verdict { font-family:var(--font-display); font-size:16px; font-style:italic; color:#e8a87c; margin-bottom:8px; line-height:1.3; }
  .rh-sub { font-size:13px; color:rgba(255,255,255,.5); line-height:1.65; }
  .section-label { font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--ink-faint); margin-bottom:12px; }
  .levers-section { margin-bottom:1.6rem; }
  .lever-row { display:flex; align-items:center; gap:10px; margin-bottom:11px; }
  .lever-rank { font-size:11px; font-weight:600; color:var(--ink-faint); width:16px; text-align:center; flex-shrink:0; }
  .lever-rank.top { color:var(--rust); }
  .lever-name { font-size:12px; font-weight:500; color:var(--ink-mid); width:140px; flex-shrink:0; }
  .lever-track { flex:1; height:5px; background:var(--sand); border-radius:3px; overflow:hidden; }
  .lever-fill { height:100%; border-radius:3px; transition:width 1s ease; }
  .lever-pct { font-size:11px; color:var(--ink-muted); width:32px; text-align:right; font-weight:500; }
  .priority-card { background:var(--cream); border:1px solid var(--border); border-radius:12px; padding:16px 18px; margin-bottom:8px; box-shadow:var(--shadow-card); }
  .priority-card.top-pick { background:var(--warm-white); border-color:var(--rust-border); border-left:3px solid var(--rust); }
  .pc-row { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:5px; }
  .pc-rank { font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-faint); }
  .priority-card.top-pick .pc-rank { color:var(--rust); }
  .pc-badge { font-size:9px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; background:var(--rust-light); color:var(--rust); padding:3px 8px; border-radius:20px; border:1px solid var(--rust-border); }
  .pc-title { font-family:var(--font-display); font-size:15px; font-weight:700; color:var(--ink); margin-bottom:5px; line-height:1.3; }
  .pc-emotion { font-size:13px; font-style:italic; color:var(--ink-muted); margin-bottom:8px; line-height:1.5; }
  .pc-desc { font-size:13px; color:var(--ink-mid); line-height:1.6; margin-bottom:10px; }
  .pc-action { font-size:12px; font-weight:600; color:var(--rust); display:flex; align-items:center; gap:6px; }
  .cta-box { background:var(--sand); border-radius:12px; padding:1.4rem 1.6rem; border:1px solid var(--sand-mid); margin-top:1.4rem; }
  .cta-title { font-family:var(--font-display); font-size:18px; font-weight:700; color:var(--ink); margin-bottom:5px; }
  .cta-sub { font-size:13px; color:var(--ink-muted); line-height:1.6; margin-bottom:14px; }
  .field-label { font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-muted); margin-bottom:6px; display:block; }
  .text-input { width:100%; padding:12px 14px; background:var(--warm-white); border:1.5px solid var(--border-mid); border-radius:10px; font-size:13px; color:var(--ink); outline:none; transition:border-color .15s; margin-bottom:10px; }
  .text-input:focus { border-color:var(--rust); }
  .text-input::placeholder { color:var(--ink-faint); }
  .thanks-wrap { text-align:center; padding:1rem 0 .5rem; }
  .thanks-circle { width:60px; height:60px; border-radius:50%; background:var(--green-light); border:1px solid rgba(45,106,79,.2); display:flex; align-items:center; justify-content:center; margin:0 auto 1.2rem; font-size:24px; }
  .what-in { background:var(--cream); border-radius:10px; padding:1.2rem 1.4rem; margin-top:1.4rem; text-align:left; }
  .what-in-title { font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--rust); margin-bottom:10px; }
  .what-item { font-size:13px; color:var(--ink-mid); line-height:1.9; display:flex; gap:8px; }
  .what-item::before { content:'·'; color:var(--ink-faint); flex-shrink:0; }
  .italic-note { font-family:var(--font-display); font-size:13px; font-style:italic; color:var(--ink-muted); margin-bottom:1.6rem; line-height:1.6; }
`

// ── COMPONENT ─────────────────────────────────────────────────────────

export default function DiagnosticPage() {
  const { lang } = useLang()
  const nl = lang === 'nl'

  const contextQuestions = nl ? contextQuestionsNl : contextQuestionsEn
  const questions        = nl ? questionsNl        : questionsEn
  const leverConfig      = nl ? leverConfigNl      : leverConfigEn
  const leverDetail      = nl ? leverDetailNl      : leverDetailEn

  const [step, setStep]           = useState<Step>('intro')
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])
  const [ctxIndex, setCtxIndex]   = useState(0)
  const [ctxAnswers, setCtxAnswers] = useState<ContextAnswers>({ industry: '', monthlyLeads: '', avgDealValue: '', teamSize: '' })
  const [currentQ, setCurrentQ]   = useState(0)
  const [answers, setAnswers]     = useState<Record<string, number>>({})
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [website, setWebsite]     = useState('')
  const [noWebsite, setNoWebsite] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [animScore, setAnimScore] = useState(0)

  const scored = useMemo(() =>
    questions.map(q => ({ key: q.lever, score: answers[q.lever] ?? 0 })).sort((a, b) => b.score - a.score),
    [answers, questions]
  )

  const overallScore = useMemo(() => {
    const total = Object.values(answers).reduce((s, v) => s + v, 0)
    return Math.round((total / (questions.length * 3)) * 100)
  }, [answers, questions])

  const getVerdict = (score: number): [string, string] => {
    if (nl) {
      if (score < 25) return ['Je hebt iets gebouwd dat voor jou werkt.', 'De basis is solide. De winst zit nu in het beschermen van jouw tijd en zorgen dat het zo blijft naarmate je groeit.']
      if (score < 50) return ['Goed momentum, maar iets werkt tegen je.', 'Echte sterktes hier, en een paar plaatsen waar het bedrijf je meer kost dan het zou mogen. Los de top hefboom op en de anderen volgen vaak vanzelf.']
      if (score < 75) return ['Het bedrijf leidt jou meer dan jij het leidt.', 'Meerdere gebieden tappen jouw tijd en energie weg. Je hoeft niet alles tegelijk op te lossen. Fix ze in de juiste volgorde en de rest volgt.']
      return ['Je draagt te veel. Dit is niet houdbaar.', 'Hoge scores overal betekenen meestal een ding: het bedrijf is gebouwd rond jou, niet voor jou. Een gefocust kwartaal, de juiste dingen in volgorde aanpakken, verandert alles.']
    }
    if (score < 25) return ['You have built something that works for you.', 'The foundation is solid. The gains from here are about protecting your time and making sure it stays this way as you grow.']
    if (score < 50) return ['Good momentum, but something is pulling against you.', 'Real strengths here, and one or two places where the business is costing you more than it should. Fix the top lever and the others often follow.']
    if (score < 75) return ['The business is running you more than you are running it.', 'Multiple areas are draining your time and revenue. You do not need to fix everything. Fix them in the right order and the others sort themselves out.']
    return ['You are carrying too much. This is not sustainable.', 'High scores across the board usually mean one thing: the business was built around you, not for you. One focused quarter, fixing the right things in sequence, changes everything.']
  }

  const startResults = () => {
    setStep('results')
    let n = 0
    const target = overallScore
    const timer = setInterval(() => {
      n = Math.min(n + 2, target)
      setAnimScore(n)
      if (n >= target) clearInterval(timer)
    }, 20)
  }

  const handleSubmit = async () => {
    if (!email.includes('@') || !name.trim()) return
    setSubmitting(true)
    try {
      await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, website: noWebsite ? 'geen website' : website, context: ctxAnswers, answers, score: overallScore, topLevers: scored.map(s => s.key) }),
      })
    } catch { /* fire and forget */ }
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead')
    }
    setStep('thanks')
    setSubmitting(false)
  }

  const ctxSelected = ctxAnswers[contextQuestions[ctxIndex].id as keyof ContextAnswers]
  const [verdict, sub] = getVerdict(overallScore)

  const T = {
    eyebrow:        nl ? 'Voor ondernemers'                        : 'For business owners',
    headline:       nl ? <>Je bouwde dit bedrijf.<br />Werkt het ook <em>voor jou?</em></> : <>You built this business.<br />Is it <em>working for you?</em></>,
    subline:        nl ? '7 eerlijke vragen. Je krijgt een helder beeld van welke ene verandering, in leiderschap, systemen, verkoop of tijd, het meeste oplevert.' : '7 honest questions. You get a clear picture of which one change, in leadership, systems, sales or time, would give you the most back.',
    moments:        nl
      ? [['Omzet stijgt, maar alles stijgt mee', 'Meer klanten, meer problemen, meer van jouw tijd. Groei voelt alsof het meer kost dan het opbrengt.'], ['Je hebt een team, maar doet nog alles zelf', 'Het zijn goede mensen. Maar elke echte beslissing belandt nog steeds op jouw bureau.'], ['Er komen leads binnen, maar niet allemaal converteren', 'Sommigen gaan koud voor iemand opvolgde. Anderen werden nooit een tweede keer benaderd.'], ['Er is meer omzet die onbenut blijft', 'Vroegere klanten die niet zijn teruggekomen. Doorverwijzingen die nooit zijn gevraagd.']]
      : [['Revenue is up, but so is everything else', 'More clients, more problems, more of your time. Growth feels like it costs more than it gives back.'], ['You have a team, but you are still doing everything', 'They are good people. But every real decision still lands on your desk.'], ['Leads are coming in, but not all of them convert', 'Some go cold before anyone followed up. Others were never chased a second time.'], ['There is more revenue sitting there, untouched', 'Past clients who never came back. Referrals that were never asked for.']],
    italicNote:     nl ? 'Deze diagnose vindt welke hefboom je als eerste moet aanpakken, zodat je omzet kunt laten groeien, beter kunt leiden en een bedrijf kunt bouwen dat jou jouw leven teruggeeft.' : 'This diagnostic finds which lever to pull first, so you can grow revenue, lead better and build a business that gives you your life back.',
    startBtn:       nl ? 'Laat me zien wat mijn bedrijf tegenhoudt' : 'Show me what is holding my business back',
    aboutBusiness:  nl ? 'Over je bedrijf'   : 'About your business',
    ctxProgress:    (i: number, t: number) => nl ? `Context ${i} van ${t}` : `Context ${i} of ${t}`,
    qProgress:      (i: number, t: number) => nl ? `Vraag ${i} van ${t}` : `Question ${i} of ${t}`,
    back:           nl ? 'Terug'             : 'Back',
    continue:       nl ? 'Verder'            : 'Continue',
    seeResults:     nl ? 'Bekijk mijn resultaten' : 'See my results',
    scoreLabel:     nl ? 'Jouw bedrijfsimpact score' : 'Your business impact score',
    energyLost:     nl ? 'Waar jouw energie verloren gaat, gerangschikt' : 'Where your energy is being lost, ranked',
    topPriorities:  nl ? 'Jouw top prioriteiten' : 'Your top priorities',
    priority:       nl ? 'Prioriteit'        : 'Priority',
    biggestImpact:  nl ? 'Grootste impact'   : 'Biggest impact',
    ctaTitle:       nl ? 'Ontvang jouw persoonlijk 30-dagenplan' : 'Get your personalised 30-day action plan',
    ctaSub:         nl ? 'Een volledig overzicht van jouw top 3 hiaten, exacte volgende stappen, wat elk je kost, en een persoonlijk plan om het op te lossen.' : 'A full breakdown of your top 3 gaps, exact next steps, what each is costing you, and a personalised plan to fix it.',
    getFreeReport:  nl ? 'Ontvang mijn gratis rapport' : 'Get my free report',
    almostThere:    nl ? 'Bijna klaar'       : 'Almost there',
    whereToSend:    nl ? 'Waar sturen we het naartoe?' : 'Where should we send it?',
    sendSubline:    nl ? 'Jouw persoonlijk rapport is binnen minuten in jouw inbox. Check ook je spammap.' : 'Your personalised report will be in your inbox within minutes. Check spam if you do not see it.',
    yourName:       nl ? 'Jouw naam'         : 'Your name',
    firstName:      nl ? 'Voornaam'          : 'First name',
    emailAddress:   nl ? 'E-mailadres'       : 'Email address',
    sending:        nl ? 'Versturen...'      : 'Sending...',
    sendReport:     nl ? 'Stuur mijn rapport': 'Send my report',
    backToResults:  nl ? 'Terug naar resultaten' : 'Back to results',
    inboxHeading:   nl ? 'Het is onderweg naar jouw inbox' : 'It is heading to your inbox',
    thanksSubline:  nl ? 'Jouw persoonlijk strategieoverzicht is binnen minuten bij je. Check ook je spammap.' : 'Your personalised strategy breakdown will be with you within minutes. Check your spam folder too.',
    whatInTitle:    nl ? 'Wat zit er in jouw rapport' : 'What is in your report',
    whatItems:      nl
      ? ['Jouw #1 hefboom met een eerlijke diagnose van wat het je kost', 'Jouw top 3 oplossingen, specifiek voor jouw type en grootte bedrijf', 'Een 30-dagenplan met een actie per dag', 'Branchespecifieke scripts en templates die je direct kunt gebruiken']
      : ['Your #1 lever with an honest diagnosis of what it is costing you', 'Your top 3 fixes, specific to your business type and size', 'A 30-day implementation plan with one action per day', 'Industry-specific scripts and templates you can use immediately'],
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="diag-page">
        <div className="wrap">
          <div className="top-stripe" />
          <div className="inner">

            {step === 'intro' && (
              <div>
                <div className="eyebrow">{T.eyebrow}</div>
                <div className="headline">{T.headline}</div>
                <div className="subline">{T.subline}</div>
                <div className="moments">
                  {T.moments.map(([title, body]) => (
                    <div key={title as string} className="moment">
                      <div className="moment-text"><strong>{title}</strong>{body}</div>
                    </div>
                  ))}
                </div>
                <div className="italic-note">{T.italicNote}</div>
                <button className="btn-primary" onClick={() => setStep('context')}>{T.startBtn}</button>
              </div>
            )}

            {step === 'context' && (
              <div>
                <div className="progress-wrap">
                  <div className="progress-meta">
                    <span className="prog-label">{T.ctxProgress(ctxIndex + 1, contextQuestions.length)}</span>
                    <span className="prog-label">{T.aboutBusiness}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${((ctxIndex + 1) / (contextQuestions.length + questions.length)) * 100}%` }} />
                  </div>
                </div>
                <div className="q-meta">{T.aboutBusiness}</div>
                <div className="q-label">{contextQuestions[ctxIndex].label}</div>
                <div className="q-emotion">{contextQuestions[ctxIndex].emotion}</div>
                <div className="options">
                  {contextQuestions[ctxIndex].options.map(opt => (
                    <button key={opt} className={`opt ${ctxSelected === opt ? 'selected' : ''}`} onClick={() => setCtxAnswers(prev => ({ ...prev, [contextQuestions[ctxIndex].id]: opt }))}>
                      <div className="opt-marker">{ctxSelected === opt && <div className="opt-dot" />}</div>
                      <div><div className="opt-main">{opt}</div></div>
                    </button>
                  ))}
                </div>
                <div className="btn-row">
                  <button className="btn-ghost" onClick={() => ctxIndex === 0 ? setStep('intro') : setCtxIndex(i => i - 1)}>{T.back}</button>
                  <button className="btn-primary" disabled={!ctxSelected} onClick={() => {
                    if (ctxIndex < contextQuestions.length - 1) setCtxIndex(i => i + 1)
                    else { setStep('questions'); setCurrentQ(0) }
                  }}>{T.continue}</button>
                </div>
              </div>
            )}

            {step === 'questions' && (
              <div>
                <div className="progress-wrap">
                  <div className="progress-meta">
                    <span className="prog-label">{T.qProgress(currentQ + 1, questions.length)}</span>
                    <span className="prog-label">{questions[currentQ].theme}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${((contextQuestions.length + currentQ + 1) / (contextQuestions.length + questions.length)) * 100}%` }} />
                  </div>
                </div>
                <div className="q-meta">{questions[currentQ].meta}</div>
                <div className="q-label">{questions[currentQ].label}</div>
                <div className="q-emotion">{questions[currentQ].emotion}</div>
                <div className="options">
                  {questions[currentQ].options.map((opt, i) => (
                    <button key={i} className={`opt ${answers[questions[currentQ].lever] === i ? 'selected' : ''}`} onClick={() => setAnswers(prev => ({ ...prev, [questions[currentQ].lever]: i }))}>
                      <div className="opt-marker">{answers[questions[currentQ].lever] === i && <div className="opt-dot" />}</div>
                      <div>
                        <div className="opt-main">{opt.main}</div>
                        <div className="opt-feel">{opt.feel}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="btn-row">
                  <button className="btn-ghost" onClick={() => currentQ === 0 ? setStep('context') : setCurrentQ(q => q - 1)}>{T.back}</button>
                  <button className="btn-primary" disabled={answers[questions[currentQ].lever] === undefined}
                    onClick={() => currentQ < questions.length - 1 ? setCurrentQ(q => q + 1) : startResults()}>
                    {currentQ < questions.length - 1 ? T.continue : T.seeResults}
                  </button>
                </div>
              </div>
            )}

            {step === 'results' && (
              <div>
                <div className="result-hero">
                  <div className="rh-eyebrow">{T.scoreLabel}</div>
                  <div className="rh-score">{animScore} <span>/ 100</span></div>
                  <div className="rh-verdict">{verdict}</div>
                  <div className="rh-sub">{sub}</div>
                </div>
                <div className="levers-section">
                  <div className="section-label">{T.energyLost}</div>
                  {scored.map((l, i) => {
                    const cfg = leverConfig[l.key]
                    const pct = Math.round((l.score / 3) * 100)
                    return (
                      <div key={l.key} className="lever-row">
                        <div className={`lever-rank ${i === 0 ? 'top' : ''}`}>{i + 1}</div>
                        <div className="lever-name">{cfg.label}</div>
                        <div className="lever-track">
                          <div className="lever-fill" style={{ width: `${pct || 4}%`, background: cfg.color }} />
                        </div>
                        <div className="lever-pct">{pct}%</div>
                      </div>
                    )
                  })}
                </div>
                <div className="section-label">{T.topPriorities}</div>
                <div style={{ marginBottom: 8 }} />
                {scored.slice(0, 3).map((l, i) => {
                  const d = leverDetail[l.key]
                  return (
                    <div key={l.key} className={`priority-card ${i === 0 ? 'top-pick' : ''}`}>
                      <div className="pc-row">
                        <div className="pc-rank">{T.priority} {i + 1}</div>
                        {i === 0 && <div className="pc-badge">{T.biggestImpact}</div>}
                      </div>
                      <div className="pc-title">{d.title}</div>
                      <div className="pc-emotion">{d.emotion}</div>
                      <div className="pc-desc">{d.desc}</div>
                      <div className="pc-action">{d.action}</div>
                    </div>
                  )
                })}
                <div className="cta-box">
                  <div className="cta-title">{T.ctaTitle}</div>
                  <div className="cta-sub">{T.ctaSub}</div>
                  <button className="btn-primary" onClick={() => setStep('capture')}>{T.getFreeReport}</button>
                </div>
              </div>
            )}

            {step === 'capture' && (
              <div>
                <div className="eyebrow">{T.almostThere}</div>
                <div className="headline" style={{ fontSize: 22, marginBottom: 8 }}>{T.whereToSend}</div>
                <div className="subline">{T.sendSubline}</div>
                <label className="field-label">{T.yourName}</label>
                <input className="text-input" type="text" placeholder={T.firstName} value={name} onChange={e => setName(e.target.value)} />
                <label className="field-label">{T.emailAddress}</label>
                <input className="text-input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                <label className="field-label">{nl ? 'Website' : 'Website'} <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>({nl ? 'optioneel' : 'optional'})</span></label>
                <input
                  className="text-input"
                  type="text"
                  placeholder="https://jouwbedrijf.be"
                  value={noWebsite ? '' : website}
                  disabled={noWebsite}
                  onChange={e => setWebsite(e.target.value)}
                  style={{ opacity: noWebsite ? 0.4 : 1 }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: -4, marginBottom: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={noWebsite}
                    onChange={e => setNoWebsite(e.target.checked)}
                    style={{ accentColor: 'var(--rust)', width: 14, height: 14 }}
                  />
                  <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{nl ? 'Ik heb nog geen website' : "I don't have a website yet"}</span>
                </label>
                <button className="btn-primary" disabled={submitting || !email.includes('@') || !name.trim()} onClick={handleSubmit}>
                  {submitting ? T.sending : T.sendReport}
                </button>
                <div style={{ marginTop: 12 }}>
                  <button className="btn-ghost" style={{ width: '100%' }} onClick={() => setStep('results')}>{T.backToResults}</button>
                </div>
              </div>
            )}

            {step === 'thanks' && (
              <div className="thanks-wrap">
                <div className="thanks-circle">✓</div>
                <div className="headline" style={{ fontSize: 22, marginBottom: 8 }}>{T.inboxHeading}</div>
                <div className="subline" style={{ marginBottom: 0 }}>{T.thanksSubline}</div>
                <div className="what-in">
                  <div className="what-in-title">{T.whatInTitle}</div>
                  {T.whatItems.map(item => <div key={item as string} className="what-item">{item}</div>)}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* SEO content section */}
      <section style={{ background: '#faf9f5', padding: '3rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', color: '#3d3929' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 400, marginBottom: '1rem', color: '#2a2720' }}>
            {nl ? 'Wat meet de groeidiagnose?' : 'What does the business diagnostic measure?'}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#5c5849', marginBottom: '1.5rem' }}>
            {nl
              ? 'De diagnose brengt 7 groeihefbomen in kaart die bepalen of jouw bedrijf voor jou werkt of tegen jou: tijd van de zaakvoerder, leiderschap en team, snelheid van leadopvolging, pipeline en nurture, online aanwezigheid, sluitingspercentage en klantbehoud. Elke hefboom vertegenwoordigt een specifiek gebied waar de meeste bedrijven structureel omzet of energie laten liggen.'
              : 'The diagnostic maps 7 growth levers that determine whether your business works for you or against you: owner time freedom, leadership and team, speed-to-lead, pipeline and follow-up, online presence, sales close rate, and client retention. Each lever represents a specific area where most businesses structurally leave revenue or energy on the table.'}
          </p>

          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 400, marginBottom: '1rem', color: '#2a2720' }}>
            {nl ? 'Voor wie is de diagnose bedoeld?' : 'Who is the diagnostic designed for?'}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#5c5849', marginBottom: '1.5rem' }}>
            {nl
              ? 'De diagnose is ontworpen voor zaakvoerders van servicebedrijven met 1 tot 20 medewerkers die het gevoel hebben dat hun bedrijf meer van hen vraagt dan het teruggeeft. Ze werken hard, de omzet groeit, maar de vrijheid blijft uit. De diagnose legt bloot welke hefboom als eerste vastloopt.'
              : 'The diagnostic is designed for owners of service businesses with 1 to 20 employees who feel their business demands more from them than it gives back. They work hard, revenue grows, but freedom stays out of reach. The diagnostic reveals which lever breaks down first.'}
          </p>

          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 400, marginBottom: '1rem', color: '#2a2720' }}>
            {nl ? 'Veelgestelde vragen' : 'Frequently asked questions'}
          </h2>
          <div style={{ borderTop: '1px solid rgba(61,57,41,0.1)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column' as const, gap: '1.5rem' }}>
            {(nl ? [
              ['Is de diagnose echt gratis?', 'Ja. De diagnose en het persoonlijk rapport zijn volledig gratis. Er is geen verkoopsgesprek aan gekoppeld.'],
              ['Hoe lang duurt de diagnose?', 'De meeste zaakvoerders ronden de diagnose af in 4 tot 6 minuten. Er zijn 4 contextvragen en 7 scoringsvragen.'],
              ['Wat ontvang ik na de diagnose?', 'Je ontvangt een persoonlijk rapport met jouw bedrijfsimpactscore, jouw top 3 groeihefbomen op prioriteit, en een concreet 30-dagenactieplan per gap. Afgeleverd per e-mail binnen enkele minuten.'],
              ['Wat zijn de 7 groeihefbomen?', 'Tijd van de zaakvoerder, leiderschap en team, snelheid van opvolging, pipeline en nurture, online aanwezigheid en marketing, sluitingspercentage en klantbehoud en doorverwijzingen.'],
            ] : [
              ['Is the diagnostic really free?', 'Yes. The diagnostic and the personalised report are completely free. There is no sales call attached.'],
              ['How long does the diagnostic take?', 'Most business owners complete it in 4 to 6 minutes. There are 4 context questions and 7 scored questions.'],
              ['What do I receive after the diagnostic?', 'You receive a personalised report with your business impact score, your top 3 growth levers by priority, and a concrete 30-day action plan per gap. Delivered by email within minutes.'],
              ['What are the 7 growth levers?', 'Owner time freedom, leadership and team, speed-to-lead, pipeline and follow-up, online presence and marketing, sales close rate, and client retention and referrals.'],
            ]).map(([q, a]) => (
              <div key={q as string}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: '0.5rem', color: '#2a2720' }}>{q}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: '#5c5849', margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
