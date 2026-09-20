// lib/actions/messages.ts
'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

// ============================================
// LIRE — tous les messages
// ============================================
export async function getMessages() {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

// ============================================
// MARQUER comme lu / non lu
// ============================================
export async function toggleMessageRead(id: string, read: boolean) {
  const supabase = await createSupabaseServer()

  const { error } = await supabase
    .from('messages')
    .update({ read })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

// ============================================
// SUPPRIMER — un message
// ============================================
export async function deleteMessage(id: string) {
  const supabase = await createSupabaseServer()

  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}