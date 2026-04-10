'use client'

import { useEffect, useState, useMemo } from 'react'
import { Search, RefreshCw, ChevronDown, ChevronUp, Mail, Users, TrendingUp, Clock } from 'lucide-react'
import type { Lead } from '@/lib/crm/claude'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: Lead['status'][] = ['new', 'replied', 'followed_up', 'booked', 'closed']

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  new:          { bg: 'rgba(201,100,66,0.15)',  color: '#e07a52' },
  replied:      { bg: 'rgba(61,186,110,0.12)',  color: '#3dba6e' },
  followed_up:  { bg: 'rgba(234,179,8,0.12)',   color: '#ca8a04' },
  booked:       { bg: 'rgba(52,130,246,0.15)',  color: '#60a5fa' },
  closed:       { bg: 'rgba(255,255,255,0.06)', color: '#6b7280' },
}

function scoreColor(s: number) {
  if (s <= 3) return '#e05b3a'
  if (s <= 5) return '#e8a838'
  if (s <= 7) return '#7ec87e'
  return '#3dba6e'
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
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(61,57,41,0.15)', borderRadius: 14, padding: '18px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ color: '#c96442', opacity: 0.8 }}>{icon}</div>
        <span style={{ fontSize: 11, color: '#83827d', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: '#3d3929', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#83827d', marginTop: 5 }}>{sub}</div>}
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
    <div style={{ minHeight: '100svh', background: '#faf9f5', color: '#3d3929', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(61,57,41,0.1)', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c96442', marginBottom: 3 }}>
            Lead it, Grow
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#3d3929' }}>Lead Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {stats.needsFollowUp > 0 && (
            <div style={{ background: 'rgba(201,100,66,0.12)', border: '1px solid rgba(201,100,66,0.3)', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#c96442', fontWeight: 600 }}>
              ⚠ {stats.needsFollowUp} follow-up{stats.needsFollowUp > 1 ? 's' : ''} due
            </div>
          )}
          <button
            onClick={load}
            style={{ background: 'rgba(61,57,41,0.06)', border: '1px solid rgba(61,57,41,0.12)', borderRadius: 8, padding: '7px 14px', color: '#83827d', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
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
            <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#83827d' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, message…"
              style={{ width: '100%', background: '#fff', border: '1px solid rgba(61,57,41,0.12)', borderRadius: 9, padding: '8px 12px 8px 32px', color: '#3d3929', fontSize: 13, outline: 'none' }}
            />
          </div>
          {(['all', ...STATUS_OPTIONS] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '7px 14px', borderRadius: 7,
                border: '1px solid rgba(61,57,41,0.12)',
                background: statusFilter === s ? 'rgba(201,100,66,0.1)' : '#fff',
                color: statusFilter === s ? '#c96442' : '#83827d',
                fontSize: 12, cursor: 'pointer',
                fontWeight: statusFilter === s ? 700 : 400,
                textTransform: 'capitalize',
              }}
            >
              {s === 'all' ? `All (${leads.length})` : s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#83827d' }}>Loading leads…</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#e05b3a' }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#83827d' }}>
            {leads.length === 0 ? 'No leads yet. Submit the contact form to test.' : 'No leads match your filter.'}
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid rgba(61,57,41,0.1)', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(61,57,41,0.08)', background: '#faf9f5' }}>
                  {([
                    { col: 'name' as keyof Lead, label: 'Name' },
                    { col: 'status' as keyof Lead, label: 'Status' },
                    { col: 'score' as keyof Lead, label: 'Score' },
                    { col: 'lang' as keyof Lead, label: 'Lang' },
                    { col: 'submittedAt' as keyof Lead, label: 'Submitted' },
                  ]).map(({ col, label }) => (
                    <th key={col} onClick={() => toggleSort(col)}
                      style={{ textAlign: 'left', padding: '10px 16px', color: '#83827d', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>{label}<SortIcon col={col} /></span>
                    </th>
                  ))}
                  <th style={{ padding: '10px 16px', color: '#83827d', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <>
                    <tr
                      key={lead.id}
                      onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                      style={{
                        borderBottom: '1px solid rgba(61,57,41,0.06)',
                        cursor: 'pointer',
                        background: expandedId === lead.id ? 'rgba(201,100,66,0.03)' : 'transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      {/* Name + email */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#3d3929' }}>{lead.name}</div>
                        <div style={{ fontSize: 12, color: '#83827d' }}>{lead.email}</div>
                      </td>
                      {/* Status */}
                      <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          disabled={updating === lead.id}
                          onChange={e => updateStatus(lead.id, e.target.value as Lead['status'])}
                          style={{
                            fontSize: 12, fontWeight: 700,
                            background: STATUS_STYLE[lead.status].bg,
                            color: STATUS_STYLE[lead.status].color,
                            border: 'none', borderRadius: 6, padding: '3px 8px',
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
                        <span style={{ fontSize: 15, fontWeight: 800, color: scoreColor(lead.score) }}>{lead.score}</span>
                        <span style={{ fontSize: 11, color: '#83827d' }}>/10</span>
                        {lead.qualified && <span style={{ marginLeft: 6, fontSize: 10, background: 'rgba(61,186,110,0.12)', color: '#3dba6e', borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>✓ qualified</span>}
                      </td>
                      {/* Lang */}
                      <td style={{ padding: '12px 16px', color: '#83827d', fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>{lead.lang}</td>
                      {/* Time */}
                      <td style={{ padding: '12px 16px', color: '#83827d', fontSize: 12, whiteSpace: 'nowrap' }}>{timeAgo(lead.submittedAt)}</td>
                      {/* Actions */}
                      <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                        <a
                          href={`mailto:${lead.email}`}
                          style={{ fontSize: 12, color: '#c96442', textDecoration: 'none', fontWeight: 600 }}
                        >
                          Email →
                        </a>
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {expandedId === lead.id && (
                      <tr key={`${lead.id}-exp`} style={{ background: '#faf9f5', borderBottom: '1px solid rgba(61,57,41,0.06)' }}>
                        <td colSpan={6} style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            {/* Message */}
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#83827d', marginBottom: 6 }}>Message</div>
                              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#535146', margin: 0 }}>{lead.message}</p>
                            </div>
                            {/* Meta */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#83827d', marginBottom: 2 }}>Details</div>
                              <div style={{ fontSize: 12, color: '#535146' }}>
                                <strong>Submitted:</strong> {new Date(lead.submittedAt).toLocaleString('en-GB')}
                              </div>
                              {lead.repliedAt && (
                                <div style={{ fontSize: 12, color: '#535146' }}>
                                  <strong>Replied:</strong> {new Date(lead.repliedAt).toLocaleString('en-GB')}
                                </div>
                              )}
                              {lead.followedUpAt && (
                                <div style={{ fontSize: 12, color: '#535146' }}>
                                  <strong>Follow-up sent:</strong> {new Date(lead.followedUpAt).toLocaleString('en-GB')}
                                </div>
                              )}
                              <div style={{ fontSize: 12, color: '#535146' }}>
                                <strong>Score:</strong>{' '}
                                <span style={{ color: scoreColor(lead.score), fontWeight: 700 }}>{lead.score}/10</span>
                                {' — '}{lead.qualified ? '✅ Qualified' : '⚠️ Not yet qualified'}
                              </div>
                              <a
                                href={`https://calendly.com/sovereign-now333/free-intro-call-clone`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: 12, color: '#c96442', fontWeight: 600, marginTop: 4 }}
                              >
                                Book call for this lead →
                              </a>
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

        <div style={{ marginTop: 12, fontSize: 12, color: '#83827d', textAlign: 'right' }}>
          {filtered.length} of {leads.length} leads
        </div>
      </div>
    </div>
  )
}
