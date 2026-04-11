import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import Anthropic from '@anthropic-ai/sdk'

// Temporary debug endpoint — visit /api/debug to check all services
// Delete this file after debugging is done

export async function GET() {
  const results: Record<string, string> = {}

  // 1. Env vars present?
  results.SUPABASE_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL    ? '✅ set' : '❌ MISSING'
  results.SUPABASE_KEY     = process.env.SUPABASE_SERVICE_KEY        ? '✅ set' : '❌ MISSING'
  results.ANTHROPIC_KEY    = process.env.ANTHROPIC_API_KEY           ? '✅ set' : '❌ MISSING'
  results.RESEND_KEY       = process.env.RESEND_API_KEY              ? '✅ set' : '❌ MISSING'

  // 2. Supabase — can we reach the diagnostics table?
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    )
    const { error } = await sb.from('diagnostics').select('id').limit(1)
    results.supabase_diagnostics_table = error ? `❌ ${error.message}` : '✅ reachable'
  } catch (e) {
    results.supabase_diagnostics_table = `❌ exception: ${e}`
  }

  // 3. Supabase — leads table?
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    )
    const { error } = await sb.from('leads').select('id').limit(1)
    results.supabase_leads_table = error ? `❌ ${error.message}` : '✅ reachable'
  } catch (e) {
    results.supabase_leads_table = `❌ exception: ${e}`
  }

  // 4. Resend — can we ping it?
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.domains.list()
    results.resend = error ? `❌ ${JSON.stringify(error)}` : '✅ authenticated'
  } catch (e) {
    results.resend = `❌ exception: ${e}`
  }

  // 5. Anthropic — minimal ping
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'ping' }],
    })
    results.anthropic = '✅ authenticated'
  } catch (e) {
    results.anthropic = `❌ ${e}`
  }

  return NextResponse.json(results, { status: 200 })
}
