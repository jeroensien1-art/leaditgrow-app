import { NextRequest, NextResponse } from 'next/server'

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD ?? 'changeme'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Dashboard protection ──────────────────────────────────────────────────
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/dashboard')) {
    const token = request.cookies.get('dashboard_token')?.value
    if (token !== DASHBOARD_PASSWORD) {
      // For API routes return 401
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      // For page routes redirect to login
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

  const response = NextResponse.next()
  response.cookies.set('lang', language, { maxAge: 60 * 60 * 24 * 365, path: '/' })
  return response
}

export const config = {
  matcher: [
    // Match all requests except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
