'use client'

import { ArrowRight, CheckCircle2, BookOpen, ChevronLeft } from 'lucide-react'
import { LogoMark } from '@/components/ui/logo-mark'
import { useLang } from '@/components/lang-context'

type Lang = 'nl' | 'en'

// ── STRIPE PAYMENT LINK ──────────────────────────────────────────────────────
// Create a Payment Link in your Stripe dashboard (Products → Payment Links)
// Set price to €97, product name "Het Businessgroei Actiehandboek"
// Then paste the URL here:
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/REPLACE_WITH_YOUR_LINK'
// ────────────────────────────────────────────────────────────────────────────

const LEVERS = [
  {
    num: '01',
    nl: { title: 'Bereken jouw omzetlek', desc: 'Ontdek hoeveel gemiste leads jou elke maand kosten. Eén berekening die alles in perspectief zet.' },
    en: { title: 'Calculate your revenue leak', desc: 'Discover how much missed leads cost you every month. One calculation that puts everything in perspective.' },
  },
  {
    num: '02',
    nl: { title: 'Speed-to-Lead', desc: 'De 5-minutenregel die jouw sluitingskans 21x verhoogt. Scripts en automatisering inbegrepen.' },
    en: { title: 'Speed-to-Lead', desc: 'The 5-minute rule that multiplies your close rate 21x. Scripts and automation included.' },
  },
  {
    num: '03',
    nl: { title: 'Pipeline Follow-Up', desc: 'De 5-staps opvolgsequentie die stille leads terugwint, zonder opdringerig te klinken.' },
    en: { title: 'Pipeline Follow-Up', desc: 'The 5-step follow-up sequence that wins back silent leads, without sounding pushy.' },
  },
  {
    num: '04',
    nl: { title: 'Online aanwezigheid', desc: 'Jouw website als conversiemachine. Welke tracking je nodig hebt, wat je moet meten en hoe je A/B-test zonder technische kennis.' },
    en: { title: 'Online presence', desc: 'Your website as a conversion machine. What tracking you need, what to measure and how to A/B test without technical skills.' },
  },
  {
    num: '05',
    nl: { title: 'Sluitingspercentage', desc: 'Het discovery-kader dat kwalificeert en sluit. Omgaan met prijsbezwaren, "ik denk er over na" en twijfelaars.' },
    en: { title: 'Close rate', desc: 'The discovery framework that qualifies and closes. Handling price objections, "let me think about it" and hesitators.' },
  },
  {
    num: '06',
    nl: { title: 'Groeimotoren', desc: 'Doorverwijzingen activeren, de juiste GTM-aanpak kiezen en een droomklantenlijst bouwen die jouw pipeline vult.' },
    en: { title: 'Growth engines', desc: 'Activating referrals, choosing the right GTM approach and building a dream client list that fills your pipeline.' },
  },
  {
    num: '07',
    nl: { title: '30-dagenplan + scripts', desc: 'Week-voor-week acties, kopieerbare scripts en een zelfscore-tool. Klaar om maandag te beginnen.' },
    en: { title: '30-day plan + scripts', desc: 'Week-by-week actions, copy-paste scripts and a self-score tool. Ready to start Monday.' },
  },
]

const INCLUDES = [
  { nl: '7-hefboom diagnose: scoor jezelf voor je begint', en: '7-lever diagnostic: score yourself before you start' },
  { nl: 'Volledige scripts voor elke opvolgstap', en: 'Full scripts for every follow-up step' },
  { nl: '30-dagenplan met week-voor-week acties', en: '30-day plan with week-by-week actions' },
  { nl: 'Bewezen GTM-kader voor servicebedrijven', en: 'Proven GTM framework for service businesses' },
  { nl: 'Droomklantenlijst template', en: 'Dream client list template' },
  { nl: 'Revenue leak calculator', en: 'Revenue leak calculator' },
  { nl: 'Digitale PDF, direct toegankelijk', en: 'Digital PDF, instant access' },
]

