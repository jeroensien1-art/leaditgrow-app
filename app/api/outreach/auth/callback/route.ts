import { getOAuth2Client } from '@/lib/outreach/googleAuth'
import { encrypt } from '@/lib/outreach/crypto'
import { createClient } from '@/lib/outreach/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const storedState = req.cookies.get('outreach_oauth_state')?.value

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(new URL('/outreach/setup/google?error=csrf', req.url))
  }

  const oauth2Client = getOAuth2Client()
  const { tokens } = await oauth2Client.getToken(code)

  if (!tokens.refresh_token) {
    return NextResponse.redirect(new URL('/outreach/setup/google?error=no_refresh', req.url))
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/outreach/login', req.url))
  }

  const encrypted = encrypt(tokens.refresh_token)
  await supabase.from('outreach_tokens').upsert({
    user_id: user.id,
    encrypted_token: encrypted,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' })

  const res = NextResponse.redirect(new URL('/outreach/setup/sheet', req.url))
  res.cookies.set('outreach_oauth_state', '', { maxAge: 0, path: '/' })
  return res
}
