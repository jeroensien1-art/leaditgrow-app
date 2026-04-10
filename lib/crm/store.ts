import { createClient } from '@supabase/supabase-js'
import type { Lead } from './claude'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

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
    replied_at: lead.repliedAt ? new Date(lead.repliedAt).toISOString() : null,
    followed_up_at: lead.followedUpAt ? new Date(lead.followedUpAt).toISOString() : null,
  }
}

function fromRow(row: Record<string, unknown>): Lead {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    message: row.message as string,
    lang: row.lang as 'nl' | 'en',
    qualified: row.qualified as boolean,
    score: row.score as number,
    status: row.status as Lead['status'],
    submittedAt: new Date(row.created_at as string).getTime(),
    repliedAt: row.replied_at ? new Date(row.replied_at as string).getTime() : undefined,
    followedUpAt: row.followed_up_at ? new Date(row.followed_up_at as string).getTime() : undefined,
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
  return (data ?? []).map(fromRow)
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
  return (data ?? []).map(fromRow)
}

export async function markFollowedUp(id: string): Promise<void> {
  await updateLead(id, { status: 'followed_up', followedUpAt: Date.now() })
}