function HeroTitle({ lang }: { lang: Lang }) {
  if (lang === 'nl') return (
    <>Breng leads binnen op autopilot, zodat je klanten je{' '}
    <em style={{ color: '#c96442' }}>volledige aandacht</em> kan geven.</>
  )
  return (
    <>Handle your leads on autopilot, so your customers get your{' '}
    <em style={{ color: '#c96442' }}>full attention</em>.</>
  )
}

export default function ActiehandboekPage() {
  const { lang, t } = useLang()

  return (
    <div style={{ background: '#faf9f5', color: '#3d3929', fontFamily: 'var(--font-sans)' }}>

      {/* ── MINIMAL NAV ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(250,249,245,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(61,57,41,0.08)' }}
      >
        <a href="/" className="flex items-center gap-2.5 text-sm font-medium opacity-60 hover:opacity-100 transition-opacity" style={{ color: '#3d3929' }}>
          <ChevronLeft className="w-4 h-4" />
          {t('Terug naar leaditgrow.be', 'Back to leaditgrow.com')}
        </a>
        <LogoMark size={28} />
        <a
          href={STRIPE_PAYMENT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-px"
          style={{ background: '#c96442', boxShadow: '0 4px 16px rgba(201,100,66,0.35)' }}
        >
          {t('Koop nu · €97', 'Buy now · €97')}
        </a>
      </nav>

      {/* ── HERO ── */}
      <section
        className="relative px-6 py-24 sm:py-32 flex flex-col items-center text-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a1e10 0%, #163320 60%, #0a1e10 100%)' }}
      >
        {/* ambient glow */}
        <div
          className="absolute"
          style={{ top: '-80px', right: '-80px', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,100,66,0.13) 0%, transparent 65%)', pointerEvents: 'none' }}
        />
        <div
          className="absolute"
          style={{ bottom: '-60px', left: '-60px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,100,66,0.07) 0%, transparent 65%)', pointerEvents: 'none' }}
        />

        <div
          className="relative z-10 inline-block text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8"
          style={{ color: '#c96442', background: 'rgba(201,100,66,0.12)', border: '1px solid rgba(201,100,66,0.25)' }}
        >
          {t('Actiehandboek · €97', 'Action Manual · €97')}
        </div>

        <h1
          className="relative z-10 font-semibold leading-tight mb-6 max-w-3xl"
          style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 6vw, 72px)', color: '#faf9f5', fontWeight: 400 }}
        >
          <HeroTitle lang={lang} />
        </h1>

        <p
          className="relative z-10 text-lg leading-relaxed mb-10 max-w-xl"
          style={{ color: 'rgba(250,249,245,0.6)' }}
        >
          {t(
            'Het exacte kader, de scripts en het 30-dagenplan om de speed-to-lead kloof te dichten en gemiste leads om te zetten in voorspelbare omzet.',
            'The exact framework, scripts and 30-day plan to close the speed-to-lead gap and turn missed leads into predictable revenue.'
          )}
        </p>

        <div className="relative z-10 flex flex-wrap gap-4 justify-center">
          <a
            href={STRIPE_PAYMENT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: '#c96442', boxShadow: '0 8px 32px rgba(201,100,66,0.45)' }}
          >
            {t('Download voor €97', 'Download for €97')}
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#inhoud"
            className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all hover:opacity-90"
            style={{ color: '#faf9f5', background: 'rgba(250,249,245,0.08)', border: '1px solid rgba(250,249,245,0.18)' }}
          >
            {t('Bekijk de inhoud', 'See what\'s inside')}
          </a>
        </div>

        <p className="relative z-10 mt-6 text-xs" style={{ color: 'rgba(250,249,245,0.3)' }}>
          {t('14 dagen terugbetalingsgarantie · Directe toegang na betaling', '14-day money-back guarantee · Instant access after payment')}
        </p>

        {/* ebook mockup */}
        <div
          className="relative z-10 mt-16 rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: 'min(340px, 90vw)',
            aspectRatio: '3/4',
            background: 'linear-gradient(160deg, #0f2a18 0%, #0a1e10 100%)',
            border: '1px solid rgba(201,100,66,0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2rem',
          }}
        >
          <div style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(250,249,245,0.3)' }}>
            Lead it, Grow · Editie 2026
          </div>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c96442', marginBottom: '1rem' }}>
              {t('Meer leads · Op autopilot · 30-dagenplan', 'More leads · On autopilot · 30-day plan')}
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 400, lineHeight: 0.95, color: '#faf9f5', letterSpacing: '-0.02em' }}>
              Het<br /><em style={{ color: '#c96442' }}>Businessgroei</em><br />Actiehandboek
            </div>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,249,245,0.25)' }}>
            {t('7-Hefboom Diagnose · GTM-kader · Scripts', '7-Lever Diagnostic · GTM Framework · Scripts')}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF / STAT ROW ── */}
      <section className="px-6 py-12 border-b" style={{ borderColor: 'rgba(61,57,41,0.1)' }}>
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { stat: '21×', label: t('hogere sluitingskans bij reactie binnen 5 min', 'higher close rate when you respond within 5 min') },
            { stat: '80%', label: t('van deals gaan naar de verkoper die het eerst reageert', 'of deals go to the vendor who responds first') },
            { stat: '30 dgn', label: t('om een volledig leadsysteem op te bouwen', 'to build a full lead system from scratch') },
          ].map(({ stat, label }) => (
            <div key={stat}>
              <div className="text-3xl sm:text-4xl font-semibold mb-1.5" style={{ color: '#c96442', fontFamily: 'var(--font-serif)' }}>{stat}</div>
              <div className="text-xs leading-relaxed" style={{ color: '#83827d' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#c96442' }}>
          {t('Voor wie', 'Who it\'s for')}
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8 leading-tight">
          {t('Je bent goed in wat je doet. Maar groei loopt vast.', 'You\'re good at what you do. But growth is stalling.')}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            t('Leads nemen contact op maar haken af voordat ze klant worden', 'Leads reach out but drop off before becoming clients'),
            t('Je reageert te laat, te weinig of niet consequent op aanvragen', 'You respond too late, too rarely or inconsistently to enquiries'),
            t('Je pipeline is afhankelijk van jouw persoonlijke energie en beschikbaarheid', 'Your pipeline depends on your personal energy and availability'),
            t('Je hebt geen systeem voor opvolging, alleen goede bedoelingen', 'You have no follow-up system, only good intentions'),
            t('Je weet niet welke kanalen werken of hoe je dat meet', 'You don\'t know which channels work or how to measure that'),
            t('Je wil groeien maar bent de bottleneck in je eigen bedrijf', 'You want to grow but are the bottleneck in your own business'),
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background: '#f5f3ee', border: '1px solid rgba(61,57,41,0.08)' }}
            >
              <div className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center" style={{ background: 'rgba(201,100,66,0.12)' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c96442' }} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#535146' }}>{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT'S INSIDE ── */}
      <section id="inhoud" className="px-6 py-20" style={{ background: '#f0ede6' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#c96442' }}>
            {t('Inhoud', 'Contents')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-12 leading-tight">
            {t('7 groeihefbomen. Elke een directe actie.', '7 growth levers. Each one a direct action.')}
          </h2>
          <div className="space-y-3">
            {LEVERS.map((lever) => (
              <div
                key={lever.num}
                className="flex items-start gap-5 p-5 rounded-xl"
                style={{ background: '#faf9f5', border: '1px solid rgba(61,57,41,0.08)' }}
              >
                <div
                  className="text-xs font-bold flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ fontFamily: 'monospace', background: 'rgba(201,100,66,0.1)', color: '#c96442' }}
                >
                  {lever.num}
                </div>
                <div>
                  <div className="font-semibold mb-1">{t(lever.nl.title, lever.en.title)}</div>
                  <div className="text-sm leading-relaxed" style={{ color: '#83827d' }}>{t(lever.nl.desc, lever.en.desc)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#c96442' }}>
          {t('Wat je krijgt', 'What you get')}
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-10 leading-tight">
          {t('Alles wat je nodig hebt om maandag te beginnen.', 'Everything you need to start Monday.')}
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {INCLUDES.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#c96442' }} />
              <span className="text-sm leading-relaxed" style={{ color: '#535146' }}>{t(item.nl, item.en)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="px-6 py-16" style={{ background: '#0a1e10' }}>
        <div className="max-w-2xl mx-auto text-center">
          <BookOpen className="w-8 h-8 mx-auto mb-6" style={{ color: '#c96442', opacity: 0.7 }} />
          <blockquote
            className="text-xl sm:text-2xl leading-relaxed mb-6"
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'rgba(250,249,245,0.85)' }}
          >
            {t(
              '"Dit handboek gaat niet over werken. Het gaat over systemen bouwen die werken terwijl jij dat niet doet."',
              '"This manual is not about working. It\'s about building systems that work while you don\'t."'
            )}
          </blockquote>
          <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#c96442', fontFamily: 'monospace' }}>
            Jeroen · Lead it, Grow
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24 flex flex-col items-center text-center">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#c96442' }}>
          {t('Klaar om te beginnen?', 'Ready to start?')}
        </div>
        <h2
          className="text-3xl sm:text-4xl font-semibold mb-4 max-w-xl leading-tight"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 400 }}
        >
          {t('€97. Directe toegang. 30 dagen resultaat.', '€97. Instant access. 30 days to results.')}
        </h2>
        <p className="text-base mb-10 max-w-md leading-relaxed" style={{ color: '#83827d' }}>
          {t(
            'Inclusief alle scripts, het 30-dagenplan en de GTM-kader. Als het niks oplevert binnen 14 dagen, krijg je je geld terug.',
            'Includes all scripts, the 30-day plan and the GTM framework. If it delivers nothing within 14 days, you get your money back.'
          )}
        </p>
        <a
          href={STRIPE_PAYMENT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-10 py-5 rounded-full text-lg font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 mb-4"
          style={{ background: '#c96442', boxShadow: '0 12px 40px rgba(201,100,66,0.4)' }}
        >
          {t('Download het Actiehandboek · €97', 'Download the Action Manual · €97')}
          <ArrowRight className="w-5 h-5" />
        </a>
        <p className="text-xs" style={{ color: '#b4b2a7' }}>
          {t('14 dagen terugbetalingsgarantie · PDF · Direct beschikbaar', '14-day money-back guarantee · PDF · Instant access')}
        </p>

        {/* upsell nudge */}
        <div
          className="mt-16 p-6 rounded-2xl text-left max-w-md w-full"
          style={{ background: '#f5f3ee', border: '1px solid rgba(61,57,41,0.1)' }}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#c96442' }}>
            {t('Wil je meer dan een boek?', 'Want more than a book?')}
          </div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#535146' }}>
            {t(
              'Stuur een e-mail naar jeroen@leaditgrow.be met onderwerp "Strategiegesprek" voor een persoonlijk gesprek over jouw leadsysteem. Of vraag een gratis Website Tracking Audit aan met onderwerp "Tracking Audit".',
              'Send an email to jeroen@leaditgrow.com with subject "Strategy Call" for a personal conversation about your lead system. Or request a free Website Tracking Audit with subject "Tracking Audit".'
            )}
          </p>
          <a
            href={t('mailto:jeroen@leaditgrow.be?subject=Strategiegesprek', 'mailto:jeroen@leaditgrow.com?subject=Strategy Call')}
            className="text-sm font-semibold underline underline-offset-4"
            style={{ color: '#c96442' }}
          >
            {t('jeroen@leaditgrow.be', 'jeroen@leaditgrow.com')}
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-8 text-center text-xs"
        style={{ background: '#051209', color: 'rgba(250,249,245,0.3)' }}
      >
        © {new Date().getFullYear()} Lead it, Grow · leaditgrow.com · leaditgrow.be
      </footer>
    </div>
  )
}
