import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require a logged-in session
const PROTECTED_PATHS = [
  '/dashboard', '/profile/settings', '/venue/settings',
  '/show-builder', '/proposals', '/messages', '/discover',
  '/board', '/scene', '/admin',
]

// Routes that logged-in users should not visit
const AUTH_PATHS = ['/login', '/signup']

// Security headers added to every response
const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Add security headers to all responses
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    supabaseResponse.headers.set(key, value)
  })

  // Only run auth check when Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const isConfigured = supabaseUrl.length > 0 && !supabaseUrl.includes('placeholder')

  if (!isConfigured) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          // Re-apply security headers after response recreation
          Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, value)
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not write logic between createServerClient and getUser()
  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  const isProtected = PROTECTED_PATHS.some(p => path === p || path.startsWith(p + '/'))
  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  if (user && AUTH_PATHS.includes(path)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
