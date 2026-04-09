'use client'

import { useState } from 'react'
import { ArrowRight, Mail, Calendar } from 'lucide-react'
import { useLang } from '@/components/lang-context'

export function Contact() {
  const { t } = useLang()
  const [sent, setSent] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple mailto fallback — replace with form API if needed
    window.location.href = `mailto:jeroen@leaditgrow.com?subject=Contact via leaditgrow.com&body=Naam: ${name}%0AEmail: ${email}%0A%0A${message}`
    setSent(true)
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
          <div
            className="text-[11px] font-bold uppercase tracking-widest mb-5"
            style={{ color: '#c96442' }}
          >
            {t('Laten we beginnen', 'Let\'s get started')}
          </div>
          <h2
            className="text-3xl sm:text-4xl font-semibold leading-tight"
            style={{ color: '#3d3929' }}
          >
            {t('Klaar voor meer ', 'Ready for more ')}
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>
              {t('impact?', 'impact?')}
            </span>
          </h2>
          <p className="mt-4 text-base" style={{ color: '#83827d' }}>
            {t(
              'Stuur een bericht of plan direct een gesprek in.',
              'Send a message or book a call directly.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact form */}
          <div
            className="rounded-2xl p-8"
            style={{ background: '#faf9f5', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid rgba(61,57,41,0.08)' }}
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-8 text-center">
                <div className="text-3xl">✓</div>
                <p className="font-semibold" style={{ color: '#3d3929' }}>
                  {t('Bericht verstuurd!', 'Message sent!')}
                </p>
                <p className="text-sm" style={{ color: '#83827d' }}>
                  {t('Ik neem zo snel mogelijk contact op.', 'I\'ll be in touch as soon as possible.')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#83827d' }}>
                    {t('Naam', 'Name')}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: '#f3f1eb',
                      border: '1px solid rgba(61,57,41,0.1)',
                      color: '#3d3929',
                    }}
                    placeholder={t('Jouw naam', 'Your name')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#83827d' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: '#f3f1eb',
                      border: '1px solid rgba(61,57,41,0.1)',
                      color: '#3d3929',
                    }}
                    placeholder="jou@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#83827d' }}>
                    {t('Bericht', 'Message')}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                    style={{
                      background: '#f3f1eb',
                      border: '1px solid rgba(61,57,41,0.1)',
                      color: '#3d3929',
                    }}
                    placeholder={t('Waar wil je mee aan de slag?', 'What would you like to work on?')}
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: '#c96442' }}
                >
                  {t('Verstuur bericht', 'Send message')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Direct links */}
          <div className="flex flex-col gap-5">
            <a
              href="mailto:jeroen@leaditgrow.com"
              className="flex items-center gap-5 p-6 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: '#faf9f5',
                border: '1px solid rgba(61,57,41,0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                color: '#3d3929',
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(201,100,66,0.1)' }}
              >
                <Mail className="w-5 h-5" style={{ color: '#c96442' }} />
              </div>
              <div>
                <div className="text-sm font-semibold mb-0.5">Email</div>
                <div className="text-sm" style={{ color: '#83827d' }}>jeroen@leaditgrow.com</div>
              </div>
            </a>

            <a
              href="#contact"
              className="flex items-center gap-5 p-6 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: '#faf9f5',
                border: '1px solid rgba(61,57,41,0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                color: '#3d3929',
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(21,128,61,0.1)' }}
              >
                <Calendar className="w-5 h-5" style={{ color: '#15803d' }} />
              </div>
              <div>
                <div className="text-sm font-semibold mb-0.5">{t('Plan een gesprek', 'Book a call')}</div>
                <div className="text-sm" style={{ color: '#83827d' }}>
                  {t('30 min · Gratis kennismaking', '30 min · Free intro call')}
                </div>
              </div>
            </a>

            {/* Mini value prop */}
            <div
              className="mt-auto p-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(10,30,16,0.96) 0%, rgba(22,51,37,0.96) 100%)',
              }}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#a3c4a8' }}>
                {t('Geen risico', 'No risk')}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(250,249,245,0.75)' }}>
                {t(
                  'Begin met de gratis Revenue Calculator. Geen verplichting, wel direct inzicht in wat je nu misloopt.',
                  'Start with the free Revenue Calculator. No commitment, immediate insight into what you\'re missing right now.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
