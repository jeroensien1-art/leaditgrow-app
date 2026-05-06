'use client'

import { useLang } from '@/components/lang-context'
import { Nav } from '@/components/nav'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type LeverContent = {
  label: string
  headline: string
  pain: string
  insight: string
  primaryCta: string
  primaryHref: string
  secondaryCta: string
  secondaryHref: string
}

const contentNl: Record<string, LeverContent> = {
  time: {
    label: 'Vrijheid van de zaakvoerder',
    headline: 'Jouw bedrijf draait op jou — en dat is het probleem.',
    pain: 'De diagnose toont dat jij de bottleneck bent. Elke beslissing, elk probleem, elke klant: het belandt bij jou. Je hebt een bedrijf gebouwd dat groeit, maar dat jou gevangen houdt.',
    insight: 'Dit lost zich niet op door harder te werken of meer te delegeren. Het vraagt een structuurverandering: hoe jouw rol eruitziet, wat je overdraagt, en hoe je dat doet zonder chaos.',
    primaryCta: 'Plan gratis leiderschapsgesprek',
    primaryHref: '/#contact',
    secondaryCta: 'Download het gratis businessgroei-handboek',
    secondaryHref: '/gratis-handboek',
  },
  leadership: {
    label: 'Leiderschap & team',
    headline: 'Je hebt een team, maar je doet nog alles zelf.',
    pain: 'De diagnose toont dat jouw team afhankelijk van jou is voor te veel. Ze zijn bekwaam, maar de systemen en structuren om zelfstandig te werken ontbreken. Elke dag kost jou tijd die ze zelf zouden kunnen invullen.',
    insight: 'Leiderschap is geen persoonlijkheidskwestie. Het is een systeem: duidelijke rollen, beslissingskaders, en feedbackloops die werken zonder dat jij er middenin zit.',
    primaryCta: 'Plan gratis leiderschapsgesprek',
    primaryHref: '/#contact',
    secondaryCta: 'Download het gratis businessgroei-handboek',
    secondaryHref: '/gratis-handboek',
  },
  speed: {
    label: 'Snelheid van leadopvolging',
    headline: 'Je verliest klanten voordat je ze ooit hebt gehad.',
    pain: 'De diagnose toont dat leads te lang wachten op een reactie. Elk uur dat verstrijkt na een eerste contact verlaagt de kans op conversie met gemiddeld 10x. Dat is omzet die verdwijnt zonder dat je het ziet.',
    insight: 'Dit is een van de snelst op te lossen hefbomen. Met de juiste opvolgflow — geautomatiseerd of niet — pak je de laaghangend fruit van jouw pipeline aan.',
    primaryCta: 'Download het gratis businessgroei-handboek',
    primaryHref: '/gratis-handboek',
    secondaryCta: 'Bespreek dit in een gratis gesprek',
    secondaryHref: '/#contact',
  },
  pipeline: {
    label: 'Pipeline & nurture',
    headline: 'Leads komen binnen, maar te weinig worden klanten.',
    pain: 'De diagnose toont dat jouw pipeline lekt. Leads starten het traject maar vallen ergens af — omdat er geen consequente opvolging is, geen nurture, geen moment waarop jij opnieuw in beeld komt.',
    insight: 'Een pipeline zonder nurture is een zeef. De fix is eenvoudiger dan je denkt: een helder systeem van contactmomenten dat werkt zonder dat jij het elke dag moet sturen.',
    primaryCta: 'Download het gratis businessgroei-handboek',
    primaryHref: '/gratis-handboek',
    secondaryCta: 'Bespreek dit in een gratis gesprek',
    secondaryHref: '/#contact',
  },
  presence: {
    label: 'Online aanwezigheid',
    headline: 'Je wordt gevonden, maar niet begrepen.',
    pain: 'De diagnose toont dat jouw online aanwezigheid niet converteert zoals het zou moeten. Bezoekers komen, maar de boodschap raakt hen niet — of vertrouwen wordt niet snel genoeg opgebouwd.',
    insight: 'Online aanwezigheid draait niet om zichtbaarheid alleen. Het draait om de juiste boodschap, op het juiste moment, voor de juiste persoon. En dat begint met begrijpen wie jij precies helpt.',
    primaryCta: 'Download het gratis businessgroei-handboek',
    primaryHref: '/gratis-handboek',
    secondaryCta: 'Bespreek dit in een gratis gesprek',
    secondaryHref: '/#contact',
  },
  close: {
    label: 'Sluitingspercentage',
    headline: 'Goede gesprekken, maar te weinig worden klant.',
    pain: 'De diagnose toont dat jouw conversieratio ruimte heeft. Je hebt de leads, je hebt de gesprekken — maar ergens in dat traject haakt een deel af. Dat kost je meer dan je denkt.',
    insight: 'Sluiting is zelden een verkooptechniek-probleem. Vaker is het een positioneringsprobleem: de lead begrijpt de waarde niet volledig, of de overgang van gesprek naar beslissing is te groot.',
    primaryCta: 'Plan gratis leiderschapsgesprek',
    primaryHref: '/#contact',
    secondaryCta: 'Download het gratis businessgroei-handboek',
    secondaryHref: '/gratis-handboek',
  },
  retention: {
    label: 'Klantbehoud & groei',
    headline: 'Je trekt nieuwe klanten aan terwijl bestaande weglopen.',
    pain: 'De diagnose toont dat klantbehoud een lek is in jouw omzet. Nieuwe klanten werven kost 5 tot 7 keer meer dan een bestaande klant houden. Elke klant die niet terugkomt of niet doorverwijst, is omzet die je dubbel had kunnen verdienen.',
    insight: 'Retentie is geen klantenservice-probleem. Het is een systeemprobleem: hoe zorg je dat klanten het gevoel hebben dat ze groeien met jou, niet enkel een dienst afnemen?',
    primaryCta: 'Download het gratis businessgroei-handboek',
    primaryHref: '/gratis-handboek',
    secondaryCta: 'Bespreek dit in een gratis gesprek',
    secondaryHref: '/#contact',
  },
}

