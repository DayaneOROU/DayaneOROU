// lib/actions/stacks.ts
'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

// ============================================
// LIRE — toutes les stacks
// ============================================
export async function getStacks() {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('stacks')
    .select('*')
    .order('name', { ascending: true }) // ordre alphabétique

  if (error) throw new Error(error.message)
  return data
}

// ============================================
// CRÉER — une nouvelle stack
// ============================================
export async function createStack(input: { name: string; icon?: string; color?: string }) {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('stacks')
    .insert(input)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// ============================================
// MODIFIER — une stack
// ============================================
export async function updateStack(id: string, input: { name?: string; icon?: string; color?: string }) {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('stacks')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// ============================================
// SUPPRIMER — une stack
// ============================================
export async function deleteStack(id: string) {
  const supabase = await createSupabaseServer()

  // Les entrées dans project_stacks sont supprimées automatiquement (CASCADE)
  const { error } = await supabase
    .from('stacks')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}