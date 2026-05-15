import { createClient } from '@/lib/supabase/client'

export async function getMyConversations(userId: string) {
  const supabase = createClient()
  return supabase
    .from('conversation_participants')
    .select('conversation_id, conversations(*), last_read_at')
    .eq('profile_id', userId)
    .order('joined_at', { ascending: false })
}

export async function getMessages(conversationId: string) {
  const supabase = createClient()
  return supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
}

export async function sendMessage(data: {
  conversation_id: string
  sender_id: string
  sender_name: string
  sender_image?: string
  body: string
}) {
  const supabase = createClient()
  return supabase.from('messages').insert(data).select().single()
}

export function subscribeToMessages(
  conversationId: string,
  callback: (payload: Record<string, unknown>) => void
) {
  const supabase = createClient()
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      callback
    )
    .subscribe()
}
