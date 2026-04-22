'use client'

import { useState, useMemo } from 'react'
import { ArrowRight, TrendingDown } from 'lucide-react'
import { Nav } from '@/components/nav'
import { useLang } from '@/components/lang-context'

// ── Lookup tables ──────────────────────────────────────────────────────────────

const leadsMap: Record<string, number> = {
  'Fewer than 5': 3,      'Minder dan 5': 3,
  '5 to 20': 12,          '5 tot 20': 12,
  '20 to 50': 35,         '20 tot 50': 35,
  'More than 50': 65,     'Meer dan 50': 65,
}
const dealMap: Record<string, number> = {
  'Under €1,000': 600,          'Onder €1.000': 600,
  '€1,000 to €5,000': 2500,    '€1.000 tot €5.000': 2500,
  '€5,000 to €20,000': 10000,  '€5.000 tot €20.000': 10000,
  'Over €20,000': 25000,        'Boven €20.000': 25000,
}
const speedLossMap: Record<string, number> = {
  'Within 5 minutes, automatically': 0,     'Binnen 5 minuten, automatisch': 0,
  'Within 1 hour, usually': 0.18,           'Binnen 1 uur, meestal': 0.18,
  'Same day, when there is time': 0.38,     'Dezelfde dag, als er tijd is': 0.38,
  'Next day or later': 0.56,               'Volgende dag of later': 0.56,
}
const followupLossMap: Record<string, number> = {
  'Automated sequence (5+ follow-ups)': 0,  'Geautomatiseerde reeks (5+ keer)': 0,
  '3 to 4 times manually': 0.22,            '3 tot 4 keer manueel': 0.22,
  '1 to 2 times, then leave it': 0.46,      '1 tot 2 keer, dan loslaten': 0.46,
  'Rarely or never follow up': 0.65,        'Zelden of nooit': 0.65,
}

