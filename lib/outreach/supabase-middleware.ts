import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_OUTREACH_PATHS = [
  '/outreach/login',
  '/api/outreach/magic-link',
  '/api/outreach/auth/confirm',
  '/api/outreach/auth/callback',
]

export async function updateOutreachSession(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl

  const isOutreachPage = pathname.startsWith('/outreach')
  const isOutreachApi = pathname.startsWith('/api/outreach')

  if (!isOutreachPage && !isOutreachApi) return null

  const isPublicOutreach = PUBLIC_OUTREACH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  if (!isPublicOutreach && !user) {
    if (isOutreachApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = request.nextUrl.clone()
    url.pathname = '/outreach/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
