import { supabase, type Message } from './supabase'

export type { Message }

export async function getMessages(): Promise<Message[]> {
  const { data, error } = await supabase
    .from('birthday_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return data || []
}

export async function addMessage(name: string, message: string): Promise<Message | null> {
  const { data, error } = await supabase
    .from('birthday_messages')
    .insert([
      {
        name: name.trim(),
        message: message.trim(),
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error adding message:', error)
    return null
  }

  return data
}

export function subscribeToMessages(callback: (messages: Message[]) => void) {
  const subscription = supabase
    .channel('birthday_messages_channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'birthday_messages'
      },
      (payload) => {
        console.log('New message received:', payload)
        // Refetch all messages when a new one is added
        getMessages().then(callback)
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'birthday_messages'
      },
      (payload) => {
        console.log('Message deleted:', payload)
        // Refetch all messages when one is deleted
        getMessages().then(callback)
      }
    )
    .subscribe((status) => {
      console.log('Supabase subscription status:', status)
    })

  return subscription
}