function calcLeak(leads: string, deal: string, speed: string, followup: string) {
  const l = leadsMap[leads] ?? 0
  const d = dealMap[deal] ?? 0
  const sLoss = speedLossMap[speed] ?? 0
  const fLoss = followupLossMap[followup] ?? 0
  const base = l * d
  const speedLeak = base * sLoss
  const followupLeak = (base - speedLeak) * fLoss
  const monthly = Math.round((speedLeak + followupLeak) / 500) * 500
  return {
    monthly,
    annual: monthly * 12,
    speedLeak: Math.round(speedLeak / 500) * 500,
    followupLeak: Math.round(followupLeak / 500) * 500,
  }
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const css = `
  :root {
    --rust: #c96442;
    --rust-light: rgba(201,100,66,.08);
    --rust-border: rgba(201,100,66,.25);
    --ink: #3d3929;
    --ink-mid: #535146;
    --ink-muted: #83827d;
    --ink-faint: #b0aea8;
    --cream: #f3f1eb;
    --warm-white: #faf9f5;
    --border: rgba(61,57,41,.1);
    --border-mid: rgba(61,57,41,.15);
    --shadow-card: 0 2px 8px rgba(0,0,0,.06);
    --font-display: var(--font-serif);
    --green: #15803d;
  }
  .calc-page { min-height:100svh; background:#faf9f5; padding-top:80px; padding-bottom:60px; }
  .calc-wrap { max-width:520px; margin:0 auto; padding:0 20px; }
  .calc-card { background:#fff; border-radius:16px; box-shadow:0 8px 40px rgba(0,0,0,.1); border:1px solid var(--border); overflow:hidden; }
  .calc-top { height:4px; background:linear-gradient(90deg,var(--rust) 0%,#e8845e 100%); }
  .calc-inner { padding:2rem 2rem 2rem; }
  .eyebrow { font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--rust); margin-bottom:10px; }
  .headline { font-family:var(--font-display); font-size:22px; font-weight:700; color:var(--ink); line-height:1.3; margin-bottom:6px; }
  .subline { font-size:14px; color:var(--ink-muted); line-height:1.6; margin-bottom:1.8rem; }
  .q-label { font-size:13px; font-weight:600; color:var(--ink); margin-bottom:8px; }
  .q-group { margin-bottom:1.4rem; }
  .opts { display:flex; flex-direction:column; gap:6px; }
  .opt { background:var(--cream); border:1.5px solid transparent; border-radius:9px; padding:10px 14px; cursor:pointer; text-align:left; font-size:13px; color:var(--ink-mid); transition:all .15s; }
  .opt:hover { border-color:var(--border-mid); background:var(--warm-white); }
  .opt.sel { border-color:var(--rust); background:var(--rust-light); color:var(--ink); font-weight:500; }
  .btn-primary { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:13px 20px; background:var(--rust); color:#fff; border:none; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; transition:opacity .15s; margin-top:1.2rem; }
  .btn-primary:hover { opacity:.9; }
  .btn-primary:disabled { opacity:.5; cursor:not-allowed; }
  .btn-ghost { display:flex; align-items:center; justify-content:center; width:100%; padding:11px; background:transparent; border:1.5px solid var(--border-mid); border-radius:10px; font-size:13px; color:var(--ink-muted); cursor:pointer; transition:opacity .15s; margin-top:8px; }
  .btn-ghost:hover { opacity:.7; }
  .result-hero { background:var(--ink); border-radius:12px; padding:1.6rem; margin-bottom:1.4rem; }
  .rh-eyebrow { font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,.4); margin-bottom:8px; }
  .rh-amount { font-family:var(--font-display); font-size:52px; font-weight:700; color:var(--rust); line-height:1; margin-bottom:4px; }
  .rh-period { font-size:14px; color:rgba(255,255,255,.45); }
  .rh-annual { font-size:13px; color:rgba(255,255,255,.6); margin-top:6px; }
  .breakdown { display:flex; flex-direction:column; gap:8px; margin-bottom:1.4rem; }
  .bk-row { display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--cream); border-radius:9px; }
  .bk-label { font-size:12px; color:var(--ink-mid); }
  .bk-value { font-size:13px; font-weight:600; color:var(--ink); }
  .cta-box { background:var(--cream); border-radius:12px; padding:1.4rem; border:1px solid var(--border); }
  .cta-title { font-family:var(--font-display); font-size:16px; font-weight:700; color:var(--ink); margin-bottom:6px; }
  .cta-sub { font-size:12px; color:var(--ink-muted); line-height:1.6; margin-bottom:1rem; }
  .field-label { font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-muted); margin-bottom:6px; display:block; }
  .text-input { width:100%; padding:11px 13px; background:#fff; border:1.5px solid var(--border-mid); border-radius:9px; font-size:13px; color:var(--ink); outline:none; transition:border-color .15s; margin-bottom:8px; box-sizing:border-box; }
  .text-input:focus { border-color:var(--rust); }
  .divider { display:flex; align-items:center; gap:10px; margin:12px 0; }
  .divider-line { flex:1; height:1px; background:var(--border); }
  .divider-text { font-size:11px; color:var(--ink-faint); }
  .btn-green { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:13px 20px; background:var(--green); color:#fff; border:none; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; transition:opacity .15s; }
  .btn-green:hover { opacity:.9; }
  .thanks-wrap { text-align:center; padding:.5rem 0; }
  .thanks-circle { width:56px; height:56px; border-radius:50%; background:rgba(201,100,66,.1); display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; font-size:22px; }
  .progress-bar { height:3px; background:var(--cream); border-radius:2px; margin-bottom:1.6rem; overflow:hidden; }
  .progress-fill { height:100%; background:var(--rust); border-radius:2px; transition:width .4s ease; }
`

type Step = 'q1' | 'q2' | 'results' | 'thanks'

export default function CalculatorPage() {
  const { lang } = useLang()
  const nl = lang === 'nl'

  const [step, setStep] = useState<Step>('q1')
  const [leads, setLeads] = useState('')
  const [deal, setDeal] = useState('')
  const [speed, setSpeed] = useState('')
  const [followup, setFollowup] = useState('')
  const [captureName, setCaptureName] = useState('')
  const [captureEmail, setCaptureEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const result = useMemo(() => calcLeak(leads, deal, speed, followup), [leads, deal, speed, followup])

  const leadsOptions = nl
    ? ['Minder dan 5', '5 tot 20', '20 tot 50', 'Meer dan 50']
    : ['Fewer than 5', '5 to 20', '20 to 50', 'More than 50']

  const dealOptions = nl
    ? ['Onder €1.000', '€1.000 tot €5.000', '€5.000 tot €20.000', 'Boven €20.000']
    : ['Under €1,000', '€1,000 to €5,000', '€5,000 to €20,000', 'Over €20,000']

  const speedOptions = nl
    ? ['Binnen 5 minuten, automatisch', 'Binnen 1 uur, meestal', 'Dezelfde dag, als er tijd is', 'Volgende dag of later']
    : ['Within 5 minutes, automatically', 'Within 1 hour, usually', 'Same day, when there is time', 'Next day or later']

  const followupOptions = nl
    ? ['Geautomatiseerde reeks (5+ keer)', '3 tot 4 keer manueel', '1 tot 2 keer, dan loslaten', 'Zelden of nooit']
    : ['Automated sequence (5+ follow-ups)', '3 to 4 times manually', '1 to 2 times, then leave it', 'Rarely or never follow up']

  const fmt = (n: number) =>
    n === 0 ? (nl ? 'Minimaal' : 'Minimal') : `€${n.toLocaleString('nl-BE')}`

  const handleCapture = async () => {
    if (!captureEmail.includes('@') || !captureName.trim()) return
    setSubmitting(true)
    try {
      await fetch('/api/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: captureName,
          email: captureEmail,
          lang: nl ? 'nl' : 'en',
          leads,
          deal,
          speed,
          followup,
          monthly: result.monthly,
          annual: result.annual,
          speedLeak: result.speedLeak,
          followupLeak: result.followupLeak,
        }),
      })
    } catch { /* fire and forget */ }
    setStep('thanks')
    setSubmitting(false)
  }

  const progressPct = step === 'q1' ? 25 : step === 'q2' ? 60 : step === 'results' ? 90 : 100

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Nav />
      <div className="calc-page">
        <div className="calc-wrap">

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,100,66,.1)', border: '1px solid rgba(201,100,66,.25)', borderRadius: 999, padding: '6px 14px', marginBottom: 12 }}>
              <TrendingDown size={14} color="#c96442" />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c96442' }}>
                {nl ? 'Revenue Calculator' : 'Revenue Calculator'}
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 700, color: '#3d3929', lineHeight: 1.25, margin: '0 0 8px' }}>
              {nl ? 'Hoeveel omzet mis jij elke maand?' : 'How much revenue are you losing each month?'}
            </h1>
            <p style={{ fontSize: 14, color: '#83827d', margin: 0 }}>
              {nl ? '4 vragen. 2 minuten. Direct jouw getal.' : '4 questions. 2 minutes. Your number, instantly.'}
            </p>
          </div>

          <div className="calc-card">
            <div className="calc-top" />
            <div className="calc-inner">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPct}%` }} />
              </div>

              {/* ── Step 1: leads + deal ── */}
              {step === 'q1' && (
                <div>
                  <div className="eyebrow">{nl ? 'Stap 1 van 2' : 'Step 1 of 2'}</div>
                  <div className="headline">{nl ? 'Jouw pipeline' : 'Your pipeline'}</div>
                  <div className="subline">{nl ? 'Twee snelle vragen over je bedrijf.' : 'Two quick questions about your business.'}</div>

                  <div className="q-group">
                    <div className="q-label">{nl ? 'Hoeveel nieuwe leads ontvang je per maand?' : 'How many new leads do you receive per month?'}</div>
                    <div className="opts">
                      {leadsOptions.map(o => (
                        <button key={o} className={`opt${leads === o ? ' sel' : ''}`} onClick={() => setLeads(o)}>{o}</button>
                      ))}
                    </div>
                  </div>

                  <div className="q-group">
                    <div className="q-label">{nl ? 'Wat is de gemiddelde waarde van een opdracht?' : 'What is your average deal value?'}</div>
                    <div className="opts">
                      {dealOptions.map(o => (
                        <button key={o} className={`opt${deal === o ? ' sel' : ''}`} onClick={() => setDeal(o)}>{o}</button>
                      ))}
                    </div>
                  </div>

                  <button className="btn-primary" disabled={!leads || !deal} onClick={() => setStep('q2')}>
                    {nl ? 'Verder' : 'Continue'}
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* ── Step 2: speed + follow-up ── */}
              {step === 'q2' && (
                <div>
                  <div className="eyebrow">{nl ? 'Stap 2 van 2' : 'Step 2 of 2'}</div>
                  <div className="headline">{nl ? 'Jouw opvolging' : 'Your follow-up'}</div>
                  <div className="subline">{nl ? 'Hier zit het meeste verborgen verlies.' : 'This is where most hidden revenue leaks.'}</div>

                  <div className="q-group">
                    <div className="q-label">{nl ? 'Hoe snel reageer je op een nieuwe aanvraag?' : 'How quickly do you respond to a new enquiry?'}</div>
                    <div className="opts">
                      {speedOptions.map(o => (
                        <button key={o} className={`opt${speed === o ? ' sel' : ''}`} onClick={() => setSpeed(o)}>{o}</button>
                      ))}
                    </div>
                  </div>

                  <div className="q-group">
                    <div className="q-label">{nl ? 'Hoe vaak volg je een lead op die niet meteen koopt?' : 'How often do you follow up a lead who does not buy immediately?'}</div>
                    <div className="opts">
                      {followupOptions.map(o => (
                        <button key={o} className={`opt${followup === o ? ' sel' : ''}`} onClick={() => setFollowup(o)}>{o}</button>
                      ))}
                    </div>
                  </div>

                  <button className="btn-primary" disabled={!speed || !followup} onClick={() => setStep('results')}>
                    {nl ? 'Bereken mijn verlies' : 'Calculate my leak'}
                    <ArrowRight size={16} />
                  </button>
                  <button className="btn-ghost" onClick={() => setStep('q1')}>{nl ? 'Terug' : 'Back'}</button>
                </div>
              )}

              {/* ── Results ── */}
              {step === 'results' && (
                <div>
                  <div className="eyebrow">{nl ? 'Jouw resultaat' : 'Your result'}</div>

                  <div className="result-hero">
                    <div className="rh-eyebrow">{nl ? 'Maandelijks omzetverlies (geschat)' : 'Monthly revenue leak (estimated)'}</div>
                    <div className="rh-amount">{fmt(result.monthly)}</div>
                    <div className="rh-period">{nl ? 'per maand' : 'per month'}</div>
                    {result.annual > 0 && (
                      <div className="rh-annual">
                        {nl ? `Dat is ${fmt(result.annual)} per jaar` : `That is ${fmt(result.annual)} per year`}
                      </div>
                    )}
                  </div>

                  {result.monthly > 0 && (
                    <div className="breakdown">
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#b0aea8', marginBottom: 2 }}>
                        {nl ? 'Waaruit bestaat dit?' : 'Where does this come from?'}
                      </div>
                      <div className="bk-row">
                        <span className="bk-label">{nl ? 'Trage eerste reactie' : 'Slow first response'}</span>
                        <span className="bk-value">{fmt(result.speedLeak)}</span>
                      </div>
                      <div className="bk-row">
                        <span className="bk-label">{nl ? 'Onvoldoende opvolging' : 'Insufficient follow-up'}</span>
                        <span className="bk-value">{fmt(result.followupLeak)}</span>
                      </div>
                    </div>
                  )}

                  <div className="cta-box">
                    <div className="cta-title">
                      {nl ? 'Wil je weten hoe je dit terugwint?' : 'Want to know how to recover this?'}
                    </div>
                    <div className="cta-sub">
                      {nl
                        ? 'De Business Impact Diagnose kijkt ook naar leiderschap, sales, retentie en marketing. Je ontvangt een volledig persoonlijk rapport met je top 3 fixes.'
                        : 'The Business Impact Diagnostic also looks at leadership, sales, retention and marketing. You get a full personalised report with your top 3 fixes.'}
                    </div>

                    <a
                      href="/diagnostic"
                      className="btn-green"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}
                    >
                      {nl ? 'Start gratis diagnose' : 'Start free diagnostic'}
                      <ArrowRight size={16} />
                    </a>

                    <div className="divider">
                      <div className="divider-line" />
                      <span className="divider-text">{nl ? 'of ontvang dit rapport per email' : 'or get this report by email'}</span>
                      <div className="divider-line" />
                    </div>

                    <label className="field-label">{nl ? 'Naam' : 'Name'}</label>
                    <input
                      className="text-input"
                      type="text"
                      placeholder={nl ? 'Jouw naam' : 'Your name'}
                      value={captureName}
                      onChange={e => setCaptureName(e.target.value)}
                    />
                    <label className="field-label">{nl ? 'E-mailadres' : 'Email address'}</label>
                    <input
                      className="text-input"
                      type="email"
                      placeholder="you@email.com"
                      value={captureEmail}
                      onChange={e => setCaptureEmail(e.target.value)}
                    />
                    <button
                      className="btn-primary"
                      style={{ marginTop: 4 }}
                      disabled={submitting || !captureEmail.includes('@') || !captureName.trim()}
                      onClick={handleCapture}
                    >
                      {submitting ? (nl ? 'Versturen...' : 'Sending...') : (nl ? 'Stuur mij het rapport' : 'Send me the report')}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── Thanks ── */}
              {step === 'thanks' && (
                <div className="thanks-wrap">
                  <div className="thanks-circle">✓</div>
                  <div className="headline" style={{ fontSize: 20, marginBottom: 8 }}>
                    {nl ? 'Onderweg naar jouw inbox' : 'On its way to your inbox'}
                  </div>
                  <p style={{ fontSize: 13, color: '#83827d', lineHeight: 1.65, marginBottom: '1.4rem' }}>
                    {nl
                      ? 'Check je inbox — en ook je spammap. Je ontvangt je rapport met jouw omzet-inzichten binnenkort.'
                      : 'Check your inbox — and your spam folder. Your revenue insight report is on its way.'}
                  </p>
                  <a
                    href="/diagnostic"
                    className="btn-green"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}
                  >
                    {nl ? 'Ontdek alle groeikansen' : 'Discover all growth gaps'}
                    <ArrowRight size={16} />
                  </a>
                </div>
              )}

            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#b0aea8', marginTop: 16 }}>
            {nl
              ? 'Berekeningen gebaseerd op gepubliceerd B2B sales onderzoek. Schattingen, geen garanties.'
              : 'Estimates based on published B2B sales research. Indicative, not guaranteed.'}
          </p>
        </div>
      </div>

      {/* SEO content section */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '3rem 1.5rem 4rem', color: '#3d3929' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 400, marginBottom: '1rem', color: '#2a2720' }}>
          {nl ? 'Hoe werkt de omzetverlies calculator?' : 'How does the revenue leak calculator work?'}
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: '#5c5849', marginBottom: '1.5rem' }}>
          {nl
            ? 'De calculator gebruikt twee bewezen oorzaken van omzetverlies: reactiesnelheid op leads en de kwaliteit van opvolging. Op basis van gepubliceerd B2B-verkooponderzoek (InsideSales, HubSpot) berekent de tool je geschat maandelijks verlies per categorie.'
            : 'The calculator uses two proven drivers of revenue leakage: lead response speed and follow-up quality. Based on published B2B sales research (InsideSales, HubSpot), the tool estimates your monthly loss per category.'}
        </p>

        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 400, marginBottom: '1rem', color: '#2a2720' }}>
          {nl ? 'Waarom lopen de meeste bedrijven omzet mis?' : 'Why do most businesses leak revenue?'}
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: '#5c5849', marginBottom: '1rem' }}>
          {nl
            ? 'Twee oorzaken domineren. Ten eerste: trage reactiesnelheid. Onderzoek toont aan dat de conversiekans met 80% daalt als je niet binnen 5 minuten reageert op een nieuwe aanvraag. Ten tweede: onvoldoende opvolging. 80% van de verkopen vereist 5 of meer contactmomenten. De meeste bedrijven stoppen bij één.'
            : 'Two causes dominate. First: slow response speed. Research shows that conversion probability drops by 80% if you do not respond within 5 minutes of a new enquiry. Second: insufficient follow-up. 80% of sales require 5 or more contact moments. Most businesses stop at one.'}
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: '#5c5849', marginBottom: '1.5rem' }}>
          {nl
            ? 'Samen verklaren deze twee factoren het merendeel van de omzet die maandelijks ongemerkt wegvloeit bij servicebedrijven.'
            : 'Together these two factors explain the majority of revenue that silently leaks away each month in service businesses.'}
        </p>

        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 400, marginBottom: '1rem', color: '#2a2720' }}>
          {nl ? 'Veelgestelde vragen' : 'Frequently asked questions'}
        </h2>
        <div style={{ borderTop: '1px solid rgba(61,57,41,0.1)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column' as const, gap: '1.5rem' }}>
          {(nl ? [
            ['Is de calculator gratis?', 'Ja, volledig gratis. Geen registratie, geen betaalwall. Je vult 4 vragen in en ziet meteen jouw geschat maandelijks verlies.'],
            ['Hoe nauwkeurig is het resultaat?', 'Het resultaat is een onderbouwde schatting op basis van jouw input en gepubliceerde branchegemiddelden. Het is geen accountantsrapport, maar geeft een betrouwbaar beeld van de grootte van het probleem.'],
            ['Wat moet ik doen met het resultaat?', 'Het resultaat wijst naar de oorzaak. Als het verlies vooral in reactiesnelheid zit, is een geautomatiseerd antwoordsysteem de eerste stap. Als opvolging het probleem is, is een gestructureerde follow-up sequentie de oplossing. De gratis diagnose gaat dieper in op alle 7 groeihefbomen.'],
          ] : [
            ['Is the calculator free?', 'Yes, completely free. No registration, no paywall. You answer 4 questions and immediately see your estimated monthly loss.'],
            ['How accurate is the result?', 'The result is a well-founded estimate based on your input and published industry averages. It is not an accountancy report, but gives a reliable picture of the scale of the problem.'],
            ['What should I do with the result?', 'The result points to the cause. If the loss is mainly in response speed, an automated reply system is the first step. If follow-up is the problem, a structured follow-up sequence is the fix. The free diagnostic goes deeper on all 7 growth levers.'],
          ]).map(([q, a]) => (
            <div key={q as string}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: '0.5rem', color: '#2a2720' }}>{q}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: '#5c5849', margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
