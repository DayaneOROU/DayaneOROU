
'use server'
import { revalidatePath } from 'next/cache'
import { createSupabaseServer } from '@/lib/supabase-server'
import { slugify } from '@/lib/utils'
import { CreateProjectInput, UpdateProjectInput } from '@/types'


export async function getProjects() {
  const supabase = await createSupabaseServer() 

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      category:project_categories(*),
      stacks:project_stacks(stack:stacks(*))
    `)
    .order('created_at', { ascending: false }) 

  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function getProjectBySlug(slug: string) {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      category:project_categories(*),
      stacks:project_stacks(stack:stacks(*))
    `)
    .eq('slug', slug)         // filtre par slug
    .single()                 // retourne un seul objet au lieu d'un tableau

  if (error) throw new Error(error.message)
  return data
}

export async function createProject(input: CreateProjectInput, stackIds: string[]) {
  const supabase = await createSupabaseServer()

  // Validation serveur minimale : le client ne mérite jamais une confiance aveugle
  if (!input.title?.trim()) return { error: 'Le titre est obligatoire.' }

  // Slug généré à partir du titre (source unique de vérité)
  const slug = slugify(input.title)

  // Insertion du projet ; .select().single() renvoie la ligne créée (donc son id)
  const { data: project, error } = await supabase
    .from('projects')
    .insert({ ...input, slug })
    .select()
    .single()

  // Au lieu de throw : on renvoie l'erreur, lisible dans le modal
  if (error) return { error: error.message }

  // Insertion des stacks liées dans la table pivot
  if (stackIds.length > 0) {
    const pivotRows = stackIds.map((stack_id) => ({
      project_id: project.id, // Id du projet tout juste créé
      stack_id,
    }))

    const { error: stackError } = await supabase.from('project_stacks').insert(pivotRows)

    if (stackError) {
      // Pas de transaction : on annule à la main pour éviter un projet orphelin
      await supabase.from('projects').delete().eq('id', project.id)
      return { error: stackError.message }
    }
  }

  // Rafraîchit la liste des projets dans le dashboard
  revalidatePath('/dayane/dashboard/projects')

  return { error: null } // Succès : forme constante { error }
}


export async function updateProject(id: string, input: UpdateProjectInput, stackIds: string[]) {
  const supabase = await createSupabaseServer()

  // Si le titre a changé on régénère le slug
  const updates = input.title
    ? { ...input, slug: slugify(input.title) }
    : input

  // On met à jour le projet
  const { data: project, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  // On supprime les anciennes stacks puis on reinsère les nouvelles
  await supabase.from('project_stacks').delete().eq('project_id', id)

  if (stackIds.length > 0) {
    const pivotRows = stackIds.map((stack_id) => ({
      project_id: id,
      stack_id,
    }))

    const { error: stackError } = await supabase
      .from('project_stacks')
      .insert(pivotRows)

    if (stackError) throw new Error(stackError.message)
  }

  return project
}

export async function deleteProject(id: string) {
  const supabase = await createSupabaseServer()

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}