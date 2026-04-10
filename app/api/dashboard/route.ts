import { NextResponse } from 'next/server'
import { getAllLeads, updateLead } from '@/lib/crm/store'
import type { Lead } from '@/lib/crm/claude'

export async function GET() {
  try {
    const leads = await getAllLeads()
    return NextResponse.json({ leads })
  } catch (err) {
    console.error('[dashboard] error:', err)
    return NextResponse.json({ error: 'Failed to load leads' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json()
    if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
    await updateLead(id, { status: status as Lead['status'] })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[dashboard patch] error:', err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
