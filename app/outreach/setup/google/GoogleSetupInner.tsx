'use client'

import { useSearchParams } from 'next/navigation'

const ERROR_MESSAGES: Record<string, string> = {
  csrf: 'De authenticatie is verlopen. Probeer opnieuw.',
  no_refresh: 'Je account kon niet volledig gekoppeld worden. Klik opnieuw op de knop en geef alle rechten.',
}

export default function GoogleSetupInner() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div style={{
      minHeight: '100svh',
      background: 'linear-gradient(to bottom, #faf9f5, #f0ede4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c96442', marginBottom: 8 }}>
            Lead it, Grow · Stap 1 van 2
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#3d3929', margin: 0 }}>Koppel je Google account</h1>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          <div style={{ width: 32, height: 4, borderRadius: 2, background: '#c96442' }} />
          <div style={{ width: 32, height: 4, borderRadius: 2, background: 'rgba(61,57,41,0.15)' }} />
        </div>

        {error && (
          <p style={{ fontSize: 13, color: '#e05b3a', marginBottom: 16, textAlign: 'center' }}>
            {ERROR_MESSAGES[error] ?? 'Er ging iets mis. Probeer opnieuw.'}
          </p>
        )}

        <p style={{ fontSize: 14, color: '#3d3929', lineHeight: 1.6, marginBottom: 24, textAlign: 'center' }}>
          We hebben toegang nodig tot je Google Sheets en Gmail om outreach te versturen namens jou.
        </p>

        <a
          href="/api/outreach/auth/google"
          style={{
            display: 'block',
            width: '100%',
            padding: '13px',
            borderRadius: 12,
            border: 'none',
            background: '#c96442',
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            textAlign: 'center',
            textDecoration: 'none',
            boxSizing: 'border-box',
          }}
        >
          Koppel je Google account
        </a>
      </div>
    </div>
  )
}
