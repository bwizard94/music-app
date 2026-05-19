import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const MAX_PROPOSALS_PER_HOUR = 5

export async function GET() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ allowed: false, reason: 'Not authenticated' }, { status: 401 })
  }

  const windowStart = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('proposals')
    .select('id', { count: 'exact', head: true })
    .eq('submitted_by_id', user.id)
    .gte('created_at', windowStart)

  const recentCount = count ?? 0
  const allowed = recentCount < MAX_PROPOSALS_PER_HOUR

  return NextResponse.json({
    allowed,
    remaining: Math.max(0, MAX_PROPOSALS_PER_HOUR - recentCount),
    reason: allowed ? null : 'Too many proposals submitted recently. Try again later.',
  })
}
