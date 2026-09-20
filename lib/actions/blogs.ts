// lib/actions/blogs.ts
'use server'

import { createSupabaseServer } from '@/lib/supabase-server'
import { slugify } from '@/lib/utils'
import { CreateBlogInput, UpdateBlogInput } from '@/types'

// ============================================
// LIRE — tous les articles
// ============================================
export async function getBlogs() {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('blogs')
    .select(`
      *,
      project:projects(id, title, slug)
    `)                        // on récupère juste l'essentiel du projet lié
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

// ============================================
// LIRE — un seul article par slug
// ============================================
export async function getBlogBySlug(slug: string) {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('blogs')
    .select(`
      *,
      project:projects(id, title, slug)
    `)
    .eq('slug', slug)
    .single()

  if (error) throw new Error(error.message)
  return data
}

// ============================================
// CRÉER — un nouvel article
// ============================================
export async function createBlog(input: CreateBlogInput) {
  const supabase = await createSupabaseServer()

  const slug = slugify(input.title)

  const { data, error } = await supabase
    .from('blogs')
    .insert({ ...input, slug })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// ============================================
// MODIFIER — un article existant
// ============================================
export async function updateBlog(id: string, input: UpdateBlogInput) {
  const supabase = await createSupabaseServer()

  const updates = input.title
    ? { ...input, slug: slugify(input.title) }
    : input

  const { data, error } = await supabase
    .from('blogs')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// ============================================
// SUPPRIMER — un article
// ============================================
export async function deleteBlog(id: string) {
  const supabase = await createSupabaseServer()

  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}