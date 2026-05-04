import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { type DiagnosticSubmission } from '@/lib/crm/diagnostic'
import { sendToLead } from '@/lib/crm/email'
import { saveLead } from '@/lib/crm/store'
import { sendDiagnosticNurtureSequence } from '@/lib/crm/sequences'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Jeroen | Lead it, Grow <jeroen@leaditgrow.be>'
const NOTIFY = 'jeroen@leaditgrow.be'

// score is a GAP score (0-100): higher = more problems

interface LeverContent {
  label: string
  cost: string
  steps: Array<{ action: string; result: string }>
  outcome: string
}

const LEVER_NL: Record<string, LeverContent> = {
  speed_to_lead: {
    label: 'Snelheid van eerste reactie op leads',
    cost: '78% van de deals gaat naar de leverancier die als eerste reageert. Elke uur dat je wacht verlies je leads die je al bijna had.',
    steps: [
      {
        action: 'Schrijf een standaard eerste reactie die je binnen 5 minuten kunt sturen na elke aanvraag. Geen essay, gewoon: "Ik heb je aanvraag ontvangen en neem vandaag contact op."',
        result: 'Elke lead voelt zich gezien. Je springt er onmiddellijk uit tegenover concurrenten die pas de volgende dag reageren.',
      },
      {
        action: 'Wijs een verantwoordelijke aan voor lead-reacties elke werkdag voor 9u. Als dat jij bent, zet er een agenda-blokkering voor.',
        result: 'Geen enkele aanvraag valt meer door de mazen, ook niet als jij in gesprek bent.',
      },
      {
        action: 'Bouw een automatische bevestigingsmail in via je website of contact-inbox. Tools als Zapier, Make of een simpele auto-reply in Gmail volstaan.',
        result: 'Je reageert sneller dan 95% van je markt, ook als je op vakantie bent.',
      },
    ],
    outcome: 'Elke aanvraag krijgt binnen 5 minuten een reactie. Je sluit meer deals puur door sneller te zijn, zonder extra marketing of lagere prijzen.',
  },
  pipeline: {
    label: 'Pipeline-opvolging en nurturing',
    cost: 'De meeste deals sluiten niet bij het eerste contact. Zonder opvolging gaan warme leads koud en koop je ze later duurder terug via advertenties of nieuwe prospectie.',
    steps: [
      {
        action: 'Definieer 5 opvolgmomenten: dag 1, 3, 7, 14 en 30. Schrijf per moment een korte template van 3-5 zinnen. Niet "just checking in", maar een concrete invalshoek: een vraag, een tip, een klantresultaat.',
        result: 'Je hebt een systeem, geen losse to-do items. Opvolging wordt iets wat je doet, niet iets wat je vergeet.',
      },
      {
        action: 'Leg elke aanvraag vast in een simpele spreadsheet of CRM met de volgende opvolgdatum. Update die datum na elk contact.',
        result: 'Je ziet in een oogopslag wie je deze week moet opvolgen. Niets raakt meer buiten beeld.',
      },
      {
        action: 'Stuur bij de derde opvolging altijd een andere invalshoek: een recent klantresultaat, een relevant artikel of een concrete vraag over hun situatie.',
        result: 'Je blijft relevant zonder opdringerig te zijn. Leads die zeiden "nog niet" komen terug op het moment dat ze er klaar voor zijn.',
      },
    ],
    outcome: 'Leads die eerder afhaakten komen terug. Jouw conversieratio stijgt zonder dat je meer leads nodig hebt, puur door bestaande contacten beter op te volgen.',
  },
  time: {
    label: 'Vrijheid en tijd als ondernemer',
    cost: 'Elke taak die alleen jij kunt doen is een plafond op jouw groei. Het bedrijf draait op jou, niet voor jou. Dat wordt vermoeiend, en het schaalt niet.',
    steps: [
      {
        action: 'Doe een tijdaudit: schrijf alles op wat je vorige week deed, van 30 minuten tot een volle dag. Markeer wat echt alleen jij kunt doen op basis van jouw unieke expertise of relaties.',
        result: 'Je ziet onmiddellijk welk deel van je week operationeel is en welk deel strategisch. Voor de meeste ondernemers is dat een ontnuchtering.',
      },
      {
        action: 'Kies 3 terugkerende taken die anderen kunnen overnemen. Maak er een SOP van: een screencapture met uitleg of een checklist van 1 pagina. Maximaal 20 minuten per taak.',
        result: 'Je verdwijnt stap voor stap uit het operationele. Anderen kunnen de taak overnemen zonder jou te hoeven vragen.',
      },
      {
        action: 'Blokkeer elke week 4 uur "CEO-tijd" in je agenda. Geen meetings, geen operatie. Alleen strategie, richting en de dingen die alleen jij kunt beslissen.',
        result: 'Je denkt meer over het bedrijf dan erin. Groei begint met die verschuiving.',
      },
    ],
    outcome: 'Het bedrijf draait een week zonder jouw dagelijkse aanwezigheid en de klanten merken het niet. Jij kiest zelf waarmee je je tijd vult.',
  },
  leadership: {
    label: 'Leiderschap en teamautonomie',
    cost: 'Als jouw team jou nodig heeft voor dagelijkse beslissingen, heb je geen team. Je hebt medewerkers die in de wachtrij staan. Dat vertraagt alles en vermoeit jou.',
    steps: [
      {
        action: 'Schrijf per terugkerende situatie op wie beslist, wie geconsulteerd wordt en wie het achteraf hoeft te weten. Gebruik een eenvoudige tabel. Bespreek het met je team in een half uur.',
        result: 'Beslissingen worden sneller genomen en worden niet meer naar jou doorgestuurd voor goedkeuring.',
      },
      {
        action: 'Houd een wekelijkse check-in van 30 minuten: wat loopt er goed, wat blokkeert en wat heeft iemand nodig. Niet meer, niet minder.',
        result: 'Problemen komen sneller naar boven. Je team voelt zich gehoord en weet dat ze niet elke dag bij jou hoeven aan te kloppen.',
      },
      {
        action: 'Laat je team beslissingen nemen die jij kunt bijsturen. Als iets fout gaat, corrigeer dan het systeem of de informatie, niet de persoon.',
        result: 'Je team leert zelfstandig opereren. Fouten worden zeldzamer en kleiner omdat het systeem beter wordt.',
      },
    ],
    outcome: 'Je hoort over problemen nadat ze zijn opgelost, niet wanneer ze net beginnen. Je team handelt, jij stuurt bij op strategie.',
  },
  marketing: {
    label: 'Online aanwezigheid en inbound leads',
    cost: 'Jij bent jouw marketing. Als jij stopt met pushen, stoppen de leads. Dat is een baan vermomd als een bedrijf.',
    steps: [
      {
        action: 'Kies 1 content-formaat dat je consistent kunt produceren: een LinkedIn-post per week, een korte video, of een maandelijkse e-mail. Niet drie formats. Kies er een en doe het goed.',
        result: 'Je bouwt zichtbaarheid die werkt terwijl jij met klanten bezig bent of slaapt. De eerste resultaten zijn merkbaar na 6-8 weken.',
      },
      {
        action: "Maak een content-batch van 4 weken in een dag: 4 posts, 4 thema's, ingepland. Gebruik echte klantproblemen als basis. Plan ze in via Buffer, Later of direct op LinkedIn.",
        result: 'Jouw aanwezigheid wordt voorspelbaar. Je stopt met vanuit paniek posten of weken lang niets laten horen.',
      },
      {
        action: 'Voeg aan elke post een zachte oproep toe: "Herken je dit? Stuur me een bericht." of "Vraag en ik stuur je de aanpak die ik gebruik."',
        result: 'Inkomende gesprekken in plaats van koude prospectie. Mensen die reageren zijn al warm.',
      },
    ],
    outcome: 'Je krijgt wekelijks 2-3 inkomende berichten van mensen die jouw content zagen. Marketing loopt als een systeem, niet als een inspanning.',
  },
  sales: {
    label: 'Salesconversie en closerate',
    cost: 'Een lage closerate is zelden een overtuigingsprobleem. Het is bijna altijd een kwalificatie- of framingprobleem. De verkeerde mensen aan tafel, of de verkeerde verwachtingen vooraf.',
    steps: [
      {
        action: 'Analyseer je laatste 10 gewonnen deals: welke sector, welke bedrijfsgrootte, welk probleem stond centraal en wat zorgde voor de beslissing. Noteer de patronen.',
        result: 'Je weet precies wie jouw ideale klant is. Je stopt energie in de juiste gesprekken en herkent snel wie niet past.',
      },
      {
        action: 'Definieer het concrete resultaat dat jouw klant na samenwerking bereikt. Zet dat resultaat centraal in jouw introgesprek, niet jouw dienst of aanpak.',
        result: 'Klanten kopen het resultaat, niet het proces. Bezwaren over prijs of timing worden zeldzamer wanneer het resultaat helder is.',
      },
      {
        action: 'Schrijf voor de 3 meest voorkomende bezwaren een concreet antwoord. "Te duur", "moet ik over nadenken" en "we doen het intern" zijn bij de meeste ondernemers verantwoordelijk voor 80% van de verloren deals. Leer de antwoorden uit je hoofd.',
        result: 'Je closerate stijgt zonder agressiever of opdringeriiger te worden. Je wordt gewoon helderder.',
      },
    ],
    outcome: 'Je werkt alleen nog met klanten die passen. Je sluit 6 van de 10 gesprekken zonder te pushen, omdat de verwachtingen vooraf al kloppen.',
  },
  retention: {
    label: 'Klantbehoud en doorverwijzingen',
    cost: 'Nieuwe klanten werven kost 5 tot 7 keer meer dan bestaande klanten houden. Zonder systeem laat je herhaalopdrachten en doorverwijzingen liggen die je al verdiend hebt.',
    steps: [
      {
        action: 'Plan na elk afgerond project een check-in na 30 dagen. Een kort gesprek of bericht met een enkele vraag: "Is er iets anders dat nu bij je speelt?"',
        result: 'Je ontdekt vervolgvragen die je anders nooit hoort. De meeste herhaalopdrachten komen uit dit ene moment van opvolging.',
      },
      {
        action: 'Vraag je beste klanten op het hoogtepunt van de samenwerking, niet achteraf: "Wie in jouw netwerk heeft hetzelfde probleem als jij had voor we begonnen?"',
        result: 'Doorverwijzingen worden actief gegenereerd in plaats van afgewacht. Dit moment is het meest effectieve sales-gesprek dat je ooit zult voeren.',
      },
      {
        action: 'Stuur 1 keer per kwartaal een persoonlijk bericht aan je klantenbase met een tip of update die relevant is voor hun situatie. Geen nieuwsbrief, gewoon een directe boodschap.',
        result: 'Je blijft top-of-mind zonder te hoeven prospecteren. Klanten denken aan jou op het moment dat ze of hun netwerk een probleem heeft.',
      },
    ],
    outcome: 'Minstens 30% van je nieuwe opdrachten komt van bestaande klanten of doorverwijzingen. Je hoeft minder te prospecteren omdat jouw klantenbase voor jou werkt.',
  },
}

