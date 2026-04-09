import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''

  // Determine language based on domain
  let language = 'nl' // default

  if (host.includes('leaditgrow.com')) {
    language = 'en'
  } else if (host.includes('leaditgrow.be')) {
    language = 'nl'
  }

  // Set language in cookie so client can read it
  const response = NextResponse.next()
  response.cookies.set('lang', language, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  })

  return response
}

export const config = {
  matcher: [
    // Match all requests except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
