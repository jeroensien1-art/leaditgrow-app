import { NextRequest, NextResponse } from 'next/server'

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  // Geen wachtwoord ingesteld = niemand raakt binnen, in plaats van een
  // publiek bekende standaardwaarde die wel werkt.
  if (!DASHBOARD_PASSWORD || typeof password !== 'string' || password !== DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('dashboard_token', DASHBOARD_PASSWORD, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    sameSite: 'lax',
  })
  return res
}