const contentEn: Record<string, LeverContent> = {
  time: {
    label: 'Owner time freedom',
    headline: 'Your business runs on you — and that is the problem.',
    pain: 'The diagnostic shows you are the bottleneck. Every decision, every problem, every client lands on your desk. You have built a business that grows, but keeps you trapped.',
    insight: 'This does not fix itself by working harder or delegating more. It requires a structural change: what your role looks like, what you hand over, and how to do it without creating chaos.',
    primaryCta: 'Book a free leadership call',
    primaryHref: '/#contact',
    secondaryCta: 'Download the free business growth handbook',
    secondaryHref: '/gratis-handboek',
  },
  leadership: {
    label: 'Leadership & team',
    headline: 'You have a team, but you are still doing everything.',
    pain: 'The diagnostic shows your team depends on you for too much. They are capable, but the systems and structures to work independently are missing. Every day costs you time they could fill themselves.',
    insight: 'Leadership is not a personality question. It is a system: clear roles, decision frameworks, and feedback loops that work without you in the middle.',
    primaryCta: 'Book a free leadership call',
    primaryHref: '/#contact',
    secondaryCta: 'Download the free business growth handbook',
    secondaryHref: '/gratis-handboek',
  },
  speed: {
    label: 'Speed to lead',
    headline: 'You are losing clients before you ever had them.',
    pain: 'The diagnostic shows leads wait too long for a response. Every hour after first contact reduces conversion likelihood by 10x on average. That is revenue disappearing without you seeing it.',
    insight: 'This is one of the fastest levers to fix. With the right follow-up flow — automated or not — you capture the low-hanging fruit of your pipeline immediately.',
    primaryCta: 'Download the free business growth handbook',
    primaryHref: '/gratis-handboek',
    secondaryCta: 'Discuss this in a free call',
    secondaryHref: '/#contact',
  },
  pipeline: {
    label: 'Pipeline & nurture',
    headline: 'Leads come in, but too few become clients.',
    pain: 'The diagnostic shows your pipeline leaks. Leads start the journey but drop off — because there is no consistent follow-up, no nurture, no moment where you re-enter their awareness.',
    insight: 'A pipeline without nurture is a sieve. The fix is simpler than you think: a clear system of touchpoints that runs without you steering it every day.',
    primaryCta: 'Download the free business growth handbook',
    primaryHref: '/gratis-handboek',
    secondaryCta: 'Discuss this in a free call',
    secondaryHref: '/#contact',
  },
  presence: {
    label: 'Online presence',
    headline: 'You are being found, but not understood.',
    pain: 'The diagnostic shows your online presence is not converting as it should. Visitors arrive, but the message does not land — or trust is not built fast enough.',
    insight: 'Online presence is not just about visibility. It is about the right message, at the right moment, for the right person. And that starts with deeply understanding who you help.',
    primaryCta: 'Download the free business growth handbook',
    primaryHref: '/gratis-handboek',
    secondaryCta: 'Discuss this in a free call',
    secondaryHref: '/#contact',
  },
  close: {
    label: 'Sales close rate',
    headline: 'Good conversations, but too few become clients.',
    pain: 'The diagnostic shows your conversion rate has room to grow. You have the leads, you have the calls — but somewhere in that journey a portion drops off. That costs more than you think.',
    insight: 'Closing is rarely a sales technique problem. More often it is a positioning problem: the lead does not fully understand the value, or the gap between conversation and decision is too large.',
    primaryCta: 'Book a free leadership call',
    primaryHref: '/#contact',
    secondaryCta: 'Download the free business growth handbook',
    secondaryHref: '/gratis-handboek',
  },
  retention: {
    label: 'Client retention & growth',
    headline: 'You are winning new clients while existing ones leave.',
    pain: 'The diagnostic shows retention is a revenue leak. Acquiring new clients costs 5 to 7 times more than keeping an existing one. Every client who does not return or refer is revenue you could have earned twice.',
    insight: 'Retention is not a customer service problem. It is a systems problem: how do you ensure clients feel they are growing with you, not just consuming a service?',
    primaryCta: 'Download the free business growth handbook',
    primaryHref: '/gratis-handboek',
    secondaryCta: 'Discuss this in a free call',
    secondaryHref: '/#contact',
  },
}

