'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import type { Tables } from '@/lib/supabase/types'

interface AuthState {
  user: User | null
  session: Session | null
  profile: Tables<'profiles'> | null
  loading: boolean
}

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  profile: null,
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
  })

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setState({ user: session.user, session, profile: profile ?? null, loading: false })
      } else {
        setState({ user: null, session: null, profile: null, loading: false })
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          setState({ user: session.user, session, profile: profile ?? null, loading: false })
        } else {
          setState({ user: null, session: null, profile: null, loading: false })
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
