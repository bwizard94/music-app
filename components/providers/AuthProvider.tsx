'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import type { Tables } from '@/lib/supabase/types'

interface AuthState {
  user: User | null
  session: Session | null
  profile: Tables<'profiles'> | null
  profileSlug: string | null
  loading: boolean
}

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  profile: null,
  profileSlug: null,
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    profileSlug: null,
    loading: true,
  })

  useEffect(() => {
    const supabase = createClient()

    async function loadProfile(session: { user: User }) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      let profileSlug: string | null = null
      if (profile) {
        if (profile.role === 'venue') {
          const { data: venueP } = await supabase.from('venue_profiles').select('slug').eq('profile_id', profile.id).single()
          profileSlug = venueP?.slug ?? null
        } else {
          const { data: artistP } = await supabase.from('artist_profiles').select('slug').eq('profile_id', profile.id).single()
          profileSlug = artistP?.slug ?? null
        }
      }

      return { profile: profile ?? null, profileSlug }
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { profile, profileSlug } = await loadProfile(session)
        setState({ user: session.user, session, profile, profileSlug, loading: false })
      } else {
        setState({ user: null, session: null, profile: null, profileSlug: null, loading: false })
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { profile, profileSlug } = await loadProfile(session)
          setState({ user: session.user, session, profile, profileSlug, loading: false })
        } else {
          setState({ user: null, session: null, profile: null, profileSlug: null, loading: false })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