const LEVER_EN: Record<string, LeverContent> = {
  speed_to_lead: {
    label: 'Speed-to-lead (response time)',
    cost: '78% of deals go to the first vendor to respond. Every hour you wait costs you leads you almost had.',
    steps: [
      {
        action: 'Write a standard first response you can send within 5 minutes of every enquiry. Not an essay, just: "I received your message and will be in touch today."',
        result: 'Every lead feels acknowledged. You immediately stand out from competitors who respond the next day.',
      },
      {
        action: 'Assign one person responsible for responding to leads before 9am every working day. If that\'s you, block time in your calendar.',
        result: 'No enquiry falls through the cracks, even when you\'re in meetings.',
      },
      {
        action: 'Set up an automatic confirmation email via your website or inbox. Zapier, Make, or a Gmail auto-reply is enough to start.',
        result: 'You respond faster than 95% of your market, even when you\'re on holiday.',
      },
    ],
    outcome: 'Every enquiry gets a response within 5 minutes. You close more deals simply by being faster, without more marketing or lower prices.',
  },
  pipeline: {
    label: 'Pipeline follow-up and nurture',
    cost: 'Most deals don\'t close on first contact. Without follow-up, warm leads go cold and you have to re-acquire them later through ads or new outreach.',
    steps: [
      {
        action: 'Define 5 follow-up moments: day 1, 3, 7, 14 and 30. Write one short template per moment. Not "just checking in" but a concrete angle: a question, a tip, a client result.',
        result: 'You have a system, not a to-do list. Follow-up becomes something you do, not something you forget.',
      },
      {
        action: 'Log every enquiry in a simple spreadsheet or CRM with the next follow-up date. Update it after every contact.',
        result: 'You see at a glance who to contact this week. Nothing goes out of sight.',
      },
      {
        action: 'On the third follow-up, always use a different angle: a recent client result, a relevant insight, or a concrete question about their situation.',
        result: 'You stay relevant without being pushy. Leads who said "not yet" come back when they\'re ready.',
      },
    ],
    outcome: 'Leads that previously dropped off come back. Your conversion rate goes up without needing more leads, purely by following up on existing contacts.',
  },
  time: {
    label: 'Owner time and freedom',
    cost: 'Every task that only you can do puts a ceiling on your growth. The business runs on you, not without you. That gets exhausting, and it doesn\'t scale.',
    steps: [
      {
        action: 'Do a time audit: write down everything you did last week, from 30-minute tasks to full days. Mark what only you can truly do based on your unique expertise or relationships.',
        result: 'You immediately see how much of your week is operational versus strategic. For most business owners, this is a wake-up call.',
      },
      {
        action: 'Pick 3 recurring tasks others could take over. Create a simple SOP: a screen recording with commentary or a one-page checklist. Maximum 20 minutes per task.',
        result: 'You gradually disappear from the operational layer. Others can take over without needing to ask you every step.',
      },
      {
        action: 'Block 4 hours of "CEO time" every week in your calendar. No meetings, no operations. Strategy, direction, and the decisions only you can make.',
        result: 'You think more about the business than in it. Growth starts with that shift.',
      },
    ],
    outcome: 'The business runs for a week without your daily presence and clients don\'t notice. You choose what to fill your time with.',
  },
  leadership: {
    label: 'Leadership and team autonomy',
    cost: 'If your team needs you for daily decisions, you don\'t have a team. You have employees queuing for your attention. That slows everything down and exhausts you.',
    steps: [
      {
        action: 'For each recurring situation, write down who decides, who is consulted, and who just needs to know afterwards. Use a simple table. Walk the team through it in 30 minutes.',
        result: 'Decisions get made faster and stop being forwarded to you for approval.',
      },
      {
        action: 'Run a weekly check-in of 30 minutes: what\'s going well, what\'s blocked, what does someone need. Nothing more.',
        result: 'Problems surface faster. The team feels heard and knows they don\'t need to knock on your door every day.',
      },
      {
        action: 'Let your team make decisions you can correct. When something goes wrong, fix the system or the information, not the person.',
        result: 'Your team learns to operate independently. Mistakes become rarer and smaller as the system improves.',
      },
    ],
    outcome: 'You hear about problems after they\'ve been solved, not when they\'re just starting. Your team acts, you steer on strategy.',
  },
  marketing: {
    label: 'Online presence and inbound leads',
    cost: 'You are your marketing. When you stop pushing, leads stop coming. That\'s a job disguised as a business.',
    steps: [
      {
        action: 'Choose 1 content format you can produce consistently: one LinkedIn post per week, a short video, or a monthly email. Not three formats. Pick one and do it well.',
        result: 'You build visibility that works while you\'re with clients or sleeping. First results show after 6-8 weeks.',
      },
      {
        action: 'Batch 4 weeks of content in one day: 4 posts, 4 topics, scheduled. Use real client problems as your material. Schedule via Buffer, Later, or directly on LinkedIn.',
        result: 'Your presence becomes predictable. You stop panic-posting or going silent for weeks at a time.',
      },
      {
        action: 'Add a soft call to action on every post: "Does this resonate? Send me a message." or "Ask me and I\'ll share the approach I use."',
        result: 'Inbound conversations instead of cold outreach. People who respond are already warm.',
      },
    ],
    outcome: 'You get 2-3 inbound messages per week from people who saw your content. Marketing runs as a system, not an effort.',
  },
  sales: {
    label: 'Sales conversion and close rate',
    cost: 'A low close rate is rarely a persuasion problem. It\'s almost always a qualification or framing problem. The wrong people at the table, or the wrong expectations set upfront.',
    steps: [
      {
        action: 'Analyse your last 10 won deals: what sector, what business size, what problem was central, and what drove the decision. Note the patterns.',
        result: 'You know exactly who your ideal client is. You invest energy in the right conversations and quickly recognise who doesn\'t fit.',
      },
      {
        action: 'Define the concrete result your client reaches after working with you. Put that result at the centre of your intro call, not your service or approach.',
        result: 'Clients buy the result, not the process. Objections about price or timing become rarer when the outcome is clear.',
      },
      {
        action: 'Write a concrete answer to your 3 most common objections. "Too expensive", "I need to think about it" and "we\'ll do it in-house" account for 80% of lost deals for most business owners. Learn the answers by heart.',
        result: 'Your close rate goes up without becoming more aggressive. You just become clearer.',
      },
    ],
    outcome: 'You only work with clients who are a good fit. You close 6 out of 10 conversations without pushing, because expectations are already aligned upfront.',
  },
  retention: {
    label: 'Client retention and referrals',
    cost: 'Acquiring new clients costs 5 to 7 times more than keeping existing ones. Without a system you leave repeat work and referrals on the table that you already earned.',
    steps: [
      {
        action: 'After every completed project, schedule a check-in at 30 days. A short call or message with one question: "Is there anything else weighing on you right now?"',
        result: 'You discover follow-on questions you\'d otherwise never hear. Most repeat work comes from this one moment of follow-up.',
      },
      {
        action: 'Ask your best clients at the peak of your collaboration, not afterwards: "Who in your network has the same problem you had before we started?"',
        result: 'Referrals are actively generated instead of waited for. This moment is the most effective sales conversation you will ever have.',
      },
      {
        action: 'Send a personal message to your client base once per quarter with a tip or update relevant to their situation. Not a newsletter, just a direct message.',
        result: 'You stay top-of-mind without having to prospect. Clients think of you when they or their network has a problem.',
      },
    ],
    outcome: 'At least 30% of your new work comes from existing clients or referrals. You prospect less because your client base works for you.',
  },
}

