import { generateAuthUrl } from '@/lib/outreach/googleAuth'
import { randomBytes } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest) {
  const state = randomBytes(16).toString('hex')
  const url = generateAuthUrl(state)
  const res = NextResponse.redirect(url)
  res.cookies.set('outreach_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })
  return res
}
