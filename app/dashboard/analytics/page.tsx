'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, TrendingUp, Search, ArrowLeft, Zap, AlertTriangle, BarChart2, Activity } from 'lucide-react'
import Link from 'next/link'
import type { AnalyticsData, ChannelRow, StrikingDistanceRow, CtrGapRow, DecayRow, LandingPageRow } from '@/lib/analytics'

// ─── Style constants (matches /dashboard, brutalist system) ─────────────────

const B = 'var(--font-brutalist, system-ui)'
const M = 'var(--font-mono-brutalist, monospace)'

const C = {
  bg: '#f2f0eb',
  surface: 'rgba(14,13,11,0.03)',
  border: 'rgba(14,13,11,0.15)',
  accent: '#c96442',
  muted: '#787068',
  text: '#0e0d0b',
  green: '#1a5e35',
  red: '#c96442',
  yellow: '#b8794f',
  blue: '#3b82f6',
}

const card: React.CSSProperties = {
  background: '#fff',
  border: `2px solid ${C.text}`,
  padding: '20px 24px',
}

const sectionTitle: React.CSSProperties = {
  fontFamily: M,
  fontSize: 13,
  fontWeight: 700,
  color: C.text,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}

const badge = (n: number): React.CSSProperties => ({
  fontFamily: M,
  fontSize: 11,
  fontWeight: 700,
  background: n > 0 ? 'rgba(201,100,66,0.12)' : 'rgba(14,13,11,0.06)',
  color: n > 0 ? C.accent : C.muted,
  padding: '2px 8px',
})

const th: React.CSSProperties = {
  fontFamily: M,
  fontSize: 10,
  fontWeight: 700,
  color: C.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  padding: '6px 10px',
  textAlign: 'left',
  borderBottom: `2px solid ${C.text}`,
  whiteSpace: 'nowrap',
}

const td: React.CSSProperties = {
  fontFamily: B,
  fontSize: 13,
  color: C.text,
  padding: '10px 10px',
  borderBottom: `1px solid rgba(14,13,11,0.1)`,
  verticalAlign: 'middle',
}

