'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Calendar, Reply } from 'lucide-react'
import { useLang } from '@/components/lang-context'
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'

const B    = 'var(--font-brutalist, system-ui)'
const D    = 'var(--font-display, var(--font-brutalist, system-ui))'
const M    = 'var(--font-mono-brutalist, monospace)'
const INK  = '#0e0d0b'
const BG   = '#f2f0eb'
const BG2  = '#eae8e2'
const GRN  = '#1a5e35'
const LIME = '#4ade80'
const ORNG = '#c96442'
const MUT  = '#787068'

const css = `
  .b-ct { border-top: 3px solid ${INK}; background: ${BG}; position: relative; z-index: 1; padding: 96px 40px; }
  .b-ct-inner { max-width: 1180px; margin: 0 auto; }
  .b-ct-kicker { font-family: ${M}; font-size: 12px; font-weight: 700; letter-spacing: .18em;
                 text-transform: uppercase; color: ${GRN}; margin-bottom: 18px; }
  .b-ct-h2 { font-family: ${D}; font-size: clamp(34px, 5vw, 68px); font-weight: 700; line-height: .96;
             letter-spacing: -.018em; text-transform: uppercase; color: ${INK}; max-width: 16ch; }
  .b-ct-h2 span { color: ${ORNG}; }
  .b-ct-sub { font-family: ${B}; font-size: 17px; line-height: 1.6; color: ${MUT}; margin-top: 20px; max-width: 46ch; }

  .b-ct-grid { display: grid; grid-template-columns: 1fr 1fr; border: 3px solid ${INK}; margin-top: 52px; }
  .b-ct-col { padding: 36px 34px; }
  .b-ct-col:first-child { border-right: 3px solid ${INK}; }

  .b-ct-label { display: block; font-family: ${M}; font-size: 11px; font-weight: 700; letter-spacing: .16em;
                text-transform: uppercase; color: ${MUT}; margin-bottom: 8px; }
  .b-ct-label i { font-style: normal; font-weight: 400; letter-spacing: .06em; }
  .b-ct-input { width: 100%; padding: 14px 16px; border: 2px solid ${INK}; background: #fff; border-radius: 0;
                font-family: ${B}; font-size: 16px; color: ${INK}; outline: none; box-sizing: border-box;
                transition: border-color .15s; }
  .b-ct-input:focus { border-color: ${ORNG}; }
  .b-ct-input:disabled { opacity: .4; }
  .b-ct-field + .b-ct-field { margin-top: 18px; }
  .b-ct-check { display: flex; align-items: center; gap: 9px; margin-top: 10px; cursor: pointer; user-select: none; }
  .b-ct-check span { font-family: ${B}; font-size: 14px; color: ${MUT}; }

  .b-ct-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%;
              margin-top: 22px; padding: 17px 24px; background: ${INK}; color: ${BG}; border: 2px solid ${INK};
              border-radius: 0; font-family: ${B}; font-size: 13px; font-weight: 700; letter-spacing: .1em;
              text-transform: uppercase; cursor: pointer; transition: background .15s, border-color .15s; }
  .b-ct-btn:hover:not(:disabled) { background: ${GRN}; border-color: ${GRN}; }
  .b-ct-btn:disabled { opacity: .4; cursor: not-allowed; }
  .b-ct-btn-grn { background: ${GRN}; border-color: ${GRN}; color: #fff; }
  .b-ct-btn-grn:hover:not(:disabled) { background: ${INK}; border-color: ${INK}; }

  .b-ct-lead { font-family: ${B}; font-size: 16px; line-height: 1.65; color: ${MUT}; }
  .b-ct-card { display: flex; align-items: center; gap: 18px; width: 100%; text-align: left; padding: 24px;
               margin-top: 22px; background: transparent; border: 2px solid ${INK}; border-radius: 0;
               cursor: pointer; transition: background .15s; }
  .b-ct-card:hover { background: ${BG2}; }
  .b-ct-card-t { font-family: ${D}; font-size: 21px; font-weight: 700; text-transform: uppercase;
                 letter-spacing: -.01em; color: ${INK}; }
  .b-ct-card-s { font-family: ${M}; font-size: 12px; letter-spacing: .1em; text-transform: uppercase;
                 color: ${MUT}; margin-top: 6px; }

  .b-ct-panel { border: 2px solid ${INK}; padding: 26px; margin-top: 22px; }
  .b-ct-cancel { display: block; width: 100%; margin-top: 14px; background: none; border: 0; cursor: pointer;
                 font-family: ${M}; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: ${MUT}; }
  .b-ct-cancel:hover { color: ${ORNG}; }

  .b-ct-risk { margin-top: 22px; background: ${INK}; padding: 26px; }
  .b-ct-risk-k { font-family: ${M}; font-size: 11px; font-weight: 700; letter-spacing: .18em;
                 text-transform: uppercase; color: ${LIME}; margin-bottom: 12px; }
  .b-ct-risk p { font-family: ${B}; font-size: 15px; line-height: 1.7; color: rgba(242,240,235,.7); }

  .b-ct-done { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; padding: 20px 0; }
  .b-ct-done-t { font-family: ${D}; font-size: 24px; font-weight: 700; text-transform: uppercase;
                 letter-spacing: -.01em; color: ${INK}; }
  .b-ct-err { font-family: ${B}; font-size: 15px; color: #b91c1c; margin-top: 14px; }

  @media (max-width: 900px) {
    .b-ct { padding: 56px 20px; }
    .b-ct-grid { grid-template-columns: 1fr; }
    .b-ct-col:first-child { border-right: 0; border-bottom: 3px solid ${INK}; }
    .b-ct-col { padding: 26px 20px; }
  }
`

