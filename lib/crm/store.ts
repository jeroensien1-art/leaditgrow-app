import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import type { Lead } from './claude'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

function toRow(lead: Lead) {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    message: lead.message,
    lang: lead.lang,
    qualified: lead.qualified,
    score: lead.score,
    status: lead.status,
    source: lead.source ?? 'widget',
    replied_at: lead.repliedAt ? new Date(lead.repliedAt).toISOString() : null,
    followed_up_at: lead.followedUpAt ? new Date(lead.followedUpAt).toISOString() : null,
  }
}

function fromRow(row: Record<string, unknown>, diag?: { answers: Record<string, number>; top_levers: string[]; score: number; industry: string; team_size: string; avg_deal_value: string; monthly_leads: string; phone?: string; website?: string }): Lead {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    message: row.message as string,
    lang: row.lang as 'nl' | 'en',
    qualified: row.qualified as boolean,
    score: row.score as number,
    status: row.status as Lead['status'],
    source: (row.source as Lead['source']) ?? 'widget',
    submittedAt: new Date(row.created_at as string).getTime(),
    repliedAt: row.replied_at ? new Date(row.replied_at as string).getTime() : undefined,
    followedUpAt: row.followed_up_at ? new Date(row.followed_up_at as string).getTime() : undefined,
    diagnosticAnswers: diag?.answers,
    diagnosticTopLevers: diag?.top_levers,
    diagnosticGapScore: diag?.score,
    diagnosticContext: diag ? { industry: diag.industry, teamSize: diag.team_size, avgDealValue: diag.avg_deal_value, monthlyLeads: diag.monthly_leads, phone: diag.phone, website: diag.website } : undefined,
  }
}

export async function saveLead(lead: Lead): Promise<void> {
  const { error } = await supabase.from('leads').insert(toRow(lead))
  if (error) throw new Error(`saveLead: ${error.message}`)
}

export async function getLead(id: string): Promise<Lead | null> {
  const { data, error } = await supabase.from('leads').select('*').eq('id', id).single()
  if (error || !data) return null
  return fromRow(data)
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<void> {
  const updates: Record<string, unknown> = {}
  if (patch.status !== undefined) updates.status = patch.status
  if (patch.qualified !== undefined) updates.qualified = patch.qualified
  if (patch.score !== undefined) updates.score = patch.score
  if (patch.lang !== undefined) updates.lang = patch.lang
  if (patch.repliedAt !== undefined) updates.replied_at = new Date(patch.repliedAt).toISOString()
  if (patch.followedUpAt !== undefined) updates.followed_up_at = new Date(patch.followedUpAt).toISOString()

  const { error } = await supabase.from('leads').update(updates).eq('id', id)
  if (error) throw new Error(`updateLead: ${error.message}`)
}

export async function markReplied(id: string): Promise<void> {
  await updateLead(id, { status: 'replied', repliedAt: Date.now() })
}

export async function getAllLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(`getAllLeads: ${error.message}`)

  const rows = data ?? []
  const diagnosticIds = rows.filter(r => r.source === 'diagnostic').map(r => r.id as string)

  let diagMap: Record<string, { answers: Record<string, number>; top_levers: string[]; score: number; industry: string; team_size: string; avg_deal_value: string; monthly_leads: string; phone?: string; website?: string }> = {}
  if (diagnosticIds.length > 0) {
    const { data: diags } = await supabase
      .from('diagnostics')
      .select('id, answers, top_levers, score, industry, team_size, avg_deal_value, monthly_leads, phone, website')
      .in('id', diagnosticIds)
    for (const d of diags ?? []) {
      diagMap[d.id] = { answers: d.answers, top_levers: d.top_levers, score: d.score, industry: d.industry, team_size: d.team_size, avg_deal_value: d.avg_deal_value, monthly_leads: d.monthly_leads, phone: d.phone, website: d.website }
    }
  }

  return rows.map(r => fromRow(r, diagMap[r.id as string]))
}

export async function getDueFollowUps(): Promise<Lead[]> {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('status', 'new')
    .is('followed_up_at', null)
    .lt('created_at', twoHoursAgo)
  if (error) throw new Error(`getDueFollowUps: ${error.message}`)
  return (data ?? []).map(r => fromRow(r))
}

export async function markFollowedUp(id: string): Promise<void> {
  await updateLead(id, { status: 'followed_up', followedUpAt: Date.now() })
}

export async function saveResendIds(leadId: string, ids: string[]): Promise<void> {
  const { error } = await supabase
    .from('leads')
    .update({ resend_ids: ids })
    .eq('id', leadId)
  if (error) console.error(`[saveResendIds] ${error.message}`)
}

export async function getResendIds(leadId: string): Promise<string[]> {
  const { data } = await supabase
    .from('leads')
    .select('resend_ids')
    .eq('id', leadId)
    .single()
  return (data?.resend_ids as string[]) ?? []
}

export async function cancelNurtureSequence(leadId: string): Promise<void> {
  const ids = await getResendIds(leadId)
  if (ids.length === 0) return
  await Promise.allSettled(ids.map(id => resend.emails.cancel(id)))
  await supabase.from('leads').update({ resend_ids: [] }).eq('id', leadId)
  console.log(`[cancelNurture] cancelled ${ids.length} scheduled emails for lead ${leadId}`)
}
