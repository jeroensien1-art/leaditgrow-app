import { createClient } from '@/lib/outreach/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const email: unknown = body?.email

  if (typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 })
  }

  const supabase = await createClient()

  await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/outreach/auth/confirm`,
    },
  })

  // Always return ok — never reveal whether the email exists
  return NextResponse.json({ ok: true })
}