const LEVER_SLUGS: Record<string, string> = {
  time: 'tijd', leadership: 'team', speed: 'opvolging',
  pipeline: 'pipeline', presence: 'aanwezigheid', close: 'verkoop', retention: 'retentie',
}
const SLUG_TO_KEY: Record<string, string> = Object.fromEntries(
  Object.entries(LEVER_SLUGS).map(([k, v]) => [v, k])
)

export default function ResultaatPage() {
  const { nl } = useLang()
  const params = useParams()
  const slug = params.lever as string

  const key = SLUG_TO_KEY[slug] ?? slug
  const content = (nl ? contentNl : contentEn)[key]

  if (!content) {
    return (
      <>
        <Nav />
        <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f7f2' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#555' }}>{nl ? 'Pagina niet gevonden.' : 'Page not found.'}</p>
            <Link href="/diagnostic" style={{ color: '#c95d3b', fontWeight: 600 }}>{nl ? 'Herstart diagnose' : 'Restart diagnostic'}</Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Nav />
      <main style={{ background: '#f9f7f2', minHeight: '100vh', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>

          {/* Eyebrow */}
          <div style={{ display: 'inline-block', background: '#c95d3b', color: '#fff', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.3rem 0.9rem', borderRadius: 4, marginBottom: '1.5rem' }}>
            {nl ? `Jouw #1 hefboom: ${content.label}` : `Your #1 lever: ${content.label}`}
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', lineHeight: 1.25, marginBottom: '1.5rem', color: '#1a1a1a' }}>
            {content.headline}
          </h1>

          {/* Pain */}
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#444', marginBottom: '1.25rem' }}>
            {content.pain}
          </p>

          {/* Insight */}
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#444', marginBottom: '2.5rem', borderLeft: '3px solid #c95d3b', paddingLeft: '1.25rem' }}>
            {content.insight}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxWidth: 400 }}>
            <Link
              href={content.primaryHref}
              style={{ display: 'block', background: '#c95d3b', color: '#fff', padding: '0.9rem 1.75rem', borderRadius: 8, fontWeight: 700, textDecoration: 'none', textAlign: 'center', fontSize: '1rem' }}
            >
              {content.primaryCta}
            </Link>
            <Link
              href={content.secondaryHref}
              style={{ display: 'block', background: 'transparent', color: '#c95d3b', padding: '0.9rem 1.75rem', borderRadius: 8, fontWeight: 600, textDecoration: 'none', textAlign: 'center', fontSize: '1rem', border: '1.5px solid #c95d3b' }}
            >
              {content.secondaryCta}
            </Link>
          </div>

          {/* Rapport onderweg */}
          <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#888' }}>
            {nl
              ? 'Jouw persoonlijk 30-dagenplan is onderweg naar je inbox. Check ook je spammap.'
              : 'Your personalised 30-day action plan is on its way to your inbox. Check your spam folder too.'}
          </p>

        </div>
      </main>
    </>
  )
}
