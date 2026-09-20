
'use server'

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
    `)                        // on récupère aussi la catégorie et les stacks liés
    .order('created_at', { ascending: false }) // les plus récents en premier

  if (error) throw new Error(error.message)
  return data
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

  // On génère le slug à partir du titre
  const slug = slugify(input.title)

  // On insère le projet
  const { data: project, error } = await supabase
    .from('projects')
    .insert({ ...input, slug })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // On insère les stacks liées dans la table pivot
  if (stackIds.length > 0) {
    const pivotRows = stackIds.map((stack_id) => ({
      project_id: project.id,
      stack_id,
    }))

    const { error: stackError } = await supabase
      .from('project_stacks')
      .insert(pivotRows)

    if (stackError) throw new Error(stackError.message)
  }

  return project
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