function estimateRevenueLeak(submission: DiagnosticSubmission): number {
  const leadsMap: Record<string, number> = {
    'Fewer than 5': 3, 'Minder dan 5': 3,
    '5 to 20': 12, '5 tot 20': 12,
    '20 to 50': 35, '20 tot 50': 35,
    'More than 50': 65, 'Meer dan 50': 65,
  }
  const dealMap: Record<string, number> = {
    'Under €1,000': 600, 'Onder €1.000': 600,
    '€1,000 to €5,000': 2500, '€1.000 tot €5.000': 2500,
    '€5,000 to €20,000': 10000, '€5.000 tot €20.000': 10000,
    'Over €20,000': 25000, 'Boven €20.000': 25000,
  }
  const leads = leadsMap[submission.context.monthlyLeads] ?? 10
  const deal = dealMap[submission.context.avgDealValue] ?? 2000
  const stl = submission.answers['speed_to_lead'] ?? 0
  const pip = submission.answers['pipeline'] ?? 0
  const sal = submission.answers['sales'] ?? 0
  const loss = Math.min(
    (stl === 3 ? 0.5 : stl === 2 ? 0.3 : stl === 1 ? 0.1 : 0) +
    (pip === 3 ? 0.4 : pip === 2 ? 0.25 : pip === 1 ? 0.1 : 0) +
    (sal === 3 ? 0.35 : sal === 2 ? 0.2 : sal === 1 ? 0.08 : 0),
    0.85
  )
  return Math.round(leads * deal * loss / 500) * 500
}

