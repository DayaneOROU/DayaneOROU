// lib/actions/messages.ts
'use server' // toutes les fonctions async exportées ici deviennent des Server Actions

import { createSupabaseServer } from '@/lib/supabase-server' // client Supabase lié aux cookies
import { Resend } from 'resend' // SDK d'envoi d'emails
import { MESSAGE_CATEGORIES } from '@/lib/message-categories' // liste importée (jamais exportée ici)

// Résultat de sendMessage : on retourne un résultat au lieu de lever une erreur,
// car en production Next.js masque le texte des erreurs levées dans une Server Action.
// Un type non exporté est autorisé dans un fichier 'use server' (il disparaît à la compilation).
type SendResult = { ok: true } | { ok: false; error: string }

// ============================================
// LIRE — tous les messages (dashboard, connecté)
// ============================================
export async function getMessages() {
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false }) // les plus récents en premier

  if (error) throw new Error(error.message)
  return data
}

// ============================================
// MARQUER comme lu / non lu (dashboard, connecté)
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
// SUPPRIMER — un message (dashboard, connecté)
// ============================================
export async function deleteMessage(id: string) {
  const supabase = await createSupabaseServer()

  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

// ============================================
// ENVOYER — formulaire de contact public (visiteur anonyme)
// ============================================
export async function sendMessage(formData: FormData): Promise<SendResult> {
  // ── 1. Anti-spam : champ piège invisible ──
  // Un humain ne le voit pas, donc ne le remplit pas. Un robot le remplit.
  // On répond "ok" sans rien enregistrer pour ne pas l'informer qu'il est détecté.
  if (String(formData.get('website') ?? '').trim() !== '') return { ok: true }

  // ── 2. Lecture des champs (String() évite les valeurs null ou les fichiers) ──
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const category = String(formData.get('category') ?? '').trim()
  // Retours à la ligne retirés du sujet : ils servent à injecter des en-têtes d'email
  const subject = String(formData.get('subject') ?? '').replace(/[\r\n]+/g, ' ').trim()
  const body = String(formData.get('body') ?? '').trim()

  // ── 3. Validation (le navigateur peut être contourné : on revérifie TOUT ici) ──
  if (name.length < 1 || name.length > 100) return { ok: false, error: 'Nom invalide (1 à 100 caractères).' }
  // Vérification d'email simple : quelque chose@quelque.chose, sans espace
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    return { ok: false, error: 'Adresse email invalide.' }
  if (!(MESSAGE_CATEGORIES as readonly string[]).includes(category))
    return { ok: false, error: 'Catégorie invalide.' }
  if (subject.length < 1 || subject.length > 150) return { ok: false, error: 'Sujet invalide (1 à 150 caractères).' }
  if (body.length < 1 || body.length > 5000) return { ok: false, error: 'Message invalide (1 à 5000 caractères).' }

  // ── 4. Enregistrement en base (la source de vérité) ──
  const supabase = await createSupabaseServer() // visiteur sans session : rôle anonyme
  // Pas de .select() : le visiteur n'a pas le droit de LIRE, la requête échouerait alors que l'insertion a réussi
  const { error } = await supabase
    .from('messages')
    .insert({ name, email, category, subject, body })
  if (error) {
    console.error('Insertion message échouée :', error.message) // détail visible dans les logs Vercel uniquement
    return { ok: false, error: "Impossible d'envoyer le message. Réessayez plus tard." }
  }

  // ── 5. Notification par email : un échec ici ne doit PAS faire échouer le formulaire ──
  try {
    const resend = new Resend(process.env.RESEND_API_KEY) // clé lue côté serveur uniquement
    const { error: mailError } = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>', // expéditeur fixe : jamais l'email du visiteur
      to: process.env.CONTACT_TO_EMAIL!,         // votre boîte (l'email de votre compte Resend)
      replyTo: email,                            // "Répondre" dans Gmail écrit au visiteur
      subject: `[Portfolio] ${subject}`,
      // Texte brut : aucun risque d'injection de HTML venant du visiteur
      text: `De : ${name} <${email}>\nCatégorie : ${category}\n\n${body}`,
    })
    // Le SDK ne lève pas d'exception : il renvoie { data, error }
    if (mailError) console.error('Email non envoyé :', mailError.message)
  } catch (e) {
    console.error('Email non envoyé :', e)
  }

  return { ok: true } // le message est enregistré, quoi qu'il arrive pour l'email
}