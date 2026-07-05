'use client'

import { useEffect, useState, useMemo } from 'react'
import { Search, RefreshCw, ChevronDown, ChevronUp, Mail, Users, TrendingUp, Clock, BarChart2 } from 'lucide-react'
import Link from 'next/link'
import type { Lead } from '@/lib/crm/claude'

// ─── Brutalist design tokens ────────────────────────────────────────────────

const B = 'var(--font-brutalist, system-ui)'
const M = 'var(--font-mono-brutalist, monospace)'
const INK = '#0e0d0b'
const BG = '#f2f0eb'
const GRN = '#1a5e35'
const LIME = '#4ade80'
const ORANGE = '#c96442'
const MUT = '#787068'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: Lead['status'][] = ['new', 'replied', 'followed_up', 'booked', 'closed']

const SOURCE_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  widget:     { bg: 'rgba(120,112,104,0.12)',  color: MUT,    label: 'Widget' },
  calculator: { bg: 'rgba(201,100,66,0.12)',   color: ORANGE, label: 'Calculator' },
  diagnostic: { bg: 'rgba(26,94,53,0.12)',     color: GRN,    label: 'Diagnostic' },
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  new:          { bg: 'rgba(201,100,66,0.15)', color: ORANGE },
  replied:      { bg: 'rgba(26,94,53,0.12)',   color: GRN },
  followed_up:  { bg: 'rgba(120,112,104,0.15)', color: MUT },
  booked:       { bg: 'rgba(74,222,128,0.18)', color: '#1a7a45' },
  closed:       { bg: 'rgba(14,13,11,0.06)',   color: MUT },
}

function scoreColor(s: number) {
  if (s <= 5) return ORANGE
  if (s <= 7) return GRN
  return '#1a7a45'
}

