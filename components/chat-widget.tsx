'use client'

import { useState, useRef, useEffect } from 'react'
import { X, ArrowRight } from 'lucide-react'
import { useLang } from '@/components/lang-context'
import { LogoFull, LogoSVG } from '@/components/ui/logo-svg'

// ── Types ──────────────────────────────────────────────────────────────────────

type BotStep =
  | 'welcome'
  | 'challenge'
  | 'route'
  | 'book_form'
  | 'done_diagnostic'
  | 'done_call'

interface Message {
  from: 'bot' | 'user'
  text: string
}

// ── Brutalist design tokens ──────────────────────────────────────────────────
const B    = 'var(--font-brutalist, system-ui)'
const M    = 'var(--font-mono-brutalist, monospace)'
const INK  = '#0e0d0b'
const BG   = '#f2f0eb'
const BG2  = '#eae8e2'
const GRN  = '#1a5e35'
const MUT  = '#787068'

// ── Main component ─────────────────────────────────────────────────────────────

export function ChatWidget() {
  const { lang } = useLang()
  const nl = lang === 'nl'

  const [open, setOpen] = useState(false)
  const [badge, setBadge] = useState(true)
  const [botStep, setBotStep] = useState<BotStep>('welcome')
  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping] = useState(false)
  const [bookName, setBookName] = useState('')
  const [bookEmail, setBookEmail] = useState('')
  const [bookSending, setBookSending] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-open after 5 seconds on first load
  useEffect(() => {
    const t = setTimeout(() => {
      setBadge(false)
      setOpen(true)
    }, 5000)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Add welcome message when first opened
  useEffect(() => {
    if (open && messages.length === 0) {
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setMessages([{
          from: 'bot',
          // Kort houden: de naam staat al in de kop erboven, en niemand leest
          // vijf regels voor hij op een knop klikt.
          text: nl
            ? 'Hoi! Twee korte vragen en we weten of we iets voor je kunnen betekenen.'
            : 'Hi! Two quick questions and we\'ll know if we can help you.',
        }])
        setBotStep('challenge')
      }, 700)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const addBot = (text: string, nextStep: BotStep, delay = 600) => {
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { from: 'bot', text }])
      setBotStep(nextStep)
    }, delay)
  }

  const handleOpen = () => {
    setBadge(false)
    setOpen(true)
  }

  const handleChallenge = (choice: string) => {
    setSelectedChallenge(choice)
    setMessages(prev => [...prev, { from: 'user', text: choice }])
    const botReply = nl
      ? `Helder. Dan zijn er 2 snelle opties om verder te gaan:`
      : `Got it. Here are 2 quick ways to move forward:`
    addBot(botReply, 'route')
  }

  const handleRoute = (choice: 'diagnostic' | 'call') => {
    const label = nl
      ? (choice === 'diagnostic' ? 'Gratis diagnose doen' : '15-min gesprek inplannen')
      : (choice === 'diagnostic' ? 'Do the free diagnostic' : 'Book a 15-min call')
    setMessages(prev => [...prev, { from: 'user', text: label }])
    if (choice === 'diagnostic') {
      addBot(
        nl
          ? 'Super! De diagnose duurt 3-4 minuten en je ontvangt direct een persoonlijk rapport. Klik hieronder om te starten.'
          : 'Great! The diagnostic takes 3-4 minutes and you receive a personalised report immediately. Click below to start.',
        'done_diagnostic',
      )
    } else {
      addBot(
        nl
          ? 'Top. Laat je naam en email achter en we sturen je direct enkele beschikbare momenten.'
          : 'Perfect. Leave your name and email and we\'ll send you available time slots right away.',
        'book_form',
      )
    }
  }

  const handleBookSubmit = async () => {
    if (!bookName.trim() || !bookEmail.includes('@')) return
    setBookSending(true)
    const challenge = selectedChallenge
    const msg = nl
      ? `Chatbot gesprekverzoek\n\nUitdaging: ${challenge}\nNaam: ${bookName}`
      : `Chatbot call request\n\nChallenge: ${challenge}\nName: ${bookName}`
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: bookName, email: bookEmail, message: msg, source: 'chatbot_call' }),
      })
    } catch { /* fire and forget */ }
    setMessages(prev => [...prev, { from: 'user', text: nl ? 'Verstuurd!' : 'Sent!' }])
    addBot(
      nl
        ? 'Goed! Je ontvangt zo snel mogelijk een mail van mij met beschikbare momenten. Check ook je spammap.'
        : 'Done! You will receive an email from me with available slots as soon as possible. Check your spam too.',
      'done_call',
    )
    setBookSending(false)
  }

  const challenges = nl
    ? ['Te weinig leads', 'Leads die niet converteren', 'Tijd en handen tekort om te groeien', 'Iets anders']
    : ['Not enough leads', 'Leads not converting', 'Not enough time and capacity to grow', 'Something else']

  return (
    <>
      {/* ── Floating bubble ── */}
      <button
        onClick={handleOpen}
        aria-label={nl ? 'Open chat' : 'Open chat'}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 0,
          background: GRN,
          color: '#fff',
          border: `2px solid ${INK}`,
          boxShadow: `4px 4px 0 ${INK}`,
          cursor: 'pointer',
          display: open ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => {
          ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
        }}
      >
        <LogoSVG size={28} />
        {badge && (
          <span style={{
            position: 'absolute',
            top: -3,
            right: -3,
            width: 18,
            height: 18,
            background: '#4ade80',
            borderRadius: '50%',
            fontSize: 12,
            fontWeight: 700,
            fontFamily: M,
            color: INK,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${BG}`,
          }}>1</span>
        )}
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 340,
            maxWidth: 'calc(100vw - 32px)',
            borderRadius: 0,
            background: BG,
            boxShadow: `6px 6px 0 rgba(14,13,11,0.18)`,
            border: `2px solid ${INK}`,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '80vh',
            overflow: 'hidden',
            fontFamily: B,
          }}
        >
          {/* Header */}
          <div style={{
            padding: '14px 16px',
            background: INK,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            borderBottom: `2px solid ${INK}`,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              border: '2px solid rgba(242,240,235,0.25)',
              background: GRN,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 17,
              fontWeight: 700,
              color: '#fff',
            }}>
              <img
                src="/jeroen.jpg"
                alt="Jeroen"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <LogoFull height={56} textColor={BG} />
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(242,240,235,0.5)', cursor: 'pointer', padding: 4 }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px 14px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  maxWidth: '82%',
                  padding: '9px 12px',
                  borderRadius: 0,
                  background: m.from === 'user' ? GRN : BG2,
                  color: m.from === 'user' ? '#fff' : INK,
                  fontSize: 15,
                  lineHeight: 1.55,
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 14px',
                  background: BG2,
                  borderRadius: 0,
                  display: 'flex',
                  gap: 4,
                  alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: MUT,
                      display: 'inline-block',
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies / input area */}
          <div style={{ padding: '8px 14px 14px', borderTop: `2px solid ${INK}` }}>

            {botStep === 'challenge' && !typing && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontFamily: M, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: MUT, marginBottom: 2 }}>
                  {nl ? 'Jouw grootste uitdaging:' : 'Your biggest challenge:'}
                </div>
                {challenges.map(c => (
                  <button
                    key={c}
                    onClick={() => handleChallenge(c)}
                    style={{
                      padding: '9px 12px',
                      background: BG2,
                      border: `1.5px solid rgba(14,13,11,0.15)`,
                      borderRadius: 0,
                      fontSize: 14,
                      fontFamily: B,
                      color: INK,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = GRN)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(14,13,11,0.15)')}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {botStep === 'route' && !typing && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button
                  onClick={() => handleRoute('diagnostic')}
                  style={{
                    padding: '10px 14px',
                    background: GRN,
                    border: 'none',
                    borderRadius: 0,
                    fontSize: 14,
                    fontFamily: B,
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {nl ? 'Gratis diagnose doen (3 min)' : 'Free diagnostic (3 min)'}
                  <ArrowRight size={13} />
                </button>
                <button
                  onClick={() => handleRoute('call')}
                  style={{
                    padding: '10px 14px',
                    background: BG2,
                    border: `1.5px solid rgba(14,13,11,0.15)`,
                    borderRadius: 0,
                    fontSize: 14,
                    fontFamily: B,
                    color: INK,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {nl ? '15-min gesprek met Jeroen' : '15-min call with Jeroen'}
                </button>
              </div>
            )}

            {botStep === 'book_form' && !typing && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <input
                  type="text"
                  placeholder={nl ? 'Jouw naam' : 'Your name'}
                  value={bookName}
                  onChange={e => setBookName(e.target.value)}
                  style={{
                    padding: '9px 12px',
                    background: '#fff',
                    border: `1.5px solid rgba(14,13,11,0.2)`,
                    borderRadius: 0,
                    fontSize: 14,
                    fontFamily: B,
                    color: INK,
                    outline: 'none',
                  }}
                />
                <input
                  type="email"
                  placeholder="email@bedrijf.be"
                  value={bookEmail}
                  onChange={e => setBookEmail(e.target.value)}
                  style={{
                    padding: '9px 12px',
                    background: '#fff',
                    border: `1.5px solid rgba(14,13,11,0.2)`,
                    borderRadius: 0,
                    fontSize: 14,
                    fontFamily: B,
                    color: INK,
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleBookSubmit}
                  disabled={bookSending || !bookName.trim() || !bookEmail.includes('@')}
                  style={{
                    padding: '10px 14px',
                    background: GRN,
                    border: 'none',
                    borderRadius: 0,
                    fontSize: 14,
                    fontFamily: B,
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    opacity: (bookSending || !bookName.trim() || !bookEmail.includes('@')) ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  {bookSending ? (nl ? 'Versturen...' : 'Sending...') : (nl ? 'Plan gesprek' : 'Book call')}
                  <ArrowRight size={13} />
                </button>
              </div>
            )}

            {botStep === 'done_diagnostic' && !typing && (
              <a
                href="/diagnostic"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '10px 14px',
                  background: GRN,
                  borderRadius: 0,
                  fontSize: 14,
                  fontFamily: B,
                  color: '#fff',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {nl ? 'Start gratis diagnose' : 'Start free diagnostic'}
                <ArrowRight size={13} />
              </a>
            )}

            {botStep === 'done_call' && !typing && (
              <p style={{ fontSize: 13, fontFamily: B, color: MUT, textAlign: 'center', margin: 0 }}>
                {nl ? 'Tot snel!' : 'Talk soon!'}
              </p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  )
}
