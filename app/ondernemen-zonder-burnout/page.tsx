'use client'

import { useState } from 'react'

type Step = 'intro' | 'intake' | 'thanks'

const CHECKS = [
  'Altijd tijd en energie te kort',
  'Niet effectief delegeren',
  'Inefficiente aanwervingen',
  'Spanningen in het team',
  "'s Avonds nog piekeren over de zaak",
]

const css = `
  :root {
    --cream: #faf7f2; --warm-white: #fff9f4; --sand: #f0e9de; --sand-mid: #e2d5c3;
    --ink: #1c1a18; --ink-mid: #4a4540; --ink-muted: #9a9088; --ink-faint: #c8bfb4;
    --rust: #c96442; --rust-light: #fdf1eb; --rust-border: rgba(201,100,66,0.2);
    --green: #2d6a4f; --green-light: #eaf4ee;
    --border: rgba(28,26,24,0.08); --border-mid: rgba(28,26,24,0.14);
    --font-display: 'Georgia', serif; --font-body: system-ui, sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .page { font-family: var(--font-body); background: var(--sand); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
  .wrap { background: var(--warm-white); border-radius: 20px; max-width: 520px; width: 100%; overflow: hidden; box-shadow: 0 8px 48px rgba(28,26,24,0.12); }
  .top-stripe { height: 4px; background: linear-gradient(90deg,#c96442,#e0845a,#c96442); }
  .inner { padding: 2.2rem 2rem 2.6rem; }
  .eyebrow { font-size:10px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--rust); margin-bottom:10px; }
  .headline { font-family:var(--font-display); font-size:26px; font-weight:700; color:var(--ink); line-height:1.2; margin-bottom:10px; }
  .headline em { font-style:italic; color:var(--rust); }
  .subline { font-size:14px; color:var(--ink-muted); line-height:1.7; margin-bottom:1.6rem; }
  .pain-list { display:flex; flex-direction:column; gap:6px; margin-bottom:1.6rem; }
  .pain-item { display:flex; align-items:center; gap:10px; padding:11px 14px; background:var(--cream); border-radius:8px; border-left:2px solid var(--rust); }
  .pain-dot { width:6px; height:6px; border-radius:50%; background:var(--rust); flex-shrink:0; }
  .pain-text { font-size:13px; font-weight:500; color:var(--ink); }
  .italic-note { font-family:var(--font-display); font-size:13px; font-style:italic; color:var(--ink-muted); margin-bottom:1.6rem; line-height:1.6; }
  .badge { display:inline-flex; align-items:center; gap:6px; background:var(--rust-light); border:1px solid var(--rust-border); border-radius:20px; padding:5px 12px; font-size:11px; font-weight:600; color:var(--rust); margin-bottom:1.4rem; }
  .btn-primary { width:100%; padding:16px 24px; background:var(--rust); color:white; border:none; border-radius:10px; font-size:15px; font-weight:700; cursor:pointer; transition:all .15s; box-shadow:0 2px 8px rgba(201,100,66,.25); letter-spacing:.01em; }
  .btn-primary:hover { background:#b8572a; transform:translateY(-1px); }
  .btn-primary:disabled { opacity:.4; cursor:not-allowed; transform:none; }
  .btn-ghost { padding:14px 18px; background:transparent; color:var(--ink-muted); border:1.5px solid var(--border-mid); border-radius:10px; font-size:13px; cursor:pointer; transition:all .15s; width:100%; margin-top:10px; }
  .btn-ghost:hover { border-color:var(--ink-muted); color:var(--ink-mid); }
  .field-label { font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-muted); margin-bottom:6px; display:block; }
  .text-input { width:100%; padding:12px 14px; background:var(--warm-white); border:1.5px solid var(--border-mid); border-radius:10px; font-size:13px; color:var(--ink); outline:none; transition:border-color .15s; margin-bottom:10px; }
  .text-input:focus { border-color:var(--rust); }
  .text-input::placeholder { color:var(--ink-faint); }
  .check-item { display:flex; align-items:center; gap:12px; padding:13px 14px; background:var(--cream); border:1.5px solid var(--border-mid); border-radius:10px; cursor:pointer; transition:all .15s; margin-bottom:8px; text-align:left; width:100%; }
  .check-item.checked { border-color:var(--rust); background:var(--rust-light); }
  .check-box { width:20px; height:20px; border-radius:6px; border:1.5px solid var(--sand-mid); flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all .15s; background:white; }
  .check-item.checked .check-box { background:var(--rust); border-color:var(--rust); }
  .check-mark { width:9px; height:6px; border-left:2.5px solid white; border-bottom:2.5px solid white; transform:rotate(-45deg) translate(0,-1px); display:block; }
  .thanks-wrap { text-align:center; padding:1rem 0 .5rem; }
  .thanks-circle { width:60px; height:60px; border-radius:50%; background:var(--green-light); border:1px solid rgba(45,106,79,.2); display:flex; align-items:center; justify-content:center; margin:0 auto 1.2rem; font-size:24px; }
  .what-in { background:var(--cream); border-radius:10px; padding:1.2rem 1.4rem; margin-top:1.4rem; text-align:left; }
  .what-in-title { font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--rust); margin-bottom:10px; }
  .what-item { font-size:13px; color:var(--ink-mid); line-height:1.9; display:flex; gap:8px; }
  .what-item::before { content:'·'; color:var(--ink-faint); flex-shrink:0; }
  .section-divider { height:1px; background:var(--border); margin:1.4rem 0; }
`

