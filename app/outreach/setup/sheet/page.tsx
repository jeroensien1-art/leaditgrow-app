'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const OFFERS = [
  { value: 'leiderschapsanalyse', label: 'Leiderschapsanalyse' },
  { value: 'speed-to-lead', label: 'Speed-to-lead' },
  { value: 'bedrijfsgroei', label: 'Bedrijfsgroei' },
] as const

export default function SheetSetupPage() {
  const router = useRouter()
  const [sheetId, setSheetId] = useState('')
  const [defaultOffer, setDefaultOffer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/outreach/setup/sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheet_id: sheetId, default_offer: defaultOffer }),
    })

    if (res.ok) {
      router.push('/outreach/session')
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Er ging iets mis. Probeer opnieuw.')
      setLoading(false)
    }
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
      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c96442', marginBottom: 8 }}>
            Lead it, Grow · Stap 2 van 2
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#3d3929', margin: 0 }}>Koppel je Google Sheet</h1>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          <div style={{ width: 32, height: 4, borderRadius: 2, background: 'rgba(61,57,41,0.15)' }} />
          <div style={{ width: 32, height: 4, borderRadius: 2, background: '#c96442' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#3d3929', marginBottom: 6 }}>
            Sheet ID
          </label>
          <input
            type="text"
            value={sheetId}
            onChange={e => setSheetId(e.target.value)}
            placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 12,
              border: '1px solid rgba(61,57,41,0.15)',
              background: '#fff',
              fontSize: 14,
              color: '#3d3929',
              outline: 'none',
              marginBottom: 20,
              boxSizing: 'border-box',
            }}
          />

          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#3d3929', marginBottom: 10 }}>
            Standaard aanbod (optioneel)
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {OFFERS.map(offer => (
              <label key={offer.value} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#3d3929' }}>
                <input
                  type="radio"
                  name="default_offer"
                  value={offer.value}
                  checked={defaultOffer === offer.value}
                  onChange={() => setDefaultOffer(offer.value)}
                  style={{ accentColor: '#c96442' }}
                />
                {offer.label}
              </label>
            ))}
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#3d3929' }}>
              <input
                type="radio"
                name="default_offer"
                value=""
                checked={defaultOffer === null}
                onChange={() => setDefaultOffer(null)}
                style={{ accentColor: '#c96442' }}
              />
              Geen voorkeur
            </label>
          </div>

          {error && <p style={{ fontSize: 13, color: '#e05b3a', marginBottom: 10 }}>{error}</p>}

          <button
            type="submit"
            disabled={loading || !sheetId}
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
              opacity: loading || !sheetId ? 0.6 : 1,
            }}
          >
            {loading ? 'Opslaan...' : 'Setup afronden'}
          </button>
        </form>
      </div>
    </div>
  )
}
