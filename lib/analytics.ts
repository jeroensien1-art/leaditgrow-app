import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { google } from 'googleapis'

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY not set')
  const key = JSON.parse(raw)
  return new google.auth.GoogleAuth({
    credentials: key,
    scopes: [
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/webmasters.readonly',
    ],
  })
}

function getGaClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY not set')
  const credentials = JSON.parse(raw)
  return new BetaAnalyticsDataClient({ credentials })
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChannelRow {
  channel: string
  sessions: number
  conversions: number
  bounceRate: number
  sessionsPrev: number
  changePercent: number
}

export interface LandingPageRow {
  page: string
  organicSessions: number
  paidSessions: number
  conversions: number
  bounceRate: number
  conversionRate: number
}

export interface QueryRow {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface PageRow {
  page: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface StrikingDistanceRow extends QueryRow {
  estimatedGain: number
}

export interface CtrGapRow extends QueryRow {
  benchmark: number
  gap: number
}

export interface DecayRow {
  page: string
  positionNow: number
  positionPrev: number
  sessionsDrop: number
  sessionsNow: number
}

export interface AnalyticsData {
  channels: ChannelRow[]
  landingPages: LandingPageRow[]
  strikingDistance: StrikingDistanceRow[]
  ctrGaps: CtrGapRow[]
  decay: DecayRow[]
  activeUsers: number
  fetchedAt: number
}

// ─── GA4 Helpers ──────────────────────────────────────────────────────────────

function toNum(v: string | null | undefined) { return parseFloat(v ?? '0') || 0 }

async function runReport(
  client: BetaAnalyticsDataClient,
  propertyId: string,
  options: Parameters<BetaAnalyticsDataClient['runReport']>[0]
) {
  const [res] = await client.runReport({ property: `properties/${propertyId}`, ...options })
  return res.rows ?? []
}

// ─── Channel traffic (28d + prev 28d) ─────────────────────────────────────────

async function fetchChannels(client: BetaAnalyticsDataClient, propertyId: string): Promise<ChannelRow[]> {
  const [current, previous] = await Promise.all([
    runReport(client, propertyId, {
      dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [
        { name: 'sessions' },
        { name: 'conversions' },
        { name: 'bounceRate' },
      ],
    }),
    runReport(client, propertyId, {
      dateRanges: [{ startDate: '56daysAgo', endDate: '29daysAgo' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
    }),
  ])

  const prevMap: Record<string, number> = {}
  for (const row of previous) {
    const ch = row.dimensionValues?.[0]?.value ?? ''
    prevMap[ch] = toNum(row.metricValues?.[0]?.value)
  }

  return current.map(row => {
    const channel = row.dimensionValues?.[0]?.value ?? ''
    const sessions = toNum(row.metricValues?.[0]?.value)
    const sessionsPrev = prevMap[channel] ?? 0
    const changePercent = sessionsPrev > 0 ? Math.round(((sessions - sessionsPrev) / sessionsPrev) * 100) : 0
    return {
      channel,
      sessions,
      conversions: toNum(row.metricValues?.[1]?.value),
      bounceRate: Math.round(toNum(row.metricValues?.[2]?.value) * 100),
      sessionsPrev,
      changePercent,
    }
  }).sort((a, b) => b.sessions - a.sessions)
}

// ─── Landing page performance ──────────────────────────────────────────────────

async function fetchLandingPages(client: BetaAnalyticsDataClient, propertyId: string): Promise<LandingPageRow[]> {
  const rows = await runReport(client, propertyId, {
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'landingPage' }, { name: 'sessionDefaultChannelGroup' }],
    metrics: [
      { name: 'sessions' },
      { name: 'conversions' },
      { name: 'bounceRate' },
    ],
    limit: 200,
  })

  const pageMap: Record<string, LandingPageRow> = {}
  for (const row of rows) {
    const page = row.dimensionValues?.[0]?.value ?? ''
    const channel = (row.dimensionValues?.[1]?.value ?? '').toLowerCase()
    const sessions = toNum(row.metricValues?.[0]?.value)
    const conversions = toNum(row.metricValues?.[1]?.value)
    const bounceRate = Math.round(toNum(row.metricValues?.[2]?.value) * 100)

    if (!pageMap[page]) {
      pageMap[page] = { page, organicSessions: 0, paidSessions: 0, conversions: 0, bounceRate, conversionRate: 0 }
    }
    if (channel.includes('organic')) pageMap[page].organicSessions += sessions
    else if (channel.includes('paid') || channel.includes('cpc')) pageMap[page].paidSessions += sessions
    else pageMap[page].organicSessions += sessions
    pageMap[page].conversions += conversions
  }

  return Object.values(pageMap).map(p => ({
    ...p,
    conversionRate: p.organicSessions + p.paidSessions > 0
      ? Math.round((p.conversions / (p.organicSessions + p.paidSessions)) * 1000) / 10
      : 0,
  })).sort((a, b) => (b.organicSessions + b.paidSessions) - (a.organicSessions + a.paidSessions)).slice(0, 20)
}

// ─── GSC helpers ──────────────────────────────────────────────────────────────

async function fetchGscQueries(siteUrl: string): Promise<QueryRow[]> {
  const auth = getAuth()
  const sc = google.searchconsole({ version: 'v1', auth })
  const res = await sc.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: new Date(Date.now() - 28 * 86400000).toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      dimensions: ['query'],
      rowLimit: 500,
    },
  })
  return (res.data.rows ?? []).map(r => ({
    query: r.keys?.[0] ?? '',
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    ctr: Math.round((r.ctr ?? 0) * 1000) / 10,
    position: Math.round((r.position ?? 0) * 10) / 10,
  }))
}

