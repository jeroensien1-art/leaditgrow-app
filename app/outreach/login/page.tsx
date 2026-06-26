'use client'

import { useState } from 'react'

export default function OutreachLogin() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/outreach/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setSent(true)
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Er ging iets mis. Probeer opnieuw.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100svh',
      background: 'linear-gradient(to bottom, #faf9f5, #f0ede4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: 360, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c96442', marginBottom: 8 }}>
            Lead it, Grow
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#3d3929', margin: 0 }}>Outreach Dashboard</h1>
        </div>

        {sent ? (
          <p style={{ textAlign: 'center', fontSize: 15, color: '#3d3929', lineHeight: 1.6 }}>
            Check je mail voor de inloglink.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jouw@email.com"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                border: '1px solid rgba(61,57,41,0.15)',
                background: '#fff',
                fontSize: 15,
                color: '#3d3929',
                outline: 'none',
                marginBottom: 12,
                boxSizing: 'border-box',
              }}
            />
            {error && <p style={{ fontSize: 13, color: '#e05b3a', marginBottom: 10 }}>{error}</p>}
            <button
              type="submit"
              disabled={loading || !email}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 12,
                border: 'none',
                background: '#c96442',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading || !email ? 0.6 : 1,
              }}
            >
              {loading ? 'Versturen...' : 'Stuur inloglink'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
