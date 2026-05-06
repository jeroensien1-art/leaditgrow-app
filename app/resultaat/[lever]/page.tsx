'use client'

import { useLang } from '@/components/lang-context'
import { useParams } from 'next/navigation'
import { LogoFull } from '@/components/ui/logo-mark'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// ── Lever data ────────────────────────────────────────────────────────────────

type LeverData = {
  label: string
  headline: string
  subline: string
  costs: string[]
  changeTitle: string
  changeItems: string[]
  scenario: string
  quoteText: string
  primaryCta: string
  primaryHref: string
  secondaryCta: string
  secondaryHref: string
}

const nl: Record<string, LeverData> = {
  tijd: {
    label: 'Vrijheid van de zaakvoerder',
    headline: 'Jouw bedrijf draait op jou. Dat is geen compliment.',
    subline: 'De diagnose toont dat jij de bottleneck bent. Elke beslissing, elk probleem, elke uitzondering belandt bij jou. Je hebt een bedrijf gebouwd dat groeit,maar dat jou gevangen houdt.',
    costs: [
      'Elke dag die jij besteedt aan werk dat een ander kon doen, kost je gemiddeld €500 tot €1.500 aan gemiste strategische tijd.',
      'Bedrijven waarbij de zaakvoerder niet weg kan, worden 40% lager gewaardeerd bij een eventuele overdracht of exit.',
      'Opgebouwde vermoeidheid bij eigenaren die "alles zelf doen" is de voornaamste reden waarom groei na 1,5 miljoen omzet stagneert.',
    ],
    changeTitle: 'Wat er verandert als je dit oplost',
    changeItems: [
      'Jouw rol verschuift van uitvoerder naar architect,je stuurt bij, je keurt goed, je bouwt.',
      'Je team neemt beslissingen zonder jou, binnen kaders die jij hebt gezet.',
      'Je kunt twee weken weg zonder dat het bedrijf stilstaat.',
    ],
    scenario: 'Een aannemer met 11 man personeel werkte 60 uur per week en was de enige die klantenklachten kon afhandelen, offertes kon goedkeuren én leveranciers kon bellen. Niet omdat zijn team onbekwaam was,maar omdat er nooit een systeem was gebouwd om dat over te dragen. Na één kwartaal: 38 uur per week, twee zelfstandige projectleiders, en de eerste echte vakantie in vier jaar.',
    quoteText: '"Vrijheid is geen beloning voor hard werken. Het is het resultaat van de juiste structuur."',
    primaryCta: 'Plan gratis leiderschapsgesprek',
    primaryHref: '/#contact',
    secondaryCta: 'Download het gratis businessgroei-handboek',
    secondaryHref: '/gratis-handboek',
  },
  team: {
    label: 'Leiderschap & team',
    headline: 'Je hebt mensen. Maar je leidt ze nog niet.',
    subline: 'De diagnose toont dat jouw team afhankelijk van jou is voor te veel. Ze zijn bekwaam,maar de structuren om zelfstandig te werken ontbreken. Elke dag kost jou tijd die zij zelf zouden kunnen invullen.',
    costs: [
      'Een team dat wacht op jouw input verliest gemiddeld 2 tot 4 uur productieve tijd per dag per medewerker,aan onduidelijkheid, wachten, en dubbel werk.',
      'Zonder duidelijke rollen en beslissingskaders schalen bedrijven niet: ze groeien in omzet, maar ook in chaos.',
      'Goede medewerkers vertrekken sneller bij managers die micromanagen dan bij bedrijven die minder betalen.',
    ],
    changeTitle: 'Wat er verandert als je dit oplost',
    changeItems: [
      'Je team weet wat van hen verwacht wordt,zonder dat jij het elke week opnieuw uitlegt.',
      'Beslissingen worden genomen op het juiste niveau, niet altijd bij jou.',
      'Onboarding van nieuwe medewerkers gaat 3x sneller omdat de systemen er zijn.',
    ],
    scenario: 'Een marketingbureau met 8 medewerkers had een zaakvoerster die elke briefing, elk klantvoorstel en elke factuur moest valideren. Niet uit wantrouwen,maar omdat de kaders ontbraken waarbinnen haar team zelfstandig kon werken. Na het definiëren van rollen, beslissingsniveaus en een wekelijks ritme: de zaakvoerster werkte nog 4 uur per week operationeel in plaats van 35.',
    quoteText: '"Leiderschap is niet aanwezig zijn bij elke beslissing. Het is zorgen dat de juiste beslissingen genomen worden zonder jou."',
    primaryCta: 'Plan gratis leiderschapsgesprek',
    primaryHref: '/#contact',
    secondaryCta: 'Download het gratis businessgroei-handboek',
    secondaryHref: '/gratis-handboek',
  },
  opvolging: {
    label: 'Snelheid van leadopvolging',
    headline: 'Je verliest klanten voordat je ze ooit hebt gehad.',
    subline: 'De diagnose toont dat leads te lang wachten op een reactie. Elk uur dat verstrijkt na een eerste contact verlaagt de kans op conversie. Dat is omzet die verdwijnt zonder dat je het ziet.',
    costs: [
      'Leads die binnen 5 minuten worden opgevolgd, converteren 21x beter dan leads die een uur wachten. Dat is geen theorie,dat zijn metingen uit honderden servicebedrijven.',
      'Elke lead die koud wordt terwijl jij of je team "te druk is", kost je gemiddeld de waarde van twee tot drie deals per maand.',
      'Concurrenten die sneller reageren winnen die opdrachten,niet omdat ze beter zijn, maar omdat ze eerder aanwezig waren.',
    ],
    changeTitle: 'Wat er verandert als je dit oplost',
    changeItems: [
      'Elke nieuwe aanvraag krijgt binnen 5 minuten een eerste reactie,ook buiten kantooruren.',
      'Je pipeline vult zich met warme leads die al het gevoel hebben dat jij betrouwbaar bent.',
      'Je sluitingspercentage stijgt zonder dat je beter hoeft te verkopen.',
    ],
    scenario: 'Een vastgoedmakelaar ontving gemiddeld 14 online aanvragen per week. Van die 14 reageerde hij gemiddeld na 4 uur. Zijn conversie lag op 11%. Na het instellen van een geautomatiseerde opvolgsequentie met een persoonlijke eerste reactie binnen 5 minuten: 28% conversie op dezelfde leads, zonder extra advertentiebudget.',
    quoteText: '"De snelste reactie wint,niet de beste pitch. Snelheid is een verkoopstrategie."',
    primaryCta: 'Download het gratis businessgroei-handboek',
    primaryHref: '/gratis-handboek',
    secondaryCta: 'Bespreek dit in een gratis gesprek',
    secondaryHref: '/#contact',
  },
  pipeline: {
    label: 'Pipeline & nurture',
    headline: 'Leads starten het traject. Te weinig komen aan.',
    subline: 'De diagnose toont dat jouw pipeline lekt. Leads tonen interesse, maar vallen ergens af,omdat er geen consequente opvolging is, geen nurture, geen moment waarop jij opnieuw in beeld komt op het juiste moment.',
    costs: [
      '80% van de deals vraagt 5 of meer contactmomenten voor een beslissing. De meeste bedrijven stoppen na 1 of 2 pogingen.',
      'Een pipeline zonder nurture laat gemiddeld 30 tot 40% van de potentiële omzet liggen,niet aan slechte leads, maar aan slechte timing.',
      'Leads die je niet nurturt, koopt iemand anders,of ze kopen helemaal niet, terwijl ze dat wel hadden gedaan met de juiste begeleiding.',
    ],
    changeTitle: 'Wat er verandert als je dit oplost',
    changeItems: [
      'Je pipeline heeft een ritme: elke lead krijgt de juiste boodschap op het juiste moment.',
      'Koude leads worden opnieuw warm zonder dat jij er manueel tijd in steekt.',
      'Je omzet wordt voorspelbaar,je weet hoeveel deals er komen aan het einde van de maand.',
    ],
    scenario: 'Een IT-bedrijf had 40 offerte-aanvragen per kwartaal. 12 werden klant. De overige 28 hoorden nooit meer iets. Na het opzetten van een 4-staps nurture-sequentie van 21 dagen: 19 klanten per kwartaal op dezelfde aanvragen,zonder extra marketing.',
    quoteText: '"De meeste omzet zit niet in nieuwe leads. Ze zitten in de leads die je al had maar nooit goed hebt opgevolgd."',
    primaryCta: 'Download het gratis businessgroei-handboek',
    primaryHref: '/gratis-handboek',
    secondaryCta: 'Bespreek dit in een gratis gesprek',
    secondaryHref: '/#contact',
  },
  aanwezigheid: {
    label: 'Online aanwezigheid',
    headline: 'Je wordt gevonden. Maar niet gekozen.',
    subline: 'De diagnose toont dat jouw online aanwezigheid bezoekers aantrekt maar niet converteert. De boodschap raakt hen niet,of vertrouwen wordt niet snel genoeg opgebouwd om actie te ondernemen.',
    costs: [
      'Een website met een conversieratio onder 2% laat bij 1.000 maandelijkse bezoekers meer dan 980 potentiële klanten gaan zonder enige interactie.',
      'Zonder een duidelijke eerste stap (laagdrempelig, gratis, waardevol) verlaat 70% van je bezoekers je site en komt nooit terug.',
      'Online aanwezigheid zonder positionering werkt als een winkel zonder etalage: mensen passeren, maar weten niet waarvoor ze naar binnen gaan.',
    ],
    changeTitle: 'Wat er verandert als je dit oplost',
    changeItems: [
      'Bezoekers begrijpen binnen 8 seconden wie jij helpt, waarmee, en wat de eerste stap is.',
      'Je genereer leads 24/7,ook wanneer jij niet actief aan het netwerken bent.',
      'Jouw online aanwezigheid versterkt jouw positionering in plaats van ze te verwaterden.',
    ],
    scenario: 'Een boekhouder met 14 jaar ervaring had een website die zijn diensten opsomde maar zijn waarde niet uitlegde. Maandelijks 800 bezoekers, gemiddeld 1 aanvraag. Na een herpositionering met een duidelijke ICP, een concreet probleem en een gratis eerste stap (diagnose): 11 aanvragen per maand op dezelfde traffic.',
    quoteText: '"Online aanwezigheid is geen visitekaartje. Het is je beste verkoper,als je hem de juiste boodschap geeft."',
    primaryCta: 'Download het gratis businessgroei-handboek',
    primaryHref: '/gratis-handboek',
    secondaryCta: 'Bespreek dit in een gratis gesprek',
    secondaryHref: '/#contact',
  },
  verkoop: {
    label: 'Sluitingspercentage',
    headline: 'Goede gesprekken. Te weinig handtekeningen.',
    subline: 'De diagnose toont dat jouw conversieratio ruimte heeft. Je hebt de leads, je hebt de gesprekken,maar ergens in dat traject haakt een deel af. Elke gemiste deal is omzet die je al bijna had.',
    costs: [
      'Een sluitingspercentage van 20% in plaats van 35% betekent bij 10 gesprekken per maand 1,5 gemiste deal,bij een gemiddelde dealwaarde van €5.000 is dat €90.000 per jaar.',
      'Prospects die afhaken kopen vaak wel,bij een concurrent die hun bezwaren beter heeft beantwoord.',
      'Een zwak sluitingsproces dwingt je om meer leads te genereren om dezelfde omzet te halen,wat meer kost en meer druk legt.',
    ],
    changeTitle: 'Wat er verandert als je dit oplost',
    changeItems: [
      'Je verkoopgesprek heeft een duidelijke structuur die vertrouwen opbouwt en bezwaren vroeg adresseert.',
      'Je weet waarom prospects afhaken,en je hebt een antwoord klaar voor elk type bezwaar.',
      'Dezelfde leads leveren meer omzet op, zonder extra marketingbudget.',
    ],
    scenario: 'Een coach met 8 intakegesprekken per maand sloot gemiddeld 2 klanten. Na het analyseren van zijn verkoopgesprekken bleek: hij presenteerde zijn aanbod te vroeg, voor de pijn volledig was vastgesteld. Na het bijstellen van de gespreksstructuur: 5 klanten per maand op dezelfde 8 gesprekken.',
    quoteText: '"Sluiting begint niet bij het aanbod. Het begint bij hoe goed je de pijn van de klant begrijpt voor je iets voorstelt."',
    primaryCta: 'Plan gratis leiderschapsgesprek',
    primaryHref: '/#contact',
    secondaryCta: 'Download het gratis businessgroei-handboek',
    secondaryHref: '/gratis-handboek',
  },
  retentie: {
    label: 'Klantbehoud & groei',
    headline: 'Je werft nieuwe klanten terwijl de waardevolste weglopen.',
    subline: 'De diagnose toont dat retentie een lek is in jouw omzet. Nieuwe klanten aantrekken kost 5 tot 7 keer meer dan een bestaande klant houden. Elke klant die niet terugkomt of niet doorverwijst, is omzet die je dubbel had kunnen verdienen.',
    costs: [
      'Een retentiegraad van 60% versus 80% kan bij een bedrijf van €500.000 omzet het verschil maken van €80.000 tot €120.000 extra jaarlijkse omzet,zonder nieuwe klanten.',
      'Bestaande klanten kopen gemiddeld 67% meer dan nieuwe klanten. Zonder retentiesysteem laat je die herhaalaankopen liggen.',
      'Klanten die vertrekken zonder feedback geven zijn de gevaarlijkste: ze zeggen niets maar schrijven wel reviews of praten negatief in hun netwerk.',
    ],
    changeTitle: 'Wat er verandert als je dit oplost',
    changeItems: [
      'Bestaande klanten voelen dat ze groeien met jou,niet enkel een dienst afnemen.',
      'Je hebt een systeem voor herhaalaankopen, upsells en doorverwijzingen dat automatisch werkt.',
      'Je omzetbasis is stabiel, zelfs in maanden dat de leadgeneratie minder presteert.',
    ],
    scenario: 'Een HR-consultant werkte met éénmalige projecten. Klanten waren tevreden maar kwamen nooit terug, want er was geen aanleiding. Na het introduceren van een kwartaalcheck-in, een klantennieuwsbrief en een gestructureerd referral-programma: 40% van de omzet kwam het volgende jaar uit bestaande klanten en hun doorverwijzingen.',
    quoteText: '"De makkelijkste verkoop is aan iemand die al van je heeft gekocht. Maar alleen als je het systeem hebt om hen te blijven bedienen."',
    primaryCta: 'Download het gratis businessgroei-handboek',
    primaryHref: '/gratis-handboek',
    secondaryCta: 'Bespreek dit in een gratis gesprek',
    secondaryHref: '/#contact',
  },
}

