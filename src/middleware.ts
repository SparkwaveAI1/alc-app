import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/onboarding']
const PARENT_PATHS = ['/parent', '/standards']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip auth for public paths and API routes
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p)) || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Demo mode: if demo_learner_id cookie is set, bypass auth
  const demoLearnerId = request.cookies.get('demo_learner_id')?.value
  const isDemoMode = !!demoLearnerId

  // Not logged in → redirect to login (unless demo mode)
  if (!user && !isDemoMode) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // Parent-only paths — check role in user metadata
  if (!isDemoMode && PARENT_PATHS.some(p => pathname.startsWith(p))) {
    const role = user!.user_metadata?.role
    if (role !== 'parent') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // Check if learner profile exists — if not, redirect to onboarding
  const profileId = isDemoMode ? demoLearnerId : null
  const profileRes = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/learner_profile${profileId ? `?id=eq.${profileId}` : '?limit=1'}`,
    {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
    }
  )
  const profiles = await profileRes.json()
  const hasProfile = Array.isArray(profiles) && profiles.length > 0

  if (!hasProfile) {
    const url = request.nextUrl.clone()
    url.pathname = '/onboarding'
    return NextResponse.redirect(url)
  }

  // Set demo learner id in response cookie for server components
  if (isDemoMode) {
    supabaseResponse.cookies.set('demo_learner_id', demoLearnerId!, { path: '/', maxAge: 86400 })
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
