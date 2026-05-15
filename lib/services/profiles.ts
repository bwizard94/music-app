import { createClient } from '@/lib/supabase/client'
import type { UpdateTables, InsertTables } from '@/lib/supabase/types'

export async function getProfile(userId: string) {
  const supabase = createClient()
  return supabase.from('profiles').select('*').eq('id', userId).single()
}

export async function updateProfile(userId: string, updates: UpdateTables<'profiles'>) {
  const supabase = createClient()
  return supabase.from('profiles').update(updates).eq('id', userId).select().single()
}

export async function getArtistProfileBySlug(slug: string) {
  const supabase = createClient()
  return supabase
    .from('artist_profiles')
    .select('*, profiles(*), social_links(*)')
    .eq('slug', slug)
    .single()
}

export async function upsertArtistProfile(data: InsertTables<'artist_profiles'>) {
  const supabase = createClient()
  return supabase
    .from('artist_profiles')
    .upsert(data, { onConflict: 'profile_id' })
    .select()
    .single()
}

export async function getVenueProfileBySlug(slug: string) {
  const supabase = createClient()
  return supabase
    .from('venue_profiles')
    .select('*, profiles(*), social_links(*)')
    .eq('slug', slug)
    .single()
}

export async function upsertVenueProfile(data: InsertTables<'venue_profiles'>) {
  const supabase = createClient()
  return supabase
    .from('venue_profiles')
    .upsert(data, { onConflict: 'profile_id' })
    .select()
    .single()
}

export async function upsertSocialLinks(
  profileId: string,
  links: Array<{ platform: string; url: string }>
) {
  const supabase = createClient()
  await supabase.from('social_links').delete().eq('profile_id', profileId)
  if (links.length === 0) return { data: [], error: null }
  return supabase
    .from('social_links')
    .insert(links.map(l => ({ profile_id: profileId, platform: l.platform, url: l.url })))
    .select()
}

export async function createOnboardingProfile(
  userId: string,
  data: {
    role: string
    displayName: string
    city: string
    genres: string[]
    links: Record<string, string>
    accentColor: string
    slug: string
  }
) {
  const supabase = createClient()

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      role: data.role,
      display_name: data.displayName,
      city: data.city,
      accent_color: data.accentColor,
    })
    .eq('id', userId)

  if (profileError) return { error: profileError }

  const isVenue = data.role === 'venue'
  if (isVenue) {
    await supabase.from('venue_profiles').upsert(
      {
        profile_id: userId,
        slug: data.slug,
        name: data.displayName,
        genres: data.genres,
        city: data.city,
        country: '',
        accent_color: data.accentColor,
        capacity: 0,
      },
      { onConflict: 'profile_id' }
    )
  } else {
    await supabase.from('artist_profiles').upsert(
      {
        profile_id: userId,
        slug: data.slug,
        genres: data.genres,
      },
      { onConflict: 'profile_id' }
    )
  }

  const links = Object.entries(data.links)
    .filter(([, url]) => url.trim())
    .map(([platform, url]) => ({ profile_id: userId, platform, url }))

  if (links.length > 0) {
    await supabase
      .from('social_links')
      .upsert(links, { onConflict: 'profile_id,platform' })
  }

  return { error: null }
}
