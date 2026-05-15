import { createClient } from '@/lib/supabase/client'
import type { InsertTables } from '@/lib/supabase/types'

export async function getMyEvents(userId: string) {
  const supabase = createClient()
  return supabase
    .from('events')
    .select('*, event_lineup(*)')
    .eq('creator_id', userId)
    .order('created_at', { ascending: false })
}

export async function createEvent(data: InsertTables<'events'>) {
  const supabase = createClient()
  return supabase.from('events').insert(data).select().single()
}

export async function updateEvent(id: string, data: InsertTables<'events'>) {
  const supabase = createClient()
  return supabase.from('events').update(data).eq('id', id).select().single()
}
