// components/public/ContactForm.tsx
"use client"; // utilise useState et des événements : composant client

import { useState } from "react";
import { sendMessage } from "@/lib/actions/messages"; // la Server Action, appelée comme une fonction
import { MESSAGE_CATEGORIES, MESSAGE_CATEGORY_LABELS } from "@/lib/message-categories";

export function ContactForm() {
  const [loading, setLoading] = useState(false); // true pendant l'envoi
  const [error, setError] = useState<string | null>(null); // message d'erreur éventuel
  const [sent, setSent] = useState(false); // true une fois le message envoyé

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // empêche le rechargement de la page
    setLoading(true);
    setError(null);

    const form = e.currentTarget; // on garde une référence pour pouvoir vider le formulaire
    const result = await sendMessage(new FormData(form)); // envoie TOUS les champs, piège compris

    setLoading(false);
    if (!result.ok) {
      setError(result.error); // affiche l'erreur de validation renvoyée par le serveur
      return;
    }
    form.reset(); // vide les champs
    setSent(true); // affiche le message de succès
  }

  // Écran de succès à la place du formulaire
  if (sent) {
    return (
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-8 text-center">
        <p className="text-lg font-semibold text-emerald-300">Message envoyé</p>
        <p className="mt-2 text-sm text-zinc-400">Merci, je vous réponds dès que possible.</p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-sm font-semibold text-white underline underline-offset-4"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  // Classes communes aux champs, pour ne pas les répéter
  const field =
    "w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#277861] focus:ring-2 focus:ring-[#277861]/20";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Champ piège : invisible pour un humain, rempli par les robots.
          aria-hidden + tabIndex -1 + autoComplete off : ni lecteur d'écran, ni clavier, ni navigateur ne le remplissent */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Ne pas remplir
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm text-zinc-400">Nom</label>
          {/* maxLength identique aux limites vérifiées côté serveur */}
          <input id="name" name="name" type="text" required maxLength={100} className={field} placeholder="Votre nom" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm text-zinc-400">Email</label>
          <input id="email" name="email" type="email" required maxLength={254} className={field} placeholder="vous@exemple.com" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-sm text-zinc-400">Catégorie</label>
          {/* Options générées depuis la liste unique : impossible de désynchroniser avec le serveur */}
          <select id="category" name="category" required defaultValue="" className={field}>
            <option value="" disabled>Choisir…</option>
            {MESSAGE_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-zinc-900">{MESSAGE_CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="subject" className="text-sm text-zinc-400">Sujet</label>
          <input id="subject" name="subject" type="text" required maxLength={150} className={field} placeholder="De quoi s'agit-il ?" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="body" className="text-sm text-zinc-400">Message</label>
        <textarea id="body" name="body" required maxLength={5000} rows={6} className={`${field} resize-none`} placeholder="Votre message…" />
      </div>

      {/* Erreur renvoyée par le serveur ; role="alert" pour les lecteurs d'écran */}
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading} // empêche le double envoi
        className="min-h-11 rounded-xl bg-[#277861] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#277861]/15 transition hover:bg-[#1f624f] disabled:opacity-50"
      >
        {loading ? "Envoi..." : "Envoyer le message"}
      </button>
    </form>
  );
}