const en: Record<string, LeverData> = {
  tijd: {
    label: 'Owner time freedom',
    headline: 'Your business runs on you. That is not a compliment.',
    subline: 'The diagnostic shows you are the bottleneck. Every decision, every problem, every exception lands on your desk. You have built a business that grows,but keeps you trapped.',
    costs: [
      'Every day you spend on work someone else could handle costs you an average of €500 to €1,500 in lost strategic time.',
      'Businesses where the owner cannot step away are valued 40% lower in a potential sale or exit.',
      'Owner burnout from "doing everything yourself" is the primary reason growth stalls after €1.5M in revenue.',
    ],
    changeTitle: 'What changes when you fix this',
    changeItems: [
      'Your role shifts from operator to architect,you guide, approve and build.',
      'Your team makes decisions without you, within frameworks you have set.',
      'You can take two weeks off without the business coming to a halt.',
    ],
    scenario: 'A contractor with 11 staff worked 60-hour weeks and was the only person who could handle client complaints, approve quotes, and call suppliers. Not because his team was incapable,but because no system had ever been built to transfer those responsibilities. After one quarter: 38 hours per week, two autonomous project managers, and the first real holiday in four years.',
    quoteText: '"Freedom is not a reward for hard work. It is the result of the right structure."',
    primaryCta: 'Book a free leadership call',
    primaryHref: '/#contact',
    secondaryCta: 'Download the free business growth handbook',
    secondaryHref: '/gratis-handboek',
  },
  team: {
    label: 'Leadership & team',
    headline: 'You have people. But you are not leading them yet.',
    subline: 'The diagnostic shows your team depends on you for too much. They are capable,but the structures to work independently are missing. Every day costs you time they could fill themselves.',
    costs: [
      'A team waiting for your input loses an average of 2 to 4 productive hours per day per person,through unclear expectations, waiting, and rework.',
      'Without clear roles and decision frameworks, businesses do not scale: they grow in revenue, but also in chaos.',
      'Good employees leave faster under micromanaging owners than at businesses that pay less.',
    ],
    changeTitle: 'What changes when you fix this',
    changeItems: [
      'Your team knows what is expected,without you explaining it again every week.',
      'Decisions are made at the right level, not always escalated to you.',
      'Onboarding new staff is 3x faster because the systems exist.',
    ],
    scenario: 'A marketing agency with 8 employees had a founder who needed to validate every brief, every client proposal, and every invoice. Not out of distrust,but because the frameworks for her team to work independently simply did not exist. After defining roles, decision levels, and a weekly rhythm: the founder spent 4 hours per week operationally instead of 35.',
    quoteText: '"Leadership is not being present at every decision. It is ensuring the right decisions get made without you."',
    primaryCta: 'Book a free leadership call',
    primaryHref: '/#contact',
    secondaryCta: 'Download the free business growth handbook',
    secondaryHref: '/gratis-handboek',
  },
  opvolging: {
    label: 'Speed to lead',
    headline: 'You are losing clients before you ever had them.',
    subline: 'The diagnostic shows leads are waiting too long for a response. Every hour after first contact reduces conversion likelihood. That is revenue disappearing without you seeing it.',
    costs: [
      'Leads followed up within 5 minutes convert 21x better than leads that wait an hour. That is not theory,it is measured across hundreds of service businesses.',
      'Every lead that goes cold while you or your team are "too busy" costs you the value of two to three deals per month.',
      'Competitors who respond faster win those jobs,not because they are better, but because they were there first.',
    ],
    changeTitle: 'What changes when you fix this',
    changeItems: [
      'Every new enquiry gets a first response within 5 minutes,including evenings and weekends.',
      'Your pipeline fills with warm leads who already feel you are reliable before the first real conversation.',
      'Your close rate improves without needing to become a better salesperson.',
    ],
    scenario: 'A real estate agent received an average of 14 online enquiries per week. He responded after an average of 4 hours. His conversion was 11%. After setting up an automated follow-up sequence with a personal first response within 5 minutes: 28% conversion on the same leads, without increasing ad spend.',
    quoteText: '"The fastest response wins,not the best pitch. Speed is a sales strategy."',
    primaryCta: 'Download the free business growth handbook',
    primaryHref: '/gratis-handboek',
    secondaryCta: 'Discuss this in a free call',
    secondaryHref: '/#contact',
  },
  pipeline: {
    label: 'Pipeline & nurture',
    headline: 'Leads start the journey. Too few arrive.',
    subline: 'The diagnostic shows your pipeline leaks. Leads show interest but drop off,because there is no consistent follow-up, no nurture, no moment where you re-enter their awareness at the right time.',
    costs: [
      '80% of deals require 5 or more touchpoints before a decision. Most businesses stop after 1 or 2 attempts.',
      'A pipeline without nurture leaves an average of 30 to 40% of potential revenue on the table,not from bad leads, but from bad timing.',
      'Leads you do not nurture either buy from someone else, or do not buy at all,even though they would have with the right guidance.',
    ],
    changeTitle: 'What changes when you fix this',
    changeItems: [
      'Your pipeline has a rhythm: every lead gets the right message at the right moment.',
      'Cold leads re-engage without you manually investing time in each one.',
      'Your revenue becomes predictable,you know what is coming at the end of the month.',
    ],
    scenario: 'An IT firm received 40 quote requests per quarter. 12 became clients. The remaining 28 never heard anything again. After setting up a 4-step, 21-day nurture sequence: 19 clients per quarter on the same enquiries,without additional marketing spend.',
    quoteText: '"Most revenue is not in new leads. It is in the leads you already had but never properly followed up."',
    primaryCta: 'Download the free business growth handbook',
    primaryHref: '/gratis-handboek',
    secondaryCta: 'Discuss this in a free call',
    secondaryHref: '/#contact',
  },
  aanwezigheid: {
    label: 'Online presence',
    headline: 'You are being found. But not chosen.',
    subline: 'The diagnostic shows your online presence attracts visitors but does not convert them. The message does not land,or trust is not built fast enough for visitors to take action.',
    costs: [
      'A website with a conversion rate below 2% lets more than 980 out of every 1,000 monthly visitors leave without any interaction.',
      'Without a clear first step (low friction, free, valuable), 70% of your visitors leave and never return.',
      'Online presence without positioning works like a shop without a window display: people walk past but do not know what they are walking into.',
    ],
    changeTitle: 'What changes when you fix this',
    changeItems: [
      'Visitors understand within 8 seconds who you help, with what, and what the first step is.',
      'You generate leads 24/7,even when you are not actively networking.',
      'Your online presence reinforces your positioning instead of diluting it.',
    ],
    scenario: 'An accountant with 14 years of experience had a website that listed his services but never explained his value. 800 monthly visitors, 1 enquiry on average. After repositioning with a clear ICP, a concrete problem, and a free first step (diagnostic): 11 enquiries per month on the same traffic.',
    quoteText: '"Online presence is not a business card. It is your best salesperson,if you give it the right message."',
    primaryCta: 'Download the free business growth handbook',
    primaryHref: '/gratis-handboek',
    secondaryCta: 'Discuss this in a free call',
    secondaryHref: '/#contact',
  },
  verkoop: {
    label: 'Sales close rate',
    headline: 'Good conversations. Not enough signatures.',
    subline: 'The diagnostic shows your conversion rate has room to grow. You have the leads, you have the calls,but somewhere in that journey a portion drops off. Every missed deal is revenue you almost had.',
    costs: [
      'A close rate of 20% instead of 35% means at 10 calls per month 1.5 missed deals,at an average deal value of €5,000 that is €90,000 per year.',
      'Prospects who drop off often do buy,from a competitor who handled their objections better.',
      'A weak closing process forces you to generate more leads to reach the same revenue,which costs more and creates more pressure.',
    ],
    changeTitle: 'What changes when you fix this',
    changeItems: [
      'Your sales conversation has a clear structure that builds trust and addresses objections early.',
      'You know why prospects drop off,and have a prepared response for each type of objection.',
      'The same leads produce more revenue without additional marketing spend.',
    ],
    scenario: 'A coach running 8 intake calls per month was closing an average of 2 clients. After analysing his sales conversations, one pattern emerged: he presented his offer too early, before the pain was fully established. After adjusting the conversation structure: 5 clients per month from the same 8 calls.',
    quoteText: '"Closing starts not with the offer. It starts with how well you understand the client\'s pain before you propose anything."',
    primaryCta: 'Book a free leadership call',
    primaryHref: '/#contact',
    secondaryCta: 'Download the free business growth handbook',
    secondaryHref: '/gratis-handboek',
  },
  retentie: {
    label: 'Client retention & growth',
    headline: 'You are winning new clients while the most valuable ones leave.',
    subline: 'The diagnostic shows retention is a revenue leak. Acquiring new clients costs 5 to 7 times more than keeping an existing one. Every client who does not return or refer is revenue you could have earned twice.',
    costs: [
      'A retention rate of 60% versus 80% can at €500K revenue mean the difference of €80,000 to €120,000 in additional annual revenue,without any new clients.',
      'Existing clients buy an average of 67% more than new ones. Without a retention system, those repeat purchases simply do not happen.',
      'Clients who leave without giving feedback are the most dangerous: they say nothing but leave reviews or speak negatively in their network.',
    ],
    changeTitle: 'What changes when you fix this',
    changeItems: [
      'Existing clients feel they are growing with you,not just consuming a service.',
      'You have a system for repeat purchases, upsells and referrals that runs automatically.',
      'Your revenue base is stable, even in months when lead generation underperforms.',
    ],
    scenario: 'An HR consultant worked exclusively on one-off projects. Clients were satisfied but never returned,because there was no reason to. After introducing a quarterly check-in, a client newsletter, and a structured referral programme: 40% of revenue the following year came from existing clients and their referrals.',
    quoteText: '"The easiest sale is to someone who has already bought from you. But only if you have the system to keep serving them."',
    primaryCta: 'Download the free business growth handbook',
    primaryHref: '/gratis-handboek',
    secondaryCta: 'Discuss this in a free call',
    secondaryHref: '/#contact',
  },
}