function Label({ children }: { children: React.ReactNode }) {
  return <label className="b-ct-label">{children}</label>
}

export function Contact() {
  const { t, lang } = useLang()
  const nl = lang === 'nl'
  const router = useRouter()

  // — Contact form —
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [noWebsite, setNoWebsite] = useState(false)
  const [message, setMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef<TurnstileInstance>(null)

  // — Book-a-call form —
  const [bookOpen, setBookOpen] = useState(false)
  const [bookSent, setBookSent] = useState(false)
  const [bookSending, setBookSending] = useState(false)
  const [bookName, setBookName] = useState('')
  const [bookEmail, setBookEmail] = useState('')
  const [bookPhone, setBookPhone] = useState('')
  const [bookWebsite, setBookWebsite] = useState('')
  const [bookNoWebsite, setBookNoWebsite] = useState(false)
  const [bookChallenge, setBookChallenge] = useState('')
  const [bookTimeline, setBookTimeline] = useState('')
  const [bookTurnstileToken, setBookTurnstileToken] = useState('')
  const bookTurnstileRef = useRef<TurnstileInstance>(null)

  const challenges = nl
    ? ['Te weinig leads', 'Leads die niet converteren', 'Geen tijd meer', 'Team te afhankelijk van mij', 'Andere uitdaging']
    : ['Not enough leads', 'Leads that do not convert', 'No time left', 'Team too dependent on me', 'Other challenge']
  const timelines = nl
    ? ['Zo snel mogelijk', 'Komende maand', 'Ik oriënteer me nog']
    : ['As soon as possible', 'Within the next month', 'Still exploring']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, website: noWebsite ? 'geen website' : website, message: `${message}${phone ? `\n\nTel: ${phone}` : ''}`, turnstileToken }),
      })
      if (!res.ok) throw new Error('Failed')
      router.push('/bedankt/contact')
    } catch {
      setError(t('Er ging iets mis. Probeer het opnieuw.', 'Something went wrong. Please try again.'))
      turnstileRef.current?.reset()
    } finally {
      setSending(false)
    }
  }

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookChallenge || !bookTimeline || !bookName || !bookEmail) return
    setBookSending(true)
    const msg = nl
      ? `Gesprekverzoek\n\nGrootste uitdaging: ${bookChallenge}\nSnelheid: ${bookTimeline}${bookPhone ? `\nTel: ${bookPhone}` : ''}`
      : `Call request\n\nBiggest challenge: ${bookChallenge}\nTimeline: ${bookTimeline}${bookPhone ? `\nPhone: ${bookPhone}` : ''}`
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: bookName,
          email: bookEmail,
          website: bookNoWebsite ? 'geen website' : bookWebsite,
          message: msg,
          source: 'call_request',
          turnstileToken: bookTurnstileToken,
        }),
      })
    } catch { /* fire and forget */ }
    setBookSending(false)
    router.push('/bedankt/gesprek')
  }

  const optional = <i>({t('optioneel', 'optional')})</i>

  return (
    <section id="contact" className="b-ct">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="b-ct-inner">

        <div className="b-ct-kicker">{t('Laten we beginnen', "Let's get started")}</div>
        <h2 className="b-ct-h2">
          {t('Klaar voor meer ', 'Ready for more ')}<span>{t('impact', 'impact')}</span>
        </h2>
        <p className="b-ct-sub">
          {t('Stuur een bericht of plan direct een gesprek in. Je krijgt antwoord van Jeroen, niet van een formulier.',
             'Send a message or book a call. You get a reply from Jeroen, not from a form.')}
        </p>

        <div className="b-ct-grid">

          {/* ── Links: contactformulier ── */}
          <div className="b-ct-col">
            {sent ? (
              <div className="b-ct-done">
                <Reply className="w-6 h-6" style={{ color: GRN }} />
                <div className="b-ct-done-t">{t('Bericht ontvangen', 'Message received')}</div>
                <p className="b-ct-lead">
                  {t(
                    'Check je inbox en ook je spammap. Je krijgt de info die je zoekt binnen enkele minuten.',
                    "Check your inbox and your spam folder. You'll get the info you're looking for within a few minutes."
                  )}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="b-ct-field">
                  <Label>{t('Naam', 'Name')}</Label>
                  <input className="b-ct-input" type="text" required value={name} onChange={e => setName(e.target.value)} placeholder={t('Jouw naam', 'Your name')} />
                </div>
                <div className="b-ct-field">
                  <Label>Email</Label>
                  <input className="b-ct-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="jou@email.com" />
                </div>
                <div className="b-ct-field">
                  <Label>{t('Telefoonnummer', 'Phone number')} {optional}</Label>
                  <input className="b-ct-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+32 ..." />
                </div>
                <div className="b-ct-field">
                  <Label>{t('Website', 'Website')} {optional}</Label>
                  <input
                    className="b-ct-input"
                    type="text"
                    value={noWebsite ? '' : website}
                    disabled={noWebsite}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://jouwbedrijf.be"
                  />
                  <label className="b-ct-check">
                    <input type="checkbox" checked={noWebsite} onChange={e => setNoWebsite(e.target.checked)} style={{ accentColor: GRN }} />
                    <span>{t('Ik heb nog geen website', "I don't have a website yet")}</span>
                  </label>
                </div>
                <div className="b-ct-field">
                  <Label>{t('Bericht', 'Message')} {optional}</Label>
                  <textarea
                    className="b-ct-input"
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    style={{ resize: 'none' }}
                    placeholder={t('Waar wil je mee aan de slag?', 'What would you like to work on?')}
                  />
                </div>
                {error && <p className="b-ct-err">{error}</p>}
                <div style={{ marginTop: 16 }}>
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={setTurnstileToken}
                    onError={() => setTurnstileToken('')}
                    onExpire={() => setTurnstileToken('')}
                    options={{ appearance: 'interaction-only' }}
                  />
                </div>
                <button type="submit" className="b-ct-btn" disabled={sending || !turnstileToken}>
                  {sending ? t('Versturen...', 'Sending...') : t('Verstuur', 'Send')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* ── Rechts: gesprek plannen ── */}
          <div className="b-ct-col">
            <p className="b-ct-lead">
              {t(
                'Liever meteen praten? Plan een gesprek van 15 minuten. Je laat je gegevens achter en krijgt direct enkele beschikbare momenten in je mailbox.',
                'Rather talk right away? Book a 15-minute call. Leave your details and you get available slots in your inbox straight away.'
              )}
            </p>

            {!bookOpen && !bookSent && (
              <button onClick={() => setBookOpen(true)} className="b-ct-card">
                <Calendar className="w-6 h-6 flex-shrink-0" style={{ color: GRN }} />
                <div>
                  <div className="b-ct-card-t">{t('Plan een gesprek', 'Book a call')}</div>
                  <div className="b-ct-card-s">{t('15 min · kennismaking', '15 min · intro call')}</div>
                </div>
                <ArrowRight className="w-5 h-5 ml-auto flex-shrink-0" style={{ color: ORNG }} />
              </button>
            )}

            {bookOpen && !bookSent && (
              <div className="b-ct-panel">
                <div className="b-ct-kicker" style={{ marginBottom: 20 }}>{t('Snel even kennismaken', 'Quick intro')}</div>
                <form onSubmit={handleBookSubmit}>
                  <div className="b-ct-field">
                    <Label>{t('Naam', 'Name')}</Label>
                    <input className="b-ct-input" type="text" required value={bookName} onChange={e => setBookName(e.target.value)} placeholder={t('Jouw naam', 'Your name')} />
                  </div>
                  <div className="b-ct-field">
                    <Label>Email</Label>
                    <input className="b-ct-input" type="email" required value={bookEmail} onChange={e => setBookEmail(e.target.value)} placeholder="jou@email.com" />
                  </div>
                  <div className="b-ct-field">
                    <Label>{t('Telefoonnummer', 'Phone number')} {optional}</Label>
                    <input className="b-ct-input" type="tel" value={bookPhone} onChange={e => setBookPhone(e.target.value)} placeholder="+32 ..." />
                  </div>
                  <div className="b-ct-field">
                    <Label>{t('Website', 'Website')} {optional}</Label>
                    <input
                      className="b-ct-input"
                      type="text"
                      value={bookNoWebsite ? '' : bookWebsite}
                      disabled={bookNoWebsite}
                      onChange={e => setBookWebsite(e.target.value)}
                      placeholder="https://jouwbedrijf.be"
                    />
                    <label className="b-ct-check">
                      <input type="checkbox" checked={bookNoWebsite} onChange={e => setBookNoWebsite(e.target.checked)} style={{ accentColor: GRN }} />
                      <span>{t('Ik heb nog geen website', "I don't have a website yet")}</span>
                    </label>
                  </div>
                  <div className="b-ct-field">
                    <Label>{t('Grootste uitdaging', 'Biggest challenge')}</Label>
                    <select className="b-ct-input" required value={bookChallenge} onChange={e => setBookChallenge(e.target.value)}>
                      <option value="">{t('Kies een optie', 'Choose an option')}</option>
                      {challenges.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="b-ct-field">
                    <Label>{t('Wanneer wil je actie ondernemen?', 'When do you want to take action?')}</Label>
                    <select className="b-ct-input" required value={bookTimeline} onChange={e => setBookTimeline(e.target.value)}>
                      <option value="">{t('Kies een optie', 'Choose an option')}</option>
                      {timelines.map(tl => <option key={tl} value={tl}>{tl}</option>)}
                    </select>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <Turnstile
                      ref={bookTurnstileRef}
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                      onSuccess={setBookTurnstileToken}
                      onError={() => setBookTurnstileToken('')}
                      onExpire={() => setBookTurnstileToken('')}
                      options={{ appearance: 'interaction-only' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="b-ct-btn b-ct-btn-grn"
                    disabled={bookSending || !bookChallenge || !bookTimeline || !bookTurnstileToken}
                  >
                    {bookSending ? t('Versturen...', 'Sending...') : t('Plan gesprek', 'Book call')}
                    <Calendar className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => setBookOpen(false)} className="b-ct-cancel">
                    {t('Annuleren', 'Cancel')}
                  </button>
                </form>
              </div>
            )}

            {bookSent && (
              <div className="b-ct-panel">
                <Calendar className="w-6 h-6" style={{ color: GRN }} />
                <div className="b-ct-done-t" style={{ marginTop: 12 }}>{t('Gesprek aangevraagd', 'Call requested')}</div>
                <p className="b-ct-lead" style={{ marginTop: 10 }}>
                  {t(
                    'Check je inbox. Jeroen stelt tijdstippen voor in zijn persoonlijk bericht.',
                    'Check your inbox. Jeroen will propose time slots in his personal message.'
                  )}
                </p>
              </div>
            )}

            <div className="b-ct-risk">
              <div className="b-ct-risk-k">{t('Geen risico', 'No risk')}</div>
              <p>
                {t(
                  'De gratis diagnose en het eerste gesprek zijn volledig vrijblijvend. Zelfs ons Actiehandboek heeft een terugbetalingsgarantie van 14 dagen als je er niet tevreden mee bent.',
                  'The free diagnostic and first call are completely no-obligation. Even our Action Manual comes with a 14-day money-back guarantee if you are not satisfied.'
                )}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
