'use client'

import { useState } from 'react'
import { ArrowRight, Loader2, Check } from 'lucide-react'
import type { FreebieConfig, FreebieId } from '@/lib/freebies'

export function FreebieGrid({ items }: { items: FreebieConfig[] }) {
  const [open, setOpen] = useState<FreebieId | null>(null)
  const [klaar, setKlaar] = useState<FreebieId[]>([])

  return (
    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      {items.map((item, index) => {
        const isOpen = open === item.id
        const isKlaar = klaar.includes(item.id)
        const isEerste = index === 0
        return (
          <article
            key={item.id}
            style={{
              background: '#fff',
              border: `1px solid ${isOpen || isEerste ? 'rgba(201,100,66,0.35)' : 'rgba(61,57,41,0.1)'}`,
              borderRadius: '16px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              transition: 'border-color 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {isEerste && (
                <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#faf9f5', background: '#1a5e35', padding: '3px 8px', borderRadius: '999px' }}>
                  Begin hier
                </span>
              )}
              <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c96442' }}>
                Keyword {item.keyword}
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '21px', fontWeight: 400, lineHeight: 1.25, color: '#0a1e10', margin: '0 0 0.75rem' }}>
              {item.title}
            </h2>

            <p style={{ fontSize: '14px', color: '#535146', lineHeight: 1.65, margin: '0 0 1rem' }}>
              {item.pitch}
            </p>

            <div style={{ background: '#f5f3ee', border: '1px solid rgba(26,94,53,0.18)', borderRadius: '10px', padding: '0.85rem 1rem', margin: '0 0 1rem' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a5e35', marginBottom: '0.4rem' }}>
                Wat je eraan overhoudt
              </div>
              <p style={{ fontSize: '13.5px', color: '#2a2721', lineHeight: 1.6, margin: 0 }}>
                {item.uitkomst}
              </p>
            </div>

            <p style={{ fontSize: '13px', color: '#83827d', lineHeight: 1.6, margin: '0 0 1.5rem', fontStyle: 'italic' }}>
              {item.voorWie}
            </p>

            <div style={{ marginTop: 'auto' }}>
              {isKlaar ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', background: '#f5f3ee', border: '1px solid rgba(61,57,41,0.08)' }}>
                  <Check className="w-4 h-4" style={{ color: '#1a5e35' }} />
                  <span style={{ fontSize: '13px', color: '#3d3929' }}>Check je inbox, ook je spammap.</span>
                </div>
              ) : isOpen ? (
                <OptinForm freebie={item.id} onDone={() => { setKlaar(k => [...k, item.id]); setOpen(null) }} />
              ) : (
                <button
                  onClick={() => setOpen(item.id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 22px', borderRadius: '999px', background: '#c96442', color: '#fff', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(201,100,66,0.3)' }}
                >
                  Gratis downloaden <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}

function OptinForm({ freebie, onDone }: { freebie: FreebieId; onDone: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/freebie-optin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, freebie }),
      })
      if (!res.ok) throw new Error()
      onDone()
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: '11px 16px',
    borderRadius: '999px',
    fontSize: '14px',
    outline: 'none',
    border: '1px solid rgba(61,57,41,0.15)',
    background: '#fff',
    width: '100%',
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <input type="text" required placeholder="Je naam" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
      <input type="email" required placeholder="Je e-mailadres" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 22px', borderRadius: '999px', background: '#c96442', color: '#fff', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer', opacity: status === 'loading' ? 0.6 : 1 }}
      >
        {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Stuur hem door <ArrowRight className="w-4 h-4" /></>}
      </button>
      {status === 'error' && (
        <p style={{ fontSize: '12px', color: '#c96442', textAlign: 'center', margin: 0 }}>Er ging iets mis, probeer het nog eens.</p>
      )}
    </form>
  )
}
