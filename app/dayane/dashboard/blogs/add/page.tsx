"use client"; // formulaire interactif → composant client

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // redirection après succès
import TiptapEditor from "@/components/tiptap-editor";
import { createBlog } from "@/lib/actions/blogs";

export default function NewBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState(""); // titre
  const [excerpt, setExcerpt] = useState(""); // résumé
  const [content, setContent] = useState(""); // HTML de l'éditeur
  const [published, setPublished] = useState(false); // brouillon par défaut
  const [error, setError] = useState<string | null>(null); // erreur éventuelle
  const [loading, setLoading] = useState(false); // anti double clic

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // pas de rechargement
    setLoading(true);
    setError(null);

    const res = await createBlog({ title, excerpt, content, published }); // Server Action

    if (res.error) {
      setError(res.error); // on reste sur la page avec le message
      setLoading(false);
      return;
    }
    router.push("/dayane/dashboard/blogs"); // retour à la liste
  }

  return (
    // pt-32 = on passe sous la navbar flottante ; max-w-6xl = largeur confortable
    <form onSubmit={handleSubmit} className="mx-auto max-w-6xl px-6 pb-16 pt-32">
      {/* Grille : feuille flexible à gauche, panneau fixe de 320px à droite (empilé sur mobile) */}
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">

        {/* ===== COLONNE GAUCHE : la "feuille" ===== */}
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
          {/* Gros titre sans bordure : il se fond dans la feuille */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'article"
            className="w-full rounded-t-2xl bg-transparent px-8 pb-5 pt-8 text-4xl font-bold tracking-tight text-neutral-900 placeholder:text-neutral-300 focus:outline-none"
          />
          <TiptapEditor value={content} onChange={setContent} />
        </div>

        {/* ===== COLONNE DROITE : panneau de réglages, collé en haut au scroll ===== */}
        <aside className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:sticky lg:top-32">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Résumé
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Affiché dans la liste des articles"
              rows={4}
              className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          {/* Interrupteur Publié / Brouillon (checkbox cachée + piste stylée) */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Statut
            </label>
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-neutral-200 p-3">
              <span className="text-sm text-neutral-700">
                {published ? "Publié" : "Brouillon"}
              </span>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="peer sr-only" // invisible mais accessible
              />
              {/* Piste grise → orange quand coché ; le rond glisse via peer-checked */}
              <span className="relative h-6 w-11 rounded-full bg-neutral-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-orange-500 peer-checked:after:translate-x-5" />
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Enregistrement…" : published ? "Publier" : "Enregistrer le brouillon"}
            </button>
            <Link
              href="/dayane/dashboard/blogs"
              className="rounded-lg px-4 py-2 text-center text-sm text-neutral-500 hover:bg-neutral-100"
            >
              Annuler
            </Link>
          </div>
        </aside>
      </div>
    </form>
  );
}