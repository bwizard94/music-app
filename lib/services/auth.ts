import { createClient } from '@/lib/supabase/client'

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = createClient()
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  const supabase = createClient()
  return supabase.auth.signOut()
}

export async function signInWithGoogle() {
  const supabase = createClient()
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
}

export async function signInWithApple() {
  const supabase = createClient()
  return supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
}