function timeAgo(ms: number) {
  const diff = Date.now() - ms
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function Stat({ label, value, sub, icon }: { label: string; value: string | number; sub?: string; icon: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: `2px solid ${INK}`, padding: '18px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ color: ORANGE }}>{icon}</div>
        <span style={{ fontFamily: M, fontSize: 11, color: MUT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
      </div>
      <div style={{ fontFamily: M, fontSize: 30, fontWeight: 700, color: INK, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: MUT, marginTop: 5, fontFamily: B }}>{sub}</div>}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState<keyof Lead>('submittedAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/dashboard')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setLeads(data.leads)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: Lead['status']) {
    setUpdating(id)
    await fetch('/api/dashboard', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    setUpdating(null)
  }

  useEffect(() => { load() }, [])

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = leads.length
    const qualified = leads.filter(l => l.qualified).length
    const booked = leads.filter(l => l.status === 'booked').length
    const avgScore = total > 0 ? (leads.reduce((a, l) => a + l.score, 0) / total).toFixed(1) : '—'
    const needsFollowUp = leads.filter(l =>
      l.status === 'new' && Date.now() - l.submittedAt > 2 * 60 * 60 * 1000
    ).length
    return { total, qualified, booked, avgScore, needsFollowUp }
  }, [leads])

  // ── Filter + sort ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = leads
    if (statusFilter !== 'all') list = list.filter(l => l.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.message.toLowerCase().includes(q)
      )
    }
    return [...list].sort((a, b) => {
      const av = a[sortBy] ?? 0
      const bv = b[sortBy] ?? 0
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [leads, search, statusFilter, sortBy, sortDir])

  function toggleSort(col: keyof Lead) {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('desc') }
  }

  function SortIcon({ col }: { col: keyof Lead }) {
    if (sortBy !== col) return null
    return sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100svh', background: BG, color: INK, fontFamily: B }}>

      {/* Header */}
      <div style={{ borderBottom: `3px solid ${INK}`, padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: BG }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-email.svg" alt="Lead it, Grow" style={{ height: 36 }} />
          <h1 style={{ fontFamily: B, fontSize: 16, fontWeight: 700, color: INK, margin: 0, textTransform: 'uppercase', letterSpacing: '.08em' }}>Lead Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/dashboard/analytics" style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: M, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: INK, background: BG, border: `2px solid ${INK}`, padding: '7px 14px', textDecoration: 'none' }}>
            <BarChart2 size={13} /> Analytics
          </Link>
          {stats.needsFollowUp > 0 && (
            <div style={{ background: ORANGE, border: `2px solid ${INK}`, padding: '6px 12px', fontFamily: M, fontSize: 11, color: '#fff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>
              ⚠ {stats.needsFollowUp} follow-up{stats.needsFollowUp > 1 ? 's' : ''} due
            </div>
          )}
          <button
            onClick={load}
            style={{ background: BG, border: `2px solid ${INK}`, padding: '7px 14px', color: INK, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: M, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      <div style={{ padding: '24px 32px', maxWidth: 1300, margin: '0 auto' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
          <Stat label="Total leads" value={stats.total} icon={<Users size={15} />} />
          <Stat label="Qualified" value={stats.qualified} sub={`${stats.total > 0 ? Math.round((stats.qualified / stats.total) * 100) : 0}% of total`} icon={<TrendingUp size={15} />} />
          <Stat label="Booked" value={stats.booked} sub="calls booked" icon={<Mail size={15} />} />
          <Stat label="Avg score" value={stats.avgScore} sub="out of 10" icon={<TrendingUp size={15} />} />
          <Stat label="Follow-ups due" value={stats.needsFollowUp} sub="> 2h no reply" icon={<Clock size={15} />} />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: MUT }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, message…"
              style={{ width: '100%', background: '#fff', border: `2px solid ${INK}`, padding: '8px 12px 8px 32px', color: INK, fontFamily: B, fontSize: 13, outline: 'none' }}
            />
          </div>
          {(['all', ...STATUS_OPTIONS] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '7px 14px',
                border: `2px solid ${INK}`,
                background: statusFilter === s ? INK : '#fff',
                color: statusFilter === s ? BG : INK,
                fontFamily: M, fontSize: 11, cursor: 'pointer',
                fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '.04em',
              }}
            >
              {s === 'all' ? `All (${leads.length})` : s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: MUT, fontFamily: M, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em' }}>Loading leads…</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 80, color: ORANGE, fontFamily: M, fontSize: 12 }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: MUT, fontFamily: M, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            {leads.length === 0 ? 'No leads yet. Submit the contact form to test.' : 'No leads match your filter.'}
          </div>
        ) : (
          <div style={{ background: '#fff', border: `2px solid ${INK}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${INK}`, background: BG }}>
                  {([
                    { col: 'name' as keyof Lead, label: 'Name' },
                    { col: 'source' as keyof Lead, label: 'Source' },
                    { col: 'status' as keyof Lead, label: 'Status' },
                    { col: 'score' as keyof Lead, label: 'Score' },
                    { col: 'lang' as keyof Lead, label: 'Lang' },
                    { col: 'submittedAt' as keyof Lead, label: 'Submitted' },
                  ]).map(({ col, label }) => (
                    <th key={col} onClick={() => toggleSort(col)}
                      style={{ textAlign: 'left', padding: '10px 16px', color: MUT, fontFamily: M, fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>{label}<SortIcon col={col} /></span>
                    </th>
                  ))}
                  <th style={{ padding: '10px 16px', color: MUT, fontFamily: M, fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <>
                    <tr
                      key={lead.id}
                      onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                      style={{
                        borderBottom: `1px solid rgba(14,13,11,0.12)`,
                        cursor: 'pointer',
                        background: expandedId === lead.id ? 'rgba(26,94,53,0.05)' : 'transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      {/* Name + email */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 700, color: INK }}>{lead.name}</div>
                        <div style={{ fontSize: 12, color: MUT }}>{lead.email}</div>
                      </td>
                      {/* Source */}
                      <td style={{ padding: '12px 16px' }}>
                        {(() => {
                          const s = SOURCE_STYLE[lead.source ?? 'widget'] ?? SOURCE_STYLE.widget
                          return (
                            <span style={{ fontFamily: M, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, padding: '2px 7px', whiteSpace: 'nowrap' }}>
                              {s.label}
                            </span>
                          )
                        })()}
                      </td>
                      {/* Status */}
                      <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          disabled={updating === lead.id}
                          onChange={e => updateStatus(lead.id, e.target.value as Lead['status'])}
                          style={{
                            fontFamily: M, fontSize: 11, fontWeight: 700,
                            background: STATUS_STYLE[lead.status].bg,
                            color: STATUS_STYLE[lead.status].color,
                            border: 'none', padding: '3px 8px',
                            cursor: 'pointer', outline: 'none',
                          }}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </td>
                      {/* Score */}
                      <td style={{ padding: '12px 16px' }}>
                        {lead.source === 'diagnostic' && lead.diagnosticGapScore !== undefined ? (
                          <>
                            <span style={{ fontFamily: M, fontSize: 15, fontWeight: 700, color: scoreColor((100 - lead.diagnosticGapScore) / 10) }}>{100 - lead.diagnosticGapScore}</span>
                            <span style={{ fontSize: 11, color: MUT }}>/100</span>
                          </>
                        ) : (
                          <>
                            <span style={{ fontFamily: M, fontSize: 15, fontWeight: 700, color: scoreColor(lead.score) }}>{lead.score}</span>
                            <span style={{ fontSize: 11, color: MUT }}>/10</span>
                            {lead.qualified && <span style={{ marginLeft: 6, fontFamily: M, fontSize: 10, background: 'rgba(26,94,53,0.12)', color: GRN, padding: '1px 5px', fontWeight: 700 }}>✓ qualified</span>}
                          </>
                        )}
                      </td>
                      {/* Lang */}
                      <td style={{ padding: '12px 16px', color: MUT, fontFamily: M, fontSize: 12, textTransform: 'uppercase', fontWeight: 700 }}>{lead.lang}</td>
                      {/* Time */}
                      <td style={{ padding: '12px 16px', color: MUT, fontSize: 12, whiteSpace: 'nowrap' }}>{timeAgo(lead.submittedAt)}</td>
                      {/* Actions */}
                      <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                        <a
                          href={`mailto:${lead.email}`}
                          style={{ fontFamily: M, fontSize: 11, color: ORANGE, textDecoration: 'none', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}
                        >
                          Email →
                        </a>
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {expandedId === lead.id && (
                      <tr key={`${lead.id}-exp`} style={{ background: 'rgba(26,94,53,0.03)', borderBottom: `1px solid rgba(14,13,11,0.12)` }}>
                        <td colSpan={7} style={{ padding: '16px 24px' }}>
                          {lead.source === 'diagnostic' && lead.diagnosticContext && (
                            <div style={{ display: 'flex', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
                              {[
                                { label: 'Sector', value: lead.diagnosticContext.industry },
                                { label: 'Team', value: lead.diagnosticContext.teamSize },
                                { label: 'Leads/maand', value: lead.diagnosticContext.monthlyLeads },
                                { label: 'Deal value', value: lead.diagnosticContext.avgDealValue },
                                ...(lead.diagnosticContext.phone ? [{ label: 'Telefoon', value: lead.diagnosticContext.phone }] : []),
                              ].map(({ label, value }) => (
                                <div key={label} style={{ background: '#fff', border: `1px solid rgba(14,13,11,0.15)`, padding: '6px 12px' }}>
                                  <div style={{ fontFamily: M, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUT, marginBottom: 2 }}>{label}</div>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: INK }}>{value}</div>
                                </div>
                              ))}
                              {lead.diagnosticContext.website && (
                                <div style={{ background: '#fff', border: `1px solid rgba(14,13,11,0.15)`, padding: '6px 12px' }}>
                                  <div style={{ fontFamily: M, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUT, marginBottom: 2 }}>Website</div>
                                  <a href={lead.diagnosticContext.website.startsWith('http') ? lead.diagnosticContext.website : `https://${lead.diagnosticContext.website}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 700, color: ORANGE, textDecoration: 'none' }}>{lead.diagnosticContext.website}</a>
                                </div>
                              )}
                            </div>
                          )}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            {/* Left: message or diagnostic answers */}
                            <div>
                              {lead.source === 'diagnostic' && lead.diagnosticAnswers ? (
                                <>
                                  <div style={{ fontFamily: M, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUT, marginBottom: 10 }}>Diagnostic antwoorden</div>
                                  {(() => {
                                    const LEVER_LABELS: Record<string, string> = {
                                      marketing: 'Online aanwezigheid & inbound',
                                      time: 'Vrijheid & tijd',
                                      leadership: 'Leiderschap & team',
                                      speed_to_lead: 'Speed-to-lead',
                                      pipeline: 'Pipeline opvolging',
                                      retention: 'Klantbehoud',
                                      sales: 'Sales conversie',
                                    }
                                    const ANSWER_TEXT: Record<string, Record<number, string>> = {
                                      time: { 0: 'Vorige week, ik heb goede grenzen.', 1: 'Een paar weken geleden, het lukt soms.', 2: 'Ik kan me eerlijk gezegd niet herinneren wanneer.', 3: 'Dat is momenteel niet echt mogelijk voor mij.' },
                                      leadership: { 0: 'Mijn team lost het op. Ik hoor het achteraf.', 1: 'Iemand geeft het door en wacht op mijn reactie.', 2: 'Meestal ben ik degene die het als eerste opmerkt.', 3: 'Niets beweegt tenzij ik er direct bij betrokken ben.' },
                                      speed_to_lead: { 0: 'Binnen 5 minuten, automatisch.', 1: 'Binnen het uur, meestal.', 2: 'Dezelfde dag, als er tijd voor is.', 3: 'De volgende dag of later, het varieert.' },
                                      pipeline: { 0: 'Ze komen in een geautomatiseerde opvolgingssequentie.', 1: 'Ik of mijn team volgt manueel een paar keer op.', 2: 'We volgen eenmaal op en laten het dan aan hen.', 3: 'Eerlijk gezegd verdwijnen de meesten gewoon.' },
                                      marketing: { 0: 'Pipeline blijft draaien. Inbound regelt het.', 1: 'Het zou vertragen, maar niet stoppen.', 2: 'Het zou opdrogen binnen een paar weken.', 3: 'Het zou meteen stoppen.' },
                                      sales: { 0: 'De meesten kopen. Het proces werkt.', 1: 'Ongeveer de helft sluit. Hangt af van de dag.', 2: 'Misschien 1 op 4. Veel "ik denk er over na".', 3: 'Zelden. Geweldige gesprekken, weinig beslissingen.' },
                                      retention: { 0: 'De meesten komen terug en sturen regelmatig doorverwijzingen.', 1: 'Sommigen komen terug, sommigen verwijzen door. Niet systematisch.', 2: 'We ronden het project af en dat is het grotendeels.', 3: 'We horen zelden van klanten na de levering.' },
                                    }
                                    const order = lead.diagnosticTopLevers ?? Object.keys(LEVER_LABELS)
                                    return order.map(key => {
                                      const val = lead.diagnosticAnswers![key] ?? 0
                                      const dotColor = val === 3 ? ORANGE : val === 2 ? '#b8794f' : val === 1 ? GRN : 'rgba(14,13,11,0.1)'
                                      const answerText = ANSWER_TEXT[key]?.[val] ?? '—'
                                      return (
                                        <div key={key} style={{ marginBottom: 10 }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                                            <div style={{ display: 'flex', gap: 3 }}>
                                              {[1, 2, 3].map(i => (
                                                <div key={i} style={{ width: 8, height: 8, background: i <= val ? dotColor : 'rgba(14,13,11,0.08)' }} />
                                              ))}
                                            </div>
                                            <span style={{ fontFamily: M, fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{LEVER_LABELS[key] ?? key}</span>
                                          </div>
                                          <div style={{ fontSize: 12, color: INK, fontStyle: 'italic', paddingLeft: 30 }}>&ldquo;{answerText}&rdquo;</div>
                                        </div>
                                      )
                                    })
                                  })()}
                                </>
                              ) : (
                                <>
                                  <div style={{ fontFamily: M, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUT, marginBottom: 6 }}>Message</div>
                                  <p style={{ fontSize: 13, lineHeight: 1.6, color: INK, margin: 0 }}>{lead.message}</p>
                                </>
                              )}
                            </div>
                            {/* Right: outreach timeline */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                              <div style={{ fontFamily: M, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: MUT, marginBottom: 12 }}>Outreach timeline</div>
                              {(() => {
                                const sub = lead.submittedAt
                                const now = Date.now()
                                const fmtDate = (ms: number) => new Date(ms).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                                const fmtDay  = (ms: number) => new Date(ms).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' })
                                const nurture3  = sub + 3  * 86400000
                                const nurture7  = sub + 7  * 86400000
                                const nurture14 = sub + 14 * 86400000

                                type StepStatus = 'done' | 'upcoming' | 'pending' | 'replied' | 'missed'
                                const steps: { label: string; detail: string; status: StepStatus }[] = [
                                  {
                                    label: 'Rapport verstuurd',
                                    detail: fmtDate(sub),
                                    status: 'done',
                                  },
                                  {
                                    label: 'Nurture dag 3',
                                    detail: fmtDay(nurture3),
                                    status: now > nurture3 ? 'done' : 'upcoming',
                                  },
                                  {
                                    label: 'Nurture dag 7',
                                    detail: fmtDay(nurture7),
                                    status: now > nurture7 ? 'done' : 'upcoming',
                                  },
                                  {
                                    label: 'Nurture dag 14',
                                    detail: fmtDay(nurture14),
                                    status: now > nurture14 ? 'done' : 'upcoming',
                                  },
                                  {
                                    label: 'Antwoord ontvangen',
                                    detail: lead.repliedAt ? fmtDate(lead.repliedAt) : 'Nog geen antwoord',
                                    status: lead.repliedAt ? 'replied' : 'pending',
                                  },
                                  {
                                    label: 'Manuele opvolging',
                                    detail: lead.followedUpAt ? fmtDate(lead.followedUpAt) : lead.repliedAt ? 'Verstuur persoonlijk antwoord' : '—',
                                    status: lead.followedUpAt ? 'done' : lead.repliedAt ? 'pending' : 'missed',
                                  },
                                ]

                                const dotStyle: Record<StepStatus, { bg: string; label: string }> = {
                                  done:     { bg: GRN,    label: '✓' },
                                  upcoming: { bg: MUT,    label: '·' },
                                  pending:  { bg: ORANGE, label: '!' },
                                  replied:  { bg: GRN,    label: '✓' },
                                  missed:   { bg: 'rgba(14,13,11,0.3)', label: '—' },
                                }

                                return (
                                  <div style={{ position: 'relative', paddingLeft: 24 }}>
                                    <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 1, background: 'rgba(14,13,11,0.15)' }} />
                                    {steps.map((s, i) => {
                                      const d = dotStyle[s.status]
                                      return (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10, position: 'relative' }}>
                                          <div style={{ position: 'absolute', left: -24, top: 2, width: 15, height: 15, borderRadius: '50%', background: d.bg, color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{d.label}</div>
                                          <div>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: INK, lineHeight: 1.3 }}>{s.label}</div>
                                            <div style={{ fontSize: 11, color: s.status === 'pending' && !lead.repliedAt ? ORANGE : MUT, marginTop: 1 }}>{s.detail}</div>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )
                              })()}

                              {/* Actions */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8, paddingTop: 12, borderTop: `1px solid rgba(14,13,11,0.12)` }}>
                                <a
                                  href={`https://mail.google.com/mail/u/0/#search/${encodeURIComponent(lead.email)}`}
                                  target="_blank" rel="noopener noreferrer"
                                  style={{ fontSize: 12, color: INK, fontWeight: 700 }}
                                >
                                  Bekijk thread in Gmail →
                                </a>
                                <a
                                  href={`mailto:${lead.email}?subject=Re: jouw diagnose`}
                                  style={{ fontSize: 12, color: ORANGE, fontWeight: 700 }}
                                >
                                  Stuur persoonlijk antwoord →
                                </a>
                                <a
                                  href="https://calendly.com/sovereign-now333/free-intro-call-clone"
                                  target="_blank" rel="noopener noreferrer"
                                  style={{ fontSize: 12, color: MUT, fontWeight: 700 }}
                                >
                                  Boek gesprek →
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: 12, fontFamily: M, fontSize: 11, color: MUT, textAlign: 'right', textTransform: 'uppercase', letterSpacing: '.04em' }}>
          {filtered.length} of {leads.length} leads
        </div>
      </div>
    </div>
  )
}
