import { createClient } from '@/lib/supabase/client'
import type { InsertTables } from '@/lib/supabase/types'

export async function getMyProposals(userId: string) {
  const supabase = createClient()
  return supabase
    .from('proposals')
    .select('*, proposal_lineup(*)')
    .eq('submitted_by_id', userId)
    .order('created_at', { ascending: false })
}

export async function getVenueProposals(venueId: string) {
  const supabase = createClient()
  return supabase
    .from('proposals')
    .select('*, proposal_lineup(*)')
    .eq('venue_id', venueId)
    .order('created_at', { ascending: false })
}

export async function getProposalById(id: string) {
  const supabase = createClient()
  return supabase
    .from('proposals')
    .select('*, proposal_lineup(*)')
    .eq('id', id)
    .single()
}

export async function createProposal(data: InsertTables<'proposals'>) {
  const supabase = createClient()
  return supabase.from('proposals').insert(data).select().single()
}

export async function updateProposalStatus(
  id: string,
  status: string,
  extra?: {
    venue_note?: string
    venue_response?: string
    change_requests?: string[]
  }
) {
  const supabase = createClient()
  return supabase
    .from('proposals')
    .update({ status, ...extra })
    .eq('id', id)
    .select()
    .single()
}