function Pill({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ fontFamily: M, fontSize: 11, fontWeight: 600, color, background: bg, padding: '2px 8px', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

function ChangeIndicator({ pct }: { pct: number }) {
  const color = pct > 0 ? C.green : pct < 0 ? C.red : C.muted
  const sign = pct > 0 ? '+' : ''
  return <span style={{ fontSize: 12, fontWeight: 700, color }}>{sign}{pct}%</span>
}

// ─── Channel table ─────────────────────────────────────────────────────────────

function ChannelTable({ rows }: { rows: ChannelRow[] }) {
  const CHANNEL_COLORS: Record<string, string> = {
    'Organic Search': C.green,
    'Paid Search': C.blue,
    'Direct': C.muted,
    'Organic Social': '#a855f7',
    'Paid Social': '#7c3aed',
    'Email': C.yellow,
    'Referral': '#0891b2',
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>Kanaal</th>
            <th style={{ ...th, textAlign: 'right' }}>Sessies</th>
            <th style={{ ...th, textAlign: 'right' }}>vs vorige 28d</th>
            <th style={{ ...th, textAlign: 'right' }}>Conversies</th>
            <th style={{ ...th, textAlign: 'right' }}>Bounce</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.channel}>
              <td style={td}>
                <span style={{ fontWeight: 600, color: CHANNEL_COLORS[r.channel] ?? C.text }}>{r.channel || '(direct)'}</span>
              </td>
              <td style={{ ...td, textAlign: 'right', fontWeight: 700 }}>{r.sessions.toLocaleString()}</td>
              <td style={{ ...td, textAlign: 'right' }}><ChangeIndicator pct={r.changePercent} /></td>
              <td style={{ ...td, textAlign: 'right' }}>{r.conversions}</td>
              <td style={{ ...td, textAlign: 'right' }}>{r.bounceRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Striking distance ────────────────────────────────────────────────────────

function StrikingTable({ rows }: { rows: StrikingDistanceRow[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>Query</th>
            <th style={{ ...th, textAlign: 'right' }}>Positie</th>
            <th style={{ ...th, textAlign: 'right' }}>Impressies</th>
            <th style={{ ...th, textAlign: 'right' }}>CTR</th>
            <th style={{ ...th, textAlign: 'right' }}>Geschat extra verkeer</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.query}>
              <td style={td}>
                <span style={{ fontWeight: i < 3 ? 700 : 400 }}>{r.query}</span>
              </td>
              <td style={{ ...td, textAlign: 'right' }}>
                <span style={{
                  fontWeight: 700,
                  color: r.position <= 6 ? C.yellow : C.muted,
                }}>{r.position}</span>
              </td>
              <td style={{ ...td, textAlign: 'right' }}>{r.impressions.toLocaleString()}</td>
              <td style={{ ...td, textAlign: 'right' }}>{r.ctr}%</td>
              <td style={{ ...td, textAlign: 'right' }}>
                <span style={{ fontWeight: 700, color: C.accent }}>+{r.estimatedGain.toLocaleString()}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── CTR Gaps ─────────────────────────────────────────────────────────────────

function CtrGapsTable({ rows }: { rows: CtrGapRow[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>Query</th>
            <th style={{ ...th, textAlign: 'right' }}>Positie</th>
            <th style={{ ...th, textAlign: 'right' }}>Impressies</th>
            <th style={{ ...th, textAlign: 'right' }}>Huidige CTR</th>
            <th style={{ ...th, textAlign: 'right' }}>Benchmark</th>
            <th style={{ ...th, textAlign: 'right' }}>Gap</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.query}>
              <td style={td}>{r.query}</td>
              <td style={{ ...td, textAlign: 'right' }}>{r.position}</td>
              <td style={{ ...td, textAlign: 'right' }}>{r.impressions.toLocaleString()}</td>
              <td style={{ ...td, textAlign: 'right', color: C.red, fontWeight: 600 }}>{r.ctr}%</td>
              <td style={{ ...td, textAlign: 'right', color: C.muted }}>{r.benchmark}%</td>
              <td style={{ ...td, textAlign: 'right' }}>
                <span style={{ fontWeight: 700, color: C.red }}>-{r.gap}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Content decay ────────────────────────────────────────────────────────────

function DecayTable({ rows }: { rows: DecayRow[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>Pagina</th>
            <th style={{ ...th, textAlign: 'right' }}>Positie nu</th>
            <th style={{ ...th, textAlign: 'right' }}>Positie vorige maand</th>
            <th style={{ ...th, textAlign: 'right' }}>Verkeer verlies</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.page} style={{ background: 'rgba(201,100,66,0.05)' }}>
              <td style={{ ...td, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span title={r.page}>{r.page.replace(/^https?:\/\/[^/]+/, '')}</span>
              </td>
              <td style={{ ...td, textAlign: 'right', color: C.red, fontWeight: 700 }}>{r.positionNow}</td>
              <td style={{ ...td, textAlign: 'right', color: C.muted }}>{r.positionPrev}</td>
              <td style={{ ...td, textAlign: 'right' }}>
                <span style={{ fontWeight: 700, color: C.red }}>-{r.sessionsDrop}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Landing pages ────────────────────────────────────────────────────────────

function LandingPagesTable({ rows }: { rows: LandingPageRow[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>Pagina</th>
            <th style={{ ...th, textAlign: 'right' }}>Organisch</th>
            <th style={{ ...th, textAlign: 'right' }}>Betaald</th>
            <th style={{ ...th, textAlign: 'right' }}>Conversies</th>
            <th style={{ ...th, textAlign: 'right' }}>Conv. %</th>
            <th style={{ ...th, textAlign: 'right' }}>Bounce</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.page}>
              <td style={{ ...td, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span title={r.page}>{r.page.replace(/^https?:\/\/[^/]+/, '') || '/'}</span>
              </td>
              <td style={{ ...td, textAlign: 'right' }}>{r.organicSessions.toLocaleString()}</td>
              <td style={{ ...td, textAlign: 'right', color: r.paidSessions > 0 ? C.blue : C.muted }}>
                {r.paidSessions > 0 ? r.paidSessions.toLocaleString() : '—'}
              </td>
              <td style={{ ...td, textAlign: 'right' }}>{r.conversions}</td>
              <td style={{ ...td, textAlign: 'right', fontWeight: 600, color: r.conversionRate >= 3 ? C.green : r.conversionRate >= 1 ? C.yellow : C.red }}>
                {r.conversionRate}%
              </td>
              <td style={{ ...td, textAlign: 'right', color: r.bounceRate > 70 ? C.red : C.muted }}>{r.bounceRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/analytics')
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setData(json)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Laden mislukt')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const organic = data?.channels.find(c => c.channel === 'Organic Search')
  const paid = data?.channels.find(c => c.channel === 'Paid Search')

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: B }}>

      {/* Header */}
      <div style={{ background: C.bg, borderBottom: `3px solid ${C.text}`, padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/dashboard" style={{ color: C.text, display: 'flex', alignItems: 'center', gap: 6, fontFamily: M, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Dashboard
        </Link>
        <span style={{ color: C.muted }}>›</span>
        <span style={{ fontFamily: M, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: C.text }}>Analytics</span>
        <div style={{ flex: 1 }} />
        {data && (
          <span style={{ fontSize: 11, color: C.muted }}>
            Laatste update: {new Date(data.fetchedAt).toLocaleTimeString('nl-BE')}
          </span>
        )}
        <button
          onClick={load}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: M, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: loading ? C.muted : C.text, background: '#fff', border: `2px solid ${C.text}`, padding: '6px 12px', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          {loading ? 'Laden…' : 'Vernieuwen'}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Error */}
        {error && (
          <div style={{ ...card, borderColor: C.red, background: 'rgba(201,100,66,0.06)', color: C.red, fontSize: 13 }}>
            <strong>Fout:</strong> {error}
            {error.includes('not set') && (
              <div style={{ marginTop: 8, color: C.muted }}>
                Stel <code>GOOGLE_SERVICE_ACCOUNT_KEY</code>, <code>GA_PROPERTY_ID</code> en <code>GSC_SITE_URL</code> in als environment variable. Zie instructies onderaan.
              </div>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !data && (
          <div style={{ ...card, textAlign: 'center', color: C.muted, padding: 48 }}>
            <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: 12, color: C.accent }} />
            <div>Analytics laden… (eerste keer ~10 sec)</div>
          </div>
        )}

        {data && (
          <>
            {/* 1. Traffic Pulse */}
            <div style={card}>
              <div style={sectionTitle}>
                <Activity size={15} color={C.accent} />
                Traffic Pulse
                <span style={{ fontSize: 11, color: C.muted, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>– laatste 28 dagen</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Actieve gebruikers nu', value: data.activeUsers, color: C.green },
                  { label: 'Organisch sessies', value: organic?.sessions.toLocaleString() ?? '—', sub: organic ? <ChangeIndicator pct={organic.changePercent} /> : null, color: C.green },
                  { label: 'Betaald sessies', value: paid?.sessions.toLocaleString() ?? '—', sub: paid ? <ChangeIndicator pct={paid.changePercent} /> : null, color: C.blue },
                  { label: 'Organisch conv.', value: organic?.conversions ?? '—', color: C.accent },
                  { label: 'Betaald conv.', value: paid?.conversions ?? '—', color: C.blue },
                ].map(s => (
                  <div key={s.label} style={{ background: C.surface, border: `2px solid ${C.text}`, padding: '14px 16px' }}>
                    <div style={{ fontFamily: M, fontSize: 11, color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontFamily: M, fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    {s.sub && <div style={{ marginTop: 4 }}>{s.sub}</div>}
                  </div>
                ))}
              </div>
              <ChannelTable rows={data.channels} />
            </div>

            {/* 2. Striking Distance */}
            <div style={card}>
              <div style={sectionTitle}>
                <Zap size={15} color={C.accent} />
                Striking Distance
                <span style={badge(data.strikingDistance.length)}>{data.strikingDistance.length} kansen</span>
                <span style={{ fontSize: 11, color: C.muted, fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 4 }}>
                  – positie 4-15, {'>'}100 impressies
                </span>
              </div>
              {data.strikingDistance.length > 0
                ? <StrikingTable rows={data.strikingDistance} />
                : <div style={{ color: C.muted, fontSize: 13 }}>Geen queries in positie 4-15 met voldoende impressies.</div>
              }
            </div>

            {/* 3. CTR Gaps */}
            <div style={card}>
              <div style={sectionTitle}>
                <Search size={15} color={C.accent} />
                CTR Gaps
                <span style={badge(data.ctrGaps.length)}>{data.ctrGaps.length} gevonden</span>
                <span style={{ fontSize: 11, color: C.muted, fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 4 }}>
                  – title/meta aanpassen, geen nieuwe content nodig
                </span>
              </div>
              {data.ctrGaps.length > 0
                ? <CtrGapsTable rows={data.ctrGaps} />
                : <div style={{ color: C.muted, fontSize: 13 }}>Geen significante CTR gaps gevonden.</div>
              }
            </div>

            {/* 4. Content Decay */}
            <div style={card}>
              <div style={sectionTitle}>
                <AlertTriangle size={15} color={C.red} />
                Content Decay
                <span style={{ ...badge(data.decay.length), background: data.decay.length > 0 ? 'rgba(201,100,66,0.12)' : undefined, color: data.decay.length > 0 ? C.red : undefined }}>
                  {data.decay.length} pagina&apos;s
                </span>
                <span style={{ fontSize: 11, color: C.muted, fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 4 }}>
                  – positie gedaald {'>'}3 plaatsen of verkeer -{'>'}20%
                </span>
              </div>
              {data.decay.length > 0
                ? <DecayTable rows={data.decay} />
                : <div style={{ color: C.green, fontSize: 13, fontWeight: 600 }}>Geen significante decay gedetecteerd.</div>
              }
            </div>

            {/* 5. Landing Page Performance */}
            <div style={card}>
              <div style={sectionTitle}>
                <BarChart2 size={15} color={C.accent} />
                Landing Page Performance
                <span style={{ fontSize: 11, color: C.muted, fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 4 }}>
                  – top 20 pagina&apos;s op totaal sessies
                </span>
              </div>
              <LandingPagesTable rows={data.landingPages} />
            </div>

            {/* 6. Organic vs Paid breakdown */}
            <div style={card}>
              <div style={sectionTitle}>
                <TrendingUp size={15} color={C.accent} />
                Organisch vs Betaald
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Organisch Search', row: organic, color: C.green },
                  { label: 'Paid Search', row: paid, color: C.blue },
                ].map(({ label, row, color }) => (
                  <div key={label} style={{ background: C.surface, border: `2px solid ${C.text}`, padding: '16px 20px' }}>
                    <div style={{ fontFamily: M, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color, marginBottom: 12 }}>{label}</div>
                    {row ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                          ['Sessies', row.sessions.toLocaleString()],
                          ['vs vorige periode', `${row.changePercent > 0 ? '+' : ''}${row.changePercent}%`],
                          ['Conversies', String(row.conversions)],
                          ['Conv. rate', row.sessions > 0 ? `${Math.round(row.conversions / row.sessions * 1000) / 10}%` : '—'],
                          ['Bounce', `${row.bounceRate}%`],
                        ].map(([k, v]) => (
                          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span style={{ color: C.muted }}>{k}</span>
                            <span style={{ fontWeight: 700, color: C.text }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: C.muted, fontSize: 13 }}>Geen data</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Setup instructions (shown when credentials are set) */}
            <div style={{ ...card, background: C.surface, borderStyle: 'dashed' }}>
              <div style={{ fontSize: 12, color: C.muted }}>
                <strong style={{ color: C.text }}>Configuratie</strong> — vereiste env vars in Vercel of .env.local:
                <code style={{ display: 'block', marginTop: 8, fontFamily: M, fontSize: 11, background: 'rgba(14,13,11,0.06)', padding: '10px 14px', lineHeight: 1.8 }}>
                  GOOGLE_SERVICE_ACCOUNT_KEY={'{...service account JSON als string}'}<br/>
                  GA_PROPERTY_ID=properties/XXXXXXXXX<br/>
                  GSC_SITE_URL=https://jouwdomein.be
                </code>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