export default function OndernemerZonderBurnoutPage() {
  const [step, setStep] = useState<Step>('intro')
  const [checks, setChecks]       = useState<string[]>([])
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [gsm, setGsm]             = useState('')
  const [werknemers, setWerknemers] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const toggleCheck = (item: string) =>
    setChecks(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item])

  const handleSubmit = async () => {
    if (!email.includes('@') || !name.trim()) return
    setSubmitting(true)
    try {
      await fetch('/api/leadership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, gsm, werknemers, checks }),
      })
    } catch { /* fire and forget */ }
    setSubmitting(false)
    setStep('thanks')
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="page">
        <div className="wrap">
          <div className="top-stripe" />
          <div className="inner">

            {step === 'intro' && (
              <div>
                <div className="eyebrow">Ondernemen zonder burnout</div>
                <div className="headline">
                  Herken je 1 of meer<br />van <em>deze?</em>
                </div>
                <div className="subline" style={{ marginBottom: '1rem' }}>
                  Vink aan wat van toepassing is.
                </div>
                {CHECKS.map(item => {
                  const checked = checks.includes(item)
                  return (
                    <button
                      key={item}
                      className={`check-item ${checked ? 'checked' : ''}`}
                      onClick={() => toggleCheck(item)}
                    >
                      <div className="check-box">{checked && <div className="check-mark" />}</div>
                      <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: checked ? 600 : 400, textAlign: 'left' }}>{item}</div>
                    </button>
                  )
                })}
                <div className="italic-note" style={{ marginTop: '1.2rem' }}>
                  Er is een betere manier. Wacht niet tot het te laat is.
                </div>
                <div className="badge">
                  <span>Volledig gratis</span>
                  <span style={{ opacity: .4 }}>·</span>
                  <span>Geen verplichtingen</span>
                  <span style={{ opacity: .4 }}>·</span>
                  <span>90 min consultatie</span>
                </div>
                <button className="btn-primary" onClick={() => setStep('intake')}>
                  Plan mijn gratis consultatie
                </button>
              </div>
            )}

            {step === 'intake' && (
              <div>
                <div className="eyebrow">Gratis consultatie</div>
                <div className="headline" style={{ fontSize: 20, marginBottom: 8, lineHeight: 1.3 }}>
                  Jouw gegevens, zodat ik je kan contacteren.
                </div>
                <div className="subline" style={{ marginBottom: '1.2rem' }}>
                  Bewezen methodes die in samenwerking met KMO's al 35+ jaar worden toegepast. Ik bel je op binnen 48 uur.
                </div>
                <div className="section-divider" style={{ marginBottom: '1.2rem' }} />
                <label className="field-label">Jouw naam</label>
                <input className="text-input" type="text" placeholder="Voornaam" value={name} onChange={e => setName(e.target.value)} />
                <label className="field-label">E-mailadres</label>
                <input className="text-input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                <label className="field-label">GSM-nummer</label>
                <input className="text-input" type="tel" placeholder="+32 ..." value={gsm} onChange={e => setGsm(e.target.value)} />
                <label className="field-label">Aantal werknemers</label>
                <input className="text-input" type="text" placeholder="bv. 12" value={werknemers} onChange={e => setWerknemers(e.target.value)} />
                <button
                  className="btn-primary"
                  disabled={submitting || !email.includes('@') || !name.trim()}
                  onClick={handleSubmit}
                >
                  {submitting ? 'Versturen...' : 'Bevestig mijn gratis consultatie'}
                </button>
                <button className="btn-ghost" onClick={() => setStep('intro')}>Terug</button>
              </div>
            )}

            {step === 'thanks' && (
              <div className="thanks-wrap">
                <div className="thanks-circle">&#10003;</div>
                <div className="headline" style={{ fontSize: 20, marginBottom: 10 }}>
                  Ik neem contact met je op binnen 48 uur.
                </div>
                <div className="subline" style={{ marginBottom: 0 }}>
                  Ik contacteer je om een volledig gratis diepgaande consultatie rond leiderschap en beter uitspelen van jouw persoonlijke sterktes (90 min) in te plannen. Een uiterst boeiend gesprek met practische inzichten die je als leider naar een hoger niveau helpen.
                </div>
                <div className="what-in">
                  <div className="what-in-title">Wat te verwachten</div>
                  <div className="what-item">Een bevestigingsmail is onderweg naar jouw inbox.</div>
                  <div className="what-item">Wij bellen je op binnen de 48 uur.</div>
                  <div className="what-item">90 minuten volledig gratis. Geen verplichtingen.</div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