async function fetchGscPages(siteUrl: string): Promise<PageRow[]> {
  const auth = getAuth()
  const sc = google.searchconsole({ version: 'v1', auth })
  const [current, previous] = await Promise.all([
    sc.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: new Date(Date.now() - 28 * 86400000).toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        dimensions: ['page'],
        rowLimit: 200,
      },
    }),
    sc.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: new Date(Date.now() - 56 * 86400000).toISOString().slice(0, 10),
        endDate: new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10),
        dimensions: ['page'],
        rowLimit: 200,
      },
    }),
  ])
  return {
    current: (current.data.rows ?? []).map(r => ({
      page: r.keys?.[0] ?? '',
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      ctr: Math.round((r.ctr ?? 0) * 1000) / 10,
      position: Math.round((r.position ?? 0) * 10) / 10,
    })),
    previous: (previous.data.rows ?? []).map(r => ({
      page: r.keys?.[0] ?? '',
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      ctr: Math.round((r.ctr ?? 0) * 1000) / 10,
      position: Math.round((r.position ?? 0) * 10) / 10,
    })),
  } as unknown as PageRow[]
}

// ─── Computed insights ────────────────────────────────────────────────────────

function computeStrikingDistance(queries: QueryRow[]): StrikingDistanceRow[] {
  const CTR_AT_TOP = 0.28
  return queries
    .filter(q => q.position >= 4 && q.position <= 15 && q.impressions >= 100)
    .map(q => ({
      ...q,
      estimatedGain: Math.round(q.impressions * (CTR_AT_TOP - q.ctr / 100)),
    }))
    .sort((a, b) => b.estimatedGain - a.estimatedGain)
    .slice(0, 15)
}

function computeCtrGaps(queries: QueryRow[]): CtrGapRow[] {
  return queries
    .map(q => {
      let benchmark = 0
      if (q.position <= 3) benchmark = 10
      else if (q.position <= 10) benchmark = 3
      else if (q.position <= 20) benchmark = 1
      else return null
      const gap = benchmark - q.ctr
      if (gap <= 0 || q.impressions < 50) return null
      return { ...q, benchmark, gap: Math.round(gap * 10) / 10 }
    })
    .filter(Boolean)
    .sort((a, b) => b!.impressions - a!.impressions)
    .slice(0, 15) as CtrGapRow[]
}

function computeDecay(
  currentPages: PageRow[],
  previousPages: PageRow[],
): DecayRow[] {
  const prevMap: Record<string, PageRow> = {}
  for (const p of previousPages) prevMap[p.page] = p

  return currentPages
    .map(p => {
      const prev = prevMap[p.page]
      if (!prev) return null
      const positionDrop = p.position - prev.position
      const sessionsDrop = prev.clicks - p.clicks
      if (positionDrop < 3 && sessionsDrop < prev.clicks * 0.2) return null
      return {
        page: p.page,
        positionNow: p.position,
        positionPrev: prev.position,
        sessionsDrop,
        sessionsNow: p.clicks,
      }
    })
    .filter(Boolean)
    .sort((a, b) => b!.sessionsDrop - a!.sessionsDrop)
    .slice(0, 10) as DecayRow[]
}

// ─── Real-time ────────────────────────────────────────────────────────────────

async function fetchActiveUsers(client: BetaAnalyticsDataClient, propertyId: string): Promise<number> {
  const [res] = await client.runRealtimeReport({
    property: `properties/${propertyId}`,
    metrics: [{ name: 'activeUsers' }],
  })
  return toNum(res.rows?.[0]?.metricValues?.[0]?.value)
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const propertyId = process.env.GA_PROPERTY_ID
  const siteUrl = process.env.GSC_SITE_URL
  if (!propertyId) throw new Error('GA_PROPERTY_ID not set')
  if (!siteUrl) throw new Error('GSC_SITE_URL not set')

  const gaClient = getGaClient()

  const [channels, landingPages, queries, pagesRaw, activeUsers] = await Promise.all([
    fetchChannels(gaClient, propertyId),
    fetchLandingPages(gaClient, propertyId),
    fetchGscQueries(siteUrl),
    fetchGscPages(siteUrl),
    fetchActiveUsers(gaClient, propertyId),
  ])

  const { current: currentPages, previous: previousPages } = pagesRaw as unknown as { current: PageRow[]; previous: PageRow[] }

  return {
    channels,
    landingPages,
    strikingDistance: computeStrikingDistance(queries),
    ctrGaps: computeCtrGaps(queries),
    decay: computeDecay(currentPages, previousPages),
    activeUsers,
    fetchedAt: Date.now(),
  }
}
