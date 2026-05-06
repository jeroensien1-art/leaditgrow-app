'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Calendar, Reply } from 'lucide-react'
import { useLang } from '@/components/lang-context'
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'

const inputStyle = {
  background: '#f3f1eb',
  border: '1px solid rgba(61,57,41,0.1)',
  color: '#3d3929',
}
const selectStyle = {
  ...inputStyle,
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2383827d' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: 36,
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#83827d' }}>
      {children}
    </label>
  )
}

function FieldInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
      style={inputStyle}
    />
  )
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
        body: JSON.stringify({ name, email, website: noWebsite ? 'geen website' : website, message, turnstileToken }),
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
      ? `Gesprekverzoek\n\nGrootste uitdaging: ${bookChallenge}\nSnelheid: ${bookTimeline}`
      : `Call request\n\nBiggest challenge: ${bookChallenge}\nTimeline: ${bookTimeline}`
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

  const cardBase = {
    background: '#faf9f5',
    border: '1px solid rgba(61,57,41,0.1)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    color: '#3d3929',
  }

  return (
    <section
      id="contact"
      className="relative py-28 px-6"
      style={{ background: 'linear-gradient(to bottom, #faf9f5 0%, #f0ede4 100%)' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <div className="text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color: '#c96442' }}>
            {t('Laten we beginnen', "Let's get started")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold leading-tight" style={{ color: '#3d3929' }}>
            {t('Klaar voor meer ', 'Ready for more ')}
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>
              {t('impact?', 'impact?')}
            </span>
          </h2>
          <p className="mt-4 text-base" style={{ color: '#83827d' }}>
            {t('Stuur een bericht of plan direct een gesprek in.', 'Send a message or book a call directly.')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Left: contact form ── */}
          <div className="rounded-2xl p-8" style={{ background: '#faf9f5', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid rgba(61,57,41,0.08)' }}>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-8 text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,100,66,0.1)' }}>
                  <Reply className="w-5 h-5" style={{ color: '#c96442' }} />
                </div>
                <p className="font-semibold" style={{ color: '#3d3929' }}>{t('Bericht ontvangen!', 'Message received!')}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#83827d' }}>
                  {t(
                    'Check je inbox (en ook je spammap). Je krijgt de info die je zoekt binnen enkele minuten.',
                    "Check your inbox (and spam folder). You'll get the info you're looking for within a few minutes."
                  )}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <Label>{t('Naam', 'Name')}</Label>
                  <FieldInput type="text" required value={name} onChange={e => setName(e.target.value)} placeholder={t('Jouw naam', 'Your name')} />
                </div>
                <div>
                  <Label>Email</Label>
                  <FieldInput type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="jou@email.com" />
                </div>
                <div>
                  <Label>{t('Website', 'Website')} <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>({t('optioneel', 'optional')})</span></Label>
                  <FieldInput
                    type="text"
                    value={noWebsite ? '' : website}
                    disabled={noWebsite}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://jouwbedrijf.be"
                    style={{ ...inputStyle, opacity: noWebsite ? 0.4 : 1 }}
                  />
                  <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={noWebsite}
                      onChange={e => setNoWebsite(e.target.checked)}
                      className="rounded"
                      style={{ accentColor: '#c96442' }}
                    />
                    <span className="text-xs" style={{ color: '#83827d' }}>{t('Ik heb nog geen website', "I don't have a website yet")}</span>
                  </label>
                </div>
                <div>
                  <Label>{t('Bericht', 'Message')}</Label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                    style={inputStyle}
                    placeholder={t('Waar wil je mee aan de slag?', 'What would you like to work on?')}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                  onSuccess={setTurnstileToken}
                  onError={() => setTurnstileToken('')}
                  onExpire={() => setTurnstileToken('')}
                  options={{ appearance: 'interaction-only' }}
                />
                <button
                  type="submit"
                  disabled={sending || !turnstileToken}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: '#c96442' }}
                >
                  {sending ? t('Versturen...', 'Sending...') : t('Verstuur bericht', 'Send message')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* ── Right: how it works + book-a-call ── */}
          <div className="flex flex-col gap-5">

            {/* Short intro above book-a-call */}
            <div className="px-1">
              <p className="text-sm leading-relaxed" style={{ color: '#83827d' }}>
                {t(
                  'Je kan ook een kort gesprek inplannen van 15 min door je gegevens achter te laten. Je krijgt direct enkele beschikbare contactmomenten in je mailbox.',
                  'You can also book a quick 15-min call by leaving your details. You will receive available time slots directly in your inbox.'
                )}
              </p>
            </div>

            {/* Book a call — toggles into qualification form */}
            {!bookOpen && !bookSent && (
              <button
                onClick={() => setBookOpen(true)}
                className="flex items-center gap-5 p-6 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg text-left w-full"
                style={cardBase}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(21,128,61,0.1)' }}>
                  <Calendar className="w-5 h-5" style={{ color: '#15803d' }} />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-0.5">{t('Plan een gesprek', 'Book a call')}</div>
                  <div className="text-sm" style={{ color: '#83827d' }}>{t('15 min · Kennismakingsgesprek', '15 min · Intro call')}</div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: '#c96442' }} />
              </button>
            )}

            {bookOpen && !bookSent && (
              <div className="p-6 rounded-2xl" style={cardBase}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#c96442' }}>
                  {t('Snel even kennis maken', 'Quick intro')}
                </div>
                <form onSubmit={handleBookSubmit} className="flex flex-col gap-3">
                  <div>
                    <Label>{t('Naam', 'Name')}</Label>
                    <FieldInput type="text" required value={bookName} onChange={e => setBookName(e.target.value)} placeholder={t('Jouw naam', 'Your name')} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <FieldInput type="email" required value={bookEmail} onChange={e => setBookEmail(e.target.value)} placeholder="jou@email.com" />
                  </div>
                  <div>
                    <Label>{t('Website', 'Website')} <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>({t('optioneel', 'optional')})</span></Label>
                    <FieldInput
                      type="text"
                      value={bookNoWebsite ? '' : bookWebsite}
                      disabled={bookNoWebsite}
                      onChange={e => setBookWebsite(e.target.value)}
                      placeholder="https://jouwbedrijf.be"
                      style={{ ...inputStyle, opacity: bookNoWebsite ? 0.4 : 1 }}
                    />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                      <input type="checkbox" checked={bookNoWebsite} onChange={e => setBookNoWebsite(e.target.checked)} style={{ accentColor: '#c96442' }} />
                      <span className="text-xs" style={{ color: '#83827d' }}>{t('Ik heb nog geen website', "I don't have a website yet")}</span>
                    </label>
                  </div>
                  <div>
                    <Label>{t('Grootste uitdaging', 'Biggest challenge')}</Label>
                    <select
                      required
                      value={bookChallenge}
                      onChange={e => setBookChallenge(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={selectStyle}
                    >
                      <option value="">{t('Kies een optie', 'Choose an option')}</option>
                      {challenges.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>{t('Wanneer wil je actie ondernemen?', 'When do you want to take action?')}</Label>
                    <select
                      required
                      value={bookTimeline}
                      onChange={e => setBookTimeline(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={selectStyle}
                    >
                      <option value="">{t('Kies een optie', 'Choose an option')}</option>
                      {timelines.map(tl => <option key={tl} value={tl}>{tl}</option>)}
                    </select>
                  </div>
                  <Turnstile
                    ref={bookTurnstileRef}
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={setBookTurnstileToken}
                    onError={() => setBookTurnstileToken('')}
                    onExpire={() => setBookTurnstileToken('')}
                    options={{ appearance: 'interaction-only' }}
                  />
                  <button
                    type="submit"
                    disabled={bookSending || !bookChallenge || !bookTimeline || !bookTurnstileToken}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: '#c96442' }}
                  >
                    {bookSending ? t('Versturen...', 'Sending...') : t('Plan gesprek', 'Book call')}
                    <Calendar className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => setBookOpen(false)} className="text-xs text-center" style={{ color: '#83827d' }}>
                    {t('Annuleren', 'Cancel')}
                  </button>
                </form>
              </div>
            )}

            {bookSent && (
              <div className="flex flex-col items-center gap-3 p-6 rounded-2xl text-center" style={cardBase}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(21,128,61,0.1)' }}>
                  <Calendar className="w-5 h-5" style={{ color: '#15803d' }} />
                </div>
                <p className="font-semibold text-sm" style={{ color: '#3d3929' }}>{t('Gesprek aangevraagd!', 'Call requested!')}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#83827d' }}>
                  {t(
                    'Check je inbox. Jeroen stelt tijdstippen voor in zijn persoonlijk bericht.',
                    'Check your inbox. Jeroen will propose time slots in his personal message.'
                  )}
                </p>
              </div>
            )}

            {/* Value prop */}
            <div
              className="mt-auto p-6 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(10,30,16,0.96) 0%, rgba(22,51,37,0.96) 100%)' }}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#a3c4a8' }}>
                {t('Geen risico', 'No risk')}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(250,249,245,0.75)' }}>
                {t(
                  'De gratis diagnose en het eerste gesprek zijn volledig vrijblijvend. Zelfs ons Actiehandboek heeft een 14-daagse terugbetalingsgarantie als je er niet volledig tevreden mee bent.',
                  'The free diagnostic and first call are completely no-obligation. Even our Action Manual comes with a 14-day money-back guarantee if you are not fully satisfied.'
                )}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
