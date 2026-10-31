'use server' // S'exécute côté serveur : c'est indispensable pour effacer les cookies de session

import { redirect } from 'next/navigation' // Redirection côté serveur
import { revalidatePath } from 'next/cache' // Invalidation du cache
import { createSupabaseServer } from '@/lib/supabase-server' // Votre client serveur

export async function signOut() {
  const supabase = await createSupabaseServer() // Client lié aux cookies de la requête

  await supabase.auth.signOut() // Invalide la session côté Supabase et supprime les cookies

  revalidatePath('/', 'layout') // Purge le cache de tout le site : plus aucune donnée de session en mémoire

  redirect('/dayane') // Retour à la page de login
}