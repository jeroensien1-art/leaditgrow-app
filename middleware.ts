import { NextRequest, NextResponse } from 'next/server'

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Dashboard protection ──────────────────────────────────────────────────
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/dashboard') || pathname.startsWith('/api/analytics')) {
    const token = request.cookies.get('dashboard_token')?.value
    // Zonder ingesteld wachtwoord gaat alles dicht, niet open. Let op de volgorde:
    // enkel `token !== DASHBOARD_PASSWORD` zou bij een ontbrekende env-var undefined
    // met undefined vergelijken en dus juist iedereen doorlaten.
    if (!DASHBOARD_PASSWORD || !token || token !== DASHBOARD_PASSWORD) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // ── Language detection ────────────────────────────────────────────────────
  const host = request.headers.get('host') || ''
  let language = 'nl'
  if (host.includes('leaditgrow.com')) language = 'en'
  else if (host.includes('leaditgrow.be')) language = 'nl'

  const existingLang = request.cookies.get('lang')?.value
  if (existingLang === language) {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  response.cookies.set('lang', language, { maxAge: 60 * 60 * 24 * 365, path: '/' })
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