// ── Slug mapping ──────────────────────────────────────────────────────────────

const VALID_SLUGS = ['tijd', 'team', 'opvolging', 'pipeline', 'aanwezigheid', 'verkoop', 'retentie']

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ResultaatPage() {
  const { lang } = useLang()
  const isNl = lang === 'nl'
  const params = useParams()
  const slug = params.lever as string

  const data = (isNl ? nl : en)[slug]

  if (!data || !VALID_SLUGS.includes(slug)) {
    return (
      <div style={{ minHeight: '100vh', background: '#faf9f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#555', marginBottom: '1rem' }}>{isNl ? 'Pagina niet gevonden.' : 'Page not found.'}</p>
          <Link href="/diagnostic" style={{ color: '#c96442', fontWeight: 600 }}>{isNl ? 'Herstart diagnose' : 'Restart diagnostic'}</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#faf9f5', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>

      {/* ── Sticky nav ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', background: 'rgba(250,249,245,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(61,57,41,0.08)' }}>
        <LogoFull height={32} />
        <Link href={data.primaryHref} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#c96442', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: 999, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
          {data.primaryCta} <ArrowRight size={14} />
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(160deg, #0a1e10 0%, #163320 60%, #0a1e10 100%)', padding: 'clamp(4rem,10vw,7rem) 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,100,66,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', background: 'rgba(201,100,66,0.15)', border: '1px solid rgba(201,100,66,0.3)', color: '#c96442', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.35rem 1rem', borderRadius: 999, marginBottom: '2rem' }}>
            {isNl ? `Jouw #1 hefboom: ${data.label}` : `Your #1 lever: ${data.label}`}
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.2, color: '#faf9f5', marginBottom: '1.5rem', fontWeight: 400 }}>
            {data.headline}
          </h1>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.75, color: 'rgba(250,249,245,0.65)', marginBottom: '2.5rem', maxWidth: 580 }}>
            {data.subline}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'rgba(250,249,245,0.35)', letterSpacing: '0.02em' }}>
            {isNl ? 'Jouw persoonlijk 30-dagenplan is onderweg naar je inbox.' : 'Your personalised 30-day action plan is on its way to your inbox.'}
          </p>
        </div>
      </section>

      {/* ── Wat dit kost ── */}
      <section style={{ padding: 'clamp(3rem,8vw,5rem) 1.5rem', background: '#faf9f5' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c96442', marginBottom: '1rem' }}>
            {isNl ? 'Wat dit je kost' : 'What this costs you'}
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', color: '#1a1a1a', marginBottom: '2rem', fontWeight: 400 }}>
            {isNl ? 'De prijs van niets doen is hoger dan je denkt.' : 'The cost of doing nothing is higher than you think.'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {data.costs.map((cost, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1.25rem', background: '#fff', borderRadius: 10, border: '1px solid rgba(61,57,41,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: 'rgba(201,100,66,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#c96442', marginTop: 2 }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#3d3929', margin: 0 }}>{cost}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Wat er verandert ── */}
      <section style={{ padding: 'clamp(3rem,8vw,5rem) 1.5rem', background: '#0a1e10' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c96442', marginBottom: '1rem' }}>
            {isNl ? 'De andere kant' : 'The other side'}
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', color: '#faf9f5', marginBottom: '2rem', fontWeight: 400 }}>
            {data.changeTitle}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.changeItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} style={{ color: '#c96442', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(250,249,245,0.8)', margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scenario ── */}
      <section style={{ padding: 'clamp(3rem,8vw,5rem) 1.5rem', background: '#faf9f5' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c96442', marginBottom: '1.5rem' }}>
            {isNl ? 'In de praktijk' : 'In practice'}
          </div>
          <blockquote style={{ borderLeft: '3px solid #c96442', paddingLeft: '1.5rem', margin: 0 }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.8, color: '#3d3929', fontStyle: 'italic', marginBottom: '1.5rem' }}>
              {data.scenario}
            </p>
          </blockquote>
        </div>
      </section>

      {/* ── Quote ── */}
      <section style={{ padding: 'clamp(3rem,8vw,4rem) 1.5rem', background: '#163320' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontStyle: 'italic', color: 'rgba(250,249,245,0.85)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            {data.quoteText}
          </p>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c96442' }}>
            Jeroen · Lead it, Grow
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(4rem,10vw,6rem) 1.5rem', background: '#faf9f5', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c96442', marginBottom: '1rem' }}>
            {isNl ? 'Wat nu?' : 'What now?'}
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: '#1a1a1a', marginBottom: '1rem', fontWeight: 400 }}>
            {isNl ? 'Je weet nu waar de lek zit. De vraag is wat je ermee doet.' : 'You now know where the leak is. The question is what you do with it.'}
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#555', marginBottom: '2.5rem' }}>
            {isNl
              ? 'De meeste zaakvoerders herkennen het probleem al jaren. Het verschil zit niet in het inzicht,het zit in het nemen van de eerste concrete stap.'
              : 'Most business owners have recognised the problem for years. The difference is not the insight,it is taking the first concrete step.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxWidth: 420, margin: '0 auto' }}>
            <Link
              href={data.primaryHref}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#c96442', color: '#fff', padding: '1rem 2rem', borderRadius: 10, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 8px 30px rgba(201,100,66,0.3)' }}
            >
              {data.primaryCta} <ArrowRight size={16} />
            </Link>
            <Link
              href={data.secondaryHref}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'transparent', color: '#c96442', padding: '1rem 2rem', borderRadius: 10, fontWeight: 600, fontSize: '1rem', textDecoration: 'none', border: '1.5px solid #c96442' }}
            >
              {data.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '2rem 1.5rem', textAlign: 'center', background: '#051209', color: 'rgba(250,249,245,0.3)', fontSize: '0.75rem' }}>
        © {new Date().getFullYear()} Lead it, Grow · leaditgrow.com · leaditgrow.be
      </footer>

    </div>
  )
}
