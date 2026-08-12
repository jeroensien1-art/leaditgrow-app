'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Nav } from '@/components/nav'
import { useLang } from '@/components/lang-context'
import { CONVERSION_RATE, leadsMap, dealMap } from '@/lib/leak'

// ── Lookup tables ──────────────────────────────────────────────────────────────

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
  // Haalbare maandomzet uit de huidige leadstroom, niet het volledige leadvolume
  const base = l * d * CONVERSION_RATE
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
    --c-ink: #0e0d0b;
    --c-bg: #f2f0eb;
    --c-bg2: #eae8e2;
    --c-orange: #c96442;
    --c-green: #1a5e35;
    --c-lime: #4ade80;
    --c-muted: #787068;
  }
  .calc-b { font-family: var(--font-brutalist, system-ui); }
  .calc-m { font-family: var(--font-mono-brutalist, monospace); }

  .calc-stage { min-height: calc(100svh - 51px); display: grid; grid-template-columns: 42% 58%;
                border-bottom: 3px solid var(--c-ink); position: relative; }
  .calc-rail { position: absolute; top: 0; left: 0; right: 0; height: 4px; background: rgba(14,13,11,.12); z-index: 3; }
  .calc-rail i { display: block; height: 100%; background: var(--c-lime); transition: width .5s cubic-bezier(.16,1,.3,1); }

  .calc-l { background: var(--c-ink); color: var(--c-bg); padding: 54px 44px 40px;
            display: flex; flex-direction: column; justify-content: space-between; }
  .calc-r { background: var(--c-bg); padding: 30px 44px 26px; display: flex; flex-direction: column; }

  .calc-qnum { font-family: var(--font-brutalist, system-ui); font-weight: 700;
               font-size: clamp(70px, 11vw, 160px); line-height: .78; letter-spacing: -.05em;
               color: transparent; -webkit-text-stroke: 2px rgba(242,240,235,.3); }
  .calc-q { font-family: var(--font-brutalist, system-ui); font-weight: 700;
            font-size: clamp(28px, 3.4vw, 54px); line-height: .98; letter-spacing: -.035em;
            text-transform: uppercase; margin-top: 24px; max-width: 15ch; }
  .calc-hint { font-size: 15px; line-height: 1.65; color: rgba(242,240,235,.5); max-width: 40ch; margin-top: 20px; }
  .calc-foot { font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: rgba(242,240,235,.3); }

  .calc-opts { flex: 1; display: flex; flex-direction: column; border-top: 2px solid var(--c-ink); }
  .calc-opt { flex: 1; display: grid; grid-template-columns: 46px 1fr 28px; align-items: center; gap: 18px;
              background: transparent; border: 0; border-bottom: 2px solid var(--c-ink); cursor: pointer;
              padding: 22px 8px; text-align: left; transition: background .18s, padding-left .18s; }
  .calc-opt:hover { background: var(--c-bg2); padding-left: 18px; }
  .calc-opt .k { font-size: 11px; color: var(--c-muted); border: 1px solid rgba(14,13,11,.25);
                 width: 26px; height: 26px; display: grid; place-items: center; transition: all .18s; }
  .calc-opt .t { font-family: var(--font-brutalist, system-ui); font-weight: 700;
                 font-size: clamp(17px, 1.9vw, 26px); text-transform: uppercase; letter-spacing: -.02em; line-height: 1.05; }
  .calc-opt .g { font-size: 17px; color: transparent; transition: color .18s; }
  .calc-opt:hover .g { color: var(--c-orange); }
  .calc-opt.sel { background: var(--c-lime); padding-left: 18px; }
  .calc-opt.sel .k { background: var(--c-ink); color: var(--c-lime); border-color: var(--c-ink); }
  .calc-opt.sel .g { color: var(--c-ink); }

  .calc-back { margin-top: 18px; align-self: flex-start; background: none; border: 0; cursor: pointer;
               font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--c-muted); }
  .calc-back:hover { color: var(--c-orange); }

  .calc-amount { font-family: var(--font-brutalist, system-ui); font-weight: 700;
                 font-size: clamp(56px, 9vw, 150px); line-height: .84; letter-spacing: -.055em;
                 color: var(--c-orange); margin: 14px 0 10px; }
  .calc-per { font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: rgba(242,240,235,.4); }
  .calc-year { font-size: 16px; color: rgba(242,240,235,.65); margin-top: 16px; }
  .calc-year b { color: var(--c-lime); }
  .calc-bd { margin-top: 34px; border-top: 1px solid rgba(242,240,235,.15); }
  .calc-bdrow { padding: 18px 0; border-bottom: 1px solid rgba(242,240,235,.15); }
  .calc-bdtop { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; }
  .calc-bdname { font-family: var(--font-brutalist, system-ui); font-weight: 700; font-size: 16px;
                 text-transform: uppercase; letter-spacing: -.01em; }
  .calc-bdval { font-family: var(--font-brutalist, system-ui); font-weight: 700; font-size: 20px;
                color: var(--c-lime); letter-spacing: -.02em; }
  .calc-bdbar { height: 5px; background: rgba(242,240,235,.12); margin-top: 11px; }
  .calc-bdbar i { display: block; height: 100%; background: var(--c-orange); transition: width 1s cubic-bezier(.16,1,.3,1); }
  .calc-src { font-size: 9px; letter-spacing: .1em; text-transform: uppercase; color: rgba(242,240,235,.32); margin-top: 9px; }

  .calc-badge { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: .14em;
                text-transform: uppercase; background: var(--c-lime); color: var(--c-ink); padding: 7px 12px; align-self: flex-start; }
  .calc-r h2 { font-family: var(--font-brutalist, system-ui); font-weight: 700;
               font-size: clamp(24px, 2.6vw, 38px); line-height: .98; text-transform: uppercase;
               letter-spacing: -.03em; margin: 20px 0 14px; }
  .calc-r .sell { font-size: 15px; line-height: 1.65; color: var(--c-muted); max-width: 42ch; }
  .calc-field { margin-top: 18px; }
  .calc-field label { display: block; font-size: 9px; letter-spacing: .16em; text-transform: uppercase;
                      color: var(--c-muted); margin-bottom: 7px; }
  .calc-field input { width: 100%; padding: 15px 16px; border: 2px solid var(--c-ink); background: #fff;
                      font-family: inherit; font-size: 15px; color: var(--c-ink); outline: none; box-sizing: border-box; }
  .calc-field input:focus { border-color: var(--c-orange); }
  .calc-submit { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%;
                 margin-top: 20px; padding: 17px 24px; background: var(--c-ink); color: var(--c-bg);
                 border: 2px solid var(--c-ink); font-family: inherit; font-size: 12px; font-weight: 700;
                 letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: background .15s, border-color .15s; }
  .calc-submit:hover:not(:disabled) { background: var(--c-green); border-color: var(--c-green); }
  .calc-submit:disabled { opacity: .4; cursor: not-allowed; }
  .calc-fine { font-size: 9px; letter-spacing: .08em; color: #a49c92; margin-top: 14px; line-height: 1.7; text-transform: uppercase; }

  .calc-seo { max-width: 760px; margin: 0 auto; padding: 80px 24px 96px; }
  .calc-seo h2 { font-family: var(--font-brutalist, system-ui); font-weight: 700;
                 font-size: clamp(24px, 3vw, 38px); text-transform: uppercase; letter-spacing: -.03em;
                 line-height: 1; margin: 0 0 18px; }
  .calc-seo h2 + p { margin-top: 0; }
  .calc-seo p { font-size: 16px; line-height: 1.75; color: #4a453e; margin: 0 0 18px; }
  .calc-seo section + section { margin-top: 56px; }
  .calc-seo h3 { font-family: var(--font-brutalist, system-ui); font-weight: 700; font-size: 17px;
                 text-transform: uppercase; letter-spacing: -.01em; margin: 0 0 8px; }
  .calc-seo .qa { border-top: 2px solid var(--c-ink); padding: 22px 0; }

  @media (max-width: 900px) {
    .calc-stage { grid-template-columns: 1fr; }
    .calc-l { padding: 34px 20px 26px; }
    .calc-r { padding: 24px 20px 44px; }
    .calc-qnum { font-size: 62px; }
    .calc-opt { padding: 18px 4px; grid-template-columns: 34px 1fr 20px; gap: 12px; }
    .calc-seo { padding: 56px 20px 72px; }
  }
`

type Step = 1 | 2 | 3 | 4 | 5

export default function CalculatorPage() {
  const { lang } = useLang()
  const nl = lang === 'nl'
  const router = useRouter()

  const [step, setStep] = useState<Step>(1)
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

  const questions = [
    {
      title: nl ? 'Hoeveel leads krijg je per maand' : 'How many leads do you get per month',
      hint: nl
        ? 'Elke aanvraag telt mee. Formulier, telefoon, mail, WhatsApp, iemand die binnenwipt.'
        : 'Every enquiry counts. Form, phone, email, WhatsApp, someone walking in.',
      options: leadsOptions, value: leads, set: setLeads,
    },
    {
      title: nl ? 'Wat is een opdracht gemiddeld waard' : 'What is an average job worth',
      hint: nl
        ? 'De omzet van een gemiddelde klant, niet van je grootste project.'
        : 'Revenue from an average client, not from your biggest project.',
      options: dealOptions, value: deal, set: setDeal,
    },
    {
      title: nl ? 'Hoe snel antwoord je op een aanvraag' : 'How fast do you answer an enquiry',
      hint: nl
        ? 'Denk aan de aanvraag die om kwart voor zes op vrijdag binnenkomt, niet aan je beste dag.'
        : 'Think of the enquiry landing at 5.45pm on a Friday, not of your best day.',
      options: speedOptions, value: speed, set: setSpeed,
    },
    {
      title: nl ? 'Hoe vaak volg je op wie niet meteen koopt' : 'How often do you follow up a lead who does not buy',
      hint: nl
        ? 'Hier zit doorgaans het grootste stuk van het lek.'
        : 'This is usually where the biggest part of the leak sits.',
      options: followupOptions, value: followup, set: setFollowup,
    },
  ]

  const pick = (q: typeof questions[number], option: string) => {
    q.set(option)
    setTimeout(() => setStep(s => (s < 5 ? (s + 1) as Step : s)), 260)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (step === 5) return
      const q = questions[step - 1]
      if (e.key >= '1' && e.key <= '4') {
        const option = q.options[Number(e.key) - 1]
        if (option) pick(q, option)
      }
      if (e.key === 'Backspace' && step > 1) {
        e.preventDefault()
        setStep(s => (s - 1) as Step)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

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
          phone: '',
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
    setSubmitting(false)
    router.push('/bedankt/calculator')
  }

  const peak = Math.max(result.speedLeak, result.followupLeak, 1)
  const q = step < 5 ? questions[step - 1] : null

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Nav />

      <div className="calc-stage calc-b">
        <div className="calc-rail"><i style={{ width: `${(step - 1) / 4 * 100}%` }} /></div>

        {q ? (
          <>
            <div className="calc-l">
              <div>
                <div className="calc-qnum">{String(step).padStart(2, '0')}</div>
                <h1 className="calc-q">{q.title}</h1>
                <p className="calc-hint">{q.hint}</p>
              </div>
              <div className="calc-foot calc-m">
                {nl ? `Vraag ${step} van 4` : `Question ${step} of 4`} · {nl ? 'gebruik je toetsenbord' : 'use your keyboard'}
              </div>
            </div>
            <div className="calc-r">
              <div className="calc-opts">
                {q.options.map((o, i) => (
                  <button
                    key={o}
                    className={`calc-opt${q.value === o ? ' sel' : ''}`}
                    onClick={() => pick(q, o)}
                  >
                    <span className="k calc-m">{i + 1}</span>
                    <span className="t">{o}</span>
                    <span className="g calc-m">→</span>
                  </button>
                ))}
              </div>
              <button
                className="calc-back calc-m"
                style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
                onClick={() => setStep(s => (s - 1) as Step)}
              >
                ← {nl ? 'Vorige' : 'Back'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="calc-l">
              <div>
                <div className="calc-foot calc-m">{nl ? 'Geschat omzetverlies' : 'Estimated revenue leak'}</div>
                <div className="calc-amount">{fmt(result.monthly)}</div>
                <div className="calc-per calc-m">{nl ? 'Per maand' : 'Per month'}</div>
                {result.annual > 0 && (
                  <div className="calc-year">
                    {nl ? 'Dat is ' : 'That is '}<b>{fmt(result.annual)}</b>{nl ? ' per jaar' : ' per year'}
                  </div>
                )}

                {result.monthly > 0 && (
                  <div className="calc-bd">
                    <div className="calc-bdrow">
                      <div className="calc-bdtop">
                        <span className="calc-bdname">{nl ? 'Trage eerste reactie' : 'Slow first response'}</span>
                        <span className="calc-bdval">{fmt(result.speedLeak)}</span>
                      </div>
                      <div className="calc-bdbar"><i style={{ width: `${result.speedLeak / peak * 100}%` }} /></div>
                      <div className="calc-src calc-m">
                        {nl
                          ? '78% van de deals gaat naar wie eerst antwoordt · InsideSales'
                          : '78% of deals go to the first responder · InsideSales'}
                      </div>
                    </div>
                    <div className="calc-bdrow">
                      <div className="calc-bdtop">
                        <span className="calc-bdname">{nl ? 'Te weinig opvolging' : 'Insufficient follow-up'}</span>
                        <span className="calc-bdval">{fmt(result.followupLeak)}</span>
                      </div>
                      <div className="calc-bdbar"><i style={{ width: `${result.followupLeak / peak * 100}%` }} /></div>
                      <div className="calc-src calc-m">
                        {nl
                          ? '80% van de verkopen vraagt 5 of meer contactmomenten · HubSpot'
                          : '80% of sales require 5 or more touchpoints · HubSpot'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button className="calc-back calc-m" style={{ color: 'rgba(242,240,235,.4)' }} onClick={() => setStep(4)}>
                ← {nl ? 'Antwoorden aanpassen' : 'Change my answers'}
              </button>
            </div>

            <div className="calc-r" style={{ justifyContent: 'center' }}>
              <span className="calc-badge calc-m">{nl ? '14 dagen gratis' : '14-day free trial'}</span>
              <h2>{nl ? 'Wil je weten waar dit vandaan komt' : 'Want to know where this comes from'}</h2>
              <p className="sell">
                {nl
                  ? 'Je krijgt het volledige rapport in je inbox, plus veertien dagen een AI werknemer die jouw aanvragen beantwoordt zoals jij dat zou doen. Gekoppeld aan je agenda, je CRM en je offertes.'
                  : 'You get the full report in your inbox, plus fourteen days of an AI employee that answers your enquiries the way you would. Connected to your calendar, your CRM and your quotes.'}
              </p>
              <div className="calc-field">
                <label className="calc-m" htmlFor="calc-name">{nl ? 'Naam' : 'Name'}</label>
                <input id="calc-name" type="text" placeholder={nl ? 'Jouw naam' : 'Your name'}
                  value={captureName} onChange={e => setCaptureName(e.target.value)} />
              </div>
              <div className="calc-field">
                <label className="calc-m" htmlFor="calc-email">{nl ? 'E-mailadres' : 'Email address'}</label>
                <input id="calc-email" type="email" placeholder={nl ? 'jij@bedrijf.be' : 'you@company.com'}
                  value={captureEmail} onChange={e => setCaptureEmail(e.target.value)} />
              </div>
              <button
                className="calc-submit"
                disabled={submitting || !captureEmail.includes('@') || !captureName.trim()}
                onClick={handleCapture}
              >
                {submitting
                  ? (nl ? 'Versturen...' : 'Sending...')
                  : (nl ? 'Stuur mijn rapport' : 'Send my report')}
                <ArrowRight size={16} />
              </button>
              <div className="calc-fine calc-m">
                {nl
                  ? `Schatting op basis van gepubliceerd B2B onderzoek en een conversie van ${Math.round(CONVERSION_RATE * 100)}% op je aanvragen. Geen garanties, geen nieuwsbrief.`
                  : `Estimate based on published B2B research and a ${Math.round(CONVERSION_RATE * 100)}% conversion rate on your enquiries. No guarantees, no newsletter.`}
              </div>
            </div>
          </>
        )}
      </div>

      {/* SEO content */}
      <div className="calc-seo calc-b">
        <section>
          <h2>{nl ? 'Hoe werkt de omzetverlies calculator' : 'How the revenue leak calculator works'}</h2>
          <p>
            {nl
              ? `De calculator gebruikt twee bewezen oorzaken van omzetverlies: reactiesnelheid op leads en de kwaliteit van opvolging. Eerst wordt je haalbare maandomzet geschat uit je leadvolume, je gemiddelde opdrachtwaarde en een conversie van ${Math.round(CONVERSION_RATE * 100)}%. Daarop worden de verliesfactoren uit gepubliceerd B2B-verkooponderzoek toegepast.`
              : `The calculator uses two proven drivers of revenue leakage: lead response speed and follow-up quality. It first estimates your achievable monthly revenue from lead volume, average deal value and a ${Math.round(CONVERSION_RATE * 100)}% conversion rate, then applies loss factors from published B2B sales research.`}
          </p>
          <p>
            {nl
              ? 'Die conversiefactor zit er bewust in. Zonder die stap zou het model doen alsof elke aanvraag een klant wordt, en dan komen er bedragen uit die niemand herkent.'
              : 'That conversion step is deliberate. Without it the model would assume every enquiry becomes a customer, which produces numbers nobody recognises.'}
          </p>
        </section>

        <section>
          <h2>{nl ? 'Waarom lopen bedrijven omzet mis' : 'Why businesses leak revenue'}</h2>
          <p>
            {nl
              ? 'Twee oorzaken domineren. Ten eerste trage reactiesnelheid: de conversiekans daalt sterk als je niet binnen enkele minuten reageert op een nieuwe aanvraag. Ten tweede onvoldoende opvolging: 80% van de verkopen vereist vijf of meer contactmomenten, en de meeste bedrijven stoppen bij één.'
              : 'Two causes dominate. First, slow response: conversion probability drops sharply when you do not reply within minutes of a new enquiry. Second, insufficient follow-up: 80% of sales require five or more touchpoints, and most businesses stop at one.'}
          </p>
          <p>
            {nl
              ? 'Samen verklaren die twee het grootste deel van de omzet die maandelijks ongemerkt wegvloeit bij dienstverlenende bedrijven.'
              : 'Together these explain the bulk of revenue that silently leaks away each month in service businesses.'}
          </p>
        </section>

        <section>
          <h2>{nl ? 'Veelgestelde vragen' : 'Frequently asked questions'}</h2>
          {(nl ? [
            ['Is de calculator gratis', 'Ja. Geen registratie en geen betaalmuur. Je vult vier vragen in en ziet meteen je geschat maandelijks verlies.'],
            ['Hoe nauwkeurig is het resultaat', `Het is een onderbouwde schatting op basis van jouw input, een conversie van ${Math.round(CONVERSION_RATE * 100)}% en gepubliceerde branchegemiddelden. Geen accountantsrapport, wel een betrouwbaar beeld van de orde van grootte.`],
            ['Wat doe ik met het resultaat', 'Het resultaat wijst naar de oorzaak. Zit het verlies vooral in reactiesnelheid, dan is een automatisch antwoordsysteem de eerste stap. Zit het in opvolging, dan is een vaste opvolgreeks de oplossing.'],
          ] : [
            ['Is the calculator free', 'Yes. No registration and no paywall. Answer four questions and see your estimated monthly loss right away.'],
            ['How accurate is the result', `It is a well-founded estimate based on your input, a ${Math.round(CONVERSION_RATE * 100)}% conversion rate and published industry averages. Not an accountancy report, but a reliable picture of the scale.`],
            ['What do I do with the result', 'The result points to the cause. If the loss sits in response speed, an automated reply system is the first step. If it sits in follow-up, a fixed follow-up sequence is the fix.'],
          ]).map(([question, answer]) => (
            <div className="qa" key={question}>
              <h3>{question}</h3>
              <p style={{ margin: 0 }}>{answer}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}
