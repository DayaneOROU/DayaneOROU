"use client"; // formulaire interactif → composant client

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // redirection / rafraîchissement
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { createBlog, updateBlogContent } from "@/lib/actions/blogs";

// Forme d'un article existant (type écrit ici pour ne pas dépendre de @/types)
type BlogData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  published: boolean;
};

// Sans prop "blog" → mode CRÉATION ; avec "blog" → mode MODIFICATION
export default function BlogForm({ blog }: { blog?: BlogData }) {
  const router = useRouter();
  const [title, setTitle] = useState(blog?.title ?? ""); // titre
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? ""); // résumé
  const [content, setContent] = useState(blog?.content ?? ""); // HTML (rempli par l'éditeur)
  const [published, setPublished] = useState(blog?.published ?? false); // brouillon par défaut
  const [error, setError] = useState<string | null>(null); // erreur éventuelle
  const [saved, setSaved] = useState(false); // message « Enregistré »
  const [loading, setLoading] = useState(false); // anti double clic

  async function handleSave() {
    setLoading(true);
    setError(null);
    setSaved(false);

    const input = { title, excerpt, content, published };
    // création ou modification : les deux actions renvoient { error }
    const res = blog ? await updateBlogContent(blog.id, input) : await createBlog(input);

    if (res.error) {
      setError(res.error); // on reste sur la page avec le message
      setLoading(false);
      return;
    }

    if (blog) {
      setSaved(true); // modification : on reste sur la page pour continuer à écrire
      setLoading(false);
      router.refresh(); // recharge les données serveur
    } else {
      router.push("/dayane/dashboard/blogs"); // création : retour à la liste
    }
  }

  return (
    // <div> et non <form> : certains boutons de la barre d'outils TipTap pourraient soumettre un formulaire
    <div className="mx-auto max-w-6xl px-6 pb-16 pt-32">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
        {/* ===== COLONNE GAUCHE : la feuille ===== */}
        <div className="editor-sheet rounded-2xl border border-neutral-200 bg-[#EEEDE7] shadow-sm">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'article"
            className="w-full rounded-t-2xl bg-transparent px-8 pb-2 pt-8 text-4xl font-bold tracking-tight text-neutral-900 placeholder:text-neutral-300 focus:outline-none"
          />
          {/* En modification : l'adresse est affichée mais figée */}
          {blog && (
            <p className="px-8 pb-4 text-xs text-neutral-400">Adresse : /blog/{blog.slug}</p>
          )}
          {/* L'éditeur reçoit le HTML de départ et nous renvoie le HTML à chaque frappe */}
          <SimpleEditor value={blog?.content ?? ""} onChange={setContent} />
        </div>

        {/* ===== COLONNE DROITE : réglages ===== */}
        <aside className="space-y-6 rounded-2xl border border-neutral-200 bg-[#EEEDE7] p-6 shadow-sm lg:sticky lg:top-32">
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

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Statut
            </label>
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-neutral-200 p-3">
              <span className="text-sm text-neutral-700">{published ? "Publié" : "Brouillon"}</span>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="peer sr-only"
              />
              <span className="relative h-6 w-11 rounded-full bg-neutral-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-orange-500 peer-checked:after:translate-x-5" />
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {saved && <p className="text-sm text-emerald-600">Enregistré ✓</p>}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="w-full rounded-lg bg-orange-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
            >
              {loading
                ? "Enregistrement…"
                : blog
                  ? "Enregistrer"
                  : published
                    ? "Publier"
                    : "Enregistrer le brouillon"}
            </button>
            <Link
              href="/dayane/dashboard/blogs"
              className="rounded-lg px-4 py-2 text-center text-sm text-neutral-500 hover:bg-neutral-100"
            >
              {blog ? "Retour à la liste" : "Annuler"}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}