// lib/supabase-server.ts
// Client Supabase pour le côté SERVEUR (API routes, middleware)
// Différent de lib/supabase.ts qui est pour le côté CLIENT (navigateur)

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServer() {
  const cookieStore = await cookies() // Next.js lit les cookies de la requête entrante

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Comment lire un cookie
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // Comment écrire un cookie
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        // Comment supprimer un cookie
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}