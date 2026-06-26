import { createClient } from '@/lib/outreach/supabase'
import { NextRequest, NextResponse } from 'next/server'

const VALID_OFFERS = ['leiderschapsanalyse', 'speed-to-lead', 'bedrijfsgroei', null]

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const sheet_id: unknown = body?.sheet_id
  const default_offer: unknown = body?.default_offer ?? null

  if (typeof sheet_id !== 'string' || !sheet_id.trim()) {
    return NextResponse.json({ error: 'sheet_id is verplicht' }, { status: 400 })
  }

  if (!VALID_OFFERS.includes(default_offer as string | null)) {
    return NextResponse.json({ error: 'Ongeldig aanbod' }, { status: 400 })
  }

  const company_name =
    (user.user_metadata?.company_name as string | undefined) ??
    (user.email?.split('@')[0] ?? 'Onbekend')

  const { error } = await supabase.from('outreach_clients').upsert({
    user_id: user.id,
    company_name,
    sheet_id: sheet_id.trim(),
    default_offer: default_offer || null,
  }, { onConflict: 'user_id' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
