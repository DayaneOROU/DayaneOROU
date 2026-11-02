// lib/actions/blogs.ts
"use server";

import { createSupabaseServer } from "@/lib/supabase-server";
import { slugify } from "@/lib/utils";
import { CreateBlogInput, UpdateBlogInput } from "@/types";
import { revalidatePath } from "next/cache"; // pour rafraîchir la liste après insertion

// ============================================
// LIRE — tous les articles
// ============================================
export async function getBlogs() {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("blogs")
    .select(
      `
      *,
      project:projects(id, title, slug)
    `,
    ) // on récupère juste l'essentiel du projet lié
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// ============================================
// LIRE — un seul article par slug
// ============================================
export async function getBlogBySlug(slug: string) {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("blogs")
    .select(
      `
      *,
      project:projects(id, title, slug)
    `,
    )
    .eq("slug", slug)
    .single();

  if (error) throw new Error(error.message);
  return data;
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
  if (!input.content || input.content === "<p></p>")
    return { error: "Le contenu est vide." };

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
  const supabase = await createSupabaseServer();

  const updates = input.title
    ? { ...input, slug: slugify(input.title) }
    : input;

  const { data, error } = await supabase
    .from("blogs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ============================================
// LIRE — un article par id (page de modification)
// ============================================
export async function getBlogById(id: string) {
  const supabase = await createSupabaseServer(); // client lié à la session

  const { data, error } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, content, published") // seulement ce dont le formulaire a besoin
    .eq("id", id)
    .maybeSingle(); // renvoie null si introuvable (au lieu de lever une erreur)

  if (error) throw new Error(error.message);
  return data;
}

// ============================================
// MODIFIER — contenu d'un article (le slug ne change JAMAIS)
// ============================================
export async function updateBlogContent(
  id: string,
  input: {
    title: string;
    excerpt: string;
    content: string;
    published: boolean;
  },
) {
  // mêmes validations que createBlog : on ne fait jamais confiance au client
  if (!input.title.trim()) return { error: "Le titre est obligatoire." };
  if (!input.content || input.content === "<p></p>")
    return { error: "Le contenu est vide." };

  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("blogs")
    .update({
      title: input.title.trim(),
      excerpt: input.excerpt.trim() || null, // résumé optionnel
      content: input.content, // HTML de TipTap
      published: input.published, // décocher = retour en brouillon
      updated_at: new Date().toISOString(), // date de dernière modification
      // PAS de slug ici : l'adresse reste stable après la création
    })
    .eq("id", id)
    .select("slug") // on récupère le slug pour rafraîchir la page publique
    .single();

  // si ce message parle de "single JSON object", la politique RLS d'UPDATE manque dans Supabase
  if (error) return { error: error.message };

  revalidatePath("/dayane/dashboard/blogs"); // la liste
  revalidatePath(`/dayane/dashboard/blogs/${id}`); // cette page
  revalidatePath(`/blog/${data.slug}`); // la page publique (étape 4)
  return { error: null };
}

// ============================================
// SUPPRIMER — un article
// ============================================
export async function deleteBlog(id: string) {
  const supabase = await createSupabaseServer();

  const { error } = await supabase.from("blogs").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
