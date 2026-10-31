// lib/actions/blogs.ts
'use server'

import { createSupabaseServer } from '@/lib/supabase-server'
import { slugify } from '@/lib/utils'
import { CreateBlogInput, UpdateBlogInput } from '@/types'
import { revalidatePath } from "next/cache"; // pour rafraîchir la liste après insertion

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
export async function createBlog(input: {
  title: string;
  excerpt: string;
  content: string; // HTML produit par TipTap
  published: boolean;
}) {
  // Validation côté serveur : ne jamais faire confiance au client
  if (!input.title.trim()) return { error: "Le titre est obligatoire." };
  if (!input.content || input.content === "<p></p>") return { error: "Le contenu est vide." };

  const supabase = await createSupabaseServer(); // client lié à la session de l'utilisateur connecté

  const { error } = await supabase.from("blogs").insert({
    title: input.title.trim(),
    slug: slugify(input.title), // slug généré depuis le titre
    excerpt: input.excerpt.trim() || null, // résumé optionnel
    content: input.content, // HTML brut dans la colonne content
    published: input.published, // false = brouillon
  });

  if (error) return { error: error.message }; // la RLS ou un slug dupliqué remontent ici

  revalidatePath("/dayane/dashboard/blogs"); // adaptez au chemin réel de votre liste
  return { error: null };
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