function stepBlock(step: { action: string; result: string }, index: number, nl: boolean): string {
  return `
  <div style="margin-bottom:10px">
    <table cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="width:32px;vertical-align:top;padding-right:12px">
          <div style="width:24px;height:24px;border-radius:50%;background:#c96442;color:#fff;font-size:11px;font-weight:800;text-align:center;line-height:24px">${index + 1}</div>
        </td>
        <td style="vertical-align:top">
          <p style="font-size:13px;color:#3d3929;line-height:1.65;margin:0 0 6px;font-weight:500">${step.action}</p>
          <div style="background:#f0faf4;border-left:3px solid #3dba6e;border-radius:0 6px 6px 0;padding:8px 12px">
            <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#3dba6e">${nl ? 'Resultaat' : 'Result'}: </span>
            <span style="font-size:12px;color:#535146;line-height:1.5">${step.result}</span>
          </div>
        </td>
      </tr>
    </table>
  </div>`
}

function buildReport(submission: DiagnosticSubmission): { subject: string; html: string } {
  const nl = true  // targeting Belgian market
  const LEVER = nl ? LEVER_NL : LEVER_EN
  const fmt = (n: number) => n === 0 ? (nl ? 'Minimaal' : 'Minimal') : `€${n.toLocaleString('nl-BE')}`

  const top3 = submission.topLevers.slice(0, 3)
  const top1 = top3[0]
  const top1Data = LEVER[top1]
  const monthly = estimateRevenueLeak(submission)
  const annual = monthly * 12

  const scoreDisplay = submission.score  // GAP score (0-100), higher = more problems — matches website display
  const healthColor = scoreDisplay <= 30 ? '#3dba6e' : scoreDisplay <= 60 ? '#e8a838' : '#e05b3a'

  const subject = nl
    ? `${submission.name}, jouw diagnose-rapport: ${top1Data?.label ?? top1}`
    : `${submission.name}, your diagnostic report: ${top1Data?.label ?? top1}`

  const leakBlock = monthly > 0 ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf4f0;border:1.5px solid rgba(201,100,66,.25);border-radius:12px;margin-bottom:24px">
      <tr>
        <td style="padding:16px 20px;vertical-align:middle">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="text-align:center;width:90px;padding-right:16px;vertical-align:middle">
                <div style="font-size:28px;font-weight:800;color:#c96442;line-height:1">${fmt(monthly)}</div>
                <div style="font-size:10px;color:#b0aea8;margin-top:2px">${nl ? 'per maand' : 'per month'}</div>
              </td>
              <td style="vertical-align:middle">
                <div style="font-size:12px;font-weight:700;color:#3d3929;margin-bottom:3px">${nl ? 'Geschat maandelijks omzetverlies' : 'Estimated monthly revenue leak'}</div>
                <div style="font-size:12px;color:#83827d;line-height:1.5">${nl ? `${fmt(annual)} per jaar, op basis van jouw leads, dealwaarde en opvolggedrag.` : `${fmt(annual)} per year, based on your leads, deal value and follow-up behaviour.`}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>` : ''

  const top1Block = top1Data ? `
    <div style="background:#3d3929;border-radius:14px;padding:24px 26px;margin-bottom:28px">
      <div style="font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#c96442;margin-bottom:8px">
        ${nl ? 'Jouw #1 hefboom - grootste impact' : 'Your #1 lever - biggest impact'}
      </div>
      <div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:10px">${top1Data.label}</div>
      <p style="font-size:13px;color:rgba(255,255,255,.7);line-height:1.65;margin:0 0 18px">${top1Data.cost}</p>
      ${top1Data.steps.map((s, i) => `
      <div style="background:rgba(255,255,255,.07);border-radius:8px;padding:14px 16px;margin-bottom:8px">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="width:28px;vertical-align:top;padding-right:10px">
              <div style="width:20px;height:20px;border-radius:50%;background:#c96442;color:#fff;font-size:10px;font-weight:800;text-align:center;line-height:20px">${i + 1}</div>
            </td>
            <td style="vertical-align:top">
              <p style="font-size:13px;color:rgba(255,255,255,.9);line-height:1.6;margin:0 0 8px">${s.action}</p>
              <div style="background:rgba(61,186,110,.15);border-left:2px solid #3dba6e;padding:6px 10px;border-radius:0 5px 5px 0">
                <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#3dba6e">${nl ? 'Resultaat' : 'Result'}: </span>
                <span style="font-size:12px;color:rgba(255,255,255,.7)">${s.result}</span>
              </div>
            </td>
          </tr>
        </table>
      </div>`).join('')}
      <div style="margin-top:16px;background:rgba(201,100,66,.2);border-radius:8px;padding:12px 16px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#c96442;margin-bottom:5px">${nl ? 'Gewenste uitkomst' : 'Desired outcome'}</div>
        <p style="font-size:13px;color:rgba(255,255,255,.85);line-height:1.6;margin:0">${top1Data.outcome}</p>
      </div>
    </div>` : ''

  const priorityBlocks = top3.slice(1).map((lever, idx) => {
    const data = LEVER[lever]
    if (!data) return ''
    const answerScore = submission.answers[lever] ?? 0
    const severity = answerScore === 3 ? (nl ? 'Kritiek' : 'Critical') : answerScore === 2 ? (nl ? 'Significant' : 'Significant') : (nl ? 'Aandachtspunt' : 'Note')
    const severityColor = answerScore === 3 ? '#e05b3a' : answerScore === 2 ? '#e8a838' : '#83827d'
    return `
    <div style="border:1px solid rgba(61,57,41,.1);border-radius:12px;padding:20px 22px;margin-bottom:14px;background:#fff">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div>
          <div style="font-size:10px;font-weight:700;color:#83827d;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px">${nl ? `Prioriteit ${idx + 2}` : `Priority ${idx + 2}`}</div>
          <div style="font-size:14px;font-weight:700;color:#3d3929">${data.label}</div>
        </div>
        <span style="font-size:10px;font-weight:700;background:${severityColor}22;color:${severityColor};border-radius:4px;padding:3px 8px;white-space:nowrap;margin-left:12px">${severity}</span>
      </div>
      <p style="font-size:13px;color:#535146;line-height:1.65;margin:0 0 14px">${data.cost}</p>
      ${data.steps.map((s, i) => stepBlock(s, i, nl)).join('')}
      <div style="background:#f3f1eb;border-radius:8px;padding:12px 14px;margin-top:12px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#83827d;margin-bottom:5px">${nl ? 'Gewenste uitkomst' : 'Desired outcome'}</div>
        <p style="font-size:13px;color:#3d3929;line-height:1.6;margin:0;font-weight:500">${data.outcome}</p>
      </div>
    </div>`
  }).join('')

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf9f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">

  <div style="margin-bottom:24px">
    <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#c96442;margin-bottom:4px">Lead it, Grow</div>
    <div style="font-size:11px;color:#b0aea8">${nl ? 'Business Impact Diagnose - persoonlijk rapport' : 'Business Impact Diagnostic - personal report'}</div>
  </div>

  <div style="background:#fff;border-radius:16px;border:1px solid rgba(61,57,41,.1);padding:32px;box-shadow:0 4px 24px rgba(0,0,0,.06)">

    <p style="font-size:16px;color:#3d3929;margin:0 0 8px">Hi ${submission.name},</p>
    <p style="font-size:14px;color:#535146;line-height:1.7;margin:0 0 24px">
      ${nl ? 'Hier is jouw persoonlijk rapport op basis van de Business Impact Diagnose. Per hefboom krijg je de exacte stappen en het verwachte resultaat.' : 'Here is your personal report based on the Business Impact Diagnostic. For each lever you get the exact steps and expected result.'}
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f1eb;border-radius:12px;margin-bottom:24px">
      <tr>
        <td style="padding:14px 18px;vertical-align:middle">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="text-align:center;min-width:52px;padding-right:14px;vertical-align:middle">
                <div style="font-size:32px;font-weight:800;color:${healthColor};line-height:1">${scoreDisplay}</div>
                <div style="font-size:10px;color:#83827d;font-weight:600">/100</div>
              </td>
              <td style="vertical-align:middle">
                <div style="font-size:12px;font-weight:700;color:#3d3929;margin-bottom:2px">${nl ? 'Bedrijfsimpact score' : 'Business impact score'}</div>
                <div style="font-size:12px;color:#535146;line-height:1.5">
                  ${scoreDisplay <= 30 ? (nl ? 'Sterke basis. Focus op optimalisatie.' : 'Strong foundation. Focus on optimisation.') : scoreDisplay <= 60 ? (nl ? 'Goede basis, duidelijke groeikansen.' : 'Good base, clear growth opportunities.') : (nl ? 'Significante groeikansen. Laaghangend fruit aanwezig.' : 'Significant growth opportunities. Low-hanging fruit available.')}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${leakBlock}
    ${top1Block}

    ${top3.length > 1 ? `<div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#83827d;margin-bottom:14px">${nl ? 'Overige prioriteiten' : 'Other priorities'}</div>` : ''}
    ${priorityBlocks}

    <div style="background:#3d3929;border-radius:12px;padding:22px 24px;margin-top:8px">
      <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:8px">${nl ? 'Wil je dit concreet aanpakken?' : 'Ready to act on this?'}</div>
      <p style="font-size:13px;color:rgba(255,255,255,.75);line-height:1.65;margin:0 0 12px">
        ${nl
          ? `Op basis van jouw diagnose begin ik in een gratis gesprek van 15 minuten bij jouw #1 hefboom: <strong style="color:#fff">${top1Data?.label ?? top1}</strong>. Geen verkooppraatje. Gewoon kijken wat er voor jou specifiek werkt.`
          : `Based on your diagnostic I start a free 15-minute call with your #1 lever: <strong style="color:#fff">${top1Data?.label ?? top1}</strong>. No sales pitch. Just looking at what specifically works for you.`}
      </p>
      <p style="font-size:13px;color:rgba(255,255,255,.75);margin:0">
        ${nl ? 'Stuur een reply met een paar tijdstippen die jou passen en we plannen iets in.' : 'Reply with a few times that work for you and we\'ll schedule something.'}
      </p>
    </div>

  </div>

  <div style="margin-top:14px;padding:12px 16px;background:#f3f1eb;border-radius:8px;font-size:11px;color:#83827d;line-height:1.6">
    <strong style="color:#3d3929">${nl ? 'Jouw context:' : 'Your context:'}</strong>
    ${submission.context.industry} - ${submission.context.teamSize} ${nl ? 'medewerkers' : 'team'} - ${submission.context.monthlyLeads} ${nl ? 'leads/maand' : 'leads/month'} - ${submission.context.avgDealValue}
  </div>

  <div style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(61,57,41,.1)">
    <div style="font-size:13px;font-weight:600;color:#3d3929">Jeroen</div>
    <div style="font-size:12px;color:#83827d">Lead it, Grow - jeroen@leaditgrow.be</div>
  </div>

</div>
</body></html>`

  return { subject, html }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as DiagnosticSubmission

    if (!body.email || !body.name) {
      return NextResponse.json({ error: 'Missing name or email' }, { status: 400 })
    }

    const id = randomUUID()

    const { error: insertError } = await supabase.from('diagnostics').insert({
      id,
      name: body.name,
      email: body.email,
      score: body.score,
      industry: body.context.industry,
      monthly_leads: body.context.monthlyLeads,
      avg_deal_value: body.context.avgDealValue,
      team_size: body.context.teamSize,
      answers: body.answers,
      top_levers: body.topLevers,
    })

    if (insertError) {
      console.error('[diagnostic] diagnostics insert error:', insertError.message)
    }

    try {
      await saveLead({
        id,
        name: body.name,
        email: body.email,
        message: `Business Impact Diagnostic - gap score: ${body.score}/100. Top gaps: ${body.topLevers.slice(0, 3).join(', ')}. Industry: ${body.context.industry}. Leads/mo: ${body.context.monthlyLeads}. Avg deal: ${body.context.avgDealValue}.`,
        lang: 'nl',
        submittedAt: Date.now(),
        qualified: body.score >= 30,
        score: Math.max(1, Math.min(10, Math.round(body.score / 10))),
        status: 'new',
        source: 'diagnostic',
      })
    } catch (err) {
      console.error('[diagnostic] leads mirror failed:', err)
    }

    const { subject, html } = buildReport(body)
    await sendToLead(body.email, subject, html)

    await supabase.from('diagnostics').update({ report_sent: true }).eq('id', id)

    // Start nurture sequence (dag 3, 7, 14) via Resend scheduled emails
    try {
      await sendDiagnosticNurtureSequence(body.name, body.email, body.topLevers[0] ?? 'time', body.score)
    } catch (err) {
      console.error('[diagnostic] nurture sequence error:', err)
    }

    await resend.emails.send({
      from: FROM,
      to: NOTIFY,
      subject: `New diagnostic: ${body.name} - score ${body.score}/100 - top gap: ${body.topLevers[0] ?? '?'}`,
      html: `
        <h2 style="font-family:sans-serif;color:#3d3929">New diagnostic submission</h2>
        <p style="font-family:sans-serif;color:#535146"><strong>Name:</strong> ${body.name}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Email:</strong> ${body.email}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Gap score:</strong> ${body.score}/100</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Industry:</strong> ${body.context.industry}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Monthly leads:</strong> ${body.context.monthlyLeads}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Avg deal value:</strong> ${body.context.avgDealValue}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Team size:</strong> ${body.context.teamSize}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Top 3 gaps:</strong> ${body.topLevers.slice(0, 3).join(', ')}</p>
        <p style="font-family:sans-serif;color:#535146;margin-top:16px">Report sent to ${body.email}</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[diagnostic] error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
